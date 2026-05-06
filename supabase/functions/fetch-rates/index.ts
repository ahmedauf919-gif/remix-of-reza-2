// Fetch reference rates from FRED API
// Returns SOFR, LIBOR (legacy), Treasuries, and global central bank policy rates
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SERIES: { id: string; label: string; category: string; country?: string }[] = [
  // USD reference rates
  { id: "SOFR", label: "SOFR (Overnight)", category: "USD Reference" },
  { id: "SOFR30DAYAVG", label: "30-Day Avg SOFR", category: "USD Reference" },
  { id: "SOFR90DAYAVG", label: "90-Day Avg SOFR", category: "USD Reference" },
  { id: "SOFR180DAYAVG", label: "180-Day Avg SOFR", category: "USD Reference" },
  { id: "EFFR", label: "Effective Fed Funds Rate", category: "USD Reference" },
  { id: "DPRIME", label: "US Bank Prime Loan Rate", category: "USD Reference" },
  // LIBOR (legacy / discontinued but still in FRED)
  { id: "USD3MTD156N", label: "USD LIBOR 3-Month (legacy)", category: "LIBOR (legacy)" },
  { id: "USD6MTD156N", label: "USD LIBOR 6-Month (legacy)", category: "LIBOR (legacy)" },
  { id: "USD12MD156N", label: "USD LIBOR 12-Month (legacy)", category: "LIBOR (legacy)" },
  // US Treasuries
  { id: "DGS1MO", label: "US Treasury 1-Month", category: "US Treasury" },
  { id: "DGS3MO", label: "US Treasury 3-Month", category: "US Treasury" },
  { id: "DGS6MO", label: "US Treasury 6-Month", category: "US Treasury" },
  { id: "DGS1", label: "US Treasury 1-Year", category: "US Treasury" },
  { id: "DGS2", label: "US Treasury 2-Year", category: "US Treasury" },
  { id: "DGS5", label: "US Treasury 5-Year", category: "US Treasury" },
  { id: "DGS10", label: "US Treasury 10-Year", category: "US Treasury" },
  { id: "DGS20", label: "US Treasury 20-Year", category: "US Treasury" },
  { id: "DGS30", label: "US Treasury 30-Year", category: "US Treasury" },
  // Central bank policy rates
  { id: "DFEDTARU", label: "US Federal Funds Target (upper)", category: "Central Bank Policy", country: "United States" },
  { id: "ECBDFR", label: "ECB Deposit Facility Rate", category: "Central Bank Policy", country: "Eurozone" },
  { id: "ECBMRRFR", label: "ECB Main Refinancing Rate", category: "Central Bank Policy", country: "Eurozone" },
  { id: "IUDSOIA", label: "Bank of England Bank Rate", category: "Central Bank Policy", country: "United Kingdom" },
  { id: "INTDSRJPM193N", label: "Bank of Japan Discount Rate", category: "Central Bank Policy", country: "Japan" },
  { id: "INTDSRCHM193N", label: "China Discount Rate", category: "Central Bank Policy", country: "China" },
  { id: "INTDSRINM193N", label: "Reserve Bank of India Discount Rate", category: "Central Bank Policy", country: "India" },
  { id: "INTDSRBRM193N", label: "Brazil Selic / Discount Rate", category: "Central Bank Policy", country: "Brazil" },
  { id: "IRSTCB01CAM156N", label: "Bank of Canada Policy Rate", category: "Central Bank Policy", country: "Canada" },
  { id: "IR3TIB01AUM156N", label: "Australia 3-Month Interbank", category: "Central Bank Policy", country: "Australia" },
  { id: "INTDSRMXM193N", label: "Banco de México Discount Rate", category: "Central Bank Policy", country: "Mexico" },
  { id: "INTDSRZAM193N", label: "South Africa Discount Rate", category: "Central Bank Policy", country: "South Africa" },
  { id: "INTDSRTRM193N", label: "Turkey Discount Rate", category: "Central Bank Policy", country: "Turkey" },
  // Reference benchmark replacements
  { id: "ESTRRATE", label: "€STR (Euro Short-Term Rate)", category: "EUR Reference", country: "Eurozone" },
  { id: "IUDSOIA", label: "SONIA (UK Overnight Indexed)", category: "GBP Reference", country: "United Kingdom" },
];

async function fetchSeries(id: string, apiKey: string) {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const obs = j?.observations?.[0];
  if (!obs || obs.value === "." || obs.value == null) return null;
  const val = parseFloat(obs.value);
  if (Number.isNaN(val)) return null;
  return { value: val, date: obs.date };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("FRED_API_KEY");
    if (!apiKey) throw new Error("FRED_API_KEY missing");

    const results = await Promise.all(
      SERIES.map(async (s) => {
        const data = await fetchSeries(s.id, apiKey);
        return data ? { ...s, ...data } : { ...s, value: null, date: null };
      }),
    );

    return new Response(
      JSON.stringify({ fetchedAt: new Date().toISOString(), rates: results }),
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