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
  fuente: string;
  /** Roles a los que aplica. */
  roles: Array<'cf' | 'socio'>;
}

export const canales: Canal[] = [
  {
    id: 'punto-focal-cf',
    nombre: 'Punto Focal de Salvaguarda de ChildFund',
    descripcion:
      'Recibe la preocupación y la registra mediante el formulario de incidentes en el sitio de EthicsPoint («Punto de Ética»).',
    estado: 'pendiente',
    fuente: 'Política 2.9.2.1; Procedimiento 5.2.2',
    roles: ['cf', 'socio'],
  },
  {
    id: 'gerente',
    nombre: 'Cualquier gerente de ChildFund',
    descripcion:
      'Puede recibir la preocupación y debe contactar con Cumplimiento Global. Recibirla no traslada tu propio deber de comunicarla dentro de 24 horas.',
    estado: 'pendiente',
    fuente: 'Política 2.9.1',
    roles: ['cf'],
  },
  {
    id: 'direccion-directa',
    nombre: 'Dirección directa',
    descripcion:
      'Director, Asesor Global de Salvaguardia y PSEA, Cumplimiento Global, Recursos Humanos Globales o Jurídico, verbalmente o por correo electrónico.',
    estado: 'pendiente',
    fuente: 'Procedimiento 5.2.2',
    roles: ['cf'],
  },
  {
    id: 'correo-complaints',
    nombre: 'Correo de reclamaciones',
    descripcion: 'Puede usarse de forma anónima o indicando tu nombre.',
    contacto: 'complaints@childfund.org',
    anonimo: true,
    estado: 'pendiente',
    fuente: 'Política 2.9.2.1; Procedimiento 5.2.2',
    roles: ['cf', 'socio'],
  },
  {
    id: 'speak-up',
    nombre: 'Speak Up (sitio web o teléfono)',
    descripcion:
      'Mecanismo de denuncia por la web o por teléfono, de forma anónima o con nombre. El teléfono de cada país figura en el propio sitio.',
    // Corregido respecto de la PPT (diapositiva 20). Las fuentes lo dan con http://; no se cambia el protocolo hasta verificar.
    url: 'http://speakup.childfund.org',
    anonimo: true,
    estado: 'pendiente',
    fuente: 'Política 2.9.2.1; Procedimiento 5.2.2',
    roles: ['cf', 'socio'],
  },
  {
    id: 'punto-focal-socio',
    nombre: 'Punto focal de salvaguarda de tu organización',
    descripcion:
      'Cada organización socia cuenta con un punto focal propio y está obligada a informar a los puntos focales de ChildFund de las infracciones de su política. Sin acuerdo propio, se aplican las normas mínimas de ChildFund.',
    estado: 'pendiente',
    fuente: 'Procedimiento 5.1.12.3, 5.1.12.6 y 5.1.12.7',
    roles: ['socio'],
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
  nombre: 'Número de emergencia local',
  estado: 'pendiente',
  fuente: 'Pendiente de verificación institucional',
};

/** Directorio local de servicios que mantiene la oficina de país (Procedimiento 5.3.1.3.1–5.3.1.3.2). */
export const directorioLocal: { descripcion: string; url?: string; estado: EstadoVerificacion } = {
  descripcion: 'Directorio local vigente de proveedores de servicios mantenido por la oficina de país.',
  estado: 'pendiente',
};

/** Etiquetas configurables del Referente según la ruta de cada rol (prompt, apartado 5.1). */
export const etiquetaReferente: Record<'cf' | 'socio', string> = {
  cf: 'Referente · Punto Focal de Salvaguarda',
  socio: 'Referente · rol competente según la ruta',
};

export function canalesParaRol(rol: 'cf' | 'socio'): Canal[] {
  return canales.filter((c) => c.roles.includes(rol));
}

export function esEnlaceActivo(c: { url?: string; estado: EstadoVerificacion }): boolean {
  return c.estado === 'verificado' && typeof c.url === 'string' && c.url.length > 0;
}
