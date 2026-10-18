// Valida el grafo narrativo del episodio y termina con error si hay problemas (se usa en CI).
import { episodio1 } from '../src/content/episodio1';
import { validarGrafo } from '../src/engine/grafo';

const problemas = validarGrafo(episodio1);
if (problemas.length) {
  for (const p of problemas) console.error(`✗ ${p.tipo}: ${p.detalle}`);
  process.exit(1);
}
console.log(`✓ Grafo de «${episodio1.title}» v${episodio1.version} válido: ${episodio1.order.length} escenas + CIERRE.`);
