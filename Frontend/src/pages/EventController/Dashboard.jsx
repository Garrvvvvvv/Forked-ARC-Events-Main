import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiController } from "../../lib/apiController";
import { Calendar, Users, CheckCircle, XCircle, TrendingUp, Eye, ClipboardList } from "lucide-react";

export default function EventControllerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [controllerName, setControllerName] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("controllerUser");
    if (username) setControllerName(username);

    apiController.get("/api/controller/events")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setEvents([]);
          console.error("Unexpected API response:", res.data);
        }
      })
      .catch((err) => {
        console.error("Dashboard Load Error:", err);
        setError("Failed to load dashboard. Ensure server is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400 mx-auto mb-3"></div>
          <p className="text-gray-300 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="bg-white/10 border border-red-400/30 text-red-300 p-6 rounded-lg max-w-md mx-auto">
          <XCircle className="h-10 w-10 mx-auto mb-3 text-red-400" />
          <p className="font-medium text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                Event Controller Dashboard
              </h1>
              <p className="text-gray-300">
                Welcome back, <span className="font-semibold text-white">{controllerName || "Controller"}</span>
              </p>
            </div>
            <ClipboardList className="h-10 w-10 text-white/20" />
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Your Events <span className="text-gray-400 font-normal">({events.length})</span>
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-12 text-center shadow-xl">
            <Calendar className="h-14 w-14 text-white/30 mx-auto mb-4" />
            <p className="text-white font-medium text-lg">No events assigned yet</p>
            <p className="text-gray-400 text-sm mt-2">Contact admin to get events assigned to you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const styles = {
    blue: {
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-blue-300",
      border: "border-blue-500/20"
    },
    green: {
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      valueColor: "text-green-300",
      border: "border-green-500/20"
    },
    red: {
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      valueColor: "text-red-300",
      border: "border-red-500/20"
    }
  };

  const style = styles[color];

  return (
    <div className={`bg-white/5 backdrop-blur-sm border ${style.border} rounded-lg p-6 shadow-xl hover:bg-white/10 transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <p className={`text-3xl font-bold ${style.valueColor}`}>{value}</p>
        </div>
        <div className={`${style.iconBg} p-3 rounded-lg ${style.iconColor}`}>{icon}</div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const pendingCount = event.registrations - event.approved - event.rejected;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-xl hover:bg-white/10 hover:border-white/20 transition-all">
      {/* Event Header */}
      <div className="bg-gray-800/50 border-b border-white/10 p-5">
        <h3 className="text-lg font-semibold text-white mb-1">{event.name}</h3>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>Event ID: {event._id.slice(-8)}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <MiniStat
            icon={<Users className="h-4 w-4" />}
            label="Total"
            value={event.registrations}
            color="blue"
          />
          <MiniStat
            icon={<CheckCircle className="h-4 w-4" />}
            label="Approved"
            value={event.approved}
            color="green"
          />
          <MiniStat
            icon={<XCircle className="h-4 w-4" />}
            label="Rejected"
            value={event.rejected}
            color="red"
          />
          <MiniStat
            icon={<TrendingUp className="h-4 w-4" />}
            label="Pending"
            value={pendingCount}
            color="amber"
          />
        </div>

        {/* Action Button */}
        <Link
          to={`/controller/events/${event._id}`}
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors"
        >
          <Eye className="h-4 w-4" />
          View All Candidates
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, color }) {
  const styles = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
      valueColor: "text-blue-300"
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      iconColor: "text-green-400",
      valueColor: "text-green-300"
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      iconColor: "text-red-400",
      valueColor: "text-red-300"
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-300"
    }
  };

  const style = styles[color];

  return (
    <div className={`${style.bg} p-3 rounded-lg border ${style.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={style.iconColor}>{icon}</span>
        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{label}</span>
      </div>
      <p className={`text-xl font-bold ${style.valueColor}`}>{value}</p>
    </div>
  );
}
