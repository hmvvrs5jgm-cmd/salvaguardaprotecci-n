// Tipos del contenido narrativo y de evaluación.
// El contenido vive en datos tipados (un único origen) y los componentes solo lo presentan.

export type RoleId = 'cf' | 'socio';
export const ROLES: readonly RoleId[] = ['cf', 'socio'];

/** Texto común o variante condicionada por rol. */
export type RoleText = string | { cf: string; socio: string };

export type Speaker = 'narracion' | 'mariela' | 'elena' | 'tu' | 'referente';

export interface Line {
  id: string;
  speaker: Speaker;
  text: RoleText;
  /**
   * true: diálogo literal del guion (entre comillas en el guion; se verifica con scripts/check-guion.ts).
   * false: indicación de pantalla convertida en narración o texto de interfaz (ver docs/cambios-editoriales.md).
   */
  literal: boolean;
}

export type SceneId = 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E05B' | 'E06' | 'E07' | 'E08';
export type NodeId = SceneId | 'CIERRE';
export type DecisionId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9';

/** Tipos de resultado de una opción, tomados del guion (prompt, apartado 5.1). */
export type Outcome =
  | { type: 'avanza'; next: NodeId }
  | { type: 'repara_y_avanza'; next: NodeId; repair: Line[]; repairFollowUp?: Line[] }
  | { type: 'pausa_y_vuelve'; pauseNote: string }
  | { type: 'reintenta' }
  | { type: 'complementa_y_avanza'; next: NodeId; complementOptionId: string; complement: Line[] };

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
}

export interface CardsDecision {
  kind: 'cards';
  id: DecisionId;
  prompt: string;
  simulationLabel: string;
  cards: Card[];
  messages: { missing: string; extra: string };
  successText: string;
  next: NodeId;
}

export type Decision = ChoiceDecision | CardsDecision;

export type BackgroundId = 'centro' | 'conversacion' | 'salida' | 'oficina';
export type CharacterId = 'mariela' | 'elena' | 'referente';
export type PanelId = 'transferencia' | 'canales' | 'apoyos';

export interface Scene {
  id: SceneId;
  title: string;
  background: BackgroundId;
  backgroundAlt: string;
  characters: CharacterId[];
  /** Rótulo visible para escenas hipotéticas (E05B). */
  variationLabel?: string;
  intro: Line[];
  decision: Decision;
  panel?: PanelId;
  /** Texto que se muestra al salir de la escena (p. ej., regreso al hilo principal tras E05B). */
  outro?: Line[];
  /** Nota de diseño del guion: no se muestra como diálogo. */
  designNote?: string;
}

export interface Closing {
  lines: Line[];
  contribution: string;
  reflection: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  decisions: DecisionId[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  version: string;
  start: SceneId;
  scenes: Record<SceneId, Scene>;
  order: SceneId[];
  closing: Closing;
  badges: Badge[];
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

export type ToolId = 'escucha' | 'seguridad' | 'no-hacer' | 'reporte' | 'ruta' | 'roles' | 'apoyos';

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
