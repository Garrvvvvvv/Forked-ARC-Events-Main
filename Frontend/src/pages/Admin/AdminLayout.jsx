import { Link, Outlet, useLocation } from "react-router-dom";
import { useAdminEvent } from "../../context/AdminEventContext";
import { FaCalendarAlt, FaUsers, FaImages, FaSignOutAlt, FaPlusCircle } from "react-icons/fa"; // npm install react-icons

export default function AdminLayout() {
  const { events, activeEvent, setActiveEvent } = useAdminEvent();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path) ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white";

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-500">ARC<span className="text-white">Admin</span></h1>
        </div>

        {/* Global Event Switcher */}
        <div className="p-6">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Event Scope</label>
          <select 
            value={activeEvent?._id || ""} 
            onChange={(e) => setActiveEvent(events.find(ev => ev._id === e.target.value))}
            className="mt-2 w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {events.length === 0 && <option>No Events Created</option>}
            {events.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin/events" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/admin/events")}`}>
            <FaPlusCircle /> Event Builder
          </Link>
          <Link to="/admin/registrations" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/admin/registrations")}`}>
            <FaUsers /> Registrations
          </Link>
          <Link to="/admin/memories" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/admin/memories")}`}>
            <FaImages /> Gallery Manager
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => { localStorage.removeItem("adminToken"); window.location.href="/admin/login"; }} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}