import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { checkAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    // ดึง id จาก URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // ตัวสุดท้ายคือ id

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update order
export async function PUT(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

    const body = await req.json();
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json(order);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAuth();
    await connectDB();

    const { id } = await params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized or error" },
      { status: 401 }
    );
  }
}