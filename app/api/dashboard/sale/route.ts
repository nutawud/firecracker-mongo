export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sale from "@/lib/models/Sale";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const skip = (page - 1) * limit;

        const bestSellers = await
            Sale.aggregate([
                // แยก sale ออกเป็นแถว

                // รวมตามสินค้า
                {
                    $group: {
                        _id: "$product_code",
                        product_name: { $first: "$product_name" },
                        totalAmount: { $sum: "$amount" },
                        totalSales: { $sum: "$total" },
                        totalProfit: { $sum: "$profit" },
                        totalPrice: { $sum: "$price" },
                        totalCost: { $sum: "$cost" }
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
