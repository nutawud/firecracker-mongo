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
    price: number;
    createdAt: string;
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
                    <h1 className="text-2xl font-bold">📦 คลัง</h1>
                    <Link
                        href="/dashboard/stock/create"
                        className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        ➕ สร้างรายการคลัง
                    </Link>
                </div>
            </div>
            {/* mobile */}
            <div className="md:hidden space-y-4">
                {stocks.map(stock => (
                    <div
                        key={stock._id}
                        className="rounded-xl bg-white p-4 shadow"
                    >

                        <div className="flex justify-between">
                            <div className="text-indigo-500"> {stock.product_code}</div>
                            <div className="text-gray-500"> {stock.createdAt.split("T")[0]}</div>
                        </div>

                        <div>ชื่อสินค้า: {stock.product_name}</div>
                        <div className="text-red-600">คงเหลือ: {stock.amount} กล่อง</div>
                        <div>ต้นทุน: {stock.cost} บาท</div>
                        <div>ราคาขาย: {stock.price} บาท</div>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => router.push(`/dashboard/stock/${stock._id}/edit`)}
                                className="flex-1 bg-green-500 text-white py-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(stock._id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full ">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">Code</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">วันที่</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">ชื่อสินค้า</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">คงเหลือ</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">ต้นทุน</th>
                            <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">ราคาขาย</th>
                            <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-700">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stocks.map((stock) => (
                            <tr key={stock._id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm">{stock.product_code}</td>
                                <td className="px-3 py-2 text-sm">{stock.createdAt.split("T")[0]}</td>
                                <td className="px-3 py-2 text-sm">{stock.product_name}</td>
                                <td className="px-3 py-2 text-sm">{stock.amount}</td>
                                <td className="px-3 py-2 text-sm">{stock.cost}</td>
                                <td className="px-3 py-2 text-sm text-center">{stock.price}</td>
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={() =>
                                            router.push(`/dashboard/stock/${stock._id}/edit`)
                                        }
                                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
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
        </div>
    )
}