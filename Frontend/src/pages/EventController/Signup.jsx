import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, User, CheckCircle } from "lucide-react";
import { apiController } from "../../lib/apiController"; // Use configured instance

export default function ControllerSignup() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch public events for selection
        // Use relative path or configured base URL
        apiController.get("/api/events/ongoing")
            .then(res => setEvents(Array.isArray(res.data) ? res.data : []))
            .catch(() => setEvents([]))
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErr("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            return setErr("Passwords do not match");
        }

        setLoading(true);

        try {
            await apiController.post("/api/controller/auth/signup", {
                username: formData.username,
                password: formData.password,
                requestedEvent: formData.requestedEvent // Send ID
            });

            setSuccess("Account created! Request sent to admin.");
            setTimeout(() => navigate("/controller/login"), 3000);

        } catch (error) {
            setErr(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
                <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Registration Successful</h2>
                    <p className="text-gray-400 mb-6">{success}</p>
                    <Link to="/controller/login" className="text-indigo-400 font-bold hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Controller Registration
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">Create an account to manage events</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {err && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {err}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Choose a username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select Event (Optional)</label>
                        <select
                            name="requestedEvent"
                            value={formData.requestedEvent || ""}
                            onChange={handleChange}
                            className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="">-- I don't know yet --</option>
                            {events.map(ev => (
                                <option key={ev._id} value={ev._id}>{ev.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Which event do you want to manage?</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/controller/login" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
