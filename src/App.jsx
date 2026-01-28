import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Prediction from "./pages/Prediction";
import Simulation from "./pages/Simulation";
import Explore from "./pages/Explore";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
