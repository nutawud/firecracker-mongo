export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { checkAuth } from "@/lib/auth";

export async function GET(req: Request) {
  await checkAuth();
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Order.find()
      .populate("orders.category_id", "name price no") // 👈 JOIN
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    const body = await req.json();

    const order = await Order.create(body);

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
