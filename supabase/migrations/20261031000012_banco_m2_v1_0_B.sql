-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m2-gracias-por-escucharme, versión 1.0-B.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M2_B02, M2_B03, M2_B04, M2_B06 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m2-gracias-por-escucharme', '1.0-B', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos; siguen activas 1.0 y 1.0-B.
update private.assessment_versions set active = false
 where episode_id = 'm2-gracias-por-escucharme' and content_version not in ('1.0', '1.0-B');

delete from private.assessment_items where episode_id = 'm2-gracias-por-escucharme' and content_version = '1.0-B';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B01', 1, false, 'M2_B01-A', array['M2_B01-A', 'M2_B01-B', 'M2_B01-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B02', 2, true, 'M2_B02-B', array['M2_B02-A', 'M2_B02-B', 'M2_B02-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B03', 3, true, 'M2_B03-C', array['M2_B03-A', 'M2_B03-B', 'M2_B03-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B04', 4, true, 'M2_B04-A', array['M2_B04-A', 'M2_B04-B', 'M2_B04-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B05', 5, false, 'M2_B05-B', array['M2_B05-A', 'M2_B05-B', 'M2_B05-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B06', 6, true, 'M2_B06-C', array['M2_B06-A', 'M2_B06-B', 'M2_B06-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B07', 7, false, 'M2_B07-B', array['M2_B07-A', 'M2_B07-B', 'M2_B07-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B08', 8, false, 'M2_B08-C', array['M2_B08-A', 'M2_B08-B', 'M2_B08-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B09', 9, false, 'M2_B09-A', array['M2_B09-A', 'M2_B09-B', 'M2_B09-C']),
  ('m2-gracias-por-escucharme', '1.0-B', 'M2_B10', 10, false, 'M2_B10-B', array['M2_B10-A', 'M2_B10-B', 'M2_B10-C']);
