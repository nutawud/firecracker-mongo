import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stock from "@/lib/models/Stock";
import Sale from "@/lib/models/Sale";

export async function POST(req: Request) {
  await connectDB();

  const { stock_id, amount, price } = await req.json();

  const stock = await Stock.findById(stock_id);
  if (!stock) {
    return NextResponse.json({ message: "ไม่พบสินค้า" }, { status: 404 });
  }

  if (stock.amount < amount) {
    return NextResponse.json({ message: "สต๊อกไม่พอ" }, { status: 400 });
  }

  // 1️⃣ ตัดสต๊อก
  stock.amount -= amount;
  await stock.save();

  // 2️⃣ insert sale
  await Sale.create({
    product_code: stock.product_code,
    product_name: stock.product_name,
    amount,
    price,
    cost: stock.cost,
    total: amount * price,
    profit: (price - stock.cost) * amount,
    sold_at: new Date(),
  });

  return NextResponse.json({ success: true });
}
