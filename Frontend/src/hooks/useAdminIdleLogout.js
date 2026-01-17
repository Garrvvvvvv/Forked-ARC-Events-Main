import { useEffect } from "react";

const IDLE_LIMIT = 2 * 60 * 1000; // 2 minutes

export default function useAdminIdleLogout() {
  useEffect(() => {
    let timer;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("adminToken");
        alert("Session expired due to inactivity");
        location.replace("/admin/login");
      }, IDLE_LIMIT);
    };

    // Reset timer on any activity
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));

    reset(); // start timer

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(timer);
    };
  }, []);
}
