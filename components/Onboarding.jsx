"use client";
import { useState } from "react";

export default function Onboarding({ initial = "", onSave, onClose }) {
  const [v, setV] = useState(initial);
  const save = () => v.trim() && onSave(v.trim());
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/40 p-4" role="dialog" aria-modal="true">
      <div className="card w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold">Como você gostaria de ser chamado?</h2>
        <input autoFocus className="input mt-4" value={v} maxLength={30} placeholder="Seu nome"
          onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} />
        <div className="mt-4 flex justify-end gap-2">
          {onClose && <button className="btn-ghost" onClick={onClose}>Cancelar</button>}
          <button className="btn" onClick={save} disabled={!v.trim()}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
