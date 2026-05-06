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

    const prompt = `You are a financial data assistant. For each interest-rate item below, provide the most recent publicly published value from the official central bank or major financial publication (Reuters, Bloomberg, IMF, country central bank).

Return STRICT JSON only, matching this schema:
{ "rates": [ { "id": string, "value": number, "date": "YYYY-MM-DD", "source": string } ] }

- value is in percent (e.g., 27.25 for 27.25%).
- date is the as-of date of the published value.
- source is the publishing institution name and URL if known.
- If you genuinely do not know a current value, omit that id from the array — do not guess.

Items:
${list}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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