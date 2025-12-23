import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "logout success" });

  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // ลบทันที
  });

  return res;
}
