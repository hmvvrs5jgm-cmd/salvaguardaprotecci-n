// Herramientas del módulo 4 (guion «La información también protege» v1.0, apartado 18).
// El texto de cada tarjeta del guion se conserva; las secciones de apoyo citan sus fuentes.
// No se inventan plazos de conservación, sanciones automáticas ni nombres de herramientas.
// Los términos de notificación de la LOPDP (arts. 43 y 46) se citan como reglas legales verificadas el 23/10/2026;
// los aplican los roles competentes y nunca autorizan a esperar.

import type { Tool } from '../types';

export const herramientasM4: Tool[] = [
  {
    id: 'm4-compartir',
    title: 'Tarjeta 1. Antes de compartir',
    summary: 'Para qué, qué mínimo, quién lo necesita, quién autoriza, canal y permisos.',
    sections: [
      {
        heading: 'Preguntas',
        bullets: [
          '¿Para qué se necesita?',
          '¿Qué mínimo basta para esa finalidad?',
          '¿Quién lo necesita para cumplir su función?',
          '¿Quién autoriza?',
          '¿Por qué canal y con qué permisos?',
          '¿Debe quedar registro?',
        ],
        paragraphs: ['Si no se puede justificar, no enviar y consultar.'],
      },
      {
        heading: 'Canales',
        bullets: [
          'Solo repositorios y formatos institucionales autorizados, con control de acceso por persona usuaria.',
          'No se usan correos personales, mensajería no institucional ni dispositivos no seguros para información sensible.',
          'Un enlace en un repositorio institucional no es seguro por sí solo: deben estar definidos sus permisos y destinatarios.',
          'No se copian datos de un caso en herramientas públicas de IA, formularios externos o servicios no autorizados.',
          'La reproducción, impresión o difusión requiere autorización expresa del Punto Focal (PEP).',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 10.2, 10.3 y 10.5 (pasos 3 y 4)',
      'Guion del módulo 4, escenas M4_E01 y M4_E05',
    ],
  },
  {
    id: 'm4-identificacion',
    title: 'Tarjeta 2. Identificación indirecta',
    summary: 'Quitar el nombre no siempre basta: los detalles se combinan.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Iniciales, códigos, edades, comunidad, fecha, parentesco, institución o cifras pequeñas pueden combinarse para reconocer. Pseudonimizar no equivale automáticamente a anonimizar.',
        ],
        bullets: [
          'Elimina o generaliza los detalles innecesarios y revisa si el contexto aún identifica.',
          'Revisa la audiencia: lo que no identifica en un lugar puede identificar en una comunidad pequeña.',
          'Para informes y aprendizaje, describe mejoras y tendencias sin narrar una historia individual.',
        ],
      },
    ],
    sources: ['Protocolo de asistencia y derivación, 10.1 y 10.4', 'Guion del módulo 4, escena M4_E03'],
  },
  {
    id: 'm4-accesos',
    title: 'Tarjeta 3. Accesos por función',
    summary: 'Integrar el SIMT o tener jerarquía no concede acceso a todo.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'PEP gestiona el registro oficial; otras intervenciones dependen de finalidad, necesidad y autorización. Integrar el SIMT o tener jerarquía no concede acceso a todo. Personal y socios no tienen acceso general por defecto.',
        ],
      },
      {
        heading: 'Matriz de control de accesos (resumen)',
        table: {
          headers: ['Rol', 'Tipo de acceso', 'Información', 'Autoriza'],
          rows: [
            ['Punto Focal (PEP)', 'Total', 'Información completa del caso', 'Por rol'],
            ['PEP suplente', 'Condicionado', 'Información necesaria para la continuidad', 'PEP o Dirección País'],
            ['Integrantes del SIMT', 'Parcial', 'Información técnica necesaria', 'PEP'],
            ['Dirección País', 'Estratégico', 'Información agregada para gobernanza', 'PEP'],
            ['RR. HH. / Legal', 'Específico', 'Información limitada', 'PEP y Dirección País'],
            ['Donantes', 'Agregado', 'Sin datos personales', 'Dirección País'],
            ['Personal / socios', 'Ninguno por defecto', 'No aplica', '—'],
          ],
        },
        paragraphs: [
          'Ningún acceso sin registro y justificación: se registra quién accede, para qué y por cuánto tiempo. Una tarea concreta (por ejemplo, apoyar un traslado seguro) no da acceso al expediente: el Punto Focal puede preparar una instrucción operativa separada, con lo estrictamente necesario, sin relato ni tipo de caso, y registra quién la recibe, para qué y por cuánto tiempo.',
        ],
      },
      {
        heading: 'Registro formativo y expedientes reales',
        paragraphs: [
          'En este juego, solo el Punto Focal consulta las aprobaciones ajenas del registro formativo. Los expedientes reales de salvaguarda tienen su propio esquema institucional de accesos funcionales.',
        ],
      },
    ],
    sources: [
      'Plan de Salvaguarda FY2026, anexos 1 y 6 (necesidad de conocimiento)',
      'Protocolo de asistencia y derivación, 10.2, 10.5 (paso 3) y 10.5.1 (matriz de control de accesos)',
      'Guion del módulo 4, escenas M4_E02 y M4_E04',
    ],
  },
  {
    id: 'm4-exposicion',
    title: 'Tarjeta 4. Si hay una exposición',
    summary: 'No ampliarla, comunicarla y atender riesgos de protección mediante los responsables.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'No abrir por curiosidad, reenviar, capturar ni generar copias; comunicar por vía autorizada; aportar hechos mínimos; ejecutar solo contención autorizada; atender riesgos de protección mediante los responsables.',
        ],
        bullets: [
          'Borrar un mensaje no demuestra que no existan accesos o copias: no ocultes el incidente.',
          'No preguntes públicamente quién lo vio ni adviertas reenviando el contenido.',
          'Comunicar hechos no equivale a señalar culpabilidad ni imponer sanciones.',
          'Si hay peligro inmediato para alguien, la protección y la respuesta de emergencia no esperan a un análisis informático.',
          'No contactes por tu cuenta a la persona afectada: la comunicación y cualquier notificación externa las coordinan los roles competentes por un medio seguro.',
        ],
      },
      {
        heading: 'Términos legales que valoran los roles competentes',
        paragraphs: [
          'Tú alertas de inmediato por el canal institucional. Los roles autorizados contienen la exposición, preservan registros, documentan cuándo se conoció y valoran las notificaciones. Estos términos no son un permiso para esperar ni equivalen a «72 horas».',
        ],
        table: {
          headers: ['Comunicación', 'Regla legal resumida (LOPDP)'],
          rows: [
            [
              'Responsable a la Superintendencia de Protección de Datos y a ARCOTEL',
              'Tan pronto sea posible y como máximo en el término de cinco días desde que tenga constancia, salvo que sea improbable un riesgo para los derechos y libertades. Art. 43.',
            ],
            ['Encargado a responsable', 'Tan pronto sea posible y en el término de dos días desde que conozca la vulneración. Art. 43.'],
            [
              'Responsable a la persona afectada',
              'Sin dilación, en el término de tres días desde que conozca el riesgo para sus derechos y libertades, por una vía segura que no amplíe la exposición. Art. 46.',
            ],
          ],
        },
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 10.2',
      'Política 2.9 (obligación de reportar)',
      'Ley Orgánica de Protección de Datos Personales, arts. 43 y 46; Resolución SPDP-SPD-2026-0040-R',
      'Guion del módulo 4, escenas M4_E06 y M4_E08',
    ],
  },
  {
    id: 'm4-contener',
    title: 'Tarjeta 5. Contener y conservar',
    summary: 'Restringir la exposición no es destruir registros.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Restringir exposición no equivale a destruir registros. Preservación, retirada, revisión técnica y tratamiento de copias se coordinan por funciones competentes. No mantener una exposición activa como supuesta prueba.',
        ],
        bullets: [
          'No descargues copias en dispositivos personales ni inspecciones cuentas ajenas.',
          'Revocar un enlace no equivale a «todo resuelto»: el alcance sigue en evaluación.',
        ],
      },
      {
        heading: 'Conservación y eliminación',
        bullets: [
          'Tras el cierre y cumplidos los plazos institucionales y la normativa nacional, la información se elimina de forma segura.',
          'La eliminación la autoriza el PEP, se registra y se aplica a archivos digitales y físicos.',
          'Solo se conserva información mínima agregada, sin datos personales identificables, para estadística o aprendizaje.',
          'Las copias personales no son un archivo autorizado.',
        ],
        paragraphs: [
          'El plazo de conservación se fijará en una tabla institucional validada. Siete años es una propuesta interna en revisión, no un mínimo legal: mientras tanto se aplica la disposición institucional vigente.',
          'No se elimina información sujeta a una obligación de conservación, investigación, reclamación o proceso pendiente. El cierre administrativo de un caso no equivale al cierre de todos los procesos relacionados.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 10.3, 10.4 y 10.5 (pasos 6 y 7)',
      'Guion del módulo 4, escenas M4_E07, M4_CONTENCION y M4_E10',
    ],
  },
  {
    id: 'm4-reportar',
    title: 'Tarjeta 6. Reportar con información disponible',
    summary: 'Qué aportar al comunicar una exposición, también si el error es tuyo.',
    sections: [
      {
        heading: 'Qué aportar',
        bullets: [
          'Recurso o mensaje afectado.',
          'Canal.',
          'Momento conocido.',
          'Tipos de datos.',
          'Alcance conocido y desconocido.',
          'Acciones iniciales.',
          'Riesgos identificados.',
        ],
        paragraphs: [
          'No adjuntar copias completas si basta una referencia segura autorizada. Si el envío equivocado fue tuyo, comunícalo de inmediato con hechos y acciones realizadas: el silencio de los destinatarios no demuestra ausencia de exposición.',
        ],
      },
    ],
    sources: ['Procedimiento 5.2 (reporte)', 'Guion del módulo 4, escenas M4_E07 y M4_E09'],
  },
  {
    id: 'm4-aprendizaje',
    title: 'Tarjeta 7. Aprendizaje seguro',
    summary: 'Informar mejoras sin historias identificables.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Informar mejoras y tendencias sin historias identificables; revisar audiencia, contexto y combinaciones de datos. Un destinatario externo no recibe detalles de casos por interés narrativo.',
        ],
      },
    ],
    sources: ['Protocolo de asistencia y derivación, 10.4 y 10.5.1 (donantes: información agregada)', 'Guion del módulo 4, escenas M4_E03, M4_E04 y M4_E10'],
  },
];
