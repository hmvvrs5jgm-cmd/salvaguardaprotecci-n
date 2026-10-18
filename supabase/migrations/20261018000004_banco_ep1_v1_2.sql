-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio ep1-una-ayuda-con-condiciones, versión 1.2.
-- Regla pedagógica provisional: puntaje >= 8 y críticas P2, P3, P4, P6 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('ep1-una-ayuda-con-condiciones', '1.2', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = 'ep1-una-ayuda-con-condiciones' and content_version <> '1.2';

delete from private.assessment_items where episode_id = 'ep1-una-ayuda-con-condiciones' and content_version = '1.2';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P1', 1, false, 'P1-B', array['P1-A', 'P1-B', 'P1-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P2', 2, true, 'P2-C', array['P2-A', 'P2-B', 'P2-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P3', 3, true, 'P3-A', array['P3-A', 'P3-B', 'P3-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P4', 4, true, 'P4-B', array['P4-A', 'P4-B', 'P4-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P5', 5, false, 'P5-C', array['P5-A', 'P5-B', 'P5-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P6', 6, true, 'P6-A', array['P6-A', 'P6-B', 'P6-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P7', 7, false, 'P7-B', array['P7-A', 'P7-B', 'P7-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P8', 8, false, 'P8-C', array['P8-A', 'P8-B', 'P8-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P9', 9, false, 'P9-A', array['P9-A', 'P9-B', 'P9-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2', 'P10', 10, false, 'P10-B', array['P10-A', 'P10-B', 'P10-C']);
