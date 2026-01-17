import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUser } from "../../lib/apiUser";
import {
  Ticket, Calendar, Clock, CheckCircle, XCircle,
  AlertCircle, ArrowRight, Loader, User, Mail, Plus
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Modal State
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    // 1. Get Local Profile
    const auth = JSON.parse(localStorage.getItem("app_auth") || "{}");
    const user = auth?.user || {};
    // Normalize user info
    setProfile({
      name: user.name || user.fullName || user.displayName || "User",
      email: user.email || "No Email",
      picture: user.picture || user.photoURL || null
    });

    // 2. Fetch Registrations
    apiUser.get("/api/events/registrations/mine")
      .then(res => setRegistrations(res.data || []))
      .catch(err => {
        console.error(err);
        setError("Failed to load your registrations.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("app_auth");
    window.location.href = "/";
  };

  // Helper for status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return { icon: <CheckCircle size={16} />, style: 'bg-green-500/10 text-green-400 border-green-500/20' };
      case 'REJECTED':
        return { icon: <XCircle size={16} />, style: 'bg-red-500/10 text-red-400 border-red-500/20' };
      default:
        return { icon: <Clock size={16} />, style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center space-y-4">
        <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* PROFILE CARD */}
        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 shadow-2xl">
          <div className="w-24 h-24 rounded-full border-4 border-gray-800 overflow-hidden shadow-lg flex-shrink-0">
            {profile?.picture ? (
              <img src={profile.picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {profile?.name?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-white mb-1">{profile?.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
              <Mail size={16} /> {profile?.email}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 text-sm font-medium mt-2">
              <FaGoogle /> Connected Account
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[150px]">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total Events</p>
              <p className="text-3xl font-bold text-white">{registrations.length}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600"
            >
              Log Out
            </button>
          </div>
        </div>


        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="text-indigo-500" /> My Registrations
          </h2>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Empty State */}
        {!error && registrations.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
            <Ticket className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300">No Registrations Found</h3>
            <p className="text-gray-500 mt-2">You haven't registered for any upcoming events yet.</p>
          </div>
        ) : (
          /* Registration List */
          <div className="grid gap-4">
            {registrations.map(reg => {
              const { icon, style } = getStatusStyle(reg.status);
              return (
                <div
                  key={reg._id}
                  onClick={() => setSelectedReg(reg)}
                  className="group bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md active:scale-[0.99]"
                >
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {reg.event?.name || "Event Name Unavailable"}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                      <span className="hidden md:inline text-gray-700">|</span>
                      <span>Batch: {reg.batch}</span>
                      {reg.amount > 0 && (
                        <>
                          <span className="hidden md:inline text-gray-700">|</span>
                          <span>Paid: ₹{reg.amount}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${style}`}>
                    {icon} {reg.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReg(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedReg.event?.name}</h3>
                <p className="text-gray-400 text-sm mt-1">Registration Details</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-gray-500 hover:text-white transition">
                <XCircle size={28} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex justify-between items-center ${getStatusStyle(selectedReg.status).style}`}>
                <span className="font-bold flex items-center gap-2">{getStatusStyle(selectedReg.status).icon} Application Status</span>
                <span className="font-mono font-bold">{selectedReg.status}</span>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Name</span>
                  <span className="text-white">{selectedReg.name}</span>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Batch</span>
                  <span className="text-white">{selectedReg.batch}</span>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Mobile</span>
                  <span className="text-white">{selectedReg.contact || selectedReg.mobile}</span>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Email</span>
                  <span className="text-white">{selectedReg.email}</span>
                </div>
              </div>

              {/* Family Info */}
              {selectedReg.familyMembers && selectedReg.familyMembers.length > 0 && (
                <div>
                  <h4 className="text-white font-bold mb-3 border-b border-gray-800 pb-2">Family Members ({selectedReg.familyMembers.length})</h4>
                  <div className="space-y-2">
                    {selectedReg.familyMembers.map((m, i) => (
                      <div key={i} className="flex justify-between bg-gray-800/30 p-3 rounded border border-gray-800">
                        <span className="text-white">{m.name}</span>
                        <span className="text-indigo-400 text-sm">{m.relation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              {selectedReg.amount > 0 && (
                <div>
                  <h4 className="text-white font-bold mb-3 border-b border-gray-800 pb-2">Payment Info</h4>
                  <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-xl font-bold text-green-400">₹{selectedReg.amount}</span>
                  </div>
                  {selectedReg.receipt && ( // Assuming populated or just having ID? The controller doesn't send receipt data unless specifically requested? 
                    // Controller currently excludes receipt.data. But might have receipt URL if using Cloudinary?
                    // Actually the controller `getMyAllRegistrations` creates a lightweight object.
                    // `EventController.js` logic for `getMyAllRegistrations` uses standard `find`.
                    // If using Cloudinary, `receipt` might be an object with url.
                    // Let's assume standard object structure. 
                    // Note: If buffer is used, it won't be sent. 
                    // Admin Controller uploads to Cloudinary. User Controller uses buffer?
                    // Let's check `registerEvent` in `eventController.js`:
                    // It saves `receipt: { data: buffer, ... }`. It does NOT upload to Cloudinary directly? 
                    // Uh oh. If it saves as buffer, it might be heavy or not viewable easily.
                    // Wait, `AdminEvent` uploads to Cloudinary. `User` might be different.
                    // Let's assume for now we just show text saying "Receipt Uploaded".
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      * Payment receipt submitted for verification.
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}