import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const HealthContext = createContext(null);
const LS_KEY = "smart_health_profiles_v1";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const USE_API = Boolean(API_BASE);

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export function HealthProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  // Load from localStorage first (instant UI), then refresh from API if configured.
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      setProfiles(data.profiles || []);
      setCurrentProfileId(data.currentProfileId || null);
    }

    (async () => {
      if (!USE_API) return;
      try {
        const list = await apiFetch("/api/profiles/");
        // DRF pagination: if enabled, list.results exists
        const apiProfiles = Array.isArray(list) ? list : (list.results || []);
        setProfiles(apiProfiles);
        if (apiProfiles.length && !currentProfileId) {
          setCurrentProfileId(apiProfiles[0].id);
        }
      } catch (e) {
        // Stay on local mode
        // eslint-disable-next-line no-console
        console.warn("API fetch failed, using localStorage mode:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ profiles, currentProfileId }));
  }, [profiles, currentProfileId]);

  const currentProfile = useMemo(
    () => profiles.find((p) => p.id === currentProfileId) || null,
    [profiles, currentProfileId]
  );

  function showToast(message, type = "success") {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3000);
  }

  async function upsertProfile(profile) {
    try {
      let saved = profile;
      if (USE_API) {
        if (profile?.id) {
          saved = await apiFetch(`/api/profiles/${profile.id}/`, {
            method: "PUT",
            body: JSON.stringify(profile),
          });
        } else {
          saved = await apiFetch("/api/profiles/", {
            method: "POST",
            body: JSON.stringify(profile),
          });
        }
      } else {
        // local mode: create an id if missing
        if (!saved.id) saved = { ...saved, id: crypto.randomUUID() };
      }

      setProfiles((prev) =>
        prev.some((p) => p.id === saved.id)
          ? prev.map((p) => (p.id === saved.id ? saved : p))
          : [...prev, saved]
      );
      setCurrentProfileId(saved.id);
      showToast("تم حفظ الملف بنجاح! 🎉");
      return saved;
    } catch (e) {
      showToast("خطأ في الحفظ", "error");
      throw e;
    }
  }

  return (
    <HealthContext.Provider
      value={{ profiles, currentProfile, setCurrentProfileId, upsertProfile, toast, showToast, USE_API, API_BASE }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth must be used within HealthProvider");
  return ctx;
}
