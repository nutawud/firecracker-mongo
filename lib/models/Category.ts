import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    no: {
      type: String,
      required: true,
      unique: true, // เลขสินค้า / รหัส
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
