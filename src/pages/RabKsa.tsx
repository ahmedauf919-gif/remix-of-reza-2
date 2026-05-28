import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, FileJson, Save, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DEFAULT_INPUTS } from "@/lib/rab/defaults";
import { runModel } from "@/lib/rab/engine";
import type { Inputs } from "@/lib/rab/types";
import { Dashboard as RabDashboard } from "@/components/rab/RabDashboard";
import { InputsPanel as RabInputsPanel } from "@/components/rab/RabInputsPanel";
import { Sensitivity as RabSensitivity } from "@/components/rab/RabSensitivity";

const STORAGE_KEY = "rab-calc-inputs-v1";
const DEFAULT_OVERRIDE_KEY = "rab-calc-default-override-v1";

function loadDefaultOverride(): Inputs | null {
  try {
    const raw = localStorage.getItem(DEFAULT_OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as Inputs) : null;
  } catch { return null; }
}

function loadInputs(): Inputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return loadDefaultOverride() ?? DEFAULT_INPUTS;
    return { ...DEFAULT_INPUTS, ...JSON.parse(raw) };
  } catch { return loadDefaultOverride() ?? DEFAULT_INPUTS; }
}

export default function RabKsa() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);

  useEffect(() => { setInputs(loadInputs()); }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); } catch {}
  }, [inputs]);

  const patch = useCallback((p: Partial<Inputs>) => {
    setInputs(prev => ({ ...prev, ...p }));
  }, []);

  const out = useMemo(() => runModel(inputs), [inputs]);
  const defaultInputs = useMemo(() => loadDefaultOverride() ?? DEFAULT_INPUTS, []);

  const reset = () => setInputs(defaultInputs);
  const saveAsDefault = () => {
    try { localStorage.setItem(DEFAULT_OVERRIDE_KEY, JSON.stringify(inputs)); } catch {}
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ inputs, kpi: out.kpi }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "rab-model-export.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="secondary" size="sm" className="gap-2"><HomeIcon className="h-4 w-4"/>Home</Button></Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">RAB Tariff Calculator</h1>
              <p className="text-xs opacity-80">Saudi Gas Distribution Concession · 6 Building Blocks · ZATCA Zakat 2024 · Income Tax Art. 21</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4"/>Reset</Button>
            <Button variant="secondary" size="sm" onClick={saveAsDefault} className="gap-2"><Save className="h-4 w-4"/>Save as Default</Button>
            <Button size="sm" onClick={exportJSON} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"><FileJson className="h-4 w-4"/>Export JSON</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-6">
        <Tabs defaultValue="summary">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="m-0 pt-6"><RabDashboard out={out} inp={inputs} mode="summary" /></TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6"><RabInputsPanel inp={inputs} patch={patch} /></TabsContent>
          <TabsContent value="output" className="m-0 pt-6"><RabDashboard out={out} inp={inputs} mode="output" /></TabsContent>
          <TabsContent value="charts" className="m-0 pt-6"><RabDashboard out={out} inp={inputs} mode="charts" /></TabsContent>
          <TabsContent value="sensitivity" className="m-0 pt-6"><RabSensitivity inp={inputs} /></TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-4 text-center text-[11px] text-muted-foreground">
        References: Saudi Income Tax Law (Royal Decree M/1, 2004) · ZATCA Ministerial Resolution 1007 (March 2024) · Vanilla WACC with tax recovered via BB3
      </footer>
    </div>
  );
}
