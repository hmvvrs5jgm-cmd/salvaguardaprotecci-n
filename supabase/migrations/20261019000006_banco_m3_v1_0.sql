-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m3-antes-de-abrir-las-puertas, versión 1.0.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M3_P2, M3_P4, M3_P6, M3_P8 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m3-antes-de-abrir-las-puertas', '1.0', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = 'm3-antes-de-abrir-las-puertas' and content_version <> '1.0';

delete from private.assessment_items where episode_id = 'm3-antes-de-abrir-las-puertas' and content_version = '1.0';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P1', 1, false, 'M3_P1-A', array['M3_P1-A', 'M3_P1-B', 'M3_P1-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P2', 2, true, 'M3_P2-C', array['M3_P2-A', 'M3_P2-B', 'M3_P2-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P3', 3, false, 'M3_P3-B', array['M3_P3-A', 'M3_P3-B', 'M3_P3-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P4', 4, true, 'M3_P4-C', array['M3_P4-A', 'M3_P4-B', 'M3_P4-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P5', 5, false, 'M3_P5-A', array['M3_P5-A', 'M3_P5-B', 'M3_P5-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P6', 6, true, 'M3_P6-B', array['M3_P6-A', 'M3_P6-B', 'M3_P6-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P7', 7, false, 'M3_P7-C', array['M3_P7-A', 'M3_P7-B', 'M3_P7-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P8', 8, true, 'M3_P8-B', array['M3_P8-A', 'M3_P8-B', 'M3_P8-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P9', 9, false, 'M3_P9-A', array['M3_P9-A', 'M3_P9-B', 'M3_P9-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0', 'M3_P10', 10, false, 'M3_P10-C', array['M3_P10-A', 'M3_P10-B', 'M3_P10-C']);
