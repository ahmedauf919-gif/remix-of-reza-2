// Fallback fetcher: ask Lovable AI (Gemini) for latest published values
// for rates that FRED could not return. Structured JSON output.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Ask = { id: string; label: string; country?: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = await req.json().catch(() => ({}));
    const items: Ask[] = body?.items ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ rates: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const list = items.map((i, idx) =>
      `${idx + 1}. id="${i.id}" — ${i.label}${i.country ? ` (${i.country})` : ""}`
    ).join("\n");

    const prompt = `You are a financial data assistant. For each interest-rate item below, provide the MOST RECENT officially published value from the relevant central bank.

Authoritative source priority (in order):
- Egypt: Central Bank of Egypt (CBE) Monetary Policy Committee (MPC) press release — overnight deposit, overnight lending, main operation, discount rate.
- Eurozone: ECB key interest rates page.
- UK: Bank of England MPC.
- Switzerland: SNB policy rate.
- All others: the country's official central bank publication.
- Only fall back to Reuters/Bloomberg/IMF if the central bank value is unavailable.

Return STRICT JSON only:
{ "rates": [ { "id": string, "value": number, "date": "YYYY-MM-DD", "source": string } ] }

Rules:
- value is in percent (e.g., 20.50 for 20.50%).
- date is the as-of date of the published value (the MPC decision date for policy rates).
- source must be the institution name + the URL of the page where the value is published.
- Do not guess. If you do not have high confidence in the current value, omit that id.
- Match the rate type to the item label (e.g., "Egypt Lending Rate" = CBE overnight LENDING rate, not deposit).

Items:
${list}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "You return only valid JSON. No prose." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI gateway ${aiRes.status}: ${t}`);
    }
    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { rates?: { id: string; value: number; date: string; source?: string }[] } = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    return new Response(
      JSON.stringify({ fetchedAt: new Date().toISOString(), rates: parsed.rates ?? [] }),
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