import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/models/Job";

// Fetch all jobs for the dashboard (latest first)
export async function GET() {
  try {
    await connectDB();

    // Only select the fields needed by frontend
    const jobs = await Job.find({})
      .select("farmerName serviceName status totalAmount paidAmount createdAt")
      .sort({ createdAt: -1 });
    
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// Create a new job
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const newJob = await Job.create(body);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}