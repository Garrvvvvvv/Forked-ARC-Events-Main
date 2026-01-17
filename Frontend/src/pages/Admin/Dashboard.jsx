import { useEffect, useState } from "react";
import { useAdminEvent } from "../../context/AdminEventContext";
import { apiAdmin } from "../../lib/apiAdmin";

export default function Dashboard() {
  const { activeEvent } = useAdminEvent();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (activeEvent) {
      apiAdmin.get(`/api/admin/events/${activeEvent._id}/stats`)
        .then(res => setStats(res.data))
        .catch(() => toast.error("Failed to load stats"));
    }
  }, [activeEvent]);

  if (!activeEvent) return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <p>Please select an event from the sidebar to view metrics.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{activeEvent.name} - Performance Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Candidates" value={stats?.total || 0} color="border-blue-500" />
        <StatCard label="Approved Payments" value={stats?.approved || 0} color="border-green-500" />
        <StatCard label="Pending Review" value={stats?.pending || 0} color="border-yellow-500" />
        <StatCard label="Active Staff" value={stats?.controllers || 0} color="border-purple-500" />
      </div>


    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-900 p-5 rounded-lg border-l-4 ${color} shadow-lg`}>
    <p className="text-gray-400 text-sm uppercase font-semibold">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);