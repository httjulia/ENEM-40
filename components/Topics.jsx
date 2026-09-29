"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus, Check } from "lucide-react";
import { uid, today, fmt } from "../lib/store";
import { colorOf, short } from "./Dashboard";

const CHIPS = ["Teoria", "R1", "R2", "R3"];

export default function Topics({ data, setData, sub, setSub }) {
  const [newT, setNewT] = useState("");
  const [edit, setEdit] = useState(null);
  const list = data.subjects[sub] || [], c = colorOf(sub);
  const upd = (fn) => setData({ ...data, subjects: { ...data.subjects, [sub]: fn(list) } });
  const toggle = (id, i) => upd((l) => l.map((t) => t.id !== id ? t : { ...t, steps: t.steps.map((s, j) => j === i ? (s ? null : today()) : s) }));
  const add = () => { if (!newT.trim()) return; upd((l) => [...l, { id: uid(), title: newT.trim(), steps: [null, null, null, null] }]); setNewT(""); };
  const saveEdit = () => { if (edit.title.trim()) upd((l) => l.map((t) => t.id === edit.id ? { ...t, title: edit.title.trim() } : t)); setEdit(null); };

  return (
    <section>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {Object.keys(data.subjects).map((s) => (
          <button key={s} onClick={() => setSub(s)} className="whitespace-nowrap rounded-full border px-3 py-1 text-sm"
            style={s === sub ? { background: colorOf(s), borderColor: colorOf(s), color: "#fff" } : { borderColor: "#cbd5e1", color: "#475569" }}>{s}</button>
        ))}
      </div>
      <div className="grid gap-2.5">
        {list.map((t) => (
          <article key={t.id} className="card !p-3.5" style={{ borderLeft: `4px solid ${c}` }}>
            <div className="flex items-start gap-2">
              {edit?.id === t.id ? (
                <>
                  <input autoFocus className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} onKeyDown={(e) => e.key === "Enter" && saveEdit()} />
                  <button className="icon-btn" onClick={saveEdit} aria-label="Salvar"><Check size={16} /></button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{short(t.title)}</p>
                    {t.title.includes("(") && <p className="text-xs text-slate-500">{t.title.slice(t.title.indexOf("("))}</p>}
                  </div>
                  <button className="icon-btn" onClick={() => setEdit({ id: t.id, title: t.title })} aria-label="Editar tópico"><Pencil size={15} /></button>
                  <button className="icon-btn" onClick={() => confirm("Excluir este tópico?") && upd((l) => l.filter((x) => x.id !== t.id))} aria-label="Excluir tópico"><Trash2 size={15} /></button>
                </>
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CHIPS.map((label, i) => {
                const d = t.steps[i];
                return (
                  <button key={i} onClick={() => toggle(t.id, i)} title={d ? `Feito em ${fmt(d)}` : "Marcar como feito"}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={d ? { background: c, borderColor: c, color: "#fff" } : { borderColor: "#cbd5e1", color: "#64748b" }}>
                    {d ? "✓ " : ""}{label}{d ? ` · ${fmt(d).slice(0, 5)}` : ""}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="card text-center text-sm text-slate-500">Nenhum tópico em {sub}. Adicione o primeiro abaixo.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="input" placeholder={`Novo tópico de ${sub}`} value={newT} onChange={(e) => setNewT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="btn" onClick={add}><Plus size={16} /> Adicionar</button>
      </div>
    </section>
  );
}
