"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Stock {
  _id: string;
  product_code: string;
  product_name: string;
  amount: number;
  cost: number;
}

export default function StockPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadData = async () => {
        setLoading(true);
        const res = await fetch("/api/stock", {
            credentials: "include",
        });
        const data = await res.json();
        setStocks(data.data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ต้องการลบรายการนี้ใช่หรือไม่")) return;

        await fetch(`/api/stock/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        loadData(); // reload
    };

    useEffect(() => {
        loadData(); // ✅ ตอนเปิดหน้า
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="">
            <div className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
                    <h1 className="text-2xl font-bold">📦 Orders</h1>
                    <Link
                        href="/dashboard/stock/create"
                        className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        ➕ Create Order
                    </Link>
                </div>
            </div>

            <table className="w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Code</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">ชื่อสินค้า</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">คงเหลือ</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">ต้นทุน</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {stocks.map((stock) => (
                        <tr key={stock._id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm">{stock.product_code}</td>
                            <td className="px-3 py-2 text-sm">{stock.product_name}</td>
                            <td className="px-3 py-2 text-sm">{stock.amount}</td>
                            <td className="px-3 py-2 text-sm">{stock.cost}</td>
                            <td className="px-3 py-2 flex flex-wrap gap-1 md:gap-2">
                                <button
                                    onClick={() =>
                                        router.push(`/dashboard/stock/${stock._id}/edit`)
                                    }
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(stock._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}