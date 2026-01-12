import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { checkAuth } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    await checkAuth();
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}