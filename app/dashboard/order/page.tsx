"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  amount: number;
  category_id: number;
}

interface Order {
  _id: string;
  name_shop: string;
  order_date: string;
  no: string;
  orders: OrderItem[];
}

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (pageNum = 1) => {
    try {
      const res = await fetch(`/api/order?page=${pageNum}&limit=5`, {
        credentials: "include",
      });
      const json = await res.json();
      setOrders(json.data);
      setTotalPages(json.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this order?")) return;
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchOrders(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
          <h1 className="text-2xl font-bold">📦 Orders</h1>
          <Link
            href="/dashboard/order/create"
            className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            ➕ Create Order
          </Link>
        </div>
      </div>
       {/* ✅ MOBILE */}
    <div className="md:hidden space-y-4 p-4">
      {orders.map(order => (
        <div
          key={order._id}
          className="rounded-xl border bg-white p-4 shadow"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{order.name_shop}</p>
              <p className="text-xs text-gray-500">
                {new Date(order.order_date).toLocaleDateString("th-TH")}
              </p>
            </div>
            <span className="text-sm text-blue-600">#{order.no}</span>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            {order.orders.map(item => (
              <div key={item._id} className="flex justify-between">
                <div>
                  <p>{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.amount} x {item.price.toLocaleString("th-TH")}
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.amount * item.price).toLocaleString("th-TH")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between font-bold">
            <span>รวม</span>
            <span className="text-green-600">
              {order.orders.reduce((s, i) => s + i.price * i.amount, 0)
                .toLocaleString("th-TH")}
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/order/${order._id}/edit`)}
              className="flex-1 bg-green-500 text-white py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(order._id)}
              className="flex-1 bg-red-500 text-white py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 ">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">No</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">ชื่อร้าน</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">วันที่สั่ง</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">รายการ</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">จำนวน</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">ราคา</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">รวม</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">รวมทั้งหมด</th>
              <th className="px-3 py-2 text-left text-xs md:text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{order.no}</td>
                <td className="px-3 py-2 text-sm">{order.name_shop}</td>
                <td className="px-3 py-2 text-sm">{order.order_date.split("T")[0]}</td>
                <td className="px-3 py-2 text-sm">
                  {order.orders.map((item) => (
                    <div key={item._id} className="truncate w-48 md:w-auto">
                      {item.name}
                    </div>
                  ))}
                </td>
                <td className="px-3 py-2 text-sm">
                  {order.orders.map((item) => (
                    <div key={item._id} className="truncate w-48 md:w-auto">
                      {item.amount}
                    </div>
                  ))}
                </td>
                <td className="px-3 py-2 text-sm">
                  {order.orders.map((item) => (
                    <div key={item._id} className="truncate w-48 md:w-auto">
                      {(item.price).toLocaleString("th-TH")}
                    </div>
                  ))}
                </td>
                <td className="px-3 py-2 text-sm">
                  {order.orders.map((item) => (
                    <div key={item._id} className="truncate w-48 md:w-auto">
                      {(item.price * item.amount).toLocaleString("th-TH")}
                    </div>
                  ))}
                </td>
                <td className="px-3 py-2 text-sm">
                  {order.orders
                    .reduce(
                      (sum, item) => sum + item.price * item.amount,
                      0
                    )
                    .toLocaleString("th-TH")}
                </td>
                <td className="px-3 py-2 flex flex-wrap gap-1 md:gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm"
                    onClick={() => router.push(`/dashboard/order/${order._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2 md:gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Prev
        </button>
        <span className="text-sm md:text-base font-semibold">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
