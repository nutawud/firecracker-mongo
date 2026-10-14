
"use client";

import { useCallback, useEffect, useState } from "react";
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
  orders: OrderItem[];
}

interface Pagination {
  totalPages: number;
}

interface OrderResponse {
  data: Order[];
  pagination: Pagination;
}

const formatNumber = (value: number | null | undefined) =>
  Number(value ?? 0).toLocaleString("th-TH");

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("th-TH");
};

const getOrderTotal = (
  items: OrderItem[],
  type: "price" | "cost"
) =>
  items.reduce(
    (sum, item) =>
      sum +
      Number(item[type] ?? 0) * Number(item.amount ?? 0),
    0
  );

export default function OrderPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchShop, setSearchShop] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [appliedShop, setAppliedShop] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  const fetchOrders = useCallback(
    async (pageNum = 1, shop = appliedShop, date = appliedDate) => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: "5",
          shop,
          date,
        });

        const res = await fetch(`/api/order?${params.toString()}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
        }

        const json: OrderResponse = await res.json();

        setOrders(Array.isArray(json.data) ? json.data : []);
        setTotalPages(
          Math.max(1, Number(json.pagination?.totalPages ?? 1))
        );
      } catch (error) {
        console.error(error);
        setOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [appliedShop, appliedDate]
  );

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  const handleSearch = () => {
    setAppliedShop(searchShop.trim());
    setAppliedDate(searchDate);
    setPage(1);

    fetchOrders(1, searchShop.trim(), searchDate);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบคำสั่งซื้อนี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        alert("ลบคำสั่งซื้อไม่สำเร็จ");
        return;
      }

      const nextPage =
        orders.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        fetchOrders(page);
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการลบคำสั่งซื้อ");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">📦 Orders</h1>

        <Link
          href="/dashboard/order/create"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          ➕ Create Order
        </Link>
      </div>

      {/* Search */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">
            ค้นหาชื่อร้าน
          </label>

          <input
            type="text"
            value={searchShop}
            onChange={(e) => setSearchShop(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="ชื่อร้าน..."
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            วันที่สั่ง
          </label>

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            ค้นหา
          </button>

          <button
            onClick={() => {
              setSearchShop("");
              setSearchDate("");
              setAppliedShop("");
              setAppliedDate("");
              setPage(1);
              fetchOrders(1, "", "");
            }}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            ล้างค่า
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
          กำลังโหลดข้อมูล...
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          ไม่พบข้อมูลคำสั่งซื้อ
        </div>
      )}

      {/* Mobile cards */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4 md:hidden">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-blue-600">
                    #{order.no}
                  </p>

                  <p className="font-semibold">
                    {order.name_shop}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDate(order.order_date)}
                  </p>
                </div>

                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                  {order.orders.length} รายการ
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {order.orders.map((item) => (
                  <div
                    key={item._id}
                    className="border-b pb-3 last:border-0"
                  >
                    <div className="font-medium">{item.name}</div>

                    <div className="mt-1 flex justify-between gap-3 text-sm text-gray-600">
                      <span>
                        {formatNumber(item.amount)} ×{" "}
                        {formatNumber(item.price)} บาท
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatNumber(
                          Number(item.price ?? 0) *
                            Number(item.amount ?? 0)
                        )}{" "}
                        บาท
                      </span>
                    </div>

                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>ต้นทุน/หน่วย</span>
                      <span>{formatNumber(item.cost)} บาท</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>รวมต้นทุน</span>
                      <span>
                        {formatNumber(
                          Number(item.cost ?? 0) *
                            Number(item.amount ?? 0)
                        )}{" "}
                        บาท
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between text-sm">
                  <span>รวมต้นทุนทั้งหมด</span>
                  <span className="font-semibold text-yellow-700">
                    {formatNumber(getOrderTotal(order.orders, "cost"))} บาท
                  </span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>รวมราคาขาย</span>
                  <span className="text-green-600">
                    {formatNumber(getOrderTotal(order.orders, "price"))} บาท
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/order/${order._id}/edit`
                    )
                  }
                  className="rounded bg-green-500 py-2 text-white hover:bg-green-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(order._id)}
                  className="rounded bg-red-500 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>

                <Link
                  href={`/dashboard/order/${order._id}/print`}
                  target="_blank"
                  className="col-span-2 rounded bg-gray-600 py-2 text-center text-white hover:bg-gray-700"
                >
                  Print
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop table */}
      {!loading && orders.length > 0 && (
        <div className="hidden overflow-x-auto rounded-lg border md:block">
          <table className="min-w-full border-collapse divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="whitespace-nowrap px-3 py-3 text-left text-sm font-semibold">
                  No
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-sm font-semibold">
                  ชื่อร้าน
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-left text-sm font-semibold">
                  วันที่สั่ง
                </th>

                <th className="px-3 py-3 text-left text-sm font-semibold">
                  รายการ
                </th>

                <th className="px-3 py-3 text-left text-sm font-semibold">
                  จำนวน
                </th>

                <th className="whitespace-nowrap bg-yellow-100 px-3 py-3 text-right text-sm font-semibold">
                  ราคา(ต้นทุน)
                </th>

                <th className="whitespace-nowrap bg-yellow-100 px-3 py-3 text-right text-sm font-semibold">
                  รวม(ต้นทุน)
                </th>

                <th className="whitespace-nowrap bg-yellow-100 px-3 py-3 text-right text-sm font-semibold">
                  รวมทั้งหมด(ต้นทุน)
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold">
                  ราคา
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold">
                  รวม
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold">
                  รวมทั้งหมด
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="align-top hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    {order.no}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    {order.name_shop}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    {formatDate(order.order_date)}
                  </td>

                  {/* รายการสินค้า */}
                  <td className="px-3 py-3 text-sm">
                    {order.orders.map((item) => (
                      <div
                        key={item._id}
                        className="min-h-6 min-w-32 py-0.5"
                      >
                        {item.name}
                      </div>
                    ))}
                  </td>

                  {/* จำนวน */}
                  <td className="px-3 py-3 text-sm">
                    {order.orders.map((item) => (
                      <div
                        key={item._id}
                        className="min-h-6 whitespace-nowrap py-0.5"
                      >
                        {formatNumber(item.amount)}
                      </div>
                    ))}
                  </td>

                  {/* ราคาต้นทุนต่อหน่วย */}
                  <td className="bg-yellow-50 px-3 py-3 text-right text-sm">
                    {order.orders.map((item) => (
                      <div
                        key={item._id}
                        className="min-h-6 whitespace-nowrap py-0.5"
                      >
                        {formatNumber(item.cost)}
                      </div>
                    ))}
                  </td>

                  {/* ต้นทุนต่อรายการ */}
                  <td className="bg-yellow-50 px-3 py-3 text-right text-sm">
                    {order.orders.map((item) => (
                      <div
                        key={item._id}
                        className="min-h-6 whitespace-nowrap py-0.5"
                      >
                        {formatNumber(
                          Number(item.cost ?? 0) *
                            Number(item.amount ?? 0)
                        )}
                      </div>
                    ))}
                  </td>

                  {/* ต้นทุนรวมทั้งคำสั่งซื้อ */}
                  <td className="bg-yellow-50 px-3 py-3 text-right text-sm font-semibold">
                    {formatNumber(
                      getOrderTotal(order.orders, "cost")
                    )}
                  </td>

                  {/* ราคาขายต่อหน่วย */}
                  <td className="px-3 py-3 text-right text-sm">
                    {order.orders.map((item) => (
                      <div
                        key={item._id}
                        className="min-h-6 whitespace-nowrap py-0.5"
                      >
                        {formatNumber(item.price)}
                      </div>
                    ))}
                  </td>

                  {/* ยอดขายต่อรายการ */}
                  <td className="px-3 py-3 text-right text-sm">
                    {order.orders.map((item) => (
                      <div
                        key={item._id}
                        className="min-h-6 whitespace-nowrap py-0.5"
                      >
                        {formatNumber(
                          Number(item.price ?? 0) *
                            Number(item.amount ?? 0)
                        )}
                      </div>
                    ))}
                  </td>

                  {/* ยอดขายรวมทั้งคำสั่งซื้อ */}
                  <td className="px-3 py-3 text-right text-sm font-semibold text-green-700">
                    {formatNumber(
                      getOrderTotal(order.orders, "price")
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/order/${order._id}/edit`
                          )
                        }
                        className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(order._id)}
                        className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                      >
                        Delete
                      </button>

                      <Link
                        href={`/dashboard/order/${order._id}/print`}
                        target="_blank"
                        className="rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                      >
                        Print
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 py-2">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => current - 1)}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm font-semibold">
          หน้า {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => setPage((current) => current + 1)}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}