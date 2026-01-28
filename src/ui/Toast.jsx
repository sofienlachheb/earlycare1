import React from "react";
import { useHealth } from "../state/HealthContext";
export default function Toast(){
  const { toast } = useHealth();
  return (
    <div className={`fixed bottom-4 left-4 px-6 py-3 rounded-xl glass-card transform transition-all duration-300 z-50
      ${toast.open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}
      ${toast.type==="error" ? "border border-red-500/30 text-red-300" : "border border-teal-500/30 text-teal-300"}`}>
      <p className="text-sm">{toast.message}</p>
    </div>
  );
}
