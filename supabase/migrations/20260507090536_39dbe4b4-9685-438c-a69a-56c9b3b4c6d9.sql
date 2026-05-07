
ALTER TABLE public.shared_scenario DROP CONSTRAINT IF EXISTS shared_scenario_singleton;
ALTER TABLE public.shared_scenario ALTER COLUMN id DROP DEFAULT;

DROP POLICY IF EXISTS "Anyone can insert shared scenario" ON public.shared_scenario;
DROP POLICY IF EXISTS "Anyone can update shared scenario" ON public.shared_scenario;

CREATE POLICY "Anyone can insert shared scenario"
  ON public.shared_scenario FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update shared scenario"
  ON public.shared_scenario FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);
