import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiController } from "../../lib/apiController";
import { ArrowLeft, User, Phone, Mail, Calendar } from "lucide-react";

export default function ControllerEventDetails() {
    const { eventId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        apiController.get(`/api/controller/registrations/${eventId}`)
            .then((res) => {
                setCandidates(res.data.candidates || []);
            })
            .catch((e) => {
                setErr("Failed to load registrations. You may not be authorized for this event.");
            })
            .finally(() => setLoading(false));
    }, [eventId]);

    const filtered = candidates.filter(c => filter === "ALL" ? true : c.status === filter);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading registrations...</div>;
    if (err) return <div className="p-10 text-center text-red-500 font-bold">{err}</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <Link to="/controller/dashboard" className="inline-flex items-center text-gray-400 hover:text-white transition gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Event Registrations</h1>
                    <p className="text-gray-400 mt-1">Total Candidates: {candidates.length}</p>
                </div>

                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded text-sm font-bold transition ${filter === status ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-950 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Candidate</th>
                                <th className="p-4">Contact Info</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500 italic">No registrations found for this filter.</td>
                                </tr>
                            )}
                            {filtered.map(c => (
                                <tr key={c._id} className="hover:bg-gray-800/50 transition group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-900/50 p-2 rounded-full text-indigo-300">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{c.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-gray-500" /> {c.oauthEmail}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 text-gray-500" /> {c.contact || "N/A"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                               inline-block px-2 py-1 rounded text-xs font-bold border
                               ${c.status === "APPROVED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                c.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}
                            `}>
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
