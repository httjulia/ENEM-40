"use client";
import { useRef, useState } from "react";
import { Home, BookOpen, ClipboardList, PenLine, Download, Upload, Pencil } from "lucide-react";
import { useStore } from "../lib/store";
import Onboarding from "../components/Onboarding";
import { Banner, Suggestions, SubjectGrid, PerfChart } from "../components/Dashboard";
import Topics from "../components/Topics";
import Simulados from "../components/Simulados";
import Redacao from "../components/Redacao";

const NAV = [["home", "Início", Home], ["rev", "Revisões", BookOpen], ["sim", "Simulados", ClipboardList], ["red", "Redação", PenLine]];

export default function Page() {
  const [data, setData] = useStore();
  const [view, setView] = useState("home");
  const [sub, setSub] = useState("Biologia");
  const [editName, setEditName] = useState(false);
  const fileRef = useRef(null);
  if (!data) return null;

  const exportJson = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = `revisae-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
    <div className="min-h-screen md:pl-56">
      {(!data.name || editName) && (
        <Onboarding initial={data.name} onClose={data.name ? () => setEditName(false) : undefined}
          onSave={(name) => { setData({ ...data, name }); setEditName(false); }} />
      )}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-slate-200 bg-white p-1.5 md:inset-y-0 md:left-0 md:right-auto md:w-56 md:flex-col md:justify-start md:gap-1 md:border-r md:border-t-0 md:p-4">
        <div className="mb-4 hidden items-center gap-2 px-2 md:flex">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-700 to-fuchsia-500 font-bold text-white">R</span>
          <div><p className="font-bold leading-none">Revisaê</p><p className="text-[11px] text-slate-400">v1.0</p></div>
        </div>
        {NAV.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setView(id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs md:flex-none md:flex-row md:gap-2.5 md:text-sm ${view === id ? "bg-brand-soft font-semibold text-brand" : "text-slate-500 hover:bg-slate-100"}`}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-4xl px-4 pb-28 pt-6 md:pb-10">
        <header className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Olá, {data.name || "…"}! 👋</h1>
          <button className="btn-ghost" onClick={() => setEditName(true)}><Pencil size={14} /> Editar nome</button>
        </header>
        <div className="grid gap-4">
          {view === "home" && (<>
            <Banner data={data} setData={setData} />
            <Suggestions data={data} />
            <SubjectGrid data={data} onOpen={(s) => { setSub(s); setView("rev"); }} />
          </>)}
          {view === "rev" && <Topics data={data} setData={setData} sub={sub} setSub={setSub} />}
          {view === "sim" && (<><PerfChart data={data} /><Simulados data={data} setData={setData} /></>)}
          {view === "red" && <Redacao data={data} setData={setData} />}
        </div>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span>Dados salvos apenas neste navegador.</span>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={exportJson}><Download size={14} /> Exportar dados (JSON)</button>
            <button className="btn-ghost" onClick={() => fileRef.current.click()}><Upload size={14} /> Importar dados (JSON)</button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
          </div>
        </footer>
      </main>
    </div>
  );
}
