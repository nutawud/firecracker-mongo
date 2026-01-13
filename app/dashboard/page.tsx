"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const res = await fetch("/api/dashboard", {
      credentials: "include",
    });
    const json = await res.json();
    setData(json || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="">
      <div className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
          <h1 className="text-2xl font-bold">📦 สินค้าขายดี</h1>
          
        </div>
      </div>
      {/* {data.map((option, index) => (
            option.name
          ))} */}
    </div>
  );
}
