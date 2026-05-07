import { PvOutputs, fmtNum } from "@/lib/pvModel";

export const PvOutput = ({ m }: { m: PvOutputs }) => {
  const cols: { key: keyof typeof m.rows[0]; label: string; d?: number }[] = [
    { key: "year", label: "Year" },
    { key: "energyKwh", label: "Energy (kWh)" },
    { key: "tariffEgp", label: "Tariff (EGP/kWh)", d: 3 },
    { key: "revenue", label: "Revenue" },
    { key: "opex", label: "OPEX" },
    { key: "ebitda", label: "EBITDA" },
    { key: "depreciation", label: "Depreciation" },
    { key: "ebit", label: "EBIT" },
    { key: "interest", label: "Interest" },
    { key: "tax", label: "Tax" },
    { key: "netProfit", label: "Net Profit" },
    { key: "principalRepay", label: "Principal" },
    { key: "debtClosing", label: "Debt Close" },
    { key: "dscr", label: "DSCR", d: 2 },
    { key: "fcff", label: "FCFF" },
    { key: "fcfe", label: "FCFE" },
  ];
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-muted-foreground">
          <tr>{cols.map(c => <th key={String(c.key)} className="py-1.5 px-2 text-right whitespace-nowrap">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {m.rows.map((r, i) => (
            <tr key={i} className="border-t border-border/40">
              {cols.map(c => (
                <td key={String(c.key)} className="py-1.5 px-2 text-right font-mono whitespace-nowrap">
                  {c.key === "year" ? r.year : fmtNum((r as any)[c.key], c.d ?? 0)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
