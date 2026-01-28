import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHealth } from "../state/HealthContext";
import { calculateRisks, getRiskFactors } from "../state/healthLogic";

/** Helpers */
function clamp(n, min = 0, max = 100) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function riskBarClass(v) {
  const value = clamp(v);
  return value >= 60 ? "risk-gradient-high" : value >= 30 ? "risk-gradient-medium" : "risk-gradient-low";
}

function riskLabel(v) {
  const value = clamp(v);
  if (value >= 60) return "خطر مرتفع";
  if (value >= 30) return "خطر متوسط";
  return "خطر منخفض";
}

function diffText(you, avg) {
  const d = Math.round((you - avg) * 10) / 10;
  if (!Number.isFinite(d)) return "--";
  if (d === 0) return "مطابق للمتوسط";
  return d > 0 ? `أعلى من المتوسط بـ ${Math.abs(d)}%` : `أقل من المتوسط بـ ${Math.abs(d)}%`;
}

/** Color map for factors */
const colorMap = {
  red: { row: "bg-red-500/10 border-red-500/30", dot: "bg-red-400", pill: "bg-red-500/20 text-red-300" },
  amber: { row: "bg-amber-500/10 border-amber-500/30", dot: "bg-amber-400", pill: "bg-amber-500/20 text-amber-300" },
  orange: { row: "bg-orange-500/10 border-orange-500/30", dot: "bg-orange-400", pill: "bg-orange-500/20 text-orange-300" },
  purple: { row: "bg-purple-500/10 border-purple-500/30", dot: "bg-purple-400", pill: "bg-purple-500/20 text-purple-300" },
  green: { row: "bg-emerald-500/10 border-emerald-500/30", dot: "bg-emerald-400", pill: "bg-emerald-500/20 text-emerald-300" },
};

export default function PredictionPage() {
  const { currentProfile } = useHealth();
  const location = useLocation();

  // ✅ نأخذ البيانات بدون حفظ من الـ state أولاً
  const profile = useMemo(() => {
    return location?.state?.profile || currentProfile || null;
  }, [location?.state, currentProfile]);

  // ✅ إذا لا توجد بيانات: يظهر التحذير فقط
  if (!profile) {
    return (
      <div id="page-prediction" className="p-8 fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">تحليل مخاطرك</h2>
            <p className="text-slate-400">بناءً على بياناتك الشخصية ونموذج الذكاء الاصطناعي القابل للتفسير</p>
          </div>

          <div id="no-profile-warning" className="glass-card rounded-2xl p-8 text-center mb-8">
            <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <h3 className="text-xl font-semibold mb-2">الملف غير مكتمل</h3>
            <p className="text-slate-400 mb-4">للحصول على تحليل شخصي، يرجى إكمال ملفك الصحي أولاً.</p>

            <Link
              to="/profile"
              className="px-6 py-3 inline-block bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              إكمال ملفي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ حساب النتائج
  const r = calculateRisks(profile);
  const factors = getRiskFactors(profile);

  // مخاطر أساسية
  const cardio = clamp(r.cardio);
  const diabetes = clamp(r.diabetes);
  const oxidative = clamp(r.oxidative);

  // BMI
  const bmi = Number.isFinite(r.bmi) ? r.bmi : (() => {
    const h = (Number(profile.height) || 170) / 100;
    const w = Number(profile.weight) || 70;
    return Math.round((w / (h * h)) * 10) / 10;
  })();

  const bmiCategory =
    bmi < 18.5 ? "نحافة" : bmi < 25 ? "طبيعي" : bmi < 30 ? "زيادة وزن" : "سمنة";

  const bmiInterpretation =
    bmi < 18.5
      ? "مؤشر كتلة جسمك يشير إلى نحافة. من الأفضل مراجعة مختص لتقييم غذائي وصحي."
      : bmi < 25
      ? "مؤشر كتلة جسمك طبيعي. حافظ على عاداتك الجيدة!"
      : bmi < 30
      ? "هناك زيادة في الوزن. النشاط البدني المنتظم وتحسين الغذاء يساعدان كثيرًا."
      : "المؤشر يشير إلى سمنة. يُنصح بخطة غذائية ونشاط وتقييم طبي عند الحاجة.";

  // مؤشر marker لـ BMI (0..100) على شريط 4 مناطق
  const bmiMarkerLeft = clamp((bmi / 40) * 100); // 40 كحد أعلى للتصوّر

  // ✅ نظرة عامة (لو healthLogic لا يوفرها، نحسبها بطريقة بسيطة)
  const avgRisk = (cardio + diabetes + oxidative) / 3;
  const healthScore = clamp(r.health_score ?? Math.round(100 - avgRisk));
  const improvementPotential = clamp(r.improvement_potential ?? Math.round(Math.max(0, 100 - healthScore)));
  const healthAge = Math.round(r.health_age ?? (Number(profile.age) + avgRisk / 10));

  // ✅ مقارنات ثابتة مثل الـ HTML
  const AVG_CARDIO = 35;
  const AVG_DIAB = 28;
  const AVG_OX = 42;

  return (
    <div id="page-prediction" className="p-8 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">تحليل مخاطرك</h2>
          <p className="text-slate-400">بناءً على بياناتك الشخصية ونموذج الذكاء الاصطناعي القابل للتفسير</p>
        </div>

        {/* النتائج */}
        <div id="prediction-results">
          {/* نظرة عامة على الصحة */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 text-center glow-teal">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-slate-400 mb-1">درجة الصحة العامة</p>
              <p className="text-4xl font-bold text-teal-400 mb-2">{healthScore}</p>
              <p className="text-sm text-slate-500">من 100</p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-sm text-slate-400 mb-1">إمكانية التحسين</p>
              <p className="text-4xl font-bold text-purple-400 mb-2">{improvementPotential}</p>
              <p className="text-sm text-slate-500">نقاط قابلة للكسب</p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-slate-400 mb-1">العمر الصحي التقديري</p>
              <p className="text-4xl font-bold text-amber-400 mb-2">{healthAge}</p>
              <p className="text-sm text-slate-500">سنة</p>
            </div>
          </div>

          {/* بطاقة BMI */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">مؤشر كتلة الجسم (BMI)</h3>
                  <p className="text-xs text-slate-500">مؤشر الوزن مقابل الطول</p>
                </div>
              </div>

              <div className="text-left">
                <span className="text-3xl font-bold text-teal-400">{bmi}</span>
                <p className="text-xs text-slate-400">{bmiCategory}</p>
              </div>
            </div>

            <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden mb-3">
              <div className="absolute inset-0 flex">
                <div className="w-1/4 bg-blue-500/30" />
                <div className="w-1/4 bg-emerald-500/30" />
                <div className="w-1/4 bg-amber-500/30" />
                <div className="w-1/4 bg-red-500/30" />
              </div>

              <div
                className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
                style={{ left: `${bmiMarkerLeft}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 mb-4">
              <span>
                نحافة
                <br />
                &lt;18.5
              </span>
              <span>
                طبيعي
                <br />
                18.5-24.9
              </span>
              <span>
                زيادة
                <br />
                25-29.9
              </span>
              <span>
                سمنة
                <br />
                ≥30
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <p className="text-sm text-slate-300">{bmiInterpretation}</p>
            </div>
          </div>

          {/* بطاقات المخاطر التفصيلية */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              تقييم المخاطر المفصّل
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* قلب وأوعية */}
              <div className="glass-card rounded-2xl p-6 stat-card transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">أمراض القلب والأوعية</p>
                    <p className="text-3xl font-bold">{cardio}%</p>
                  </div>
                </div>

                <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className={`h-full transition-all duration-500 ${riskBarClass(cardio)}`} style={{ width: `${cardio}%` }} />
                </div>
                <p className="text-xs text-slate-500 text-center">{riskLabel(cardio)}</p>
              </div>

              {/* سكري */}
              <div className="glass-card rounded-2xl p-6 stat-card transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">السكري النوع 2</p>
                    <p className="text-3xl font-bold">{diabetes}%</p>
                  </div>
                </div>

                <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className={`h-full transition-all duration-500 ${riskBarClass(diabetes)}`} style={{ width: `${diabetes}%` }} />
                </div>
                <p className="text-xs text-slate-500 text-center">{riskLabel(diabetes)}</p>
              </div>

              {/* إجهاد تأكسدي */}
              <div className="glass-card rounded-2xl p-6 stat-card transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">الإجهاد التأكسدي</p>
                    <p className="text-3xl font-bold">{oxidative}%</p>
                  </div>
                </div>

                <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className={`h-full transition-all duration-500 ${riskBarClass(oxidative)}`} style={{ width: `${oxidative}%` }} />
                </div>
                <p className="text-xs text-slate-500 text-center">{riskLabel(oxidative)}</p>
              </div>
            </div>
          </div>

          {/* رسم بياني مقارن */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              مقارنة مخاطرك مع المتوسط
            </h3>

            <div className="space-y-6">
              {/* cardio */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">أمراض القلب والأوعية</span>
                  <span className="text-sm">
                    <span className="text-red-400 font-semibold">{cardio}%</span>
                    <span className="text-slate-600 mx-2">مقابل</span>
                    <span className="text-slate-500">{AVG_CARDIO}%</span>
                  </span>
                </div>

                <div className="relative h-8 bg-slate-700/30 rounded-lg overflow-hidden">
                  <div className="absolute right-0 h-full bg-slate-600/50 rounded-lg" style={{ width: `${AVG_CARDIO}%` }} />
                  <div
                    className="absolute right-0 h-full bg-gradient-to-l from-red-500 to-red-600 rounded-lg transition-all duration-700"
                    style={{ width: `${cardio}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-lg">{diffText(cardio, AVG_CARDIO)}</span>
                  </div>
                </div>
              </div>

              {/* diabetes */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">السكري النوع 2</span>
                  <span className="text-sm">
                    <span className="text-amber-400 font-semibold">{diabetes}%</span>
                    <span className="text-slate-600 mx-2">مقابل</span>
                    <span className="text-slate-500">{AVG_DIAB}%</span>
                  </span>
                </div>

                <div className="relative h-8 bg-slate-700/30 rounded-lg overflow-hidden">
                  <div className="absolute right-0 h-full bg-slate-600/50 rounded-lg" style={{ width: `${AVG_DIAB}%` }} />
                  <div
                    className="absolute right-0 h-full bg-gradient-to-l from-amber-500 to-amber-600 rounded-lg transition-all duration-700"
                    style={{ width: `${diabetes}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-lg">{diffText(diabetes, AVG_DIAB)}</span>
                  </div>
                </div>
              </div>

              {/* oxidative */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">الإجهاد التأكسدي</span>
                  <span className="text-sm">
                    <span className="text-purple-400 font-semibold">{oxidative}%</span>
                    <span className="text-slate-600 mx-2">مقابل</span>
                    <span className="text-slate-500">{AVG_OX}%</span>
                  </span>
                </div>

                <div className="relative h-8 bg-slate-700/30 rounded-lg overflow-hidden">
                  <div className="absolute right-0 h-full bg-slate-600/50 rounded-lg" style={{ width: `${AVG_OX}%` }} />
                  <div
                    className="absolute right-0 h-full bg-gradient-to-l from-purple-500 to-purple-600 rounded-lg transition-all duration-700"
                    style={{ width: `${oxidative}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-lg">{diffText(oxidative, AVG_OX)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center">* المتوسطات مبنية على بيانات المجتمع العام</p>
          </div>

          {/* قسم التفسير (العوامل) */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              العوامل المساهمة في مخاطرك
            </h3>

            <div className="space-y-4">
              {factors?.length ? (
                factors.map((f, idx) => {
                  const c = colorMap[f.color] || colorMap.amber;
                  return (
                    <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${c.row}`}>
                      <div className={`w-3 h-3 rounded-full ${c.dot} mt-1`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{f.name}</span>
                          {f.impact ? (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${c.pill}`}>{f.impact}</span>
                          ) : null}
                        </div>
                        <p className="text-sm text-slate-400">{f.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-sm text-slate-400">
                  لا توجد عوامل كافية للعرض حالياً. جرّب تعديل بعض القيم في ملفك الصحي.
                </div>
              )}
            </div>
          </div>

          {/* زر الإجراء */}
          <div className="text-center">
           <Link
  to="/simulation"
  state={{ profile }}   // ✅ هنا نمرّر profile وليس currentProfile
  className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
>
  🔮 محاكاة التغييرات
</Link>


             
            <p className="mt-3 text-sm text-slate-500">اكتشف كيف يمكن لتغيير عاداتك أن يقلل مخاطرك</p>
          </div>
        </div>
      </div>
    </div>
  );
}
