import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Plus } from "lucide-react";

const models = [
  {
    id: "reza",
    title: "REZA Project Finance Model",
    description: "Full project finance model for wind / renewables: CAPEX, debt sizing, DSCR, LCOE, equity IRR, sensitivities.",
    icon: Wind,
    href: "/models/reza",
    available: true,
  },
  {
    id: "reza-2",
    title: "REZA Project Finance Model (Copy)",
    description: "Independent duplicate with its own saved assumptions — run a parallel scenario for comparison.",
    icon: Wind,
    href: "/models/reza-2",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold">Financial Models Hub</h1>
          <p className="text-muted-foreground mt-1">
            Select a model to open. More models will be added over time.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((m) => {
            const Icon = m.icon;
            const card = (
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{m.title}</CardTitle>
                  <CardDescription>{m.description}</CardDescription>
                </CardHeader>
              </Card>
            );
            return m.available ? (
              <Link key={m.id} to={m.href}>{card}</Link>
            ) : (
              <div key={m.id} className="opacity-50 pointer-events-none">{card}</div>
            );
          })}

          <Card className="h-full border-dashed flex items-center justify-center text-muted-foreground">
            <CardContent className="flex flex-col items-center gap-2 py-10">
              <Plus className="h-6 w-6" />
              <span className="text-sm">More models coming soon</span>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
