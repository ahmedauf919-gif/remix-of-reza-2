import { Calendar, Percent, Fuel, Gauge } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface DieselFiltersProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  growthRate: number;
  onGrowthRateChange: (rate: number) => void;
  dieselPrice: number;
  onDieselPriceChange: (price: number) => void;
  efficiency: number;
  onEfficiencyChange: (efficiency: number) => void;
}

const years = ["all", "2026", "2027", "2028"];

export function DieselFilters({
  selectedYear,
  onYearChange,
  growthRate,
  onGrowthRateChange,
  dieselPrice,
  onDieselPriceChange,
  efficiency,
  onEfficiencyChange,
}: DieselFiltersProps) {
  return (
    <div className="glass-card p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Year Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Year</Label>
          </div>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Growth Rate Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-warning" />
              <Label className="text-sm font-medium">Growth Rate</Label>
            </div>
            <span className="text-sm font-mono font-bold text-warning">
              {growthRate}%
            </span>
          </div>
          <Slider
            value={[growthRate]}
            onValueChange={(value) => onGrowthRateChange(value[0])}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Diesel Price Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Diesel Price (EGP/L)</Label>
            </div>
            <span className="text-sm font-mono font-bold text-primary">
              {dieselPrice} EGP
            </span>
          </div>
          <Slider
            value={[dieselPrice]}
            onValueChange={(value) => onDieselPriceChange(value[0])}
            min={10}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10 EGP</span>
            <span>50 EGP</span>
          </div>
        </div>

        {/* Efficiency Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-success" />
              <Label className="text-sm font-medium">Efficiency</Label>
            </div>
            <span className="text-sm font-mono font-bold text-success">
              {efficiency}%
            </span>
          </div>
          <Slider
            value={[efficiency]}
            onValueChange={(value) => onEfficiencyChange(value[0])}
            min={15}
            max={45}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15%</span>
            <span>45%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
