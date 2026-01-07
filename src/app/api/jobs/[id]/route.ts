import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import { Types } from "mongoose";

type Params = {
  params: Promise<{ id: string }>;
};

interface WorkLog {
  _id?: Types.ObjectId;
  hoursWorked: number;
  fixedCost: number;
  rate?: number;
}

interface WorkStats {
  totalHours: number;
  totalAmount: number;
}

interface PaymentLog {
  amount: number;
}

// GET: Fetch a single job
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
    }

    const job = await Job.findById(id).lean(); // Use lean() for faster read-only queries
    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json(job);
  } catch (error) {
    console.error("GET Job Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Update job (Work logs, Payments, Status)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const job = await Job.findById(id);
    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Handle Work Logs
    if (body.newLog) job.workLogs.push(body.newLog);
    if (body.updateWorkLog) {
      const log = job.workLogs.id(body.updateWorkLog._id);
      if (log) Object.assign(log, body.updateWorkLog);
    }
    if (body.deleteWorkLogId) job.workLogs.pull({ _id: body.deleteWorkLogId });

    // Handle Payment Logs
    if (body.newPayment) {
      job.paymentLogs.push({
        amount: Number(body.newPayment.amount),
        date: body.newPayment.date || new Date(),
        note: body.newPayment.note || "Cash",
      });
    }
    if (body.updatePaymentLog) {
      const log = job.paymentLogs.id(body.updatePaymentLog._id);
      if (log) {
        if (body.updatePaymentLog.amount)
          log.amount = Number(body.updatePaymentLog.amount);
        if (body.updatePaymentLog.date) log.date = body.updatePaymentLog.date;
        if (body.updatePaymentLog.note) log.note = body.updatePaymentLog.note;
      }
    }
    if (body.deletePaymentLogId)
      job.paymentLogs.pull({ _id: body.deletePaymentLogId });

    // Handle Status
    if (body.status) job.status = body.status;

    // Optimized Recalculation using Reduce
    const workStats = job.workLogs.reduce(
      (acc: WorkStats, log: WorkLog) => {
        const rate = log.rate ?? job.serviceRate;
        if (log.fixedCost > 0) {
          acc.totalAmount += Number(log.fixedCost);
        } else {
          const hours = Number(log.hoursWorked) || 0;
          acc.totalHours += hours;
          acc.totalAmount += hours * rate;
        }
        return acc;
      },
      { totalHours: 0, totalAmount: 0 }
    );

    const totalPaid = job.paymentLogs.reduce(
      (sum: number, p: PaymentLog) => sum + (Number(p.amount) || 0),
      0
    );

    // Update fields
    job.totalHours = workStats.totalHours;
    job.totalAmount = Math.round(workStats.totalAmount);
    job.paidAmount = totalPaid;

    await job.save();
    return NextResponse.json(job);
  } catch (error) {
    console.error("PUT Job Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove job
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE Job Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
