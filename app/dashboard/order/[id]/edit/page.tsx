"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  price: number;
  no: string;
};

type OrderItem = {
  _id?: string;
  category_id: string;
  name: string;
  price: number;
  amount: number;
};

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name_shop: "",
    no: "",
    order_date: "",
    orders: [] as OrderItem[],
  });

  // โหลด category
  useEffect(() => {
    fetch("/api/category", { credentials: "include" })
      .then(res => res.json())
      .then(res => setCategories(res.data || []));
  }, []);

  // โหลด order ตาม id
  useEffect(() => {
    if (!id) return;

    fetch(`/api/order/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(res => {
        setForm({
          name_shop: res.name_shop,
          no: res.no,
          order_date: res.order_date?.slice(0, 10),
          orders: res.orders,
        });
        setLoading(false);
      });
  }, [id]);

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
    await fetch(`/api/order/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/order");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">แก้ไข Order</h1>

      {/* ข้อมูลหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border p-2 rounded"
          value={form.name_shop}
          onChange={e => setForm({ ...form, name_shop: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          value={form.no}
          onChange={e => setForm({ ...form, no: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={form.order_date}
          onChange={e =>
            setForm({ ...form, order_date: e.target.value })
          }
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
            key={item._id || index}
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
        className="px-6 py-2 bg-green-600 text-white rounded"
      >
        บันทึกการแก้ไข
      </button>
    </div>
  );
}
