export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stock from "@/lib/models/Stock";
import { checkAuth } from "@/lib/auth";

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

    const stock = await Stock.findById(id);

    if (!stock) {
      return NextResponse.json({ message: "stock not found" }, { status: 404 });
    }

    return NextResponse.json(stock);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
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

        const stock = await Stock.findByIdAndDelete(id);

        if (!stock) {
            return NextResponse.json(
                { message: "stock not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "stock deleted",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Unauthorized or error" },
            { status: 401 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await checkAuth();
        await connectDB();

        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

        const body = await req.json();
        const stock = await Stock.findByIdAndUpdate(id, body, { new: true });
        if (!stock) return NextResponse.json({ message: "Stock not found" }, { status: 404 });

        return NextResponse.json(stock);
    } catch (err: any) {
        if (err.message === "UNAUTHORIZED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}