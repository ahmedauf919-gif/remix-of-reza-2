import { useMemo, useDeferredValue, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { FileText, RotateCcw, Check, UploadCloud, Loader2, Home as HomeIcon, Save, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_WATER_INPUTS, runWaterModel } from "@/lib/waterModel";
import { generateWaterMemo } from "@/lib/waterMemo";
import { exportWaterExcel } from "@/lib/excelExporters";
import { WaterInputsForm } from "@/components/water/WaterInputsForm";
import { WaterSummary } from "@/components/water/WaterSummary";
import { useSharedWaterScenario } from "@/hooks/useSharedWaterScenario";

const WaterCharts = lazy(() => import("@/components/water/WaterCharts").then(m => ({ default: m.WaterCharts })));
const WaterSensitivity = lazy(() => import("@/components/water/WaterSensitivity").then(m => ({ default: m.WaterSensitivity })));
const WaterRecommendations = lazy(() => import("@/components/water/WaterRecommendations").then(m => ({ default: m.WaterRecommendations })));
const WaterOutput = lazy(() => import("@/components/water/WaterOutput").then(m => ({ default: m.WaterOutput })));

const Fallback = () => <div className="flex items-center justify-center py-16 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading…</div>;

export default function Water() {
  const { inputs, setInputs, loaded, saving } = useSharedWaterScenario(1);
  const deferred = useDeferredValue(inputs);
  const model = useMemo(() => runWaterModel(deferred), [deferred]);
  const isStale = inputs !== deferred;

  const exportMemo = async () => {
    try {
      toast.loading("Generating investment memo…", { id: "wmemo" });
      await generateWaterMemo(inputs, model);
      toast.success("Investment memo downloaded", { id: "wmemo" });
    } catch (e) { console.error(e); toast.error("Failed to generate memo", { id: "wmemo" }); }
  };

  const defaultKey = `water_default_inputs_1`;
  const reset = () => {
    try {
      const stored = localStorage.getItem(defaultKey);
      const base = stored ? { ...DEFAULT_WATER_INPUTS, ...JSON.parse(stored) } : DEFAULT_WATER_INPUTS;
      setInputs(base);
      toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
    } catch {
      setInputs(DEFAULT_WATER_INPUTS);
      toast.info("Reset to factory defaults");
    }
  };
  const saveAsDefault = () => {
    try {
      localStorage.setItem(defaultKey, JSON.stringify(inputs));
      toast.success("Current assumptions saved as your default");
    } catch (e) { console.error(e); toast.error("Failed to save defaults"); }
  };
  const exportExcel = async () => {
    try { toast.loading("Building Excel model…", { id: "xlsx" }); await exportWaterExcel(model); toast.success("Excel model downloaded", { id: "xlsx" }); }
    catch (e) { console.error(e); toast.error("Failed to export Excel", { id: "xlsx" }); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="secondary" size="sm" className="gap-2"><HomeIcon className="h-4 w-4"/>Home</Button></Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">Water (SWRO) Project Finance Model</h1>
              <p className="text-xs opacity-80">{inputs.projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs opacity-90">
              {isStale ? <Loader2 className="h-4 w-4 animate-spin"/> : saving ? <UploadCloud className="h-4 w-4 animate-pulse"/> : <Check className="h-4 w-4"/>}
              {!loaded ? "Loading…" : isStale ? "Recalculating…" : saving ? "Saving…" : "All changes saved"}
            </div>
            <Button variant="secondary" onClick={saveAsDefault} className="gap-2"><Save className="h-4 w-4"/>Save as default</Button>
            <Button onClick={exportMemo} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"><FileText className="h-4 w-4"/>Export Investment Memo</Button>
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

          <TabsContent value="summary" className="m-0 pt-6"><WaterSummary m={model}/></TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6"><WaterInputsForm inputs={inputs} onChange={setInputs}/></TabsContent>
          <TabsContent value="output" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><WaterOutput m={model}/></Suspense></TabsContent>
          <TabsContent value="charts" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><WaterCharts m={model}/></Suspense></TabsContent>
          <TabsContent value="sensitivity" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><WaterSensitivity inputs={deferred}/></Suspense></TabsContent>
          <TabsContent value="recommendations" className="m-0 pt-6"><Suspense fallback={<Fallback/>}><WaterRecommendations m={model}/></Suspense></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
