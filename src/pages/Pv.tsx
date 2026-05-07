import { useMemo, useDeferredValue, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Check, UploadCloud, Loader2, Home as HomeIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_PV_INPUTS, runPvModel } from "@/lib/pvModel";
import { PvInputsForm } from "@/components/pv/PvInputsForm";
import { PvSummary } from "@/components/pv/PvSummary";
import { useSharedPvScenario } from "@/hooks/useSharedPvScenario";

const PvCharts = lazy(() => import("@/components/pv/PvCharts").then(m => ({ default: m.PvCharts })));
const PvSensitivity = lazy(() => import("@/components/pv/PvSensitivity").then(m => ({ default: m.PvSensitivity })));
const PvOutput = lazy(() => import("@/components/pv/PvOutput").then(m => ({ default: m.PvOutput })));

const Fallback = () => <div className="flex items-center justify-center py-16 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading…</div>;

export default function PvPage() {
  const { inputs, setInputs, loaded, saving } = useSharedPvScenario(1);
  const deferred = useDeferredValue(inputs);
  const model = useMemo(() => runPvModel(deferred), [deferred]);
  const isStale = inputs !== deferred;

  const defaultKey = "pv_default_inputs_1";
  const reset = () => {
    try {
      const stored = localStorage.getItem(defaultKey);
      const base = stored ? { ...DEFAULT_PV_INPUTS, ...JSON.parse(stored) } : DEFAULT_PV_INPUTS;
      setInputs(base);
      toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
    } catch {
      setInputs(DEFAULT_PV_INPUTS);
      toast.info("Reset to factory defaults");
    }
  };
  const saveAsDefault = () => {
    try { localStorage.setItem(defaultKey, JSON.stringify(inputs)); toast.success("Current assumptions saved as your default"); }
    catch (e) { console.error(e); toast.error("Failed to save defaults"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="secondary" size="sm" className="gap-2"><HomeIcon className="h-4 w-4"/>Home</Button></Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">PV (Solar) Project Finance Model</h1>
              <p className="text-xs opacity-80">{inputs.projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs opacity-90">
              {isStale ? <Loader2 className="h-4 w-4 animate-spin"/> : saving ? <UploadCloud className="h-4 w-4 animate-pulse"/> : <Check className="h-4 w-4"/>}
              {!loaded ? "Loading…" : isStale ? "Recalculating…" : saving ? "Saving…" : "All changes saved"}
            </div>
            <Button variant="secondary" onClick={saveAsDefault} className="gap-2"><Save className="h-4 w-4"/>Save as default</Button>
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
          </TabsList>
          <TabsContent value="summary" className="m-0 pt-6"><PvSummary m={model}/></TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6"><PvInputsForm inputs={inputs} onChange={setInputs}/></TabsContent>
          <TabsContent value="output" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><PvOutput m={model}/></Suspense></TabsContent>
          <TabsContent value="charts" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><PvCharts m={model}/></Suspense></TabsContent>
          <TabsContent value="sensitivity" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><PvSensitivity inputs={deferred}/></Suspense></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
