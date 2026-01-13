import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stock from "@/lib/models/Stock";

export async function POST(req: Request) {
    await connectDB();

    const { stock_id, qty } = await req.json();

    if (!stock_id || qty <= 0) {
        return NextResponse.json(
            { message: "ข้อมูลไม่ถูกต้อง" },
            { status: 400 }
        );
    }

    const stock = await Stock.findById(stock_id);

    if (!stock) {
        return NextResponse.json(
            { message: "ไม่พบสินค้า" },
            { status: 404 }
        );
    }

    if (stock.amount < qty) {
        return NextResponse.json(
            { message: "Stock ไม่พอ" },
            { status: 400 }
        );
    }

    stock.amount -= qty;
    await stock.save();

    return NextResponse.json({
        success: true,
        remaining: stock.amount,
    });
}
