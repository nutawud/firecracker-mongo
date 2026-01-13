"use client";

import { useEffect, useState } from "react";

type Stock = {
  _id: string;
  product_code: string;
  product_name: string;
  amount: number;   // ✅ คงเหลือ
  price: number;
};

type SellItem = {
  stock_id: string;
  product_name: string;
  price: number;
  qty: number;
};

export default function SellPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [sellItems, setSellItems] = useState<SellItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // โหลด stock ตอนเปิดหน้า
  const loadStock = async () => {
    setLoading(true);
    const res = await fetch("/api/stock", {
      credentials: "include",
    });
    const json = await res.json();

    setStocks(json.data); // ✅ สำคัญ
    setLoading(false);
  };

  useEffect(() => {
    loadStock();
  }, []);

  // เพิ่มลงรายการขาย
  const addItem = () => {
    const stock = stocks.find(s => s._id === selectedId);
    if (!stock) return;

    if (qty <= 0) {
      alert("จำนวนต้องมากกว่า 0");
      return;
    }

    if (qty > stock.amount) {
      alert("สินค้าไม่พอ");
      return;
    }

    setSellItems(prev => {
      const exist = prev.find(i => i.stock_id === stock._id);
      if (exist) {
        return prev.map(i =>
          i.stock_id === stock._id
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }

      return [
        ...prev,
        {
          stock_id: stock._id,
          product_name: stock.product_name,
          price: stock.price,
          qty,
        },
      ];
    });

    setQty(1);
  };

  // ลบรายการ
  const removeItem = (id: string) => {
    setSellItems(prev => prev.filter(i => i.stock_id !== id));
  };

  // ยืนยันขาย (ตัด stock)
  const confirmSell = async () => {
    if (!confirm("ยืนยันการขาย?")) return;

    for (const item of sellItems) {
      await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          stock_id: item.stock_id,
          qty: item.qty,
        }),
      });
    }

    alert("ขายเรียบร้อย");
    setSellItems([]);
    loadStock(); // รีโหลด stock ใหม่
  };

  const total = sellItems.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">🧾 ขายสินค้า (ต่อชิ้น)</h1>

      {/* เลือกสินค้า */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="border p-2 rounded"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="">-- เลือกสินค้า --</option>
          {stocks.map(s => (
            <option key={s._id} value={s._id}>
              {s.product_name} | คงเหลือ {s.amount}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          className="border p-2 w-24 rounded"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
        />

        <button
          onClick={addItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่ม
        </button>
      </div>

      {/* ตารางรายการขาย */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 ">
          <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">สินค้า</th>
            <th className="border p-2">จำนวน</th>
            <th className="border p-2">ราคา</th>
            <th className="border p-2">รวม</th>
            <th className="border p-2">ลบ</th>
          </tr>
        </thead>
        <tbody>
          {sellItems.map(i => (
            <tr key={i.stock_id}>
              <td className="border p-2">{i.product_name}</td>
              <td className="border p-2">{i.qty}</td>
              <td className="border p-2">
                {i.price}
              </td>
              <td className="border p-2">
                {(i.qty * i.price)}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => removeItem(i.stock_id)}
                  className="text-red-500"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
          {sellItems.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                ยังไม่มีรายการขาย
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* สรุป */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">
          รวมทั้งหมด: {total} บาท
        </div>
        <button
          disabled={sellItems.length === 0}
          onClick={confirmSell}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          ✅ ยืนยันขาย
        </button>
      </div>

      
    </div>
  );
}
