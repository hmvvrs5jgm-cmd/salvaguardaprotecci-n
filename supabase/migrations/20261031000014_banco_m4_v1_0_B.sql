-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio m4-la-informacion-tambien-protege, versión 1.0-B.
-- Regla pedagógica provisional: puntaje >= 8 y críticas M4_B02, M4_B05, M4_B06, M4_B07 correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values ('m4-la-informacion-tambien-protege', '1.0-B', 8, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos; siguen activas 1.0 y 1.0-B.
update private.assessment_versions set active = false
 where episode_id = 'm4-la-informacion-tambien-protege' and content_version not in ('1.0', '1.0-B');

delete from private.assessment_items where episode_id = 'm4-la-informacion-tambien-protege' and content_version = '1.0-B';

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B01', 1, false, 'M4_B01-B', array['M4_B01-A', 'M4_B01-B', 'M4_B01-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B02', 2, true, 'M4_B02-C', array['M4_B02-A', 'M4_B02-B', 'M4_B02-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B03', 3, false, 'M4_B03-A', array['M4_B03-A', 'M4_B03-B', 'M4_B03-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B04', 4, false, 'M4_B04-B', array['M4_B04-A', 'M4_B04-B', 'M4_B04-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B05', 5, true, 'M4_B05-C', array['M4_B05-A', 'M4_B05-B', 'M4_B05-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B06', 6, true, 'M4_B06-A', array['M4_B06-A', 'M4_B06-B', 'M4_B06-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B07', 7, true, 'M4_B07-B', array['M4_B07-A', 'M4_B07-B', 'M4_B07-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B08', 8, false, 'M4_B08-C', array['M4_B08-A', 'M4_B08-B', 'M4_B08-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B09', 9, false, 'M4_B09-A', array['M4_B09-A', 'M4_B09-B', 'M4_B09-C']),
  ('m4-la-informacion-tambien-protege', '1.0-B', 'M4_B10', 10, false, 'M4_B10-B', array['M4_B10-A', 'M4_B10-B', 'M4_B10-C']);
