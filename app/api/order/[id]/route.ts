
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { checkAuth } from "@/lib/auth";

export const runtime = "nodejs";

// =========================
// GET : ดึง Order ตาม ID
// =========================
export async function GET(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Missing id" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("GET ORDER ERROR:", err);

    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// =========================
// PUT : แก้ไข Order
// =========================
export async function PUT(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Missing id" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // ========================================
    // กรณีเปลี่ยนสถานะการชำระเงิน
    // ========================================
    if (body.payment_status !== undefined) {
      if (
        body.payment_status !== "paid" &&
        body.payment_status !== "unpaid"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "payment_status ไม่ถูกต้อง",
          },
          { status: 400 }
        );
      }

      const order = await Order.findByIdAndUpdate(
        id,
        {
          $set: {
            payment_status: body.payment_status,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            message: "Order not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          body.payment_status === "paid"
            ? "บันทึกสถานะจ่ายแล้วเรียบร้อย"
            : "บันทึกสถานะยังไม่จ่ายเรียบร้อย",
        data: order,
      });
    }

    // ========================================
    // กรณีแก้ไข Order ปกติ
    // ========================================
    const order = await Order.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (err: any) {
    console.error("PUT ORDER ERROR:", err);

    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE : ลบ Order
// =========================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAuth();
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing id" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized or error",
      },
      { status: 401 }
    );
  }
}
