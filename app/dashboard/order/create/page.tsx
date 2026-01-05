"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  price: number;
  no: string;
};

type OrderItem = {
  category_id: string;
  name: string;
  price: number;
  amount: number;
};

export default function CreateOrderPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name_shop: "",
    no: "",
    order_date: today,
    orders: [] as OrderItem[],
  });

  // โหลด category
  useEffect(() => {
    fetch("/api/category", { credentials: "include" })
      .then(res => res.json())
      .then(res => setCategories(res.data || []));
  }, []);

  const addItem = () => {
    setForm({
      ...form,
      orders: [
        ...form.orders,
        { category_id: "", name: "", price: 0, amount: 1 },
      ],
    });
  };

  const removeItem = (index: number) => {
    const items = [...form.orders];
    items.splice(index, 1);
    setForm({ ...form, orders: items });
  };

  const selectCategory = (index: number, categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return;

    const items = [...form.orders];
    items[index] = {
      ...items[index],
      category_id: category._id,
      name: category.name,
      price: category.price,
    };

    setForm({ ...form, orders: items });
  };

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/order", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/dashboard/order");
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">สร้าง Order</h1>

      {/* ข้อมูลหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="ชื่อร้าน"
          onChange={e => setForm({ ...form, name_shop: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="เลขที่ Order"
          onChange={e => setForm({ ...form, no: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={form.order_date}
          onChange={e => setForm({ ...form, order_date: e.target.value })}
        />
      </div>

      {/* รายการสินค้า */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">รายการสินค้า</h2>
          <button
            onClick={addItem}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            + เพิ่มรายการ
          </button>
        </div>

        {form.orders.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center border p-3 rounded"
          >
            <select
              className="border p-2 rounded md:col-span-2"
              value={item.category_id}
              onChange={e => selectCategory(index, e.target.value)}
            >
              <option value="">-- เลือกรายการ --</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border p-2 rounded"
              placeholder="จำนวน"
              value={item.amount}
              onChange={e => {
                const items = [...form.orders];
                items[index].amount = Number(e.target.value);
                setForm({ ...form, orders: items });
              }}
            />

            <input
              className="border p-2 rounded bg-gray-100"
              value={item.price}
              disabled
            />

            <button
              onClick={() => removeItem(index)}
              className="text-red-600"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="px-6 py-2 bg-green-600 text-white rounded"
      >
        บันทึก Order
      </button>
    </div>
  );
}
