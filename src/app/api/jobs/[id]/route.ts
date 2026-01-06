import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

type Params = {
  params: Promise<{ id: string }>;
};

// GET job
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("GET /jobs/:id error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// UPDATE job
export async function PUT(
  request: NextRequest,
  { params }: Params
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

// DELETE job
export async function DELETE(
  request: NextRequest,
  { params }: Params
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
