export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const skip = (page - 1) * limit;

        const bestSellers = await
            Order.aggregate([
                // แยก orders ออกเป็นแถว
                { $unwind: "$orders" },

                // รวมตามสินค้า
                {
                    $group: {
                        _id: "$orders.category_id", // แนะนำใช้ id
                        name: { $first: "$orders.name" },
                        totalAmount: { $sum: "$orders.amount" },
                        totalPrice: {
                            $sum: { $multiply: ["$orders.price", "$orders.amount"] }
                        },
                        totalCost: {
                            $sum: { $multiply: ["$orders.cost", "$orders.amount"] }
                        }
                    }
                },

                // เรียงจากขายดี
                { $sort: { totalAmount: -1 } }
            ])


        return NextResponse.json(bestSellers);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching firecracker" },
            { status: 500 }
        );
    }
}
