"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { uid, today, fmt } from "../lib/store";

const AREAS = [["ling", "Linguagens"], ["hum", "Humanas"], ["nat", "Natureza"], ["mat", "Matemática"]];
const blank = () => ({ id: null, date: today(), nome: "", ling: "", hum: "", nat: "", mat: "" });
const total = (s) => AREAS.reduce((a, [k]) => a + (+s[k] || 0), 0);

export default function Simulados({ data, setData }) {
  const [f, setF] = useState(blank());
  const set = (k, v) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.nome.trim()) return;
    const item = { ...f, id: f.id || uid(), ...Object.fromEntries(AREAS.map(([k]) => [k, Math.min(45, Math.max(0, +f[k] || 0))])) };
    setData({ ...data, simulados: f.id ? data.simulados.map((s) => s.id === f.id ? item : s) : [item, ...data.simulados] });
    setF(blank());
  };
  const rows = [...data.simulados].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="grid gap-4">
      <div className="card">
        <h2 className="mb-3 font-semibold">{f.id ? "Editar simulado" : "Novo simulado"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="date" className="input" value={f.date} onChange={(e) => set("date", e.target.value)} />
          <input className="input" placeholder="Nome / edição" value={f.nome} onChange={(e) => set("nome", e.target.value)} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AREAS.map(([k, l]) => (
            <label key={k} className="text-xs text-stone-500">{l} (/45)
              <input type="number" min="0" max="45" className="input mt-1" value={f[k]} onChange={(e) => set(k, e.target.value)} />
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-stone-600">Total: <b>{total(f)}/180</b> · {Math.round((total(f) / 180) * 100)}%</p>
          <div className="flex gap-2">
            {f.id && <button className="btn-ghost" onClick={() => setF(blank())}>Cancelar</button>}
            <button className="btn" onClick={save}>{f.id ? "Salvar alterações" : "Registrar"}</button>
          </div>
        </div>
      </div>
      <div className="card overflow-x-auto p-0 sm:p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-xs text-stone-500"><tr><th className="p-3">Data</th><th>Simulado</th><th>Ling</th><th>Hum</th><th>Nat</th><th>Mat</th><th>Total</th><th /></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-stone-100">
                <td className="p-3">{fmt(s.date)}</td><td>{s.nome}</td>
                {AREAS.map(([k]) => <td key={k}>{s[k]}</td>)}
                <td className="font-medium">{total(s)} <span className="text-stone-400">({Math.round((total(s) / 180) * 100)}%)</span></td>
                <td className="whitespace-nowrap pr-2 text-right">
                  <button className="icon-btn" aria-label="Editar" onClick={() => setF({ ...s })}><Pencil size={15} /></button>
                  <button className="icon-btn" aria-label="Excluir" onClick={() => confirm("Excluir este simulado?") && setData({ ...data, simulados: data.simulados.filter((x) => x.id !== s.id) })}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="8" className="p-6 text-center text-stone-500">Nenhum simulado registrado ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
