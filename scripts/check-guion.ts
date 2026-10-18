// Compara los textos literales del contenido con el guion local (referencias/, ignorado por git).
// Si el guion no está presente (por ejemplo, en CI), informa y termina sin error.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { textosLiterales } from '../src/content/textos';

const dir = 'referencias';
const archivo = existsSync(dir)
  ? readdirSync(dir).filter((f) => /^Guion_.*\.md$/i.test(f)).sort().pop()
  : undefined;

if (!archivo) {
  console.log('Guion no disponible en referencias/: se omite la comparación literal (esperado en CI).');
  process.exit(0);
}

const norm = (s: string) =>
  s.normalize('NFC').replace(/\*\*/g, '').replace(/[«»"“”]/g, '').replace(/\s+/g, ' ').replace(/[.]+$/, '').trim();

const guion = norm(readFileSync(join(dir, archivo), 'utf8'));
const faltan = textosLiterales().filter((t) => !guion.includes(norm(t.texto)));

console.log(`Guion: ${archivo}. Textos literales comprobados: ${textosLiterales().length}.`);
if (faltan.length === 0) {
  console.log('Todos los textos literales coinciden con el guion.');
} else {
  console.log(`Diferencias (${faltan.length}):`);
  for (const f of faltan) console.log(`- [${f.origen}] ${f.texto}`);
  process.exit(1);
}
