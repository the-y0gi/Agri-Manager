import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

// Fetch a single job by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// Update job details, work logs, payments, or status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Add work log and recalculate totals
    if (body.newLog) {
      job.workLogs = job.workLogs || [];
      job.workLogs.push(body.newLog);

      if (job.rateType === "hourly") {
        const addedHours = Number(body.newLog.hoursWorked) || 0;
        job.totalHours = (job.totalHours || 0) + addedHours;
        job.totalAmount = job.totalHours * job.serviceRate;
      } else if (job.rateType === "fixed" && body.newLog.fixedCost) {
        job.totalAmount =
          (job.totalAmount || 0) + Number(body.newLog.fixedCost);
      }
    }

    // Add payment entry and update paid amount
    if (body.newPayment) {
      job.paymentLogs = job.paymentLogs || [];
      job.paymentLogs.push({
        amount: Number(body.newPayment.amount),
        date: body.newPayment.date || new Date(),
        note: body.newPayment.note || "Cash",
      });

      job.paidAmount =
        (job.paidAmount || 0) + Number(body.newPayment.amount);
    }

    // Update job status
    if (body.status) {
      job.status = body.status;
    }

    await job.save();
    return NextResponse.json(job);
  } catch (error) {
    console.error("PUT /jobs/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// Delete a job by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /jobs/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
