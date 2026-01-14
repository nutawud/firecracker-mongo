"use client";

import { useEffect, useState } from "react";

type Category = {
  _id?: string;
  name: string;
  price: number;
  no: string;
  cost: number;
  unit_per_box: number;
  value: number;
};

export default function CategoryPage() {
  const [data, setData] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({
    name: "",
    price: 0,
    no: "",
    cost: 0,
    unit_per_box: 0,
    value: 0
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

    setForm({ name: "", price: 0, no: "", cost: 0, unit_per_box: 0, value: 0 });
    setEditingId(null);
    loadData();
  };

  const edit = (c: Category) => {
    setForm({ name: c.name, price: c.price, no: c.no, cost: c.cost, unit_per_box: c.unit_per_box, value: c.value });
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
      {/* <form className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg"> */}
        <div className="mb-4">
          <label htmlFor="no" className="block text-gray-700 font-bold mb-2">
            No.
          </label>
          <input
            type="text"
            id="no"
            name="no"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="No"
            required
            value={form.no}
            onChange={e => setForm({ ...form, no: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            ชื่อสินค้า
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ชื่อสินค้า"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            ราคา
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ราคา"
            required
            value={form.price}
            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cost" className="block text-gray-700 font-bold mb-2">
            ราคาทุน
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ราคาทุน"
            required
            value={form.cost}
            onChange={e => setForm({ ...form, cost: Number(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="unit_per_box" className="block text-gray-700 font-bold mb-2">
            ชิ้นต่อลัง
          </label>
          <input
            type="number"
            id="unit_per_box"
            name="unit_per_box"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ชิ้นต่อลัง"
            required
            value={form.unit_per_box}
            onChange={e => setForm({ ...form, unit_per_box: Number(e.target.value) })}
          />
        </div>



        <button
          onClick={submit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          {editingId ? "อัปเดต" : "เพิ่ม"}
        </button>
      {/* </form> */}


      {/* Table */}
      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">ชื่อ</th>
              <th className="p-3 text-left">ราคา</th>
              <th className="p-3 text-left">ราคาทุน</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.no}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.price}</td>
                <td className="p-3">{c.cost}</td>
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
