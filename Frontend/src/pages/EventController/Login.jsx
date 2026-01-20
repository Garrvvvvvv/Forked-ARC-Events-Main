import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiController } from "../../lib/apiController";
import { ArrowRight, Lock, User } from "lucide-react";

export default function ControllerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const res = await apiController.post("/api/controller/auth/login", {
                username,
                password
            });

            const data = res.data;

            // Save token
            localStorage.setItem("controllerToken", data.token);
            localStorage.setItem("controllerUser", data.username);

            navigate("/controller/dashboard");
        } catch (error) {
            setErr(error.response?.data?.message || error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Controller Portal
                    </h1>
                    <p className="text-gray-400 mt-2">Sign in to manage your events</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {err && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {err}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                        {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/controller/signup" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}
