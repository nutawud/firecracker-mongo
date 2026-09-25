
import mongoose, { Schema, Types } from "mongoose";

const OrderItemSchema = new Schema({
  name: String,
  price: Number,
  amount: Number,
  cost: Number,
  category_id: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    name_shop: String,
    order_date: {
      type: Date,
      default: Date.now,
    },

    no: String,

    // =========================
    // Payment Status
    // =========================
    payment_status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    orders: [OrderItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
