// Fetch FX rates against USD from a free public source (open.er-api.com)
// No API key needed; updated daily.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COUNTRIES: Record<string, string> = {
  EUR: "Eurozone", GBP: "United Kingdom", JPY: "Japan", CNY: "China",
  CHF: "Switzerland", CAD: "Canada", AUD: "Australia", NZD: "New Zealand",
  SEK: "Sweden", NOK: "Norway", DKK: "Denmark", PLN: "Poland", HUF: "Hungary",
  CZK: "Czech Republic", RON: "Romania", TRY: "Turkey", RUB: "Russia",
  INR: "India", IDR: "Indonesia", THB: "Thailand", MYR: "Malaysia",
  PHP: "Philippines", SGD: "Singapore", HKD: "Hong Kong", KRW: "South Korea",
  TWD: "Taiwan", VND: "Vietnam", PKR: "Pakistan", BDT: "Bangladesh",
  SAR: "Saudi Arabia", AED: "United Arab Emirates", QAR: "Qatar",
  KWD: "Kuwait", BHD: "Bahrain", OMR: "Oman", JOD: "Jordan", ILS: "Israel",
  EGP: "Egypt", MAD: "Morocco", TND: "Tunisia", DZD: "Algeria",
  ZAR: "South Africa", NGN: "Nigeria", KES: "Kenya", GHS: "Ghana",
  BRL: "Brazil", MXN: "Mexico", ARS: "Argentina", CLP: "Chile",
  COP: "Colombia", PEN: "Peru", UYU: "Uruguay",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!r.ok) throw new Error(`Provider ${r.status}`);
    const j = await r.json();
    if (j.result !== "success") throw new Error("Provider error");

    const date: string = j.time_last_update_utc ?? new Date().toUTCString();
    const rates = Object.entries(COUNTRIES)
      .map(([code, country]) => ({
        code,
        country,
        perUsd: j.rates?.[code] ?? null,
        usdPer: j.rates?.[code] ? 1 / j.rates[code] : null,
      }))
      .filter(r => r.perUsd != null);

    return new Response(
      JSON.stringify({ fetchedAt: new Date().toISOString(), asOf: date, base: "USD", rates }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});