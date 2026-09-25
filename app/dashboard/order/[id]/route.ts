import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;

const client = new MongoClient(uri);

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const { payment_status } = body;

    // ตรวจสอบสถานะ
    if (
      payment_status !== "paid" &&
      payment_status !== "unpaid"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "payment_status ไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    // ตรวจสอบ ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID ไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    await client.connect();

    const db = client.db();

    const result = await db.collection("orders").updateOne(
      {
        _id: new ObjectId(params.id),
      },
      {
        $set: {
          payment_status: payment_status,
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบรายการสั่งซื้อ",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        payment_status === "paid"
          ? "เปลี่ยนสถานะเป็นจ่ายแล้วเรียบร้อย"
          : "เปลี่ยนสถานะเป็นยังไม่จ่ายเรียบร้อย",
      payment_status,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ",
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
