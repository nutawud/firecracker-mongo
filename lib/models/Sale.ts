import { Schema, model, models } from "mongoose";

const SaleSchema = new Schema(
  {
    product_code: String,
    product_name: String,
    amount: Number,
    price: Number,
    cost: Number,
    total: Number,
    profit: Number,
    sold_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models.Sale || model("Sale", SaleSchema);
