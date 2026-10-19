// Herramientas del módulo 3 (guion «Antes de abrir las puertas» v1.0, apartado 18).
// La ficha de prevención es una herramienta propuesta para el juego, no un formulario institucional aprobado.
// No se fijan proporciones de personal, requisitos de transporte ni plazos que las fuentes no establecen.

import type { Tool } from '../types';

export const herramientasM3: Tool[] = [
  {
    id: 'm3-ficha',
    title: '1. Ficha de prevención',
    summary: 'Riesgo, medida, responsable, evidencia, pendiente y condición de inicio o reanudación.',
    sections: [
      {
        heading: 'Para cada riesgo',
        bullets: [
          'Riesgo identificado (lugar, personas, actividades, traslados y datos).',
          'Medida preventiva.',
          'Responsable.',
          'Evidencia de que la medida está implementada.',
          'Pendiente.',
          'Condición de inicio o reanudación.',
        ],
      },
      {
        heading: 'Ficha de trabajo inicial de la simulación',
        table: {
          headers: ['Aspecto', 'Condición por verificar', 'Responsable ficticio'],
          rows: [
            ['Espacio', 'Acceso, circulación, salidas y necesidades de apoyo', 'Elena y equipo'],
            ['Supervisión', 'Personal preparado, presencia y distribución suficientes', 'Elena'],
            ['Traslados y salida', 'Condiciones verificadas y entrega autorizada', 'Nicolás y personal designado'],
            ['Participación', 'Información comprensible, voluntariedad y requisitos documentales', 'Equipo facilitador'],
            ['Visitantes', 'Autorización, controles, orientación y acompañamiento', 'Responsable de visitas'],
            ['Imágenes y datos', 'Alcance del permiso, necesidad y almacenamiento seguro', 'Comunicaciones y responsables'],
            ['Respuesta', 'Mecanismos de ayuda, emergencia y reporte conocidos', 'Equipo y Referente según función'],
          ],
        },
      },
      {
        heading: 'Estados',
        bullets: ['Pendiente de verificar.', 'Verificado.', 'No viable.', 'Suspendido.'],
        paragraphs: [
          'Una agenda o una autorización firmada no demuestran que las medidas estén implementadas. «Verificado» describe la simulación; no es una certificación de seguridad real.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.4 (evaluación de riesgos) y 5.1.9 (programas seguros)',
      'Procedimiento 5.1.11.2 (evaluación del riesgo de participación infantil)',
      'Guion del módulo 3, escena M3_E01',
    ],
  },
  {
    id: 'm3-supervision',
    title: '2. Supervisión',
    summary: 'Personal preparado, distribución y contingencias; regla de dos adultos más valoración de suficiencia.',
    sections: [
      {
        heading: 'Regla de los dos adultos',
        paragraphs: [
          'Dos o más personas adultas supervisan todas las actividades con niñas, niños y adolescentes y están siempre visibles y presentes.',
          'No significa que dos personas adultas basten para cualquier cantidad de participantes, espacio o necesidad: la suficiencia se valora en cada actividad.',
        ],
      },
      {
        heading: 'Cuando cambia el equipo',
        bullets: [
          'Una puerta abierta no reemplaza una supervisión adecuada.',
          'Estar presente no convierte a alguien en personal autorizado, preparado y sujeto a los controles requeridos.',
          'El liderazgo adolescente no sustituye la supervisión ni transfiere la responsabilidad de cuidado.',
          'Si no hay personal suficiente, se reorganiza en un espacio común, se espera un relevo autorizado o se reduce o reprograma esa parte, sin dejar a nadie sin cuidado.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.3 (Protocolo de comportamiento: regla de los «dos adultos» y supervisión adecuada)',
      'Guion del módulo 3, escenas M3_E02 y M3_E09',
    ],
  },
  {
    id: 'm3-participacion',
    title: '3. Participación',
    summary: 'Información clara, requisitos de autorización, voluntariedad, derecho a pasar y apoyos accesibles.',
    sections: [
      {
        heading: 'Criterios',
        bullets: [
          'La participación es voluntaria y se acompaña de un consentimiento por escrito para la actividad.',
          'El consentimiento para participar no equivale a permiso para fotografías, publicación, transporte o nuevas actividades.',
          'Información comprensible y adecuada a la edad; derecho a pasar en cualquier dinámica.',
          'Las adaptaciones se acuerdan con quien las necesita, sin exponerlo ni improvisar asistencias físicas. No se presume una condición ni que todas las personas requieren el mismo apoyo.',
          'Si no puede confirmarse una adaptación segura, se replantea el componente con una alternativa inclusiva; no se excluye a nadie para salvar la agenda.',
          'Evita crear expectativas poco realistas o hacer promesas que no se puedan cumplir, e informa después de la actividad.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.9.5 y 5.1.11.3–5.1.11.8',
      'Guion del módulo 3, escenas M3_E03, M3_E03B y M3_INICIO_ADAPTADO',
    ],
  },
  {
    id: 'm3-visitas',
    title: '4. Visitas e imágenes',
    summary: 'Controles separados, acompañamiento, alcance de permisos y revisión de exposición.',
    sections: [
      {
        heading: 'Visitas',
        bullets: [
          'Las visitas se coordinan con antelación y siguen el procedimiento y la lista de verificación de visitas.',
          'ChildFund puede rechazar visitas no anunciadas; la decisión no corresponde a quien está en la actividad.',
          'La persona visitante siempre está acompañada por personal autorizado, no intercambia información de contacto y sigue los procedimientos de consentimiento fotográfico.',
          'La supervisión de una visita nunca se delega en niñas, niños o adolescentes.',
          'Se aplican controles sin acusar ni estigmatizar: una relación con un donante no crea una excepción.',
        ],
      },
      {
        heading: 'Imágenes y datos',
        bullets: [
          'Participación e imagen son decisiones diferenciadas: no se condiciona la participación a aparecer en fotografías.',
          'Antes de publicar se obtiene consentimiento informado y, cuando el sujeto principal es una niña o un niño, también el consentimiento escrito de su madre, padre o tutor. Un permiso previo se revisa por propósito, vigencia y alcance.',
          'Difuminar un rostro no elimina toda posibilidad de identificación: también importan la voz, el uniforme, la ubicación, los nombres y el contexto.',
          'Una alternativa, como fotografiar los materiales, puede cumplir el objetivo comunicacional sin excluir ni señalar a nadie.',
          'Los datos e imágenes se guardan de forma segura y solo acceden las personas autorizadas.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.10 (visitas seguras), en especial 5.1.10.7 y 5.1.10.12',
      'Procedimiento 5.1.14.4–5.1.14.7 (consentimiento, dignidad y seguridad de la información)',
      'Guion del módulo 3, escenas M3_E05 y M3_E06',
    ],
  },
  {
    id: 'm3-transporte',
    title: '5. Transporte y salida',
    summary: 'Verificación por responsables, cambios, registros mínimos y entrega autorizada.',
    sections: [
      {
        heading: 'Si cambia el transporte',
        bullets: [
          'Se comunica el cambio y no se acepta el nuevo traslado hasta verificar proveedor, conductor, vehículo, capacidad, acompañamiento, ruta, comunicación y autorización conforme a los requisitos aplicables.',
          'La confianza personal o una firma de último minuto no sustituyen las verificaciones.',
          'El grupo permanece acompañado durante la coordinación. Si no se confirma una alternativa, no se declara resuelto el regreso.',
          'Los viajes de niñas, niños y jóvenes facilitados por ChildFund siguen las directrices de participación en eventos y su documentación archivada.',
        ],
      },
      {
        heading: 'Entrega al finalizar',
        bullets: [
          'La actividad termina cuando la salida es segura.',
          'Reconocer a alguien no confirma su autorización. Se verifican la identidad y la autorización por el mecanismo previsto, con acceso restringido.',
          'No se distribuyen documentos de identidad ni datos personales para resolver una verificación.',
          'Si el niño o la niña expresa temor o hay conflicto con quien recogería, no se hace un contacto automático que lo exponga: se activa la valoración de los responsables. No se decide custodia ni se usa coerción física.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.11.1 (directrices de viaje)',
      'Procedimiento 5.1.14.6–5.1.14.7 (información sensible y confidencialidad)',
      'Guion del módulo 3, escenas M3_E04 y M3_E10',
    ],
  },
  {
    id: 'm3-pausar',
    title: '6. Pausar o suspender',
    summary: 'Detener el componente inseguro, mantener cuidado, informar y validar condiciones antes de reiniciar.',
    sections: [
      {
        heading: 'Respuesta proporcional',
        bullets: [
          'Inicia solo los componentes con condiciones verificadas; suspende o reprograma los que no las tienen.',
          'Si tampoco se puede garantizar el resto, se suspende o reprograma la jornada completa.',
          'Las condiciones se mantienen durante toda la actividad: un cambio a mitad de jornada exige pausar lo afectado.',
          'Suspender no equivale a dejar a nadie sin cuidado: se comunica, se mantiene el acompañamiento y se coordina una entrega segura.',
          'La persona responsable de la actividad valida la adaptación y la reanudación, con asesoría de salvaguarda cuando se necesita. Puedes detener una acción insegura y pedir apoyo.',
          'Adaptar o suspender puede ser la decisión correcta: completar la agenda no es el indicador de éxito.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.9.1–5.1.9.3 (No Hacer Daño e interés superior)',
      'Procedimiento 5.1.11.5 (detener o interrumpir la actividad para prestar apoyo)',
      'Guion del módulo 3, escenas M3_E08, M3_INICIO_ADAPTADO, M3_SUSPENSION, M3_E09 y M3_E09S',
    ],
  },
  {
    id: 'm3-preocupacion',
    title: '7. Si aparece una preocupación',
    summary: 'Seguridad, escucha, reporte oportuno, privacidad y activación de apoyos sin investigar.',
    sections: [
      {
        heading: 'Durante la actividad',
        bullets: [
          'Las dinámicas no piden relatos personales de violencia: se trabaja con situaciones ficticias, con derecho a pasar y formas seguras de pedir ayuda.',
          'No se puede prometer confidencialidad grupal absoluta.',
          'Si alguien comunica espontáneamente una preocupación: escucha sin interrogar, atiende necesidades inmediatas, explica los límites de la confidencialidad y activa la ruta. No pidas que lo repita ante el grupo.',
          'Si hay peligro inmediato, activa la respuesta de emergencia (911).',
        ],
      },
      {
        heading: 'Después',
        bullets: [
          'Comunica la preocupación por el mecanismo institucional dentro de 24 horas, aunque no haya daño consumado o la condición ya se haya corregido.',
          'Registra la mejora y los pendientes por los canales pertinentes, con información restringida y sin nombres ante todo el equipo.',
          'En el módulo 2, «Gracias por escucharme», se practica la escucha y la derivación; no necesitas haberlo aprobado.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.1.11.4–5.1.11.5 y 5.2 (reporte)',
      'Política 2.9 (obligación de reportar)',
      'Guion del módulo 3, escena M3_E07 y subescena M3_REVELACION',
    ],
  },
];
