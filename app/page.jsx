"use client";
import { useRef, useState } from "react";
import { BookOpen, ClipboardList, PenLine, Download, Upload, Pencil } from "lucide-react";
import { useStore } from "../lib/store";
import Onboarding from "../components/Onboarding";
import { Banner, Suggestions } from "../components/Dashboard";
import Topics from "../components/Topics";
import Simulados from "../components/Simulados";
import Redacao from "../components/Redacao";

const TABS = [["rev", "Revisões", BookOpen], ["sim", "Simulados", ClipboardList], ["red", "Redação", PenLine]];

export default function Page() {
  const [data, setData] = useStore();
  const [tab, setTab] = useState("rev");
  const [editName, setEditName] = useState(false);
  const fileRef = useRef(null);
  if (!data) return null;

  const exportJson = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = `enem40-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  const importJson = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const j = JSON.parse(await file.text());
      if (!j.subjects || !Array.isArray(j.simulados) || !Array.isArray(j.redacoes)) throw 0;
      if (confirm("Substituir os dados atuais pelo backup?")) setData(j);
    } catch { alert("Arquivo inválido. Use um JSON exportado por este app."); }
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      {(!data.name || editName) && (
        <Onboarding initial={data.name} onClose={data.name ? () => setEditName(false) : undefined}
          onSave={(name) => { setData({ ...data, name }); setEditName(false); }} />
      )}
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Olá, {data.name || "…"}! 👋</h1>
          <p className="text-sm text-stone-500">ENEM · Reta final</p>
        </div>
        <button className="btn-ghost" onClick={() => setEditName(true)}><Pencil size={14} /> Editar nome</button>
      </header>

      <div className="grid gap-4">
        <Banner data={data} setData={setData} />
        <Suggestions data={data} />
        <nav className="flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
          {TABS.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm ${tab === id ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>
        {tab === "rev" && <Topics data={data} setData={setData} />}
        {tab === "sim" && <Simulados data={data} setData={setData} />}
        {tab === "red" && <Redacao data={data} setData={setData} />}
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4 text-xs text-stone-500">
        <span>Dados salvos apenas neste navegador.</span>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={exportJson}><Download size={14} /> Exportar dados (JSON)</button>
          <button className="btn-ghost" onClick={() => fileRef.current.click()}><Upload size={14} /> Importar dados (JSON)</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
        </div>
      </footer>
    </div>
  );
}
