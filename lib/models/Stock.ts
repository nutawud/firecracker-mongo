// models/Stock.ts
import mongoose, { Schema } from "mongoose";

const StockSchema = new Schema(
    {
        product_code: { type: String, required: true, unique: true },
        product_name: String,
        unit_per_box: Number,
        amount: { type: Number, default: 0 },
        cost: Number,
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Stock ||
    mongoose.model("Stock", StockSchema);