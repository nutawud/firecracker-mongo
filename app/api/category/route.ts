import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { checkAuth } from "@/lib/auth";

export async function GET() {
  try {
    await checkAuth();
    await connectDB();

    const data = await Category.find()
      .select("_id name price no value")
      .sort({ value: 1 });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    const body = await req.json();
    const { name, price, no } = body;

    if (!name || !price || !no) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const category = await Category.create({ name, price, no });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
