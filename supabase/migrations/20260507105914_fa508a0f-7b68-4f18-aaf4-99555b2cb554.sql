CREATE TABLE IF NOT EXISTS public.shared_water_scenario (
  id integer PRIMARY KEY,
  inputs jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shared_water_scenario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read water scenario" ON public.shared_water_scenario FOR SELECT USING (true);
CREATE POLICY "Anyone can insert water scenario" ON public.shared_water_scenario FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update water scenario" ON public.shared_water_scenario FOR UPDATE USING (true) WITH CHECK (true);
INSERT INTO public.shared_water_scenario (id, inputs) VALUES (1, '{}'::jsonb) ON CONFLICT DO NOTHING;