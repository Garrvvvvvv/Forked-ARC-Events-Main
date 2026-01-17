import { useState } from "react";
import { apiAdmin } from "../../lib/apiAdmin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await apiAdmin.post("/api/admin/auth/login", {
        username,
        password,
      });

      const token = res.data?.token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("adminToken", token);
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("login error", error);
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={submit} className="bg-gray-800 p-6 rounded w-96">
        <h2 className="text-xl mb-4 text-white">Admin Login</h2>

        {err && <div className="text-red-400 mb-3">{err}</div>}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white"
        />

        <button
          disabled={loading}
          className="bg-indigo-600 w-full py-2 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
