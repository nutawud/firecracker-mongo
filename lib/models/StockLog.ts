// models/StockLog.ts
import mongoose, { Schema } from "mongoose";

const StockLogSchema = new Schema({
  product_code: String,
  type: {
    type: String,
    enum: ["IN", "OUT", "ADJUST"],
  },
  amount: Number,
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.StockLog ||
  mongoose.model("StockLog", StockLogSchema);
