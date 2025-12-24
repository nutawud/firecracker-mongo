import mongoose from "mongoose";

const FirecrackerSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    stock: Number,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.models.Firecracker ||
  mongoose.model("Firecracker", FirecrackerSchema);
