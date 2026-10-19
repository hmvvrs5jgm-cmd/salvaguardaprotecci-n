-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m2-gracias-por-escucharme, versión 1.0.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M2_P2, M2_P3, M2_P4, M2_P6 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m2-gracias-por-escucharme', '1.0', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = 'm2-gracias-por-escucharme' and content_version <> '1.0';

delete from private.assessment_items where episode_id = 'm2-gracias-por-escucharme' and content_version = '1.0';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m2-gracias-por-escucharme', '1.0', 'M2_P1', 1, false, 'M2_P1-B', array['M2_P1-A', 'M2_P1-B', 'M2_P1-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P2', 2, true, 'M2_P2-C', array['M2_P2-A', 'M2_P2-B', 'M2_P2-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P3', 3, true, 'M2_P3-A', array['M2_P3-A', 'M2_P3-B', 'M2_P3-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P4', 4, true, 'M2_P4-B', array['M2_P4-A', 'M2_P4-B', 'M2_P4-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P5', 5, false, 'M2_P5-C', array['M2_P5-A', 'M2_P5-B', 'M2_P5-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P6', 6, true, 'M2_P6-A', array['M2_P6-A', 'M2_P6-B', 'M2_P6-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P7', 7, false, 'M2_P7-B', array['M2_P7-A', 'M2_P7-B', 'M2_P7-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P8', 8, false, 'M2_P8-C', array['M2_P8-A', 'M2_P8-B', 'M2_P8-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P9', 9, false, 'M2_P9-A', array['M2_P9-A', 'M2_P9-B', 'M2_P9-C']),
  ('m2-gracias-por-escucharme', '1.0', 'M2_P10', 10, false, 'M2_P10-B', array['M2_P10-A', 'M2_P10-B', 'M2_P10-C']);
