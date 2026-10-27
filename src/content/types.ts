// Tipos del contenido narrativo y de evaluación.
// El contenido vive en datos tipados (un único origen) y los componentes solo lo presentan.
// Cada módulo (episodio) es un objeto Episode independiente con IDs propios (M1 sin prefijo, M2 con «M2_»).

export type RoleId = 'cf' | 'socio';
export const ROLES: readonly RoleId[] = ['cf', 'socio'];

/** Texto común o variante condicionada por rol. */
export type RoleText = string | { cf: string; socio: string };

export type Speaker =
  | 'narracion'
  | 'tu'
  | 'mariela'
  | 'elena'
  | 'referente'
  | 'lucia'
  | 'profesional'
  | 'nicolas'
  | 'camila'
  | 'diego'
  | 'visitante'
  | 'comunicaciones'
  | 'colega'
  | 'simt'
  | 'soporte'
  | 'documento'
  | 'paula'
  | 'alma'
  | 'valeria';

/** Pose del personaje mientras habla (las ilustraciones tienen tres poses por personaje). */
export type Pose = 'atenta' | 'pensativa' | 'explica';

export interface Line {
  id: string;
  speaker: Speaker;
  text: RoleText;
  /**
   * true: diálogo literal del guion (entre comillas en el guion; se verifica con scripts/check-guion.ts).
   * false: indicación de pantalla convertida en narración o texto de interfaz (ver docs/cambios-editoriales.md).
   */
  literal: boolean;
  /** Pose de quien habla; por defecto «explica». */
  pose?: Pose;
}

export type SceneId = string;
export type DecisionId = string;
/** Nodo del grafo: una escena o el cierre del módulo. */
export type NodeId = string;
export const CIERRE = 'CIERRE';

/** Tipos de resultado de una opción, tomados de los guiones (prompt, apartado 5.1). */
export type Outcome =
  | { type: 'avanza'; next: NodeId }
  | { type: 'repara_y_avanza'; next: NodeId; repair: Line[]; repairFollowUp?: Line[] }
  | { type: 'pausa_y_vuelve'; pauseNote: string }
  | { type: 'reintenta' }
  | { type: 'complementa_y_avanza'; next: NodeId; complementOptionId: string; complement: Line[] }
  /** Respuesta inadecuada que conduce a una escena de reparación obligatoria (módulo 2, M2_REPARAR_DERIVACION). */
  | { type: 'redirige_a_reparacion'; next: NodeId };

export type OutcomeType = Outcome['type'];

export interface Option {
  id: string;
  /** Letra del guion, solo para trazabilidad (no se muestra ligada a la clave). */
  guionLetter: string;
  label: RoleText;
  /** Lo que ocurre tras elegir (narración y diálogos). */
  consequence: Line[];
  feedback: string;
  /** Refuerzo con fuentes, añadido sin modificar el texto del guion (prompt, apartado 2.2). */
  sourceNote?: string;
  outcome: Outcome;
  /** true si la retroalimentación es un texto editorial (el guion no la define); no se compara con el guion. */
  feedbackEditorial?: true;
}

export interface ChoiceDecision {
  kind: 'choice';
  id: DecisionId;
  prompt: string;
  options: Option[];
  /** Nota complementaria que se muestra junto a la retroalimentación (p. ej., tras D8). */
  complementaryNote?: string;
}

export interface Card {
  id: string;
  number: number;
  text: string;
  include: boolean;
  explanation: string;
  /** La tarjeta solo aparece si la escena indicada forma parte del recorrido actual (rama). */
  soloSiVisitada?: SceneId;
}

export interface CardsDecision {
  kind: 'cards';
  id: DecisionId;
  prompt: string;
  simulationLabel: string;
  cards: Card[];
  messages: { missing: string; extra: string };
  /** Rótulo de las tarjetas que se incluyen (por defecto «Incluir»). */
  includeLabel?: string;
  /** Título opcional del texto final (p. ej., «Registro simulado»). */
  successTitle?: string;
  successText: string;
  next: NodeId;
}

/** Elección de la variación que se practica (no se puntúa; todas las opciones son válidas). */
export interface VarianteDecision {
  kind: 'variante';
  id: DecisionId;
  prompt: string;
  opciones: { id: string; label: string; descripcion: string; next: NodeId }[];
}

/** Escena sin elección: un botón para continuar (p. ej., la reparación de la derivación en el módulo 2). */
export interface ContinueDecision {
  kind: 'continuar';
  id: DecisionId;
  label: string;
  note?: string;
  next: NodeId;
}

/** Ficha de verificación: todas las condiciones deben quedar marcadas para continuar. */
export interface ChecklistDecision {
  kind: 'checklist';
  id: DecisionId;
  prompt: string;
  simulationLabel: string;
  items: { id: string; label: string }[];
  /** Estado mostrado antes de completar la ficha. */
  pendingState: string;
  /** Estado mostrado al completar la ficha. */
  doneState: string;
  incompleteMessage: string;
  successText: string;
  next: NodeId;
  /** Rama opcional de contingencia (no resuelve la decisión). */
  alternative?: { label: string; next: NodeId };
}

/** Varias solicitudes, cada una con su propia elección (módulo 4, D04). Todas deben quedar bien resueltas. */
export interface SolicitudesDecision {
  kind: 'solicitudes';
  id: DecisionId;
  prompt: string;
  simulationLabel: string;
  solicitudes: {
    id: string;
    titulo: string;
    opciones: { id: string; guionLetter: string; texto: string; correcta: boolean }[];
    explicacion: string;
  }[];
  incorrectMessage: string;
  successText: string;
  next: NodeId;
}

export type Decision =
  | ChoiceDecision
  | CardsDecision
  | ContinueDecision
  | ChecklistDecision
  | SolicitudesDecision
  | VarianteDecision;

export type CharacterId = 'mariela' | 'elena' | 'referente' | 'lucia' | 'profesional' | 'nicolas' | 'camila' | 'diego' | 'paula' | 'alma' | 'valeria';
export type PanelId = 'transferencia' | 'canales' | 'apoyos';

/** Estados de planificación de la ficha de condiciones (módulo 3). Siempre se muestran con texto. */
export type EstadoCondicion =
  | 'pendiente_de_verificar'
  | 'verificado'
  | 'no_viable'
  | 'suspendido'
  // Estados ficticios de una exposición de información (módulo 4)
  | 'detectada'
  | 'comunicada'
  | 'contencion_en_curso'
  | 'riesgo_en_evaluacion'
  | 'seguimiento_asignado'
  // Estados ficticios de una exposición pública (módulo 6)
  | 'contenido_restringido'
  | 'copias_en_gestion';

/** Chat simulado: los datos sensibles se representan solo por su tipo, nunca con contenido. */
export interface ChatSimulado {
  titulo: string;
  mensajes: { autor: string; partes: Array<string | { oculto: string }> }[];
}

/** Consulta opcional dentro de una escena (no cambia el recorrido). */
export interface Consulta {
  titulo: string;
  lines: Line[];
}

export interface Scene {
  id: SceneId;
  title: string;
  /** Descripción del entorno para la versión de lectura y la documentación. */
  setting: string;
  characters: CharacterId[];
  /**
   * Rama a la que pertenece la escena, con la forma «grupo:opción» (p. ej., «jornada:suspendida»).
   * El contador de escenas solo cuenta la opción recorrida de cada grupo.
   */
  rama?: string;
  /** Escena que solo se visita en algunos recorridos (reparación o contingencia): no cuenta si no se visitó. */
  opcional?: boolean;
  /** Rótulo visible para escenas hipotéticas o de contingencia. */
  variationLabel?: string;
  intro: Line[];
  decision: Decision;
  panel?: PanelId;
  /** Texto que se muestra al salir de la escena (p. ej., regreso al hilo principal tras E05B). */
  outro?: Line[];
  /** Nota de diseño del guion: no se muestra como diálogo. */
  designNote?: string;
  /** Consultas opcionales desplegables (p. ej., «¿Y si el relevo no llega?»). */
  consultas?: Consulta[];
  /** Ficha de condiciones de la simulación, mostrada antes de la decisión. */
  ficha?: { titulo: string; filas: { aspecto: string; estado: EstadoCondicion }[] };
  chat?: ChatSimulado;
}

export interface Closing {
  /** Variantes según la rama recorrida: se muestra la de la escena visitada más recientemente, antes de las líneas comunes. */
  variantes?: { siVisitada: SceneId; lines: Line[] }[];
  /** Dónde se muestra la variante: antes (por defecto) o después de las líneas comunes. */
  variantesAlFinal?: boolean;
  lines: Line[];
  contribution: string;
  reflection: string[];
  /** Etiqueta del botón de repaso (p. ej., «Ver mis aprendizajes»). */
  reviewLabel?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** Decisiones requeridas; un grupo (array) se cumple con cualquiera de ellas (ramas alternativas). */
  decisions: Array<DecisionId | DecisionId[]>;
}

/** Textos de portada y elección de rol de cada módulo. */
export interface Portada {
  lead: string;
  aviso: string;
  rolPregunta: string;
  roles: Record<RoleId, string>;
  rolMensaje: string;
  /** Aclaraciones por rol que se muestran bajo cada opción. */
  rolNotas?: Record<RoleId, string>;
}

export interface TextosResultado {
  aprobado: (score: number, version: string) => string;
  criticoFallido: (score: number) => string;
  insuficiente: string;
  practicaReforzada: string;
}

export interface EvaluacionEpisodio {
  config: AssessmentConfig;
  preguntas: Question[];
  textos: TextosResultado;
  notaUmbral: string;
}

export interface Episode {
  id: string;
  /** Segmento de ruta del módulo (p. ej., «m1»). */
  ruta: string;
  /** Rótulo del tipo de unidad (p. ej., «Episodio 1», «Módulo 2»). */
  rotulo: string;
  number: number;
  title: string;
  subtitle?: string;
  version: string;
  /** Clave de almacenamiento local del progreso. */
  claveAlmacen: string;
  /** Expresión regular del nombre del guion local en referencias/. */
  guionArchivo: string;
  start: SceneId;
  scenes: Record<SceneId, Scene>;
  order: SceneId[];
  closing: Closing;
  badges: Badge[];
  portada: Portada;
  herramientas: ToolId[];
  evaluacion: EvaluacionEpisodio;
  /** Párrafos del panel «Posibles apoyos»; si falta, se usa el del módulo 1 (persona adulta). */
  panelApoyos?: string[];
  /** Textos redactados para el juego que no figuran en el guion: se excluyen de la comparación literal. */
  textosEditoriales?: string[];
  /** Texto del panel «Si hubiera peligro inmediato». */
  panelTransferencia?: string;
}

// --- Evaluación ---

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  number: number;
  title: string;
  stem: string;
  options: QuestionOption[];
  critical: boolean;
  /** Criterio evaluado, mostrado al fallar. */
  criterion: string;
  explanation: string;
  /** Nota complementaria que no modifica la explicación del guion. */
  complementaryNote?: string;
  /** Recuperación tras error: escena de práctica relacionada y herramienta. */
  recovery: { decisionId: DecisionId; sceneId: SceneId; toolId: ToolId };
  /** Forma B: en el resultado se ofrece la herramienta, sin mostrar la escena de práctica como caso de recuperación. */
  sinCasoRecuperacion?: boolean;
}

/** Clave de corrección separada de las preguntas: el frontend de registro no la necesita. */
export type AnswerKey = Record<string, string>;

export interface AssessmentConfig {
  episodeId: string;
  version: string;
  passScore: number;
  criticalQuestionIds: string[];
  isProvisional: true;
}

// --- Herramientas ---

export type ToolId = string;

export interface ToolSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface Tool {
  id: ToolId;
  title: string;
  summary: string;
  sections: ToolSection[];
  sources: string[];
}
