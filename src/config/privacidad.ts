// Aviso de privacidad configurable (prompt, apartado 9).
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

// Valores confirmados en la consulta institucional (31/10/2026). Se aplican tal como los indicó el Punto Focal.
// Observación pendiente para Asesoría Legal: la LOPDP espera como responsable a la entidad jurídica
// y una base de legitimación concreta (art. 7); estos textos pueden precisarse sin cambiar el código.
export const privacidad: ConfigPrivacidad = {
  responsableTratamiento: 'Punto Focal de Salvaguarda de ChildFund Ecuador (gvasquez@childfund.org).',
  plazoConservacion: 'Siete años desde la fecha de cada resultado.',
  baseJuridica: 'Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador.',
  canalConsultas: 'gvasquez@childfund.org, para consultas y para ejercer los derechos de acceso, rectificación, eliminación y oposición.',
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
