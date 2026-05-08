CREATE TABLE public.shared_cng_scenario (
  id integer PRIMARY KEY,
  inputs jsonb NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_cng_scenario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cng scenario" ON public.shared_cng_scenario FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cng scenario" ON public.shared_cng_scenario FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cng scenario" ON public.shared_cng_scenario FOR UPDATE USING (true) WITH CHECK (true);