-- Single shared scenario storage. One row holds the latest inputs JSON.
CREATE TABLE public.shared_scenario (
  id INTEGER PRIMARY KEY DEFAULT 1,
  inputs JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT shared_scenario_singleton CHECK (id = 1)
);

ALTER TABLE public.shared_scenario ENABLE ROW LEVEL SECURITY;

-- App is gated by a shared password (PasswordGate component); allow anon read/write.
CREATE POLICY "Anyone can read shared scenario"
ON public.shared_scenario FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert shared scenario"
ON public.shared_scenario FOR INSERT TO anon, authenticated WITH CHECK (id = 1);

CREATE POLICY "Anyone can update shared scenario"
ON public.shared_scenario FOR UPDATE TO anon, authenticated USING (id = 1) WITH CHECK (id = 1);

ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_scenario;