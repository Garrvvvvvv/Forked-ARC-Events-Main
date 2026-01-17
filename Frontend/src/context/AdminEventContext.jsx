import React, { createContext, useContext, useState, useEffect } from "react";
import { apiAdmin } from "../lib/apiAdmin"; // Assumes axios instance with token

const AdminEventContext = createContext();

export const AdminEventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await apiAdmin.get("/api/admin/events");
      const data = res.data;
      const eventsArray = Array.isArray(data) ? data : [];
      setEvents(eventsArray);
      // Automatically select the first event if none is active
      if (!activeEvent && eventsArray.length > 0) {
        setActiveEvent(eventsArray[0]);
      }
    } catch (err) {
      console.error("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <AdminEventContext.Provider value={{ events, setEvents, activeEvent, setActiveEvent, fetchEvents, loading }}>
      {children}
    </AdminEventContext.Provider>
  );
};

export const useAdminEvent = () => useContext(AdminEventContext);