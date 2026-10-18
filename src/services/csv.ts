// Neutralización de fórmulas de hoja de cálculo para CSV.
// El servidor aplica la misma regla en SQL (admin_export_csv); esta copia se usa solo con datos ficticios de la demostración.

const PELIGROSOS = /^[=+\-@\t\r]/;

export function celdaSegura(valor: unknown): string {
  let s = valor === null || valor === undefined ? '' : String(valor);
  if (PELIGROSOS.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function aCsv(encabezados: string[], filas: unknown[][]): string {
  return [encabezados, ...filas].map((f) => f.map(celdaSegura).join(',')).join('\r\n');
}
