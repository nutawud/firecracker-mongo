"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStockPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    product_code: "",
    product_name: "",
    unit_per_box: 0,
    cost: 0,
    amount: 0,
    price: 0
  });

  const submit = async () => {
    if (!form.product_code || form.amount <= 0) {
      alert("กรอกข้อมูลไม่ครบ");
      return;
    }

    await fetch("/api/stock", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/stock");
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">➕ Add Stock</h1>

      <input
        placeholder="Product Code (เช่น P-5000)"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, product_code: e.target.value })}
      />

      <input
        placeholder="ชื่อสินค้า"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, product_name: e.target.value })}
      />

      <input
        type="number"
        placeholder="ชิ้นต่อลัง"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({ ...form, unit_per_box: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="ต้นทุนต่อชิ้น"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="ราคาขาย"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />

      <input
        type="number"
        placeholder="จำนวนที่รับเข้า (ชิ้น)"
        className="border p-2 w-full mb-4"
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
      />

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        บันทึก
      </button>
    </div>
  );
}
