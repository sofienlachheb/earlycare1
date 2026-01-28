import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-5">
          <span className="w-2 h-2 rounded-full bg-teal-400 pulse-dot" />
          <span className="text-sm text-teal-400">AI قابل للتفسير</span>
        </div>
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent">
          افهم وتوقع مخاطرك الصحية
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          ملف صحي + تحليل مخاطر + شرح العوامل + محاكاة تغييرات نمط الحياة.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-2xl p-6 glow-teal">
          <h3 className="text-xl font-semibold mb-2">1) أنشئ ملفك</h3>
          <p className="text-slate-400">أدخل العمر، الوزن، العادات، والتاريخ العائلي.</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-2">2) شاهد التفسير</h3>
          <p className="text-slate-400">كل نتيجة لها عوامل واضحة يمكن تعديلها.</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-2">3) حاكِ التغيير</h3>
          <p className="text-slate-400">غيّر الرياضة/النوم/التدخين وشاهد الفرق فوراً.</p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/profile" className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all">
          ابدأ الآن
        </Link>
        <p className="mt-4 text-sm text-slate-500">مجاني • سري • تعليمي</p>
      </div>
    </div>
  );
}
