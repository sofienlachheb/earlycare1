import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

export default function AppLayout(){
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="fade-in p-8"><Outlet /></div>
      </main>
      <Toast />
    </div>
  );
}
