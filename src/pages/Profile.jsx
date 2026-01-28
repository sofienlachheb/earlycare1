import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealth } from "../state/HealthContext";

const DEFAULT = {
  id: null,
  user_id: "",
  name: "",
  age: 35,
  gender: "other",
  weight: 70,
  height: 170,
  smoking: false,
  alcohol: "none",
  exercise: 3,
  diet_quality: 5,
  sleep_hours: 7,
  stress_level: 5,
  family_diabetes: false,
  family_heart: false,
  family_cancer: false,
  blood_pressure: "normal",
  cholesterol: "normal",
};

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentProfile, upsertProfile, showToast } = useHealth();

  const [form, setForm] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setForm({ ...DEFAULT, ...currentProfile });
    }
  }, [currentProfile]);

  const bmi = useMemo(() => {
    const h = (Number(form.height) || 170) / 100;
    const w = Number(form.weight) || 70;
    return Math.round((w / (h * h)) * 10) / 10;
  }, [form.height, form.weight]);

  const on = (k) => (e) => {
    const t = e?.target;
    let v = t?.value;

    if (t?.type === "number") v = Number(v);
    setForm((p) => ({ ...p, [k]: v }));
  };

  // ✅ حفظ اختياري (إذا أردت تخزينه فعلاً)
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = normalizeProfile(form, currentProfile);
      await upsertProfile(payload);
      showToast("تم حفظ الملف بنجاح! 🎉");
    } catch (err) {
      console.error(err);
      showToast("خطأ في الحفظ", "error");
    } finally {
      setSaving(false);
    }
  }

  // ✅ المطلوب: عرض النتائج بدون حفظ
  function handleShowRisks() {
    const payload = normalizeProfile(form, currentProfile);
    navigate("/prediction", { state: { profile: payload } });
  }

  return (
    <div className="p-6 md:p-8 fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">ملفي الصحي</h2>
            <p className="text-slate-400">أدخل معلوماتك للحصول على تحليل شخصي</p>
          </div>

          <div className="px-4 py-2 rounded-full glass-card text-sm">
            {currentProfile ? (
              <span className="text-teal-400">تم الحفظ</span>
            ) : (
              <span className="text-slate-400">غير محفوظ</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* المعلومات الشخصية */}
          <section className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">المعلومات الشخصية</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">الاسم / اللقب</label>
                <input
                  value={form.name}
                  onChange={on("name")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                  placeholder="اسمك"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">العمر</label>
                <input
                  type="number"
                  min={18}
                  max={120}
                  value={form.age}
                  onChange={on("age")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">الجنس</label>
                <select
                  value={form.gender}
                  onChange={on("gender")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                >
                  
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">الوزن (كجم)</label>
                  <input
                    type="number"
                    min={30}
                    max={300}
                    value={form.weight}
                    onChange={on("weight")}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">الطول (سم)</label>
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={form.height}
                    onChange={on("height")}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="font-medium">BMI (مؤشر كتلة الجسم)</p>
                <p className="text-sm text-slate-400">قيمة تقريبية حسب الوزن والطول</p>
              </div>
              <div className="text-2xl font-bold text-teal-400">
                {Number.isFinite(bmi) ? bmi : "--"}
              </div>
            </div>
          </section>

          {/* نمط الحياة */}
          <section className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">نمط الحياة</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">مدخن</span>
                <Toggle value={!!form.smoking} onChange={(v) => setForm((p) => ({ ...p, smoking: v }))} />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">استهلاك الكحول</label>
                <select
                  value={form.alcohol}
                  onChange={on("alcohol")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                >
                  <option value="none">أبداً</option>
                  <option value="occasional">أحياناً (1-2/أسبوع)</option>
                  <option value="regular">منتظم (3-5/أسبوع)</option>
                  <option value="heavy">يومياً</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">النشاط البدني (ساعات/أسبوع)</span>
                  <span className="text-teal-400 font-semibold">{Number(form.exercise) || 0} س</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={Number(form.exercise) || 0}
                  onChange={(e) => setForm((p) => ({ ...p, exercise: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">جودة التغذية</span>
                  <span className="text-teal-400 font-semibold">{Number(form.diet_quality) || 0}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={Number(form.diet_quality) || 5}
                  onChange={(e) => setForm((p) => ({ ...p, diet_quality: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">ساعات النوم</span>
                  <span className="text-teal-400 font-semibold">{Number(form.sleep_hours) || 0} س</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={12}
                  value={Number(form.sleep_hours) || 7}
                  onChange={(e) => setForm((p) => ({ ...p, sleep_hours: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">مستوى التوتر</span>
                  <span className="text-teal-400 font-semibold">{Number(form.stress_level) || 0}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={Number(form.stress_level) || 5}
                  onChange={(e) => setForm((p) => ({ ...p, stress_level: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* التاريخ الطبي */}
          <section className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">التاريخ الطبي</h3>

            <p className="text-sm text-slate-400 mb-4">التاريخ العائلي (الوالدين، الأجداد، الإخوة)</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">السكري في العائلة</span>
                <Toggle value={!!form.family_diabetes} onChange={(v) => setForm((p) => ({ ...p, family_diabetes: v }))} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">أمراض القلب والأوعية</span>
                <Toggle value={!!form.family_heart} onChange={(v) => setForm((p) => ({ ...p, family_heart: v }))} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">السرطان</span>
                <Toggle value={!!form.family_cancer} onChange={(v) => setForm((p) => ({ ...p, family_cancer: v }))} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-700">
              <div>
                <label className="block text-sm text-slate-400 mb-2">ضغط الدم</label>
                <select
                  value={form.blood_pressure}
                  onChange={on("blood_pressure")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                >
                  <option value="normal">طبيعي (&lt;120/80)</option>
                  <option value="elevated">مرتفع (120-129/&lt;80)</option>
                  <option value="high_1">ارتفاع المرحلة 1 (130-139/80-89)</option>
                  <option value="high_2">ارتفاع المرحلة 2 (≥140/≥90)</option>
                  <option value="unknown">لا أعرف</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">الكوليسترول</label>
                <select
                  value={form.cholesterol}
                  onChange={on("cholesterol")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none transition"
                >
                  <option value="normal">طبيعي (&lt;200 مجم/دل)</option>
                  <option value="borderline">حد الارتفاع (200-239 مجم/دل)</option>
                  <option value="high">مرتفع (≥240 مجم/دل)</option>
                  <option value="unknown">لا أعرف</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-60"
            >
              {saving ? "جاري الحفظ..." : "حفظ ملفي"}
            </button>

            <button
              type="button"
              onClick={handleShowRisks}
              className="px-8 py-4 glass-card rounded-xl font-semibold hover:bg-slate-700/50 transition-all duration-300"
            >
              ← عرض مخاطري
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ تطبيع البيانات (أرقام صحيحة + user_id)
function normalizeProfile(form, currentProfile) {
  return {
    ...form,
    user_id: form.user_id || (currentProfile?.user_id ?? `user_${Date.now()}`),
    name: String(form.name || ""),
    age: Number(form.age) || 35,
    weight: Number(form.weight) || 70,
    height: Number(form.height) || 170,
    exercise: Number(form.exercise) || 3,
    diet_quality: Number(form.diet_quality) || 5,
    sleep_hours: Number(form.sleep_hours) || 7,
    stress_level: Number(form.stress_level) || 5,
    smoking: Boolean(form.smoking),
    family_diabetes: Boolean(form.family_diabetes),
    family_heart: Boolean(form.family_heart),
    family_cancer: Boolean(form.family_cancer),
    alcohol: form.alcohol || "none",
    gender: form.gender || "other",
    blood_pressure: form.blood_pressure || "normal",
    cholesterol: form.cholesterol || "normal",
  };
}
