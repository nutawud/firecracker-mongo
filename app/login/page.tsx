"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setLoading(false)
      router.push("/dashboard");
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >

        <h1 className="text-xl font-bold text-center">Admin Login</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded" >
          {loading && (
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
          {loading ? '' : 'Login'}
        </button>
      </form>
    </div>
  );
}
