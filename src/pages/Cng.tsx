import { useMemo, useDeferredValue, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Check, UploadCloud, Loader2, Home as HomeIcon, Save, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_CNG_INPUTS, runCngModel } from "@/lib/cngModel";
import { exportCngExcel } from "@/lib/excelExporters";
import { CngInputsForm } from "@/components/cng/CngInputsForm";
import { CngSummary } from "@/components/cng/CngSummary";
import { useSharedCngScenario } from "@/hooks/useSharedCngScenario";

const CngCharts = lazy(() => import("@/components/cng/CngCharts").then(m => ({ default: m.CngCharts })));
const CngSensitivity = lazy(() => import("@/components/cng/CngSensitivity").then(m => ({ default: m.CngSensitivity })));
const CngOutput = lazy(() => import("@/components/cng/CngOutput").then(m => ({ default: m.CngOutput })));
const CngRecommendations = lazy(() => import("@/components/cng/CngRecommendations").then(m => ({ default: m.CngRecommendations })));

const Fallback = () => <div className="flex items-center justify-center py-16 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading…</div>;

export default function CngPage() {
  const { inputs, setInputs, loaded, saving } = useSharedCngScenario(1);
  const deferred = useDeferredValue(inputs);
  const model = useMemo(() => runCngModel(deferred), [deferred]);
  const isStale = inputs !== deferred;

  const defaultKey = "cng_default_inputs_1";
  const reset = () => {
    try {
      const stored = localStorage.getItem(defaultKey);
      const base = stored ? { ...DEFAULT_CNG_INPUTS, ...JSON.parse(stored) } : DEFAULT_CNG_INPUTS;
      setInputs(base);
      toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
    } catch { setInputs(DEFAULT_CNG_INPUTS); toast.info("Reset to factory defaults"); }
  };
  const saveAsDefault = () => {
    try { localStorage.setItem(defaultKey, JSON.stringify(inputs)); toast.success("Current assumptions saved as your default"); }
    catch (e) { console.error(e); toast.error("Failed to save defaults"); }
  };
  const exportExcel = async () => {
    try { toast.loading("Building Excel model…", { id: "xlsx" }); await exportCngExcel(model); toast.success("Excel model downloaded", { id: "xlsx" }); }
    catch (e) { console.error(e); toast.error("Failed to export Excel", { id: "xlsx" }); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="secondary" size="sm" className="gap-2"><HomeIcon className="h-4 w-4"/>Home</Button></Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">Mobile CNG Project Finance Model</h1>
              <p className="text-xs opacity-80">{inputs.projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs opacity-90">
              {isStale ? <Loader2 className="h-4 w-4 animate-spin"/> : saving ? <UploadCloud className="h-4 w-4 animate-pulse"/> : <Check className="h-4 w-4"/>}
              {!loaded ? "Loading…" : isStale ? "Recalculating…" : saving ? "Saving…" : "All changes saved"}
            </div>
            <Button variant="secondary" onClick={saveAsDefault} className="gap-2"><Save className="h-4 w-4"/>Save as default</Button>
            <Button onClick={exportExcel} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"><FileSpreadsheet className="h-4 w-4"/>Export Excel Model</Button>
            <Button variant="secondary" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4"/>Reset</Button>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-8">
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="m-0 pt-6"><CngSummary m={model}/></TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6"><CngInputsForm inputs={inputs} onChange={setInputs}/></TabsContent>
          <TabsContent value="output" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><CngOutput m={model}/></Suspense></TabsContent>
          <TabsContent value="charts" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><CngCharts m={model}/></Suspense></TabsContent>
          <TabsContent value="sensitivity" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><CngSensitivity inputs={deferred}/></Suspense></TabsContent>
          <TabsContent value="recommendations" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><CngRecommendations m={model}/></Suspense></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
