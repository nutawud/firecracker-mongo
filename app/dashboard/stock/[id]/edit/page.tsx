"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditStockPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    product_code: "",
    product_name: "",
    unit_per_box: 0,
    cost: 0,
    price: 0
  });

  useEffect(() => {
    fetch(`/api/stock/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const submit = async () => {
    await fetch(`/api/stock/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/stock");
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">✏️ Edit Stock</h1>

      <label>Product Code</label>
      <input
        value={form.product_code}
        disabled
        className="border p-2 w-full mb-3 bg-gray-100"
      />

      <label>ชื่อสินค้า</label>
      <input
        value={form.product_name}
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({ ...form, product_name: e.target.value })
        }
      />

      <label>ชิ้นต่อลัง</label>
      <input
        type="number"
        value={form.unit_per_box}
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({ ...form, unit_per_box: Number(e.target.value) })
        }
      />

      <label>ต้นทุนต่อชิ้น</label>
      <input
        type="number"
        value={form.cost}
        className="border p-2 w-full mb-4"
        onChange={(e) =>
          setForm({ ...form, cost: Number(e.target.value) })
        }
      />
      
      <label>ราคาขาย</label>
      <input
        type="number"
        value={form.price}
        className="border p-2 w-full mb-4"
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        บันทึก
      </button>
    </div>
  );
}
