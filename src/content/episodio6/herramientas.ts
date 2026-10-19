// Herramientas del módulo 6 (guion «Una imagen que no debió publicarse» v1.0, apartado 18).
// El texto de cada tarjeta del guion se conserva; las secciones de apoyo citan sus fuentes.
// No se dan instrucciones de plataformas concretas ni plazos de retiro, notificación o conservación.

import type { Tool } from '../types';

export const herramientasM6: Tool[] = [
  {
    id: 'm6-decisiones',
    title: '1. Tres decisiones distintas',
    summary: 'Participar, aceptar una toma de imagen y autorizar usos concretos no son lo mismo.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Participar, aceptar una toma de imagen y autorizar usos determinados no son lo mismo. La información debe ser comprensible y la elección libre; el equipo revisa requisitos de edad y representación aplicables.',
          'Una autorización no demuestra por sí sola que la publicación sea segura: se valoran alcance, propósito, comprensión, voluntariedad y cambios de contexto. Tampoco toda autorización general es automáticamente nula.',
        ],
        bullets: [
          'Para publicar, se obtiene consentimiento informado y, cuando el sujeto principal es una niña o un niño, consentimiento escrito de su madre, padre o tutor.',
          'Una negativa o un cambio de preferencia no se usan para excluir de programas o ayudas.',
        ],
      },
    ],
    sources: ['Procedimiento 5.1.11.3 y 5.1.14.4', 'Guion del módulo 6, escenas M6_E02 y M6_E05'],
  },
  {
    id: 'm6-revision',
    title: '2. Revisión antes de publicar',
    summary: 'Propósito, permiso, voz de la niña, identificación, dignidad, contexto y audiencia.',
    sections: [
      {
        heading: 'Revisar',
        bullets: [
          'Propósito y necesidad.',
          'Comprensión y alcance del permiso.',
          'Voz de la niña.',
          'Identificación directa e indirecta: rostro, uniforme, institución, texto, etiquetas, ubicación, fecha, comentarios, audio y texto alternativo.',
          'Dignidad: nunca como víctimas indefensas.',
          'Riesgos de contexto y audiencia.',
          'Canales.',
          'Revisión autorizada.',
        ],
        paragraphs: ['En un grupo pequeño puede reconocerse a alguien con pocos datos.'],
      },
    ],
    sources: ['Procedimiento 5.1.14.2 y 5.1.14.5', 'Guion del módulo 6, escena M6_E03'],
  },
  {
    id: 'm6-preocupacion',
    title: '3. Si hay preocupación',
    summary: 'Comunicar y coordinar la contención por quienes administran la cuenta, sin difundir más.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'No reenviar ni pedir capturas a grupos; comunicar por mecanismo; coordinar restricción o retiro por administradores autorizados; atender seguridad; registrar mínimo por vía restringida. No retrasar contención por esperar pruebas o permisos nuevos.',
        ],
        bullets: [
          'Ocultar una publicación no siempre elimina el enlace ni las copias.',
          'No borres archivos, permisos ni historiales por tu cuenta: retirar exposición no es ocultar lo ocurrido.',
          'Si no administras la cuenta, tu acción es avisar y solicitar intervención urgente del responsable.',
          'Si aparece una amenaza inmediata, se activa protección urgente sin esperar la revisión de redes.',
        ],
      },
    ],
    sources: ['Procedimiento 5.1.14.2 y 5.2', 'Protocolo de asistencia y derivación, 10', 'Guion del módulo 6, escenas M6_E01 y M6_E04'],
  },
  {
    id: 'm6-copias',
    title: '4. Copias externas',
    summary: 'Referencias conocidas por vía restringida, sin búsquedas por parte de la niña ni promesas de borrado total.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Transmitir referencias conocidas; coordinar solicitudes o mecanismos de plataforma; no imponer búsqueda a la niña, acceder a cuentas ajenas ni prometer eliminación universal.',
        ],
        bullets: [
          'No se piden credenciales a familias, niñas o cuentas externas.',
          'No se usan herramientas no autorizadas ni reconocimiento facial para localizar copias.',
          'No se reenvía públicamente el material para pedir que se elimine.',
        ],
      },
    ],
    sources: ['Procedimiento 5.1.14.6', 'Guion del módulo 6, escena M6_E06'],
  },
  {
    id: 'm6-comunicacion',
    title: '5. Comunicación respetuosa',
    summary: 'Explicar acciones y límites por contacto seguro, sin pedir nada a cambio.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Explicar acciones y límites por contacto seguro, sin culpabilizar. No pedir disculpa pública, video correctivo, silencio o nuevo testimonio como condición de apoyo.',
        ],
        bullets: [
          'La comunicación pública la valoran los responsables, sin nombre, imagen ni detalles del caso.',
          'Una explicación privada a la niña, adecuada a su edad, no se reemplaza por una campaña.',
          'No se contacta automáticamente a un familiar que pueda aumentar el riesgo.',
        ],
      },
    ],
    sources: ['Protocolo de asistencia y derivación, 3 a 5', 'Guion del módulo 6, escenas M6_E05 y M6_E07'],
  },
  {
    id: 'm6-alternativas',
    title: '6. Alternativas',
    summary: 'No publicar o publicar contenido general independiente y revisado.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'No publicar; materiales generales; resultados agregados revisados; ilustración independiente sin rasgos ni relato de la persona. No asumir que recorte, desenfoque, avatar o IA garantizan anonimato.',
        ],
        bullets: [
          'No se reconstruye con IA a una persona que no desea exposición ni se genera una imagen a partir de la foto retirada.',
          'El calendario de una campaña no elimina la revisión ni justifica presionar.',
        ],
      },
    ],
    sources: ['Procedimiento 5.1.14.5', 'Guion del módulo 6, escenas M6_E08, M6_NO_REPUBLICAR y M6_CONTENIDO_ALTERNATIVO'],
  },
  {
    id: 'm6-archivo',
    title: '7. Archivo y seguimiento',
    summary: 'Detener reutilizaciones sin destruir registros, y seguir hasta una decisión fundada de cierre.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Detener nuevas publicaciones y usos programados; proteger registros que deban conservarse; no mantener bancos de imágenes sin controles; seguir pendientes y apoyos por roles competentes.',
        ],
        bullets: [
          'Retirar una publicación no equivale a cerrar el caso: se documenta lo confirmado, lo pendiente y lo desconocido.',
          'Una marca interna de no uso, si se propone, tiene acceso restringido y no es una lista pública de personas afectadas.',
          'Las imágenes, formularios de consentimiento y demás información sensible se almacenan, conservan y eliminan según normas institucionales.',
        ],
      },
    ],
    sources: ['Procedimiento 5.1.14.6', 'Protocolo de asistencia y derivación, 10.3 y 10.4', 'Guion del módulo 6, escenas M6_E09 y M6_E10'],
  },
];
