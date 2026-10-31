-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio ep1-una-ayuda-con-condiciones, versión 1.2-B.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M1_B02, M1_B03, M1_B04, M1_B06 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('ep1-una-ayuda-con-condiciones', '1.2-B', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos; siguen activas 1.2 y 1.2-B.
update private.assessment_versions set active = false
 where episode_id = 'ep1-una-ayuda-con-condiciones' and content_version not in ('1.2', '1.2-B');

delete from private.assessment_items where episode_id = 'ep1-una-ayuda-con-condiciones' and content_version = '1.2-B';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B01', 1, false, 'M1_B01-B', array['M1_B01-A', 'M1_B01-B', 'M1_B01-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B02', 2, true, 'M1_B02-A', array['M1_B02-A', 'M1_B02-B', 'M1_B02-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B03', 3, true, 'M1_B03-C', array['M1_B03-A', 'M1_B03-B', 'M1_B03-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B04', 4, true, 'M1_B04-B', array['M1_B04-A', 'M1_B04-B', 'M1_B04-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B05', 5, false, 'M1_B05-C', array['M1_B05-A', 'M1_B05-B', 'M1_B05-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B06', 6, true, 'M1_B06-A', array['M1_B06-A', 'M1_B06-B', 'M1_B06-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B07', 7, false, 'M1_B07-B', array['M1_B07-A', 'M1_B07-B', 'M1_B07-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B08', 8, false, 'M1_B08-A', array['M1_B08-A', 'M1_B08-B', 'M1_B08-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B09', 9, false, 'M1_B09-C', array['M1_B09-A', 'M1_B09-B', 'M1_B09-C']),
  ('ep1-una-ayuda-con-condiciones', '1.2-B', 'M1_B10', 10, false, 'M1_B10-B', array['M1_B10-A', 'M1_B10-B', 'M1_B10-C']);
