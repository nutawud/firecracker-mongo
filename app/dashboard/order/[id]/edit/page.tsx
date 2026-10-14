
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  price: number;
  no: string;
  cost: number;
};

type OrderItem = {
  _id?: string;
  category_id: string;
  name: string;
  price: number;
  amount: number;
  cost: number;
};

type OrderForm = {
  name_shop: string;
  no: string;
  order_date: string;
  orders: OrderItem[];
};

export default function EditOrderPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<OrderForm>({
    name_shop: "",
    no: "",
    order_date: "",
    orders: [],
  });

  // โหลดหมวดหมู่สินค้า
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/category", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดรายการสินค้าได้");
        }

        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาด"
        );
      }
    };

    loadCategories();
  }, []);

  // โหลดข้อมูล Order เดิม
  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/order/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูล Order ได้");
        }

        const data = await res.json();

        setForm({
          name_shop: data.name_shop || "",
          no: data.no || "",
          order_date: data.order_date
            ? String(data.order_date).slice(0, 10)
            : "",
          orders: (data.orders || []).map(
            (item: Partial<OrderItem>) => ({
              _id: item._id,
              category_id: item.category_id || "",
              name: item.name || "",
              price: Number(item.price) || 0,
              amount: Number(item.amount) || 1,
              cost: Number(item.cost) || 0,
            })
          ),
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาด"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // เพิ่มรายการสินค้า
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      orders: [
        ...prev.orders,
        {
          category_id: "",
          name: "",
          price: 0,
          amount: 1,
          cost: 0,
        },
      ],
    }));
  };

  // ลบรายการสินค้า
  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      orders: prev.orders.filter((_, i) => i !== index),
    }));
  };

  // เปลี่ยนสินค้า พร้อมดึงราคาขายและต้นทุน
  const selectCategory = (
    index: number,
    categoryId: string
  ) => {
    const category = categories.find(
      (c) => c._id === categoryId
    );

    setForm((prev) => {
      const orders = [...prev.orders];

      if (!category) {
        orders[index] = {
          ...orders[index],
          category_id: "",
          name: "",
          price: 0,
          cost: 0,
        };
      } else {
        orders[index] = {
          ...orders[index],
          category_id: category._id,
          name: category.name,
          price: Number(category.price) || 0,
          cost: Number(category.cost) || 0,
        };
      }

      return { ...prev, orders };
    });
  };

  // เปลี่ยนจำนวนสินค้า
  const updateAmount = (index: number, amount: number) => {
    setForm((prev) => ({
      ...prev,
      orders: prev.orders.map((item, i) =>
        i === index ? { ...item, amount } : item
      ),
    }));
  };

  // บันทึกการแก้ไข
  const submit = async () => {
    setError("");

    if (!form.name_shop.trim()) {
      setError("กรุณากรอกชื่อร้าน");
      return;
    }

    if (form.orders.length === 0) {
      setError("กรุณาเพิ่มรายการสินค้า");
      return;
    }

    if (
      form.orders.some(
        (item) =>
          !item.category_id ||
          item.amount <= 0 ||
          !Number.isFinite(item.amount)
      )
    ) {
      setError("กรุณาเลือกสินค้าและระบุจำนวนให้ถูกต้องทุกรายการ");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        orders: form.orders.map((item) => ({
          ...(item._id ? { _id: item._id } : {}),
          category_id: item.category_id,
          name: item.name,
          price: Number(item.price) || 0,
          amount: Number(item.amount) || 0,
          cost: Number(item.cost) || 0,
        })),
      };

      const res = await fetch(`/api/order/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(
          result.message || "บันทึกการแก้ไขไม่สำเร็จ"
        );
      }

      router.push("/dashboard/order");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึก"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">แก้ไข Order</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* ข้อมูลหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            ชื่อร้าน
          </label>
          <input
            className="w-full border p-2 rounded"
            value={form.name_shop}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name_shop: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            เลขที่ Order
          </label>
          <input
            className="w-full border p-2 rounded"
            value={form.no}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                no: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            วันที่สั่งซื้อ
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.order_date}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                order_date: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            รายการสินค้า
          </h2>

          <button
            type="button"
            onClick={addItem}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + เพิ่มรายการ
          </button>
        </div>

        {form.orders.map((item, index) => (
          <div
            key={item._id || index}
            className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border p-3 rounded"
          >
            <div className="md:col-span-3">
              <label className="block mb-1 text-sm">
                รายการสินค้า
              </label>
              <select
                className="w-full border p-2 rounded"
                value={item.category_id}
                onChange={(e) =>
                  selectCategory(index, e.target.value)
                }
              >
                <option value="">-- เลือกรายการ --</option>
                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">
                จำนวน
              </label>
              <input
                type="number"
                min="1"
                className="w-full border p-2 rounded"
                value={item.amount}
                onChange={(e) =>
                  updateAmount(
                    index,
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">
                ราคาขาย/หน่วย
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded bg-gray-100"
                value={item.price}
                readOnly
              />
            </div>

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50"
            >
              ลบรายการ
            </button>

            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  ต้นทุน/หน่วย:{" "}
                  <strong>
                  {(item.cost * item.amount).toLocaleString("th-TH")}
                </strong>{" "}
                บาท
                </label>
              </div>

              <div>
                รวมราคาขายรายการนี้:{" "}
                <strong>
                  {(item.price * item.amount).toLocaleString("th-TH")}
                </strong>{" "}
                บาท
              </div>
              <div>
                รวมต้นทุนรายการนี้:{" "}
                <strong>
                  {(item.cost * item.amount).toLocaleString("th-TH")}
                </strong>{" "}
                บาท
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded hover:bg-gray-50"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
