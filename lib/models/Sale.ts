import { Schema, Types, model, models } from "mongoose";

const SaleSchema = new Schema(
    {
        stock_id: {
            type: Types.ObjectId,
            ref: "Stock",
            required: true,
        },
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
