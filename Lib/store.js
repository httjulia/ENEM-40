"use client";
import { useEffect, useState } from "react";
import { DEFAULT_TOPICS } from "./topics";

export const KEY = "enem40:v1";
export const STEPS = ["Teoria / Questões", "R1 (1 dia)", "R2 (7 dias)", "R3 (30 dias)"];
export const uid = () => Math.random().toString(36).slice(2, 10);
const local = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
export const today = () => local(new Date());
export const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return local(d); };
export const diffDays = (a, b) => Math.round((new Date(a + "T12:00:00") - new Date(b + "T12:00:00")) / 864e5);
export const fmt = (iso) => iso.split("-").reverse().join("/");

const initial = () => ({
  name: "",
  examDate: addDays(today(), 40),
  subjects: Object.fromEntries(Object.entries(DEFAULT_TOPICS).map(([s, list]) => [s, list.map((title) => ({ id: uid(), title, steps: [null, null, null, null] }))])),
  simulados: [],
  redacoes: [],
});

export function useStore() {
  const [data, setData] = useState(null);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); setData(raw ? JSON.parse(raw) : initial()); } catch { setData(initial()); }
  }, []);
  useEffect(() => { if (data) try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} }, [data]);
  return [data, setData];
}

// Revisões que vencem hoje, com base na data em que a teoria foi concluída
export function dueToday(subjects, daysLeft) {
  const t = today(), out = [];
  for (const [subject, topics] of Object.entries(subjects)) for (const tp of topics) {
    const [s0, r1, r2, r3] = tp.steps;
    if (!s0) continue;
    const age = diffDays(t, s0);
    let step = null;
    if (!r1 && age >= 1) step = 1;
    else if (r1 && !r2 && age >= 7) step = 2;
    else if (r2 && !r3 && (age >= 30 || daysLeft <= 7)) step = 3;
    if (step) out.push({ subject, topic: tp, step });
  }
  return out;
}
