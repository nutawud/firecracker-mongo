export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Firecracker from "@/lib/models/Firecracker";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Firecracker.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Firecracker.countDocuments(),
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
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching firecracker" },
      { status: 500 }
    );
  }
}
