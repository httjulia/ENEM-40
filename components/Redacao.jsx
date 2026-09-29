"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { uid, today, fmt } from "../lib/store";

const C = ["c1", "c2", "c3", "c4", "c5"];
const blank = () => ({ id: null, date: today(), tema: "", nota: "", c1: "", c2: "", c3: "", c4: "", c5: "", obs: "" });
const clamp = (v, max) => Math.min(max, Math.max(0, +v || 0));

export default function Redacao({ data, setData }) {
  const [f, setF] = useState(blank());
  const set = (k, v) => setF({ ...f, [k]: v });
  const soma = C.reduce((a, k) => a + clamp(f[k], 200), 0);
  const save = () => {
    if (!f.tema.trim()) return;
    const item = { ...f, id: f.id || uid(), nota: f.nota === "" ? soma : clamp(f.nota, 1000), ...Object.fromEntries(C.map((k) => [k, clamp(f[k], 200)])) };
    setData({ ...data, redacoes: f.id ? data.redacoes.map((r) => r.id === f.id ? item : r) : [item, ...data.redacoes] });
    setF(blank());
  };
  const rows = [...data.redacoes].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="grid gap-4">
      <div className="card">
        <h2 className="mb-3 font-semibold">{f.id ? "Editar redação" : "Nova redação"}</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input className="input" placeholder="Tema" value={f.tema} onChange={(e) => set("tema", e.target.value)} />
          <input type="date" className="input" value={f.date} onChange={(e) => set("date", e.target.value)} />
          <input type="number" min="0" max="1000" className="input sm:w-36" placeholder={`Nota (${soma} pela soma)`} value={f.nota} onChange={(e) => set("nota", e.target.value)} />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {C.map((k, i) => (
            <label key={k} className="text-xs text-stone-500">C{i + 1}
              <input type="number" min="0" max="200" className="input mt-1 px-2" value={f[k]} onChange={(e) => set(k, e.target.value)} />
            </label>
          ))}
        </div>
        <textarea className="input mt-3" rows="2" placeholder="Observações / pontos fracos" value={f.obs} onChange={(e) => set("obs", e.target.value)} />
        <div className="mt-3 flex justify-end gap-2">
          {f.id && <button className="btn-ghost" onClick={() => setF(blank())}>Cancelar</button>}
          <button className="btn" onClick={save}>{f.id ? "Salvar alterações" : "Registrar"}</button>
        </div>
      </div>
      <ul className="grid gap-3">
        {rows.map((r) => (
          <li key={r.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-medium">{r.tema}</p><p className="text-xs text-stone-500">{fmt(r.date)} · C1 {r.c1} · C2 {r.c2} · C3 {r.c3} · C4 {r.c4} · C5 {r.c5}</p></div>
              <div className="flex items-center gap-1">
                <span className="mr-2 text-xl font-semibold text-brand">{r.nota}</span>
                <button className="icon-btn" aria-label="Editar" onClick={() => setF({ ...r })}><Pencil size={15} /></button>
                <button className="icon-btn" aria-label="Excluir" onClick={() => confirm("Excluir esta redação?") && setData({ ...data, redacoes: data.redacoes.filter((x) => x.id !== r.id) })}><Trash2 size={15} /></button>
              </div>
            </div>
            {r.obs && <p className="mt-2 text-sm text-stone-600">{r.obs}</p>}
          </li>
        ))}
        {!rows.length && <li className="card text-center text-sm text-stone-500">Nenhuma redação registrada ainda.</li>}
      </ul>
    </section>
  );
}
