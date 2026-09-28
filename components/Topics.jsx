"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus, Check } from "lucide-react";
import { STEPS, uid, today, fmt } from "../lib/store";

export default function Topics({ data, setData }) {
  const subjects = Object.keys(data.subjects);
  const [sub, setSub] = useState(subjects[0]);
  const [newT, setNewT] = useState("");
  const [edit, setEdit] = useState(null); // {id, title}
  const list = data.subjects[sub] || [];
  const upd = (fn) => setData({ ...data, subjects: { ...data.subjects, [sub]: fn(list) } });
  const toggle = (id, i) => upd((l) => l.map((t) => t.id !== id ? t : { ...t, steps: t.steps.map((s, j) => j === i ? (s ? null : today()) : s) }));
  const add = () => { if (!newT.trim()) return; upd((l) => [...l, { id: uid(), title: newT.trim(), steps: [null, null, null, null] }]); setNewT(""); };
  const saveEdit = () => { if (edit.title.trim()) upd((l) => l.map((t) => t.id === edit.id ? { ...t, title: edit.title.trim() } : t)); setEdit(null); };

  return (
    <section className="card">
      <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {subjects.map((s) => {
          const l = data.subjects[s], d = l.filter((t) => t.steps[3]).length;
          return (
            <button key={s} onClick={() => setSub(s)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${s === sub ? "border-brand bg-brand text-white" : "border-stone-300 text-stone-600 hover:bg-stone-100"}`}>
              {s} <span className="opacity-70">{d}/{l.length}</span>
            </button>
          );
        })}
      </div>
      <ul className="divide-y divide-stone-100">
        {list.map((t) => (
          <li key={t.id} className="py-3">
            <div className="flex items-start gap-2">
              {edit?.id === t.id ? (
                <>
                  <input autoFocus className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} onKeyDown={(e) => e.key === "Enter" && saveEdit()} />
                  <button className="icon-btn" onClick={saveEdit} aria-label="Salvar"><Check size={16} /></button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm font-medium">{t.title}</p>
                  <button className="icon-btn" onClick={() => setEdit({ id: t.id, title: t.title })} aria-label="Editar tópico"><Pencil size={15} /></button>
                  <button className="icon-btn" onClick={() => confirm("Excluir este tópico?") && upd((l) => l.filter((x) => x.id !== t.id))} aria-label="Excluir tópico"><Trash2 size={15} /></button>
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              {STEPS.map((label, i) => (
                <label key={i} className="flex cursor-pointer items-center gap-1.5 text-xs text-stone-600">
                  <input type="checkbox" className="accent-teal-700" checked={!!t.steps[i]} onChange={() => toggle(t.id, i)} />
                  {label}{t.steps[i] && <span className="text-stone-400">· {fmt(t.steps[i])}</span>}
                </label>
              ))}
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="py-6 text-center text-sm text-stone-500">Nenhum tópico em {sub}. Adicione o primeiro abaixo.</li>}
      </ul>
      <div className="mt-3 flex gap-2">
        <input className="input" placeholder={`Novo tópico de ${sub}`} value={newT} onChange={(e) => setNewT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="btn" onClick={add}><Plus size={16} /> Adicionar</button>
      </div>
    </section>
  );
}
