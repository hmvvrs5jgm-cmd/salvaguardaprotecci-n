-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m5-es-alguien-importante, versión 1.0.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M5_P2, M5_P4, M5_P6, M5_P8 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m5-es-alguien-importante', '1.0', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = 'm5-es-alguien-importante' and content_version <> '1.0';

delete from private.assessment_items where episode_id = 'm5-es-alguien-importante' and content_version = '1.0';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m5-es-alguien-importante', '1.0', 'M5_P1', 1, false, 'M5_P1-B', array['M5_P1-A', 'M5_P1-B', 'M5_P1-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P2', 2, true, 'M5_P2-A', array['M5_P2-A', 'M5_P2-B', 'M5_P2-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P3', 3, false, 'M5_P3-C', array['M5_P3-A', 'M5_P3-B', 'M5_P3-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P4', 4, true, 'M5_P4-B', array['M5_P4-A', 'M5_P4-B', 'M5_P4-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P5', 5, false, 'M5_P5-A', array['M5_P5-A', 'M5_P5-B', 'M5_P5-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P6', 6, true, 'M5_P6-C', array['M5_P6-A', 'M5_P6-B', 'M5_P6-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P7', 7, false, 'M5_P7-B', array['M5_P7-A', 'M5_P7-B', 'M5_P7-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P8', 8, true, 'M5_P8-A', array['M5_P8-A', 'M5_P8-B', 'M5_P8-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P9', 9, false, 'M5_P9-C', array['M5_P9-A', 'M5_P9-B', 'M5_P9-C']),
  ('m5-es-alguien-importante', '1.0', 'M5_P10', 10, false, 'M5_P10-B', array['M5_P10-A', 'M5_P10-B', 'M5_P10-C']);
