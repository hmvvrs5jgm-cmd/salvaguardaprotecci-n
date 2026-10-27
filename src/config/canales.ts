// Configuración centralizada de canales, contactos y servicios (prompt, apartados 2.2.5, 2.2.9 y 6).
// Regla: un canal con estado «pendiente» nunca se muestra como enlace activo ni con datos de contacto.
// La institución cambia el estado a «verificado» solo tras comprobar el dato vigente.

export type EstadoVerificacion = 'verificado' | 'pendiente';

export interface Canal {
  id: string;
  nombre: string;
  descripcion: string;
  /** Dato de contacto tal como figura en las fuentes; solo se muestra si estado === 'verificado'. */
  contacto?: string;
  /** URL tal como figura en las fuentes; solo se enlaza si estado === 'verificado'. */
  url?: string;
  anonimo?: boolean;
  estado: EstadoVerificacion;
  /** Texto del enlace, si el canal tiene URL. */
  etiquetaEnlace?: string;
  /** Quién y cuándo confirmó el dato (solo para canales verificados). */
  verificacion?: string;
  fuente: string;
  /** Roles a los que aplica. */
  roles: Array<'cf' | 'socio'>;
}

export const canales: Canal[] = [
  {
    id: 'punto-focal-cf',
    nombre: 'Punto Focal de Salvaguarda de ChildFund',
    descripcion:
      'Recibe la preocupación y la registra mediante el formulario de incidentes. Para iniciar el contacto no envíes un expediente completo: usa el mecanismo seguro que te indique.',
    contacto: 'gvasquez@childfund.org',
    estado: 'verificado',
    verificacion: 'Confirmado por el Punto Focal de Salvaguarda (respuestas revisadas, 23 de octubre de 2026, punto 4.1).',
    fuente: 'Política 2.9.2.1; Procedimiento 5.2.2',
    roles: ['cf', 'socio'],
  },
  {
    id: 'punto-focal-suplente',
    nombre: 'Punto Focal de Salvaguarda suplente',
    descripcion:
      'Asegura la continuidad y reemplaza al Punto Focal titular cuando es necesario. Es una alternativa si no es seguro o adecuado acudir al titular.',
    contacto: 'mespin@childfund.org',
    estado: 'verificado',
    verificacion:
      'Confirmado por el Punto Focal de Salvaguarda (respuestas revisadas, 23 de octubre de 2026, punto 4.2). Pendiente la constancia documental de la designación vigente.',
    fuente: 'Plan de Salvaguarda FY2026, sección 6 y anexo 4',
    roles: ['cf', 'socio'],
  },
  {
    id: 'gerente',
    nombre: 'Cualquier gerente de ChildFund',
    descripcion:
      'Puede recibir la preocupación y debe ponerse en contacto con Cumplimiento Global en un plazo de 5 días laborables. Recibirla no traslada tu propio deber de comunicarla dentro de 24 horas.',
    estado: 'verificado',
    verificacion: 'Confirmado por la institución el 18 de octubre de 2026; coincide con la fuente indicada.',
    fuente: 'Política 2.9.1',
    roles: ['cf'],
  },
  {
    id: 'direccion-directa',
    nombre: 'Dirección directa',
    descripcion:
      'Director, Asesor Global de Salvaguardia y PSEA, Cumplimiento Global, Recursos Humanos Globales o Jurídico, verbalmente o por correo electrónico (complaints@childfund.org).',
    estado: 'verificado',
    verificacion: 'Confirmado por la institución el 18 de octubre de 2026; coincide con la fuente indicada.',
    fuente: 'Procedimiento 5.2.2',
    roles: ['cf'],
  },
  {
    id: 'correo-complaints',
    nombre: 'Correo de reclamaciones',
    descripcion: 'Puede usarse de forma anónima o indicando tu nombre.',
    contacto: 'complaints@childfund.org',
    anonimo: true,
    estado: 'verificado',
    verificacion: 'Confirmado por la institución el 18 de octubre de 2026; coincide con la Política 2.9.2.1 y el Procedimiento 5.2.2.',
    fuente: 'Política 2.9.2.1; Procedimiento 5.2.2',
    roles: ['cf', 'socio'],
  },
  {
    id: 'speak-up',
    nombre: 'Speak Up (sitio web o teléfono)',
    descripcion:
      'Mecanismo de denuncia por la web o por teléfono, de forma anónima o con nombre. El teléfono de cada país figura en el propio sitio; el juego no publica un número.',
    // Corregido respecto de la PPT (diapositiva 20). Dirección confirmada por la institución, con http:// como en las fuentes.
    url: 'http://speakup.childfund.org',
    etiquetaEnlace: 'Abrir el sitio de Speak Up',
    anonimo: true,
    estado: 'verificado',
    verificacion: 'Confirmado por la institución el 18 de octubre de 2026; coincide con la Política 2.9.2.1 y el Procedimiento 5.2.2.',
    fuente: 'Política 2.9.2.1; Procedimiento 5.2.2',
    roles: ['cf', 'socio'],
  },
  {
    id: 'punto-focal-socio',
    nombre: 'Punto focal de salvaguarda de tu organización',
    descripcion:
      'Activa la ruta en tu organización y la informa al Punto Focal de Salvaguarda de ChildFund. Cada organización socia cuenta con un punto focal propio y está obligada a informar a los puntos focales de ChildFund de las infracciones de su política. Sin acuerdo propio, se aplican las normas mínimas de ChildFund. La coordinación de cada organización designa a una persona con conocimiento de la política y capacitación, y publica su contacto y una alternativa para casos de conflicto de interés o ausencia.',
    estado: 'pendiente',
    fuente: 'Procedimiento 5.1.12.3, 5.1.12.6 y 5.1.12.7; Protocolo de asistencia y derivación, 6; Plan de Salvaguarda FY2026, sección 6',
    roles: ['socio'],
  },
  {
    id: 'cfm',
    nombre: 'Mecanismo comunitario de retroalimentación y quejas',
    descripcion:
      'Canal para que participantes y comunidades comuniquen preocupaciones o quejas de salvaguarda. Forma parte de los canales de recepción de la ruta. Cada organización socia lo establece y difunde según su contexto, de forma accesible, comprensible y segura: es público el modo de acceder; los reportes y las identidades se manejan con confidencialidad.',
    estado: 'pendiente',
    fuente: 'Política 2.9.2.2; Ruta gráfica de respuesta y derivación',
    roles: ['cf', 'socio'],
  },
];

export interface ContactoEmergencia {
  nombre: string;
  valor?: string;
  estado: EstadoVerificacion;
  fuente: string;
}

/** Número de emergencia: solo se muestra si está verificado (prompt, apartado 2.2.9). */
export const emergencia: ContactoEmergencia = {
  nombre: 'Número de emergencia',
  valor: '911',
  estado: 'verificado',
  fuente: 'Capítulo III; Protocolo de asistencia y derivación, 7.3',
};

/**
 * Servicios públicos de emergencia, denuncia y protección en Ecuador (Capítulo III; Protocolo de asistencia y derivación, 7.3).
 * Se informan a la persona como alternativas: ella decide si acude. Las derivaciones las coordina el Punto Focal (PEP).
 * No se nombran ministerios: los documentos institucionales difieren en sus nombres (ver docs/discrepancias.md, punto 18).
 */
export interface ServicioPublico {
  id: string;
  tipo: 'emergencia' | 'denuncia' | 'proteccion';
  nombre: string;
  descripcion: string;
  contacto?: string;
  url?: string;
  etiquetaEnlace?: string;
  estado: EstadoVerificacion;
  fuente: string;
}

export const serviciosPublicos: ServicioPublico[] = [
  {
    id: 'ecu-911',
    tipo: 'emergencia',
    nombre: 'Línea de emergencias',
    descripcion:
      'Atención inmediata de emergencias, incluidos casos de violencia y explotación sexual, para proteger la seguridad física de la persona.',
    contacto: '911',
    estado: 'verificado',
    fuente: 'Capítulo III; Protocolo de asistencia y derivación, 7.3',
  },
  {
    id: 'linea-1800-delito',
    tipo: 'denuncia',
    nombre: 'Línea de denuncia de la Fiscalía',
    descripcion: 'Vía de denuncia de la Fiscalía que permite reportar delitos de manera anónima y segura.',
    contacto: '1800-DELITO (1800-335486), opción 4',
    estado: 'verificado',
    fuente: 'Capítulo III; Protocolo de asistencia y derivación, 7.3',
  },
  {
    id: 'flagrancia',
    tipo: 'denuncia',
    nombre: 'Unidades de Flagrancia',
    descripcion:
      'Si se trata de violencia de género y el hecho ocurrió hace menos de 48 horas: unidades en todo el país para atención inmediata y legal.',
    estado: 'verificado',
    fuente: 'Capítulo III; Protocolo de asistencia y derivación, 7.3',
  },
  {
    id: 'fiscalia',
    tipo: 'denuncia',
    nombre: 'Fiscalía, juzgados o Juntas de Protección de Derechos',
    descripcion:
      'Si el hecho ocurrió hace más de 48 horas: denuncia presencial en la Fiscalía o en las unidades judiciales, o en línea. No se requiere abogado y el trámite es gratuito. El sitio de la Fiscalía incluye el directorio de fiscalías.',
    url: 'https://www.fiscalia.gob.ec/',
    etiquetaEnlace: 'Abrir el sitio de la Fiscalía General del Estado',
    estado: 'verificado',
    fuente: 'Capítulo III; Protocolo de asistencia y derivación, 7.3',
  },
  {
    id: 'juntas',
    tipo: 'proteccion',
    nombre: 'Juntas de Protección de Derechos',
    descripcion:
      'Reciben denuncias y dictan medidas de protección, en especial para niñas, niños y adolescentes. Conviene acudir a la más cercana al lugar de residencia.',
    estado: 'verificado',
    fuente: 'Capítulo III',
  },
  {
    id: 'proteccion-integral',
    tipo: 'proteccion',
    nombre: 'Servicios de Protección Integral y Centros Violeta',
    descripcion:
      'Orientación e información sobre los servicios de atención; atención psicológica, legal y de trabajo social a sobrevivientes de violencia.',
    estado: 'verificado',
    fuente: 'Capítulo III; Protocolo de asistencia y derivación, 7.3',
  },
];

export const avisoServicios =
  'Estos servicios pueden comunicarse a la persona como alternativas: ella decide si acude y cuándo. Las derivaciones las coordina el Punto Focal de Salvaguarda (PEP), con consentimiento informado; no derives por tu cuenta. Las 48 horas indican a qué servicio acudir según el tiempo transcurrido: no son un plazo para reportar ni para esperar. El 911 atiende emergencias y no sustituye el reporte institucional.';

/** Alternativas de reporte (respuestas revisadas, sección 4). */
export const notaAlternativas =
  'La dirección directa, los gerentes y las vías globales autorizadas son alternativas de reporte, no pasos sucesivos obligatorios.';

/** Revisión del directorio y de los servicios públicos (punto 4.7, confirmado por el Punto Focal). */
export const revisionDirectorio =
  'El Punto Focal revisa el directorio y los servicios cada seis meses, y antes si conoce un cambio; registra fecha, fuente y cambios. Última confirmación de los servicios públicos: 18 de octubre de 2026.';

/** Directorio local de servicios que mantiene la oficina de país (Procedimiento 5.3.1.3.1–5.3.1.3.2). */
export const directorioLocal: { descripcion: string; url?: string; estado: EstadoVerificacion } = {
  descripcion:
    'El directorio de servicios de la oficina de país y de cada organización socia es de uso interno: se consulta a través del Punto Focal de Salvaguarda que corresponda (de ChildFund o de tu organización), que te orienta sobre el servicio adecuado.',
  estado: 'pendiente',
};

/** Etiquetas configurables del Referente según la ruta de cada rol (prompt, apartado 5.1). */
export const etiquetaReferente: Record<'cf' | 'socio', string> = {
  cf: 'Referente · Punto Focal de Salvaguarda',
  socio: 'Referente · punto focal de salvaguarda según la ruta',
};

export function canalesParaRol(rol: 'cf' | 'socio'): Canal[] {
  return canales.filter((c) => c.roles.includes(rol));
}

export function esEnlaceActivo(c: { url?: string; estado: EstadoVerificacion }): boolean {
  return c.estado === 'verificado' && typeof c.url === 'string' && c.url.length > 0;
}
