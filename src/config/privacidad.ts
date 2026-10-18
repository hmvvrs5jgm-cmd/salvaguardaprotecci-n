// Aviso de privacidad configurable (prompt, apartado 9).
// No se inventan responsable del tratamiento, plazos ni bases jurídicas.
// El modo «registro» no puede compilarse para producción mientras estos campos estén vacíos
// (scripts/check-release-config.ts).

export interface ConfigPrivacidad {
  responsableTratamiento: string;
  plazoConservacion: string;
  baseJuridica: string;
  canalConsultas: string;
  /** Vigencia de la aprobación: vacía por defecto, pendiente de decisión institucional (prompt, apartado 7). */
  vigenciaAprobacion: string;
}

export const privacidad: ConfigPrivacidad = {
  responsableTratamiento: '',
  plazoConservacion: '',
  baseJuridica: '',
  canalConsultas: '',
  vigenciaAprobacion: '',
};

/** Aviso previo al registro (guion, apartado 18). */
export const avisoPrevioRegistro =
  'Se utilizarán los datos indicados para identificar tu participación y registrar el resultado. El Punto Focal de Salvaguarda es el único rol autorizado para consultar las aprobaciones. Podrás ver tu propio resultado.';

export const finalidadRegistro =
  'Finalidad: dejar constancia de la participación del personal y de los representantes en esta formación (Procedimiento 5.1.6.5). La aprobación corresponde solo a este episodio y versión.';

export function camposPrivacidadPendientes(p: ConfigPrivacidad = privacidad): string[] {
  const etiquetas: Record<keyof ConfigPrivacidad, string> = {
    responsableTratamiento: 'responsable del tratamiento',
    plazoConservacion: 'plazo de conservación',
    baseJuridica: 'base jurídica',
    canalConsultas: 'canal de consultas',
    vigenciaAprobacion: 'vigencia de la aprobación',
  };
  return (Object.keys(etiquetas) as Array<keyof ConfigPrivacidad>)
    .filter((k) => k !== 'vigenciaAprobacion' && p[k].trim() === '')
    .map((k) => etiquetas[k]);
}
