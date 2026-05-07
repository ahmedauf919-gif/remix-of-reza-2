import { useMemo } from "react";
import { WaterInputs, sensitivityIRR, fmtPct, fmtNum } from "@/lib/waterModel";

const MULT = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15];

const Table = ({ title, field, inputs }: { title: string; field: keyof WaterInputs; inputs: WaterInputs }) => {
  const rows = useMemo(() => sensitivityIRR(inputs, field, MULT), [inputs, field]);
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
      <h3 className="font-semibold mb-3">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="py-1.5 text-left">Multiplier</th>
            <th className="py-1.5 text-right">Project IRR</th>
            <th className="py-1.5 text-right">Equity IRR</th>
            <th className="py-1.5 text-right">Min DSCR</th>
            <th className="py-1.5 text-right">LCOM³</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.mult} className={`border-t border-border/40 ${r.mult === 1 ? "bg-secondary/30 font-medium" : ""}`}>
              <td className="py-1.5">{fmtNum(r.mult * 100, 0)}%</td>
              <td className="py-1.5 text-right font-mono">{fmtPct(r.projectIRR)}</td>
              <td className="py-1.5 text-right font-mono">{fmtPct(r.equityIRR)}</td>
              <td className="py-1.5 text-right font-mono">{fmtNum(r.minDSCR, 2)}</td>
              <td className="py-1.5 text-right font-mono">{fmtNum(r.lcom3, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const WaterSensitivity = ({ inputs }: { inputs: WaterInputs }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <Table title="Selling Price Sensitivity" field="sellingPriceEgpPerM3" inputs={inputs} />
    <Table title="FX Rate Sensitivity" field="fxRateEgpPerUsd" inputs={inputs} />
    <Table title="Electricity Price Sensitivity" field="electricityPriceEgpKwh" inputs={inputs} />
    <Table title="CAPEX Sensitivity (RO Unit)" field="roUnitUsd" inputs={inputs} />
    <Table title="Min Take Sensitivity" field="minTakePct" inputs={inputs} />
    <Table title="Debt Rate Sensitivity" field="debtRateYr1" inputs={inputs} />
  </div>
);
