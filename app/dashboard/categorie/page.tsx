"use client";

import { useEffect, useState } from "react";

type Category = {
  _id?: string;
  name: string;
  price: number;
  no: string;
};

export default function CategoryPage() {
  const [data, setData] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({
    name: "",
    price: 0,
    no: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch("/api/category", {
      credentials: "include",
    });
    const json = await res.json();
    setData(json.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/category/${editingId}`
      : "/api/category";

    await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", price: 0, no: "" });
    setEditingId(null);
    loadData();
  };

  const edit = (c: Category) => {
    setForm({ name: c.name, price: c.price, no: c.no });
    setEditingId(c._id!);
  };

  const remove = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    await fetch(`/api/category/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Category</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded border">
        <input
          className="border p-2 rounded"
          placeholder="ชื่อสินค้า"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="ราคา"
          value={form.price}
          onChange={e =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="no (w,j,k)"
          value={form.no}
          onChange={e => setForm({ ...form, no: e.target.value })}
        />
        <button
          onClick={submit}
          className="bg-blue-600 text-white rounded px-4"
        >
          {editingId ? "อัปเดต" : "เพิ่ม"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ชื่อ</th>
              <th className="p-3 text-left">ราคา</th>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.price}</td>
                <td className="p-3">{c.no}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => edit(c)}
                    className="text-blue-600"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => remove(c._id!)}
                    className="text-red-600"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
