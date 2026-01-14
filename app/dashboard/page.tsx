"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [data, setData] = useState([{
    _id: 0,
    name: "",
    totalAmount: 0,
    totalPrice: 0,
    totalCost: 0
  }]);

  const total = data.reduce(
    (sum, i) => sum + i.totalPrice-i.totalCost,
    0
  );

  const loadData = async () => {
    const res = await fetch("/api/dashboard", {
      credentials: "include",
    });
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="">
      <div className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
          <h1 className="text-2xl font-bold">📦 สินค้าขายดี {total.toLocaleString("th-TH")}</h1>
        </div>
      </div>


      <div className="grid md:grid-cols-3 gap-4">
        {data.map((d, index) => (
          <div key={d._id} className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl transform transition duration-500 hover:scale-105">
            <div className="md:flex">

              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {d.name}
                </div>
                <p className="mt-2 text-gray-500">จำนวนที่สั่ง: {d.totalAmount} ลัง</p>
                <p className="mt-2 text-gray-500">จำนวนเงินที่ได้: {d.totalPrice.toLocaleString("th-TH")} บาท</p>
                <p className="mt-2 text-gray-500">จำนวนเงินที่ลงทุน: {d.totalCost.toLocaleString("th-TH")} บาท</p>
                <p className="mt-2 text-gray-500">กำไร: {(d.totalPrice - d.totalCost).toLocaleString("th-TH")} บาท</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
