CREATE TABLE IF NOT EXISTS public.shared_pv_scenario (
  id integer PRIMARY KEY,
  inputs jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shared_pv_scenario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read pv scenario" ON public.shared_pv_scenario FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pv scenario" ON public.shared_pv_scenario FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pv scenario" ON public.shared_pv_scenario FOR UPDATE USING (true) WITH CHECK (true);