import mongoose from "mongoose";

const WorkLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  startTime: { type: String },
  endTime: { type: String },
  hoursWorked: { type: Number, default: 0 },
  fixedCost: { type: Number },
  note: { type: String },

  serviceName: { type: String },
  rate: { type: Number },
});

const PaymentLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  note: { type: String }, // Cash/PhonePe/
});

const JobSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    serviceName: { type: String, required: true },
    serviceRate: { type: Number, required: true },
    rateType: { type: String, enum: ["hourly", "fixed"], required: true },

    // Lists
    workLogs: [WorkLogSchema],
    paymentLogs: [PaymentLogSchema],

    // Totals
    totalHours: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    paidAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);