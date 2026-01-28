import React from "react";
import { NavLink } from "react-router-dom";

const Item = ({to,label,icon}) => (
  <NavLink to={to} end={to==="/"} className={({isActive})=>`nav-item w-full px-4 py-3 flex items-center gap-3 ${isActive?"active":""}`}>
    {({isActive})=>(
      <>
        <span className={`w-5 h-5 ${isActive?"text-teal-400":"text-slate-400"}`}>{icon}</span>
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

export default function Sidebar(){
  return (
    <aside className="w-64 min-h-full glass-card border-l border-slate-700/50 flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center font-bold">🩺</div>
          <div>
            <h1 className="font-bold text-lg text-white">صحتك الذكية</h1>
            <p className="text-xs text-teal-400">EarlyCare</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-4">
        <div className="px-3 mb-2"><span className="text-xs font-medium text-slate-500 uppercase tracking-wider">التنقل</span></div>
        <Item to="/" label="الرئيسية" icon="🏠" />
        <Item to="/profile" label="ملفي الصحي" icon="👤" />
        <Item to="/prediction" label="التنبؤ" icon="📊" />
        <Item to="/simulation" label="المحاكاة" icon="🔮" />
        <Item to="/explore" label="استكشاف" icon="🔎" />
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 pulse-dot"></div>
            <span className="text-xs text-amber-400 font-medium">تنبيه</span>
          </div>
          <p className="text-xs text-slate-400">تعليمي فقط ولا يغني عن الطبيب.</p>
        </div>
      </div>
    </aside>
  );
}
