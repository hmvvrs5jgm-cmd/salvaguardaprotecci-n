// Herramientas de consulta (guion v1.1, apartado 15; prompt, apartados 2.2 y 5).
// Cada herramienta cita sus fuentes. No contienen teléfonos, autoridades ni personas inventadas.

import type { Tool, ToolId } from './types';

export const herramientas: Tool[] = [
  {
    id: 'escucha',
    title: 'Guía de escucha',
    summary: 'Cómo recibir una preocupación sin culpabilizar, interrogar ni prometer lo que no puedes cumplir.',
    sections: [
      {
        heading: 'Al escuchar',
        bullets: [
          'Agradece que la persona se acerque y ofrece un espacio discreto donde se sienta segura; pregúntale dónde prefiere hablar.',
          'Escucha sin culpabilizar ni cuestionar su relato. Escuchar no implica determinar culpabilidad.',
          'No pidas detalles íntimos ni reconstruyas los hechos: bastan preguntas mínimas para identificar necesidades y activar la respuesta.',
          'Evita hacer repetir el relato innecesariamente y no presiones sus decisiones.',
        ],
      },
      {
        heading: 'Confidencialidad con límites',
        bullets: [
          'No prometas secreto absoluto: es incompatible con el deber de reporte.',
          'Explica qué información necesitas comunicar, por qué vía y cómo se restringe su acceso a quienes deban atenderla.',
          'Pregunta por sus preocupaciones para reducir riesgos y no garantices resultados que no controlas, como obtener una plaza.',
        ],
      },
      {
        heading: 'Si te equivocas',
        paragraphs: [
          'Puedes reparar: reconoce lo que dijiste y corrígelo con respeto. Por ejemplo, aclarar que no puedes prometer secreto absoluto y explicar los límites.',
        ],
      },
    ],
    sources: [
      'PPT, diapositivas 26–28 y 33 (no revictimización y enfoque centrado en la persona sobreviviente)',
      'PPT, diapositiva 48 (promesas inapropiadas sobre la confidencialidad)',
      'Procedimiento 5.1.14.7 (confidencialidad)',
      'Guion, escenas E01 y E02',
    ],
  },
  {
    id: 'seguridad',
    title: 'Tarjeta de seguridad y contacto',
    summary: 'Preguntas mínimas para atender la seguridad inmediata y acordar un contacto seguro.',
    sections: [
      {
        heading: 'Preguntas mínimas',
        bullets: [
          '¿Te sientes segura o seguro ahora?',
          '¿Hay algo que necesites para salir de aquí con tranquilidad?',
          '¿De qué manera sería seguro contactarte, si necesitas seguimiento?',
        ],
      },
      {
        heading: 'Dentro de tu función',
        bullets: [
          'Si hubiera peligro inmediato o necesidad urgente de atención, activa la respuesta de emergencia y los servicios competentes según la ruta local. La seguridad y la atención no esperan una clasificación ni la conclusión de una investigación.',
          'No improvises medidas mediante confrontación: no contactes a la persona señalada.',
          'Explica con honestidad los límites de la protección disponible.',
          'Registra la preferencia de contacto solo por la vía restringida, con acceso para quienes necesitan actuar.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.3.1.3.4.1 (seguridad y límites de la protección)',
      'Guion, escena E03 y panel de transferencia',
    ],
  },
  {
    id: 'reporte',
    title: 'Guía de reporte e información mínima',
    summary: 'Cuándo, por dónde y qué comunicar, sin investigar ni difundir.',
    sections: [
      {
        heading: 'Cuándo',
        paragraphs: [
          'Comunica la preocupación dentro de 24 horas desde que la conoces, con la información disponible. No necesitas pruebas, certeza ni una clasificación previa.',
        ],
      },
      {
        heading: 'Por dónde',
        paragraphs: [
          'Por los mecanismos institucionales. Si no es seguro o adecuado usar el canal habitual, existen otras vías institucionales, incluidas vías anónimas. Consulta el panel «Cómo comunicar una preocupación real».',
        ],
      },
      {
        heading: 'Qué incluir',
        bullets: [
          'Fecha, hora y lugar en que se recibió la preocupación.',
          'Naturaleza de lo comunicado: lo que la persona manifestó, sin conclusiones de culpabilidad.',
          'Acciones en curso para mantener a salvo a la persona.',
          'Ayuda o acciones necesarias.',
          'Lo que todavía se desconoce, sin llenarlo mediante investigación personal.',
        ],
      },
      {
        heading: 'Qué no incluir',
        bullets: [
          'Suposiciones, rumores u opiniones.',
          'Información personal innecesaria sobre la vida privada o la familia.',
        ],
      },
      {
        heading: 'Cómo compartir',
        paragraphs: [
          'Solo por la vía restringida, con quienes necesitan conocerla para actuar. Se limita el acceso y se suprimen los datos identificativos al compartir.',
        ],
      },
    ],
    sources: [
      'Política 2.9 y 2.9.2.1; Procedimiento 5.2.1 y 5.2.2',
      'Procedimiento 5.2.4.3, 5.2.4.4 y 5.2.4.7 (plazo, contenido del reporte y acceso limitado)',
      'Guion, escenas E04 a E06',
    ],
  },
  {
    id: 'roles',
    title: 'Roles, niveles y plazos',
    summary: 'Definiciones, quién decide qué y la tarjeta de los tres niveles. No necesitas clasificar para reportar.',
    sections: [
      {
        heading: 'Definiciones',
        bullets: [
          'Explotación sexual: «cualquier abuso real o intento de abuso de una posición de vulnerabilidad, poder diferencial o confianza con fines sexuales» (Política 3.4.1). No es necesario que el hecho se haya consumado.',
          'Está prohibido el intercambio de dinero, empleo, bienes o servicios por sexo, incluido el intercambio de ayuda que se debe a los beneficiarios (Política, nota 1, principio 3).',
        ],
      },
      {
        heading: 'Tu rol',
        paragraphs: [
          'Escuchar, atender riesgos dentro de tu función y comunicar la preocupación. La clasificación, la investigación y la gestión especializada corresponden a los roles designados. Las investigaciones administrativas las realizan profesionales experimentados y cualificados.',
        ],
      },
      {
        heading: 'Tarjeta de los tres niveles',
        paragraphs: [
          'Es un recurso de consulta. No es una decisión que debas acertar antes de comunicar: el referente determina la clasificación aplicable.',
        ],
        bullets: [
          'Nivel 1: incidentes de protección infantil no cometidos por personal o representantes de ChildFund, sino por miembros de la comunidad o agencias externas no afiliadas. Puede incluir daño físico, emocional, sexual o psicológico grave, lesiones o la muerte. Este nivel no significa daño leve. La responsabilidad de la gestión recae en el socio local, que notifica y coordina con el Punto Focal de ChildFund.',
          'Nivel 2: violaciones o incumplimientos de la política, el procedimiento, el protocolo de comportamiento o el código de conducta por parte de personal o representantes, que colocan a participantes en riesgo directo de daño o abuso, cuando se cree que no se ha producido un daño real. La valoración y gestión corresponden a los responsables establecidos.',
          'Nivel 3: violaciones graves, reales o sospechadas, cometidas por personal o representantes que provocan daño, incluida cualquier forma de violencia, explotación, abuso o negligencia; también la muerte o lesión grave de un participante bajo el cuidado temporal de ChildFund o en una actividad organizada o facilitada por ChildFund.',
          'El caso de este episodio —una preocupación sobre una persona vinculada al programa respecto de una participante adulta— no es de nivel 1. No te corresponde decidir entre nivel 2 o 3.',
        ],
      },
      {
        heading: 'Plazos que no deben confundirse',
        paragraphs: ['Ninguno de estos plazos autoriza a demorar la seguridad, la atención ni la comunicación inicial.'],
        table: {
          headers: ['Quién', 'Qué', 'Plazo'],
          rows: [
            ['Personal o representante que conoce la preocupación', 'Comunicarla por el mecanismo institucional', '24 horas'],
            [
              'Gerente de ChildFund que recibe una preocupación',
              'Contactar con Cumplimiento Global (no traslada tu propio deber de comunicar en 24 horas)',
              '5 días laborables',
            ],
            ['Roles competentes, nivel 3', 'Notificación según el escalamiento', '24 horas'],
            ['Roles competentes, nivel 2', 'Notificación a ChildFund según el escalamiento', '48 horas'],
            [
              'Socio local, nivel 1',
              'Notificar al Punto Focal de ChildFund casos de daño grave que amenacen la seguridad y el bienestar del niño o joven',
              '72 horas',
            ],
          ],
        },
      },
    ],
    sources: [
      'Política 2.9, 2.9.1, 2.13.1 y 3.4.1; nota 1 de la política',
      'Procedimiento 5.2.1 y 5.2.3 (definiciones y escalamiento por niveles)',
      'Guion, apartado 20',
    ],
  },
  {
    id: 'apoyos',
    title: 'Opciones de apoyo',
    summary: 'Categorías de apoyo según necesidades, con consentimiento y sin condiciones indebidas.',
    sections: [
      {
        heading: 'Posibles apoyos según necesidades y ruta',
        bullets: [
          'Seguridad.',
          'Atención médica.',
          'Apoyo psicosocial.',
          'Orientación o asistencia jurídica.',
          'Asistencia material básica.',
        ],
        paragraphs: [
          'La elección de servicios y la información a compartir se tratan con consentimiento cuando corresponde y explicando las obligaciones aplicables. No todos los casos requieren todos los servicios.',
        ],
      },
      {
        heading: 'Sin condiciones indebidas',
        bullets: [
          'El apoyo no se condiciona a pruebas, a participar en una investigación ni a una denuncia penal.',
          'Si lo ocurrido pudiera constituir un delito, los roles competentes exploran con la persona si desea apoyo para denunciarlo ante las autoridades. Siendo una persona adulta, esa decisión es suya y el apoyo no depende de ella. En el caso de un niño, la denuncia es obligatoria.',
          'Las obligaciones aplicables las explican los roles competentes.',
        ],
      },
      {
        heading: 'Información general sobre atención médica',
        paragraphs: [
          'En casos de abuso sexual, es importante buscar atención médica cuanto antes; algunos tratamientos, como la profilaxis posexposición al VIH y la anticoncepción de emergencia, deben iniciarse dentro de las 72 horas. Este dato no describe el caso de Mariela, en el que no se comunicó contacto físico, y no es un plazo de reporte.',
        ],
      },
      {
        heading: 'Directorio local',
        paragraphs: [
          'La oficina de país mantiene un mapa y una lista actualizada de proveedores de servicios locales. Consulta el directorio vigente con el Punto Focal; los nombres de entidades no se publican aquí sin verificación.',
        ],
      },
    ],
    sources: [
      'Política 2.10.3, 2.10.4 y 2.10.5',
      'Procedimiento 5.3.1.3.1 a 5.3.1.3.5',
      'PPT, diapositivas 32, 55 y 66–67',
      'Guion, escena E07 y panel de apoyos',
    ],
  },
];

export function herramienta(id: ToolId): Tool {
  const t = herramientas.find((h) => h.id === id);
  if (!t) throw new Error(`Herramienta desconocida: ${id}`);
  return t;
}

/** Texto del panel de apoyos de E07 (guion v1.1, apartado 12). */
export const panelApoyos = {
  intro:
    'Posibles apoyos según necesidades y ruta: seguridad, atención médica, apoyo psicosocial, orientación jurídica o asistencia material. La elección de servicios y la información a compartir se tratan con consentimiento cuando corresponde y explicando las obligaciones aplicables. No todos los casos requieren todos los servicios.',
  denuncia:
    'Si lo ocurrido pudiera constituir un delito, los roles competentes exploran contigo si deseas apoyo para denunciarlo ante las autoridades. Siendo una persona adulta, esa decisión es tuya y el apoyo no depende de ella.',
  medica:
    'En casos de abuso sexual, es importante buscar atención médica cuanto antes; algunos tratamientos, como la profilaxis posexposición al VIH y la anticoncepción de emergencia, deben iniciarse dentro de las 72 horas.',
  medicaAclaracion:
    'Este dato no describe el caso de Mariela, en el que no se comunicó contacto físico, y no es un plazo de reporte.',
};
