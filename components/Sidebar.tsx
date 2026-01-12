"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "รายการสั่งซื้อ", path: "/dashboard/order" },
    { name: "ประเภท", path: "/dashboard/categorie" },
    { name: "ตารางขายส่ง", path: "/dashboard/wholesale-table" },
    { name: "ตารางขายส่งให้ร้าน", path: "/dashboard/stores-table" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-5 left-4 z-50 text-black rounded"
      >
        <Bars3BottomLeftIcon className="h-6 w-6 text-gray-500" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-4 text-xl text-white font-bold bg-black">
          ร้านประทัด
        </div>

        <nav className="p-4 space-y-1">
          {menu.map((m) => (
            <Link
              key={m.path}
              href={m.path}
              onClick={() => setOpen(false)}
              className={`
                block px-3 py-2 rounded
                ${
                  pathname === m.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {m.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
