// Genera la migración del banco de evaluación del servidor desde el contenido tipado (único origen).
// Uso: npm run gen:assessment-sql        → escribe el archivo
//      npm run gen:assessment-sql -- --check → falla si el archivo no está actualizado (CI)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import * as ep1 from "../src/content/episodio1";
import { claveEp1 } from "../src/content/episodio1/clave";
import * as ep2 from "../src/content/episodio2";
import { claveM2 } from "../src/content/episodio2/clave";
import type {
  AnswerKey,
  AssessmentConfig,
  Question,
} from "../src/content/types";

// Cada módulo y versión del contenido tiene su propia migración; las anteriores no se editan.
// Los resultados se registran por episode_id: el banco del módulo 2 no desactiva el del módulo 1.
const bancos: Array<{
  configEvaluacion: AssessmentConfig;
  preguntas: Question[];
  clave: AnswerKey;
  destinos: Record<string, string>;
}> = [
  {
    configEvaluacion: ep1.configEvaluacion,
    preguntas: ep1.preguntas,
    clave: claveEp1,
    destinos: {
      "1.1": "supabase/migrations/20261018000003_banco_ep1_v1_1.sql",
      "1.2": "supabase/migrations/20261018000004_banco_ep1_v1_2.sql",
    },
  },
  {
    configEvaluacion: ep2.configEvaluacion,
    preguntas: ep2.preguntas,
    clave: claveM2,
    destinos: { "1.0": "supabase/migrations/20261019000005_banco_m2_v1_0.sql" },
  },
];

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
let desactualizado = false;

for (const { configEvaluacion, preguntas, clave, destinos } of bancos) {
  const destino = destinos[configEvaluacion.version];
  if (!destino)
    throw new Error(
      `Añade el nombre de migración para ${configEvaluacion.episodeId} ${configEvaluacion.version}`,
    );

  const filas = preguntas.map((p, i) => {
    const correcta = clave[p.id];
    if (!correcta || !p.options.some((o) => o.id === correcta))
      throw new Error(`Clave inválida para ${p.id}`);
    const opciones = `array[${p.options.map((o) => q(o.id)).join(", ")}]`;
    return `  (${q(configEvaluacion.episodeId)}, ${q(configEvaluacion.version)}, ${q(p.id)}, ${i + 1}, ${p.critical}, ${q(correcta)}, ${opciones})`;
  });

  const sql = `-- GENERADO por scripts/generate-assessment-seed.ts a partir de src/content. No editar a mano.
-- Banco de la evaluación del episodio ${configEvaluacion.episodeId}, versión ${configEvaluacion.version}.
-- Regla pedagógica provisional: puntaje >= ${configEvaluacion.passScore} y críticas ${configEvaluacion.criticalQuestionIds.join(", ")} correctas.

insert into private.assessment_versions (episode_id, content_version, pass_score, active)
values (${q(configEvaluacion.episodeId)}, ${q(configEvaluacion.version)}, ${configEvaluacion.passScore}, true)
on conflict (episode_id, content_version) do update set pass_score = excluded.pass_score, active = excluded.active;

-- Las versiones anteriores del episodio dejan de aceptar intentos nuevos y envíos.
update private.assessment_versions set active = false
 where episode_id = ${q(configEvaluacion.episodeId)} and content_version <> ${q(configEvaluacion.version)};

delete from private.assessment_items where episode_id = ${q(configEvaluacion.episodeId)} and content_version = ${q(configEvaluacion.version)};

insert into private.assessment_items (episode_id, content_version, question_id, position, critical, correct_option_id, option_ids) values
${filas.join(",\n")};
`;

  // Coherencia: las críticas del banco coinciden con la configuración.
  const criticas = preguntas.filter((p) => p.critical).map((p) => p.id);
  if (
    JSON.stringify(criticas) !==
    JSON.stringify(configEvaluacion.criticalQuestionIds)
  ) {
    throw new Error(
      "Las preguntas críticas no coinciden con configEvaluacion.criticalQuestionIds",
    );
  }

  if (process.argv.includes("--check")) {
    const actual = existsSync(destino) ? readFileSync(destino, "utf8") : "";
    if (actual !== sql) {
      console.error(
        `${destino} no está actualizado. Ejecuta npm run gen:assessment-sql.`,
      );
      desactualizado = true;
    } else {
      console.log(`${destino} está actualizado.`);
    }
  } else {
    writeFileSync(destino, sql);
    console.log(`Escrito ${destino}`);
  }
}

if (desactualizado) process.exit(1);
