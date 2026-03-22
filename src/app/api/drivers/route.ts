import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Driver from "@/models/Driver";

// 1. Fetch All Drivers (GET)
export async function GET() {
  try {
    await connectDB();
    // Fetch all drivers and sort by newest first
    const drivers = await Driver.find({}).sort({ createdAt: -1 });
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { type, driverId, name, payment } = body;

    if (type === "ADD_DRIVER") {
      const newDriver = await Driver.create({ 
        name, 
        paymentLogs: [], 
        totalPaid: 0 
      });
      return NextResponse.json(newDriver, { status: 201 });
    }

    if (type === "ADD_PAYMENT") {
      // --- FIX: Create a clean payment object ---
      const newPayment = {
        amount: Number(payment.amount),
        // अगर स्ट्रिंग है तो उसे Date ऑब्जेक्ट में बदलें, नहीं तो current date लें
        date: payment.date ? new Date() : new Date(), 
        time: payment.time || new Date().toLocaleTimeString(),
        note: payment.note || ""
      };

      const updatedDriver = await Driver.findByIdAndUpdate(
        driverId,
        { 
          $push: { paymentLogs: newPayment },
          $inc: { totalPaid: newPayment.amount } 
        },
        { new: true, runValidators: true }
      );
      return NextResponse.json(updatedDriver);
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch (error: any) {
    console.error("POST ERROR DETAILS:", error); // Terminal में पूरा एरर देखने के लिए
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. Update Name or Payment Amount (PATCH)
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { type, driverId, name, paymentId, updatedAmount } = body;

    // Logic to update driver's name
    if (type === "UPDATE_NAME") {
      const updatedDriver = await Driver.findByIdAndUpdate(
        driverId,
        { name },
        { new: true }
      );
      return NextResponse.json(updatedDriver);
    }

    // Logic to update a specific payment amount inside the array
    if (type === "UPDATE_PAYMENT") {
      // Find the driver first to calculate the new totalPaid correctly
      const driver = await Driver.findById(driverId);
      if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

      // Find the specific payment log and update it
      const updatedDriver = await Driver.findOneAndUpdate(
        { _id: driverId, "paymentLogs._id": paymentId },
        { $set: { "paymentLogs.$.amount": updatedAmount } },
        { new: true }
      );

      // Recalculate totalPaid based on the updated logs
      const newTotal = updatedDriver.paymentLogs.reduce((acc: number, log: any) => acc + log.amount, 0);
      updatedDriver.totalPaid = newTotal;
      await updatedDriver.save();

      return NextResponse.json(updatedDriver);
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH ERROR:", error.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 4. Delete Driver (DELETE)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });

    const deletedDriver = await Driver.findByIdAndDelete(id);
    if (!deletedDriver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

    return NextResponse.json({ message: "Driver deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}