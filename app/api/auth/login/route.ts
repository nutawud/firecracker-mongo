export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 401 }
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json(
            { message: "Wrong password" },
            { status: 401 }
        );
    }

    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" }
    );

    const res = NextResponse.json(
        { 
            message: "login success",
            token: token,
            fname: user.fname,
            lname: user.lname,
            email: user.email
        }
    );

    res.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 3,
    });

    return res;
}
