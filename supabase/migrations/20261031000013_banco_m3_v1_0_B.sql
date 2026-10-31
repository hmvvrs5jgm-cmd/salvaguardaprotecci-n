-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m3-antes-de-abrir-las-puertas, versión 1.0-B.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M3_B02, M3_B04, M3_B06, M3_B08 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m3-antes-de-abrir-las-puertas', '1.0-B', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos; siguen activas 1.0 y 1.0-B.
update private.assessment_versions set active = false
 where episode_id = 'm3-antes-de-abrir-las-puertas' and content_version not in ('1.0', '1.0-B');

delete from private.assessment_items where episode_id = 'm3-antes-de-abrir-las-puertas' and content_version = '1.0-B';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B01', 1, false, 'M3_B01-A', array['M3_B01-A', 'M3_B01-B', 'M3_B01-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B02', 2, true, 'M3_B02-B', array['M3_B02-A', 'M3_B02-B', 'M3_B02-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B03', 3, false, 'M3_B03-C', array['M3_B03-A', 'M3_B03-B', 'M3_B03-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B04', 4, true, 'M3_B04-A', array['M3_B04-A', 'M3_B04-B', 'M3_B04-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B05', 5, false, 'M3_B05-B', array['M3_B05-A', 'M3_B05-B', 'M3_B05-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B06', 6, true, 'M3_B06-C', array['M3_B06-A', 'M3_B06-B', 'M3_B06-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B07', 7, false, 'M3_B07-A', array['M3_B07-A', 'M3_B07-B', 'M3_B07-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B08', 8, true, 'M3_B08-B', array['M3_B08-A', 'M3_B08-B', 'M3_B08-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B09', 9, false, 'M3_B09-C', array['M3_B09-A', 'M3_B09-B', 'M3_B09-C']),
  ('m3-antes-de-abrir-las-puertas', '1.0-B', 'M3_B10', 10, false, 'M3_B10-A', array['M3_B10-A', 'M3_B10-B', 'M3_B10-C']);
