```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  cost: number;
  amount: number;
  category_id: number;
}

interface Order {
  _id: string;
  name_shop: string;
  order_date: string;
  no: string;
  payment_status?: "paid" | "unpaid";
  orders: OrderItem[];
}

export default function OrderPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchShop, setSearchShop] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // =========================
  // Fetch Orders
  // =========================
  const fetchOrders = async (pageNum = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: "5",
        shop: searchShop,
        date: searchDate,
      });

      const res = await fetch(`/api/order?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถโหลดรายการสั่งซื้อได้");
      }

      const json = await res.json();

      setOrders(json.data || []);
      setTotalPages(json.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // =========================
  // Change Payment Status
  // =========================
  const togglePaymentStatus = async (order: Order) => {
    const currentStatus = order.payment_status || "unpaid";

    const newStatus =
      currentStatus === "paid"
        ? "unpaid"
        : "paid";

    try {
      const res = await fetch(`/api/order/${order._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถเปลี่ยนสถานะได้");
      }

      // อัปเดตหน้าจอทันที ไม่ต้องโหลดใหม่
      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                payment_status: newStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);

      alert("ไม่สามารถเปลี่ยนสถานะการจ่ายเงินได้");
    }
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this order?")) return;

    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchOrders(page);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Payment Button
  // =========================
  const PaymentButton = ({ order }: { order: Order }) => {
    const isPaid = order.payment_status === "paid";

    return (
      <button
        type="button"
        onClick={() => togglePaymentStatus(order)}
        className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${
          isPaid
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {isPaid ? "✓ จ่ายแล้ว" : "ยังไม่จ่าย"}
      </button>
    );
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // =========================
  // Render
  // =========================
  return (
    <div>
      {/* Header */}
      <div className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">
            📦 Orders
          </h1>

          <Link
            href="/dashboard/order/create"
            className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            ➕ Create Order
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">
            ค้นหาชื่อร้าน
          </label>

          <input
            type="text"
            value={searchShop}
            onChange={(e) => setSearchShop(e.target.value)}
            placeholder="ชื่อร้าน..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            วันที่สั่ง
          </label>

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setPage(1);
              fetchOrders(1);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            ค้นหา
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* MOBILE */}
      {/* ========================= */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const total = order.orders.reduce(
            (sum, item) => sum + item.price * item.amount,
            0
          );

          return (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-4 shadow"
            >
              <div className="text-sm text-blue-600">
                #{order.no}
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {order.name_shop}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(order.order_date).toLocaleDateString(
                      "th-TH"
                    )}
                  </p>
                </div>

                {/* Payment */}
                <PaymentButton order={order} />
              </div>

              <div className="mt-3 space-y-2 text-sm">
                {order.orders.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between"
                  >
                    <div>
                      <p>{item.name}</p>

                      <p className="text-xs text-gray-500">
                        {item.amount} x{" "}
                        {item.price.toLocaleString("th-TH")}
                      </p>
                    </div>

                    <p className="font-semibold">
                      {(
                        item.amount * item.price
                      ).toLocaleString("th-TH")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between font-bold">
                <span>รวม</span>

                <span className="text-green-600">
                  {total.toLocaleString("th-TH")}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/order/${order._id}/edit`
                    )
                  }
                  className="flex-1 bg-green-500 text-white py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(order._id)
                  }
                  className="flex-1 bg-red-500 text-white py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= */}
      {/* DESKTOP */}
      {/* ========================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium">
                No
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                ชื่อร้าน
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                วันที่สั่ง
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                รายการ
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                จำนวน
              </th>

              <th className="px-3 py-2 text-center text-sm font-medium bg-yellow-100">
                ราคา(ต้นทุน)
              </th>

              <th className="px-3 py-2 text-center text-sm font-medium bg-yellow-100">
                รวม(ต้นทุน)
              </th>

              <th className="px-3 py-2 text-center text-sm font-medium bg-yellow-100">
                รวมทั้งหมด(ต้นทุน)
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                ราคา
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                รวม
              </th>

              <th className="px-3 py-2 text-left text-sm font-medium">
                รวมทั้งหมด
              </th>

              {/* NEW */}
              <th className="px-3 py-2 text-center text-sm font-medium">
                การชำระเงิน
              </th>

              <th className="px-3 py-2 text-center text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const totalCost = order.orders.reduce(
                (sum, item) =>
                  sum +
                  (item.cost ?? 0) *
                    (item.amount ?? 0),
                0
              );

              const totalPrice = order.orders.reduce(
                (sum, item) =>
                  sum +
                  item.price *
                    item.amount,
                0
              );

              return (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 py-2 text-sm">
                    {order.no}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {order.name_shop}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {order.order_date.split("T")[0]}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {order.orders.map((item) => (
                      <div key={item._id}>
                        {item.name}
                      </div>
                    ))}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {order.orders.map((item) => (
                      <div key={item._id}>
                        {item.amount}
                      </div>
                    ))}
                  </td>

                  <td className="px-3 py-2 text-sm bg-yellow-50">
                    {order.orders.map((item) => (
                      <div key={item._id}>
                        {(item.cost || 0).toLocaleString(
                          "th-TH"
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="px-3 py-2 text-sm bg-yellow-50">
                    {order.orders.map((item) => (
                      <div key={item._id}>
                        {(
                          (item.cost || 0) *
                          (item.amount || 0)
                        ).toLocaleString("th-TH")}
                      </div>
                    ))}
                  </td>

                  <td className="px-3 py-2 text-sm bg-yellow-50 font-semibold">
                    {totalCost.toLocaleString(
                      "th-TH"
                    )}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {order.orders.map((item) => (
                      <div key={item._id}>
                        {item.price.toLocaleString(
                          "th-TH"
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {order.orders.map((item) => (
                      <div key={item._id}>
                        {(
                          item.price *
                          item.amount
                        ).toLocaleString("th-TH")}
                      </div>
                    ))}
                  </td>

                  <td className="px-3 py-2 text-sm font-semibold">
                    {totalPrice.toLocaleString(
                      "th-TH"
                    )}
                  </td>

                  {/* ========================= */}
                  {/* PAYMENT STATUS */}
                  {/* ========================= */}
                  <td className="px-3 py-2 text-center">
                    <PaymentButton order={order} />
                  </td>

                  {/* ========================= */}
                  {/* ACTION */}
                  {/* ========================= */}
                  <td className="px-3 py-2">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/order/${order._id}/edit`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                        onClick={() =>
                          handleDelete(order._id)
                        }
                      >
                        Delete
                      </button>

                      <Link
                        href={`/dashboard/order/${order._id}/print`}
                        target="_blank"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs md:text-sm"
                      >
                        Print
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= */}
      {/* Pagination */}
      {/* ========================= */}
      <div className="mt-4 flex justify-center items-center gap-2 md:gap-4">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((p) => p - 1)
          }
          className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Prev
        </button>

        <span className="text-sm md:text-base font-semibold">
          {page}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage((p) => p + 1)
          }
          className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```
