-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m6-una-imagen-que-no-debio-publicarse, versión 1.0.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M6_P2, M6_P4, M6_P5, M6_P6 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m6-una-imagen-que-no-debio-publicarse', '1.0', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = 'm6-una-imagen-que-no-debio-publicarse' and content_version <> '1.0';

delete from private.assessment_items where episode_id = 'm6-una-imagen-que-no-debio-publicarse' and content_version = '1.0';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P1', 1, false, 'M6_P1-C', array['M6_P1-A', 'M6_P1-B', 'M6_P1-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P2', 2, true, 'M6_P2-A', array['M6_P2-A', 'M6_P2-B', 'M6_P2-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P3', 3, false, 'M6_P3-B', array['M6_P3-A', 'M6_P3-B', 'M6_P3-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P4', 4, true, 'M6_P4-C', array['M6_P4-A', 'M6_P4-B', 'M6_P4-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P5', 5, true, 'M6_P5-A', array['M6_P5-A', 'M6_P5-B', 'M6_P5-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P6', 6, true, 'M6_P6-B', array['M6_P6-A', 'M6_P6-B', 'M6_P6-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P7', 7, false, 'M6_P7-C', array['M6_P7-A', 'M6_P7-B', 'M6_P7-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P8', 8, false, 'M6_P8-A', array['M6_P8-A', 'M6_P8-B', 'M6_P8-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P9', 9, false, 'M6_P9-B', array['M6_P9-A', 'M6_P9-B', 'M6_P9-C']),
  ('m6-una-imagen-que-no-debio-publicarse', '1.0', 'M6_P10', 10, false, 'M6_P10-C', array['M6_P10-A', 'M6_P10-B', 'M6_P10-C']);
