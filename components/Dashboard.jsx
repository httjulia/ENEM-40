"use client";
import { CalendarDays, Sparkles } from "lucide-react";
import { STEPS, diffDays, today, dueToday, fmt } from "../lib/store";

export const COLORS = { Biologia: "#16a34a", Química: "#d97706", Física: "#0284c7", Matemática: "#e11d48", História: "#ea580c", Geografia: "#0d9488" };
export const colorOf = (s) => COLORS[s] || "#6d28d9";
export const short = (t) => t.split("(")[0].trim();

export function Banner({ data, setData }) {
  const daysLeft = Math.max(0, diffDays(data.examDate, today()));
  const all = Object.values(data.subjects).flat();
  const done = all.filter((t) => t.steps[3]).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  return (
    <section className="rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-fuchsia-500 p-5 text-white shadow-md sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-6xl font-bold leading-none tabular-nums">{daysLeft}</p>
          <p className="mt-1 text-violet-100">dias para o ENEM</p>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-violet-100">
          <CalendarDays size={14} /> Prova
          <input type="date" value={data.examDate} className="rounded bg-white/20 px-1.5 py-0.5 text-white [color-scheme:dark]"
            onChange={(e) => e.target.value && setData({ ...data, examDate: e.target.value })} />
        </label>
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-sm"><span>Revisão completa (R3)</span><b>{pct}% · {done}/{all.length} tópicos</b></div>
        <div className="h-3 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white transition-all" style={{ width: pct + "%" }} /></div>
      </div>
    </section>
  );
}

export function Suggestions({ data }) {
  const list = dueToday(data.subjects, Math.max(0, diffDays(data.examDate, today())));
  return (
    <section className="card border-l-4 border-l-brand">
      <h2 className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-brand" /> Revisões sugeridas para hoje</h2>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">Nada vencendo hoje. Marque “Teoria” em um tópico para agendar as próximas revisões.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-slate-500">Aqui está uma revisão sugerida para você hoje:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {list.map(({ subject, topic, step }) => (
              <li key={topic.id} className="flex items-center gap-2 rounded-full bg-slate-100 py-1 pl-2.5 pr-3 text-sm">
                <span className="h-2 w-2 rounded-full" style={{ background: colorOf(subject) }} />
                <b>{short(topic.title)}</b><span className="text-slate-500">{subject} · {STEPS[step].split(" ")[0]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function SubjectGrid({ data, onOpen }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(data.subjects).map(([s, list]) => {
        const total = list.length * 4, got = list.reduce((a, t) => a + t.steps.filter(Boolean).length, 0);
        const pct = total ? Math.round((got / total) * 100) : 0, c = colorOf(s);
        return (
          <button key={s} onClick={() => onOpen(s)} className="card overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderTop: `4px solid ${c}` }}>
            <div className="flex items-baseline justify-between"><h3 className="font-semibold">{s}</h3><span className="text-lg font-bold" style={{ color: c }}>{pct}%</span></div>
            <p className="mt-0.5 text-xs text-slate-500">{list.filter((t) => t.steps[3]).length} de {list.length} tópicos com R3</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: pct + "%", background: c }} /></div>
          </button>
        );
      })}
    </section>
  );
}

export function PerfChart({ data }) {
  const rows = [...data.simulados].sort((a, b) => a.date.localeCompare(b.date)).slice(-8)
    .map((s) => ({ ...s, pct: Math.round(((+s.ling || 0) + (+s.hum || 0) + (+s.nat || 0) + (+s.mat || 0)) / 180 * 100) }));
  return (
    <section className="card">
      <h2 className="font-semibold">Evolução nos simulados</h2>
      {rows.length === 0 ? <p className="mt-2 text-sm text-slate-500">Registre um simulado abaixo para ver seu desempenho aqui.</p> : (
        <div className="mt-4 flex h-40 items-end gap-2">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-1 flex-col items-center justify-end gap-1" title={r.nome}>
              <span className="text-xs font-semibold text-brand">{r.pct}%</span>
              <div className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-violet-700 to-fuchsia-500" style={{ height: `${Math.max(r.pct, 3) * 1.1}px` }} />
              <span className="text-[10px] text-slate-500">{fmt(r.date).slice(0, 5)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
