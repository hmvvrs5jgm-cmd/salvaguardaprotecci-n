-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m5-es-alguien-importante, versión 1.0-B.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M5_B02, M5_B04, M5_B06, M5_B08 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m5-es-alguien-importante', '1.0-B', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos; siguen activas 1.0 y 1.0-B.
update private.assessment_versions set active = false
 where episode_id = 'm5-es-alguien-importante' and content_version not in ('1.0', '1.0-B');

delete from private.assessment_items where episode_id = 'm5-es-alguien-importante' and content_version = '1.0-B';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m5-es-alguien-importante', '1.0-B', 'M5_B01', 1, false, 'M5_B01-C', array['M5_B01-A', 'M5_B01-B', 'M5_B01-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B02', 2, true, 'M5_B02-A', array['M5_B02-A', 'M5_B02-B', 'M5_B02-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B03', 3, false, 'M5_B03-B', array['M5_B03-A', 'M5_B03-B', 'M5_B03-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B04', 4, true, 'M5_B04-C', array['M5_B04-A', 'M5_B04-B', 'M5_B04-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B05', 5, false, 'M5_B05-A', array['M5_B05-A', 'M5_B05-B', 'M5_B05-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B06', 6, true, 'M5_B06-B', array['M5_B06-A', 'M5_B06-B', 'M5_B06-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B07', 7, false, 'M5_B07-C', array['M5_B07-A', 'M5_B07-B', 'M5_B07-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B08', 8, true, 'M5_B08-A', array['M5_B08-A', 'M5_B08-B', 'M5_B08-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B09', 9, false, 'M5_B09-B', array['M5_B09-A', 'M5_B09-B', 'M5_B09-C']),
  ('m5-es-alguien-importante', '1.0-B', 'M5_B10', 10, false, 'M5_B10-C', array['M5_B10-A', 'M5_B10-B', 'M5_B10-C']);
