// Compara los textos literales de cada módulo con su guion local (referencias/, ignorado por git).
// Si un guion no está presente (por ejemplo, en CI), informa y continúa sin error.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { episodios } from '../src/content/episodios';
import { textosLiterales } from '../src/content/textos';

const dir = 'referencias';
const norm = (s: string) =>
  s.normalize('NFC').replace(/\*\*/g, '').replace(/[«»"“”]/g, '').replace(/\s+/g, ' ').replace(/[.]+$/, '').trim().toLocaleLowerCase('es');

let fallos = 0;
for (const ep of episodios) {
  const patron = new RegExp(ep.guionArchivo, 'i');
  const archivo = existsSync(dir) ? readdirSync(dir).filter((f) => patron.test(f)).sort().pop() : undefined;
  if (!archivo) {
    console.log(`${ep.rotulo}: guion no disponible en referencias/; se omite la comparación literal (esperado en CI).`);
    continue;
  }
  const guion = norm(readFileSync(join(dir, archivo), 'utf8'));
  const textos = textosLiterales(ep);
  const faltan = textos.filter((t) => !guion.includes(norm(t.texto)));
  console.log(`${ep.rotulo} — guion: ${archivo}. Textos literales comprobados: ${textos.length}.`);
  if (faltan.length === 0) {
    console.log('  Todos los textos literales coinciden con el guion.');
  } else {
    fallos += faltan.length;
    console.log(`  Diferencias (${faltan.length}):`);
    for (const f of faltan) console.log(`  - [${f.origen}] ${f.texto}`);
  }
}
if (fallos) process.exit(1);
