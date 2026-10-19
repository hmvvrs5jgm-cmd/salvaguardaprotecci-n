-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m4-la-informacion-tambien-protege, versión 1.0.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M4_P2, M4_P5, M4_P6, M4_P7 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m4-la-informacion-tambien-protege', '1.0', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = 'm4-la-informacion-tambien-protege' and content_version <> '1.0';

delete from private.assessment_items where episode_id = 'm4-la-informacion-tambien-protege' and content_version = '1.0';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P1', 1, false, 'M4_P1-B', array['M4_P1-A', 'M4_P1-B', 'M4_P1-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P2', 2, true, 'M4_P2-A', array['M4_P2-A', 'M4_P2-B', 'M4_P2-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P3', 3, false, 'M4_P3-C', array['M4_P3-A', 'M4_P3-B', 'M4_P3-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P4', 4, false, 'M4_P4-B', array['M4_P4-A', 'M4_P4-B', 'M4_P4-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P5', 5, true, 'M4_P5-A', array['M4_P5-A', 'M4_P5-B', 'M4_P5-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P6', 6, true, 'M4_P6-C', array['M4_P6-A', 'M4_P6-B', 'M4_P6-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P7', 7, true, 'M4_P7-B', array['M4_P7-A', 'M4_P7-B', 'M4_P7-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P8', 8, false, 'M4_P8-A', array['M4_P8-A', 'M4_P8-B', 'M4_P8-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P9', 9, false, 'M4_P9-C', array['M4_P9-A', 'M4_P9-B', 'M4_P9-C']),
  ('m4-la-informacion-tambien-protege', '1.0', 'M4_P10', 10, false, 'M4_P10-B', array['M4_P10-A', 'M4_P10-B', 'M4_P10-C']);
