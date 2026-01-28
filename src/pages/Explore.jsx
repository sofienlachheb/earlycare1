import React, { useMemo } from "react";
import { useHealth } from "../state/HealthContext";

/**
 * صفحة الاستكشاف
 * تحليل مجتمعي مجهول للتوعية بالوقاية
 */
export default function ExplorePage() {
  const { profiles } = useHealth();

  // ====== إحصاءات مجتمعية (مجهولة) ======
  const stats = useMemo(() => {
    const list = profiles || [];
    const count = list.length;

    if (!count) {
      return {
        users: 0,
        avgAge: "--",
        smokersPct: "--",
        avgExercise: "--",
      };
    }

    const avgAge = Math.round(list.reduce((s, p) => s + (p.age || 0), 0) / count);
    const smokersPct = Math.round(
      (list.filter((p) => p.smoking).length / count) * 100
    );
    const avgExercise = Math.round(
      (list.reduce((s, p) => s + (p.exercise || 0), 0) / count) * 10
    ) / 10;

    return {
      users: count,
      avgAge,
      smokersPct,
      avgExercise,
    };
  }, [profiles]);

  // ====== بيانات رسومية افتراضية (يمكن ربطها بالـ ML لاحقًا) ======
  const cardioDist = {
    low: 60,
    medium: 30,
    high: 10,
  };

  const factors = [
    { name: "قلة الحركة", pct: 65, color: "bg-red-400" },
    { name: "توتر مرتفع", pct: 58, color: "bg-amber-400" },
    { name: "تغذية غير متوازنة", pct: 52, color: "bg-orange-400" },
    { name: "قلة النوم", pct: 45, color: "bg-purple-400" },
    { name: "التدخين", pct: 28, color: "bg-slate-400" },
  ];

  return (
    <div id="page-explore" className="p-8 fade-in">
      <div className="max-w-5xl mx-auto">
        {/* العنوان */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">استكشاف الاتجاهات</h2>
          <p className="text-slate-400">
            تحليل مجهول لبيانات المجتمع للتوعية بالوقاية
          </p>
        </div>

        {/* نظرة عامة */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard value={stats.users} label="ملفات منشأة" color="text-teal-400" />
          <StatCard value={stats.avgAge} label="متوسط العمر" color="text-emerald-400" />
          <StatCard
            value={stats.smokersPct === "--" ? "--" : `${stats.smokersPct}%`}
            label="مدخنون"
            color="text-amber-400"
          />
          <StatCard
            value={stats.avgExercise === "--" ? "--" : `${stats.avgExercise} س`}
            label="رياضة / أسبوع"
            color="text-purple-400"
          />
        </div>

        {/* رؤى المجتمع */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* توزيع مخاطر القلب */}
          <div className="glass-card rounded-2xl p-6 community-card">
            <h3 className="text-lg font-semibold mb-4">
              توزيع مخاطر القلب والأوعية
            </h3>

            <div className="flex items-end justify-between h-40 gap-2">
              <Bar label="منخفض" value={cardioDist.low} color="bg-emerald-500" />
              <Bar label="متوسط" value={cardioDist.medium} color="bg-amber-500" />
              <Bar label="مرتفع" value={cardioDist.high} color="bg-red-500" />
            </div>
          </div>

          {/* عوامل الخطر */}
          <div className="glass-card rounded-2xl p-6 community-card">
            <h3 className="text-lg font-semibold mb-4">
              عوامل الخطر الأكثر شيوعاً
            </h3>

            <div className="space-y-3">
              {factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-300">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${f.color}`}
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{f.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* رؤى تعليمية */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            ما تعلمنا إياه البيانات
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <Insight
              color="emerald"
              title="🏃 الرياضة تصنع الفارق"
              text="المستخدمون الذين يمارسون 3+ ساعات رياضة أسبوعياً لديهم مخاطر قلبية أقل بنسبة 35%."
            />
            <Insight
              color="amber"
              title="😴 النوم مفتاح الصحة"
              text="من ينامون 7-8 ساعات يحققون أفضل مؤشرات صحية عامة في المجتمع."
            />
            <Insight
              color="purple"
              title="🥗 التغذية مهمة"
              text="درجة غذائية 7+/10 ترتبط بانخفاض 25% في خطر السكري."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Components ====== */

function StatCard({ value, label, color }) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function Bar({ value, label, color }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div
        className={`w-full ${color} rounded-t chart-bar transition-all duration-700`}
        style={{ height: `${value}%` }}
      />
      <span className="text-xs text-slate-400 mt-2">{label}</span>
    </div>
  );
}

function Insight({ title, text, color }) {
  return (
    <div
      className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/30`}
    >
      <p className={`text-${color}-300 font-medium mb-2`}>{title}</p>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
