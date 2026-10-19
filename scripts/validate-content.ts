// Valida el grafo narrativo de cada módulo y termina con error si hay problemas (se usa en CI).
import { episodios } from '../src/content/episodios';
import { validarGrafo } from '../src/engine/grafo';

let error = false;
for (const ep of episodios) {
  const problemas = validarGrafo(ep);
  if (problemas.length) {
    error = true;
    for (const p of problemas) console.error(`✗ ${ep.rotulo} — ${p.tipo}: ${p.detalle}`);
  } else {
    console.log(`✓ Grafo de «${ep.title}» v${ep.version} válido: ${ep.order.length} escenas + CIERRE.`);
  }
}
if (error) process.exit(1);
