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

// Estado según el documento de respuestas revisadas (23/10/2026, sección 5):
// - 5.1 Responsable: debe ser la entidad jurídica que determina fines y medios (no el delegado de protección de datos). Pendiente.
// - 5.2 Conservación: propuesta de siete años desde cada resultado, pendiente de justificar necesidad y proporcionalidad. Pendiente.
// - 5.3 Base jurídica: la LOPDP es el marco, no la base; debe elegirse por finalidad y grupo. Pendiente de Asesoría Legal.
// - 5.4 Canal: correo o formulario verificado para consultas y derechos; el correo de salvaguarda no lo sustituye. Pendiente.
// Mientras estos campos estén vacíos, la compilación en modo «registro» se detiene. No rellenarlos con propuestas.
export const privacidad: ConfigPrivacidad = {
  responsableTratamiento: '',
  plazoConservacion: '',
  baseJuridica: '',
  canalConsultas: '',
  // Punto 1.6, confirmado por el Punto Focal: doce meses desde la aprobación (src/engine/vigencia.ts).
  vigenciaAprobacion:
    'Doce meses desde la fecha de aprobación. El resultado histórico se conserva y se marca como vencido; la renovación exige aprobar de nuevo la versión vigente.',
};

/** Aviso previo al registro (guion, apartado 18). */
export const avisoPrevioRegistro =
  'Se utilizarán los datos indicados para identificar tu participación y registrar el resultado. El Punto Focal de Salvaguarda es el único rol autorizado para consultar las aprobaciones. Podrás ver tu propio resultado. Puedes registrarte con el correo institucional de tu organización: verificar el correo no prueba tu pertenencia vigente ni da acceso a resultados de otras personas. Este registro es independiente de los expedientes de salvaguarda: no escribas aquí relatos ni información de casos.';

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
