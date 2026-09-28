"use client";
import { CalendarDays, Sparkles } from "lucide-react";
import { STEPS, diffDays, today, dueToday } from "../lib/store";

export function Banner({ data, setData }) {
  const daysLeft = Math.max(0, diffDays(data.examDate, today()));
  const all = Object.values(data.subjects).flat();
  const done = all.filter((t) => t.steps[3]).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  return (
    <section className="card grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div>
        <p className="text-5xl font-semibold tabular-nums text-brand">{daysLeft}</p>
        <p className="text-sm text-stone-500">dias para o ENEM</p>
        <label className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
          <CalendarDays size={14} /> Prova:
          <input type="date" className="rounded border border-stone-300 px-1.5 py-0.5" value={data.examDate}
            onChange={(e) => e.target.value && setData({ ...data, examDate: e.target.value })} />
        </label>
      </div>
      <div>
        <div className="mb-1.5 flex justify-between text-sm"><span>Conteúdos com revisão completa (R3)</span><b>{pct}%</b></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-brand transition-all" style={{ width: pct + "%" }} /></div>
        <p className="mt-1.5 text-xs text-stone-500">{done} de {all.length} tópicos</p>
      </div>
    </section>
  );
}

export function Suggestions({ data }) {
  const list = dueToday(data.subjects, Math.max(0, diffDays(data.examDate, today())));
  return (
    <section className="card border-brand/30 bg-brand-soft/40">
      <h2 className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-brand" /> Revisões sugeridas para hoje</h2>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-stone-600">Nada vencendo hoje. Marque “Teoria / Questões” em um tópico para agendar as próximas revisões.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-stone-600">Aqui está uma revisão sugerida para você hoje:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {list.map(({ subject, topic, step }) => (
              <li key={topic.id} className="rounded-lg border border-brand/20 bg-white px-2.5 py-1.5 text-sm">
                <b>{topic.title.split("(")[0].trim()}</b> <span className="text-stone-500">de {subject} · {STEPS[step].split(" ")[0]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
