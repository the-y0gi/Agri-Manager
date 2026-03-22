import mongoose from "mongoose";

const DriverPaymentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  note: { type: String }, // Cash, PhonePe, Advance, etc.
});

const DriverSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    mobileNumber: { 
      type: String 
    },
    paymentLogs: [DriverPaymentSchema],

    totalPaid: { 
      type: Number, 
      default: 0 
    },
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema);