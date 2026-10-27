// Herramientas del módulo 2 (guion «Gracias por escucharme» v1.0, apartado 18).
// El texto de cada tarjeta del guion se conserva; las secciones de apoyo citan sus fuentes.
// No se publican nombres de servicios del directorio interno ni contactos no verificados.

import { avisoServicios, serviciosPublicos } from '../../config/canales';
import type { Tool } from '../types';

const lineaServicio = (s: (typeof serviciosPublicos)[number]) =>
  `${s.nombre}${s.contacto ? ` (${s.contacto})` : ''}: ${s.descripcion}`;

export const herramientasM2: Tool[] = [
  {
    id: 'm2-escucha',
    title: 'Tarjeta 1. Escucha inicial',
    summary: 'Una frase para recibir la comunicación de una adolescente y explicar los límites de la confidencialidad.',
    sections: [
      {
        heading: 'Frase de referencia',
        paragraphs: [
          '«Gracias por contármelo. No es tu culpa. Puedes hablar sin dar detalles que no quieras. Necesito comunicar la preocupación para buscar protección; te explicaré los pasos».',
        ],
      },
      {
        heading: 'Al escuchar a una niña, niño o adolescente',
        bullets: [
          'Usa un lenguaje claro, sencillo y adecuado a la edad, sin términos técnicos, culpabilizantes ni alarmistas.',
          'Ofrece un espacio discreto que mantenga las condiciones de supervisión del centro: privacidad no es aislamiento.',
          'Escucha lo que comunica espontáneamente. No reconstruyas los hechos ni preguntes cuántas veces pasó.',
          'No pidas que muestre lesiones, no tomes fotografías y no solicites demostraciones.',
          'No prometas secreto absoluto. Explica a quién comunicarás la preocupación, que no será a todo el equipo, y pregunta qué podría ponerla en riesgo.',
          'Si te equivocas, repara: reconoce lo que dijiste y corrígelo con respeto.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 3.3, 3.4, 5.1.1 y 8',
      'Procedimiento 5.1.14.7 (confidencialidad)',
      'PPT, diapositivas 26–28 y 48',
      'Guion del módulo 2, escenas M2_E01 a M2_E03',
    ],
  },
  {
    id: 'm2-necesidades',
    title: 'Tarjeta 2. Necesidades inmediatas',
    summary: 'Preguntas mínimas sobre seguridad y atención urgente, y qué hacer dentro de tu rol.',
    sections: [
      {
        heading: 'Preguntar solo lo necesario',
        paragraphs: [
          'Preguntar por seguridad actual, preocupación por la salida y atención urgente. No examinar, diagnosticar ni completar una entrevista de hechos.',
        ],
        bullets: [
          '¿Te sientes segura ahora?',
          '¿Hay algo que te preocupe al salir de aquí?',
          '¿Necesitas atención de salud en este momento?',
        ],
      },
      {
        heading: 'Si hay un riesgo próximo',
        bullets: [
          'Activa de inmediato el mecanismo de salvaguarda y solicita coordinación de protección antes de la salida.',
          'Si el peligro es inminente, activa la respuesta de emergencia (911) sin esperar una autorización que demore la protección. Una llamada al Punto Focal no reemplaza a emergencias.',
          'Mantén acompañamiento seguro dentro de las condiciones del centro mientras los responsables y las autoridades competentes indican medidas.',
          'No improvises acogimiento, custodia ni traslados personales. No hace falta una lesión visible ni una entrevista extensa para activar ayuda.',
          'La seguridad y la atención no esperan una clasificación del nivel ni la conclusión de una investigación.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 3.5, 6.1 (fase 1) y 8',
      'Capítulo III (línea 911)',
      'Guion del módulo 2, escena M2_E04 y subescena M2_URGENTE',
    ],
  },
  {
    id: 'm2-familia',
    title: 'Tarjeta 3. Familia y redes',
    summary: 'Cómo considerar a las personas que la adolescente propone, sin contactar automáticamente a nadie.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Escuchar a quién propone la adolescente; considerar riesgos y conflictos; no contactar automáticamente; coordinar con el Referente y las autoridades competentes cuando corresponda.',
        ],
        bullets: [
          'Nombrar una persona de confianza no autoriza una divulgación total ni confirma que el contacto sea seguro.',
          'Descartar a toda la red sin valoración puede perder un apoyo protector.',
          'La coordinación con la persona adulta responsable se promueve siempre que sea posible y seguro, salvo cuando pueda representar un riesgo para la niña, niño o adolescente.',
          'Cuando el representante legal es presunto agresor o existe conflicto de intereses, se activan las rutas de protección especial con las autoridades competentes. No se pide su firma ni se le informa automáticamente. No se le contacta ni se le entrega información si ello aumenta el riesgo.',
          'Pertenecer al hogar no convierte por sí solo a toda la familia en insegura: con los roles competentes se identifica una persona protectora segura.',
          'Tú no decides custodia, traslado ni contacto: comunicas la preferencia y el temor al Referente.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 4.2 y 5.1.1',
      'Respuestas revisadas del Punto Focal, 23/10/2026, punto 2.2',
      'Guion del módulo 2, escena M2_E05',
    ],
  },
  {
    id: 'm2-reporte',
    title: 'Tarjeta 4. Reporte y apoyo',
    summary: 'Comunicar por el canal institucional y distinguir lo obligatorio de lo que se decide con participación.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Comunicar por canal institucional sin exigir pruebas. Explicar qué actuaciones son obligatorias y qué opciones de asistencia pueden decidirse con información y participación adecuada a la edad.',
        ],
      },
      {
        heading: 'Comunicar',
        bullets: [
          'Comunica la preocupación dentro de 24 horas desde que la conoces, con la información disponible. No necesitas pruebas, certeza ni clasificar antes de comunicar.',
          'Comparte por el canal restringido solo hechos comunicados, riesgo, acciones activadas, necesidades y preferencias. Consigna lo desconocido como no conocido, sin obtenerlo mediante entrevistas.',
          'En una organización socia, se activa el punto focal del socio, que informa y se articula con el Punto Focal de ChildFund conforme a la ruta. La jerarquía interna no debe impedir un reporte oportuno ni una respuesta urgente.',
          'La violencia en el hogar de una adolescente por una persona no vinculada a ChildFund ni a un socio puede corresponder al nivel 1 de la ruta. El nivel 1 no significa daño leve, y no te corresponde clasificar.',
        ],
      },
      {
        heading: 'Información, comprensión y decisión',
        bullets: [
          'Una firma no reemplaza información comprensible ni participación.',
          'En adolescentes se aplica la autonomía progresiva, valorada caso a caso. Siempre que sea posible y seguro se promueve la participación del representante legal; el consentimiento de la adolescente puede ser suficiente cuando la normativa y la valoración del riesgo lo permitan.',
          'Quién puede consentir cada intervención lo valoran los responsables, no tú. La falta de una firma no se utiliza para aplazar una emergencia.',
          'En delitos que afectan a niñas, niños y adolescentes existen obligaciones de denuncia. Los roles competentes las aplican y las explican; el retiro del consentimiento no anula las obligaciones de protección.',
        ],
      },
    ],
    sources: [
      'Política 2.9 y 2.9.2.1; Procedimiento 5.2.1, 5.2.2 y 5.2.3',
      'Protocolo de asistencia y derivación, 4.1–4.3, 6 y 10',
      'Ruta gráfica de respuesta y derivación (niveles)',
      'Guion del módulo 2, escenas M2_E06 y M2_E07',
    ],
  },
  {
    id: 'm2-derivacion',
    title: 'Tarjeta 5. Derivación segura',
    summary: 'Qué condiciones comprobar para que una derivación sea viable, y qué hacer si no hay cupo.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Verificar pertinencia, recepción, condiciones de acceso, información mínima y acompañamiento/traslado autorizado. Si no hay cupo, mantener la respuesta de protección y escalar la barrera.',
        ],
      },
      {
        heading: 'Ficha de verificación',
        bullets: [
          'Servicio pertinente.',
          'Recepción confirmada por canal autorizado.',
          'Horario.',
          'Accesibilidad y costos.',
          'Traslado o acompañamiento autorizado.',
          'Información mínima acordada.',
        ],
        paragraphs: [
          'Cada condición queda comprobada o con un responsable y una acción pendiente. Una ficha incompleta no se marca como derivación recibida. Entregar un contacto no verifica acceso.',
        ],
      },
      {
        heading: 'Estados de la derivación',
        bullets: [
          'No iniciada.',
          'En coordinación.',
          'Pendiente por barrera.',
          'Recepción confirmada.',
        ],
        paragraphs: ['Ninguno de estos estados equivale a un caso cerrado. Nunca se cierra un caso por falta de cupo.'],
      },
      {
        heading: 'Tu parte',
        paragraphs: [
          'Las derivaciones las coordina el Punto Focal. Tú comunicas las barreras y apoyas en las tareas asignadas, sin improvisar transporte ni recepción y sin hacer circular el relato por una lista de contactos.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 6.1 (fases 3 y 4), 8 y 10',
      'Guion del módulo 2, escena M2_E08 y subescenas M2_VERIFICAR y M2_SIN_SERVICIO',
    ],
  },
  {
    id: 'm2-seguimiento',
    title: 'Tarjeta 6. Seguimiento',
    summary: 'Un seguimiento seguro, además de oportuno, que no interpreta una cita como cierre.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Acordar canal seguro, confirmar recepción, identificar barreras nuevas y transmitirlas al responsable. No exigir informes clínicos ni interpretar una cita como cierre.',
        ],
        bullets: [
          'Si un teléfono se ha identificado como inseguro, no dejes mensajes, avisos ni notificaciones con detalles.',
          'El seguimiento voluntario sobre apoyos se acuerda con la adolescente; las obligaciones de protección se mantienen por los roles competentes.',
          'Comprobar recepción no autoriza acceso a notas clínicas ni información íntima.',
          'El cierre corresponde a los responsables y a los criterios de la ruta.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 6.1 (fase 5) y 10',
      'Guion del módulo 2, escenas M2_E09 y M2_E10',
    ],
  },
  {
    id: 'm2-servicios',
    title: 'Servicios de protección',
    summary: 'Servicios públicos que pueden comunicarse como alternativas. Las derivaciones las coordina el Punto Focal.',
    sections: [
      {
        heading: 'Servicios que pueden comunicarse',
        paragraphs: [avisoServicios],
        bullets: serviciosPublicos.filter((s) => s.estado === 'verificado').map(lineaServicio),
      },
      {
        heading: 'Niñas, niños y adolescentes',
        bullets: [
          'La asistencia prioriza la protección integral y la atención psicosocial, con personal capacitado y lenguaje adecuado a la edad.',
          'Las Juntas de Protección de Derechos dictan medidas de protección. Las rutas interinstitucionales las activan los responsables.',
          'Si el peligro es inmediato, se llama al 911 sin esperar trámites.',
        ],
      },
      {
        heading: 'Directorio interno',
        paragraphs: [
          'La oficina de país mantiene un mapeo de servicios de uso interno. Se consulta a través del Punto Focal y no se publica aquí.',
        ],
      },
    ],
    sources: [
      'Capítulo III: vías de denuncia y servicios de protección en Ecuador',
      'Protocolo de asistencia y derivación, 5.1.1 y 9',
    ],
  },
];
