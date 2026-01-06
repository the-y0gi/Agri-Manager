import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    rateType: {
      type: String,
      enum: ["hourly", "fixed"], 
      default: "hourly",
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } 
);


export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);