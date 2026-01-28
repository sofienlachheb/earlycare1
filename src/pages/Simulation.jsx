import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHealth } from "../state/HealthContext";
import { calculateRisks } from "../state/healthLogic";

/** helpers */
function clamp(n, min = 0, max = 100) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function Toggle({ value, onChange, id }) {
  return (
    <div
      id={id}
      className={`toggle-switch ${value ? "active" : ""}`}
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!value);
        }
      }}
    />
  );
}

function avg3(a, b, c) {
  return (clamp(a) + clamp(b) + clamp(c)) / 3;
}

function gainPercent(beforeAvg, afterAvg) {
  const g = beforeAvg - afterAvg; // انخفاض = مكسب
  return Math.round(g * 10) / 10;
}

function tipFor(sim) {
  const tips = [];
  if (sim.smoking === false) tips.push("الإقلاع عن التدخين عادةً يرفع التحسن بسرعة.");
  if (Number(sim.exercise) >= 5) tips.push("رفع النشاط البدني 5+ ساعات أسبوعيًا ممتاز للقلب والسكري.");
  if (Number(sim.diet_quality) >= 8) tips.push("جودة التغذية 8/10 أو أكثر تقلل خطر السكري بشكل واضح.");
  if (Number(sim.sleep_hours) >= 7 && Number(sim.sleep_hours) <= 9) tips.push("النوم 7-9 ساعات يدعم التعافي ويقلل الإجهاد.");
  if (Number(sim.stress_level) <= 4) tips.push("خفض التوتر يساعد الصحة العامة بشكل تدريجي.");

  if (!tips.length) return "💡 نصيحة: ابدأ بالتغييرات الأكثر تأثيراً بأقل جهد.";
  return `💡 ${tips[0]}`;
}

export default function Simulation() {
  const { currentProfile } = useHealth();
  const location = useLocation();

  // ✅ profile من navigation state (بدون حفظ) أو من currentProfile
  const profile = useMemo(() => {
    const s = location?.state;
    if (s && typeof s === "object" && s.profile) return s.profile;
    return currentProfile || null;
  }, [location?.state, currentProfile]);

  const base = useMemo(() => (profile ? calculateRisks(profile) : null), [profile]);

  const [sim, setSim] = useState({
    smoking: false,
    exercise: 3,
    diet_quality: 5,
    stress_level: 5,
    sleep_hours: 7,
  });

  // عند دخول الصفحة أو تغيّر profile: املأ قيم المحاكاة من ملفه
  useEffect(() => {
    if (!profile) return;
    setSim({
      smoking: Boolean(profile.smoking),
      exercise: Number(profile.exercise ?? 3),
      diet_quality: Number(profile.diet_quality ?? 5),
      stress_level: Number(profile.stress_level ?? 5),
      sleep_hours: Number(profile.sleep_hours ?? 7),
    });
  }, [profile]);

  const simulatedProfile = useMemo(() => {
    if (!profile) return null;
    return {
      ...profile,
      smoking: Boolean(sim.smoking),
      exercise: Number(sim.exercise),
      diet_quality: Number(sim.diet_quality),
      stress_level: Number(sim.stress_level),
      sleep_hours: Number(sim.sleep_hours),
    };
  }, [profile, sim]);

  const after = useMemo(() => {
    if (!simulatedProfile) return null;
    return calculateRisks(simulatedProfile);
  }, [simulatedProfile]);

  if (!profile) {
    return (
      <div className="p-8 fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">محاكاة الوقاية</h2>
            <p className="text-slate-400">عدّل المعايير وشاهد التأثير على مخاطرك في الوقت الفعلي</p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">الملف مطلوب</h3>
            <p className="text-slate-400 mb-4">أكمل ملفك أولاً للوصول إلى المحاكاة.</p>
            <Link
              to="/profile"
              className="px-6 py-3 inline-block bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              إنشاء ملفي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const beforeAvg = base ? avg3(base.cardio, base.diabetes, base.oxidative) : 0;
  const afterAvg = after ? avg3(after.cardio, after.diabetes, after.oxidative) : 0;
  const totalGain = gainPercent(beforeAvg, afterAvg);

  const resetSimulation = () => {
    setSim({
      smoking: Boolean(profile.smoking),
      exercise: Number(profile.exercise ?? 3),
      diet_quality: Number(profile.diet_quality ?? 5),
      stress_level: Number(profile.stress_level ?? 5),
      sleep_hours: Number(profile.sleep_hours ?? 7),
    });
  };

  return (
    <div className="p-8 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">محاكاة الوقاية</h2>
          <p className="text-slate-400">عدّل المعايير وشاهد التأثير على مخاطرك في الوقت الفعلي</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* عناصر التحكم */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              معايير المحاكاة
            </h3>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">الإقلاع عن التدخين</span>
                  <Toggle
                    id="sim-toggle-smoking"
                    value={sim.smoking}
                    onChange={(v) => setSim((p) => ({ ...p, smoking: v }))}
                  />
                </div>
                <p className="text-sm text-slate-400">التأثير المحتمل: -15% خطر القلب</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">النشاط البدني</span>
                  <span className="text-teal-400 font-semibold">{sim.exercise} س/أسبوع</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={sim.exercise}
                  onChange={(e) => setSim((p) => ({ ...p, exercise: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <p className="text-sm text-slate-400 mt-2">+1 ساعة = -5% خطر عام تقديري</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">جودة التغذية</span>
                  <span className="text-teal-400 font-semibold">{sim.diet_quality}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={sim.diet_quality}
                  onChange={(e) => setSim((p) => ({ ...p, diet_quality: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <p className="text-sm text-slate-400 mt-2">التحسن إلى 8+: -20% خطر السكري</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">تقليل التوتر</span>
                  <span className="text-teal-400 font-semibold">{sim.stress_level}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={sim.stress_level}
                  onChange={(e) => setSim((p) => ({ ...p, stress_level: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <p className="text-sm text-slate-400 mt-2">توتر أقل = صحة عامة أفضل</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">ساعات النوم</span>
                  <span className="text-teal-400 font-semibold">{sim.sleep_hours} س</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={10}
                  value={sim.sleep_hours}
                  onChange={(e) => setSim((p) => ({ ...p, sleep_hours: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <p className="text-sm text-slate-400 mt-2">7-9 ساعات مثالية للتعافي</p>
              </div>
            </div>

            <button
              onClick={resetSimulation}
              className="w-full mt-6 py-3 glass-card rounded-xl font-semibold hover:bg-slate-700/50 transition-all"
            >
              🔄 إعادة تعيين للقيم الحالية
            </button>
          </div>

          {/* النتائج */}
          <div>
            <div className="glass-card rounded-2xl p-6 mb-6 glow-teal">
              <h3 className="text-lg font-semibold mb-4">مقارنة المخاطر</h3>

              <div className="space-y-6">
                {/* cardio */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">القلب والأوعية</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{base?.cardio ?? "--"}% ←</span>
                      <span className="text-teal-400 font-bold">{after?.cardio ?? "--"}%</span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-slate-500/50 transition-all duration-500" style={{ width: `${base?.cardio ?? 0}%` }} />
                    <div className="absolute h-full bg-teal-500 transition-all duration-500" style={{ width: `${after?.cardio ?? 0}%` }} />
                  </div>
                </div>

                {/* diabetes */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">السكري النوع 2</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{base?.diabetes ?? "--"}% ←</span>
                      <span className="text-teal-400 font-bold">{after?.diabetes ?? "--"}%</span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-slate-500/50 transition-all duration-500" style={{ width: `${base?.diabetes ?? 0}%` }} />
                    <div className="absolute h-full bg-amber-500 transition-all duration-500" style={{ width: `${after?.diabetes ?? 0}%` }} />
                  </div>
                </div>

                {/* oxidative */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">الإجهاد التأكسدي</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{base?.oxidative ?? "--"}% ←</span>
                      <span className="text-teal-400 font-bold">{after?.oxidative ?? "--"}%</span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-slate-500/50 transition-all duration-500" style={{ width: `${base?.oxidative ?? 0}%` }} />
                    <div className="absolute h-full bg-purple-500 transition-all duration-500" style={{ width: `${after?.oxidative ?? 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                المكسب المحتمل
              </h3>

              <div className="text-center py-6">
                <p className="text-5xl font-bold text-emerald-400 mb-2">{totalGain > 0 ? `${totalGain}%` : "0%"}</p>
                <p className="text-slate-400">متوسط انخفاض المخاطر</p>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm text-emerald-300">{tipFor(sim)}</p>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                to="/prediction"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                🔎 الرجوع لتحليل المخاطر
              </Link>
              <p className="mt-3 text-sm text-slate-500">يمكنك العودة لرؤية العوامل المساهمة بعد المحاكاة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
