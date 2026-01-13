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
      default: Date.now, // ✅ วันนี้
    },
    no: String,
    orders: [OrderItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
