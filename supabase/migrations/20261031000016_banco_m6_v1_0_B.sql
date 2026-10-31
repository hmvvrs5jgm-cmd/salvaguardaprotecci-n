-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m6-una-imagen-que-no-debio-publicarse, versión 1.0-B.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M6_B02, M6_B04, M6_B05, M6_B06 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos; siguen activas 1.0 y 1.0-B.
update private.assessment_versions set active = false
 where episode_id = 'm6-una-imagen-que-no-debio-publicarse' and content_version not in ('1.0', '1.0-B');

delete from private.assessment_items where episode_id = 'm6-una-imagen-que-no-debio-publicarse' and content_version = '1.0-B';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B01', 1, false, 'M6_B01-A', array['M6_B01-A', 'M6_B01-B', 'M6_B01-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B02', 2, true, 'M6_B02-B', array['M6_B02-A', 'M6_B02-B', 'M6_B02-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B03', 3, false, 'M6_B03-C', array['M6_B03-A', 'M6_B03-B', 'M6_B03-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B04', 4, true, 'M6_B04-A', array['M6_B04-A', 'M6_B04-B', 'M6_B04-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B05', 5, true, 'M6_B05-B', array['M6_B05-A', 'M6_B05-B', 'M6_B05-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B06', 6, true, 'M6_B06-C', array['M6_B06-A', 'M6_B06-B', 'M6_B06-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B07', 7, false, 'M6_B07-A', array['M6_B07-A', 'M6_B07-B', 'M6_B07-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B08', 8, false, 'M6_B08-B', array['M6_B08-A', 'M6_B08-B', 'M6_B08-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B09', 9, false, 'M6_B09-C', array['M6_B09-A', 'M6_B09-B', 'M6_B09-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0-B', 'M6_B10', 10, false, 'M6_B10-A', array['M6_B10-A', 'M6_B10-B', 'M6_B10-C']);
