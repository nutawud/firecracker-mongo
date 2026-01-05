"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh(); // สำคัญ
  }

  return (
    <header className="fixed h-15 bg-white shadow flex items-center justify-end px-5 w-full md:w-[calc(100%-16rem)]">
      <div className="relative" ref={ref}>
        {/* Profile button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          <img
            src="https://ui-avatars.com/api/?name=Admin"
            alt="Profile"
            className="w-9 h-9 rounded-full"
          />
          <span className="hidden md:block font-medium">
            Admin
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow">
            <a
              href="/dashboard/profile"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="/dashboard/settings"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </a>
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
