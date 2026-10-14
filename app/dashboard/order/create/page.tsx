
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  price: number;
  no: string;
  cost: number;
};

type OrderItem = {
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

export default function CreateOrderPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });

  const [form, setForm] = useState<OrderForm>({
    name_shop: "",
    no: "",
    order_date: today,
    orders: [],
  });

  // โหลดข้อมูลสินค้า
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("โหลดรายการสินค้าไม่สำเร็จ");
        }

        const json = await res.json();
        setCategories(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดรายการสินค้าได้");
      }
    };

    fetchCategories();
  }, []);

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

  // เลือกสินค้าและดึงราคาขายกับต้นทุน
  const selectCategory = (index: number, categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);

    setForm((prev) => ({
      ...prev,
      orders: prev.orders.map((item, i) => {
        if (i !== index) return item;

        if (!category) {
          return {
            category_id: "",
            name: "",
            price: 0,
            amount: item.amount,
            cost: 0,
          };
        }

        return {
          ...item,
          category_id: category._id,
          name: category.name,
          price: Number(category.price ?? 0),
          cost: Number(category.cost ?? 0),
        };
      }),
    }));
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

  // จัดรูปแบบตัวเลข
  const formatNumber = (value: number) =>
    Number(value || 0).toLocaleString("th-TH");

  // บันทึก Order
  const submit = async () => {
    setError("");

    if (!form.name_shop.trim()) {
      setError("กรุณากรอกชื่อร้าน");
      return;
    }

    if (!form.no.trim()) {
      setError("กรุณากรอกเลขที่ Order");
      return;
    }

    if (form.orders.length === 0) {
      setError("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ");
      return;
    }

    if (form.orders.some((item) => !item.category_id)) {
      setError("กรุณาเลือกสินค้าให้ครบทุกแถว");
      return;
    }

    if (
      form.orders.some(
        (item) => !Number.isFinite(item.amount) || item.amount <= 0
      )
    ) {
      setError("จำนวนสินค้าต้องมากกว่า 0");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        orders: form.orders.map((item) => ({
          category_id: item.category_id,
          name: item.name,
          price: Number(item.price ?? 0),
          amount: Number(item.amount ?? 0),
          cost: Number(item.cost ?? 0),
        })),
      };

      const res = await fetch("/api/order", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          result?.message || "บันทึก Order ไม่สำเร็จ"
        );
      }

      router.push("/dashboard/order");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">สร้าง Order</h1>
        <p className="mt-1 text-sm text-gray-500">
          กรอกข้อมูลร้านค้าและเพิ่มรายการสินค้า
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ข้อมูลหลัก */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">
            ชื่อร้าน
          </label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="ชื่อร้าน"
            autoComplete="organization"
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
          <label className="mb-1 block text-sm font-medium">
            เลขที่ Order
          </label>
          <input
            className="w-full rounded-lg border p-2"
            placeholder="เลขที่ Order"
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
          <label className="mb-1 block text-sm font-medium">
            วันที่สั่ง
          </label>
          <input
            type="date"
            className="w-full rounded-lg border p-2"
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">รายการสินค้า</h2>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            + เพิ่มรายการ
          </button>
        </div>

        {form.orders.length === 0 && (
          <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
            ยังไม่มีรายการสินค้า กดปุ่ม + เพิ่มรายการ
          </div>
        )}

        {form.orders.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border bg-white p-3"
          >
            {/* แถวหลัก เหมือนหน้าแก้ไข */}
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6">
              <div className="md:col-span-3">
                <label className="mb-1 block text-sm">
                  รายการสินค้า
                </label>
                <select
                  className="w-full rounded-lg border p-2"
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
                <label className="mb-1 block text-sm">
                  จำนวน
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-lg border p-2"
                  value={item.amount}
                  onChange={(e) =>
                    updateAmount(index, Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">
                  ราคาขาย/หน่วย
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border bg-gray-100 p-2"
                  value={item.price}
                  readOnly
                />
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
              >
                ลบรายการ
              </button>
            </div>

            {/* ยอดของสินค้าแต่ละรายการ อยู่บรรทัดเดียวกัน */}
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm text-gray-600">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  ต้นทุน/หน่วย: {formatNumber(item.cost)} บาท
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  รวมต้นทุนรายการนี้: {formatNumber(item.cost * item.amount)} บาท
                </label>
                
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  รวมราคาขายรายการนี้: {formatNumber(item.price * item.amount)} บาท
                </label>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มบันทึก */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "กำลังบันทึก..." : "บันทึก Order"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard/order")}
          disabled={loading}
          className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-300"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
