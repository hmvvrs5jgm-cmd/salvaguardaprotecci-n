// Recolección de todos los textos publicados del episodio, para comprobaciones automáticas.
import { avisoServicios, canales, serviciosPublicos } from '../config/canales';
import { herramientas, panelApoyos } from './herramientas';
import { episodio1, panelTransferencia, portada, preguntas } from './episodio1';
import type { Line, RoleText } from './types';

const rt = (t: RoleText): string[] => (typeof t === 'string' ? [t] : [t.cf, t.socio]);

export interface TextoLiteral {
  origen: string;
  texto: string;
}

/** Diálogos y opciones que deben coincidir literalmente con el guion. */
export function textosLiterales(): TextoLiteral[] {
  const out: TextoLiteral[] = [];
  const lines = (ls: Line[] | undefined, origen: string) =>
    ls?.filter((l) => l.literal).forEach((l) => rt(l.text).forEach((texto) => out.push({ origen, texto })));
  for (const s of Object.values(episodio1.scenes)) {
    lines(s.intro, `${s.id} intro`);
    if (s.decision.kind === 'choice') {
      out.push({ origen: `${s.decision.id} pregunta`, texto: s.decision.prompt });
      for (const o of s.decision.options) {
        rt(o.label).forEach((texto) => out.push({ origen: o.id, texto }));
        out.push({ origen: `${o.id} retroalimentación`, texto: o.feedback });
        lines(o.consequence, `${o.id} consecuencia`);
        if (o.outcome.type === 'repara_y_avanza') lines(o.outcome.repair, `${o.id} reparación`);
        if (o.outcome.type === 'complementa_y_avanza') lines(o.outcome.complement, `${o.id} complemento`);
      }
    } else {
      s.decision.cards.forEach((c) => out.push({ origen: c.id, texto: c.text }));
      out.push({ origen: 'D7 faltan', texto: s.decision.messages.missing });
      out.push({ origen: 'D7 sobran', texto: s.decision.messages.extra });
      out.push({ origen: 'D7 final', texto: s.decision.successText });
    }
  }
  lines(episodio1.closing.lines, 'CIERRE');
  out.push({ origen: 'CIERRE contribución', texto: episodio1.closing.contribution });
  episodio1.closing.reflection.forEach((texto) => out.push({ origen: 'CIERRE reflexión', texto }));
  out.push({ origen: 'portada', texto: portada.lead }, { origen: 'aviso', texto: portada.aviso }, { origen: 'rol', texto: portada.rolMensaje });
  out.push({ origen: 'panel transferencia', texto: panelTransferencia });
  return out;
}

/** Todo el texto publicado (para buscar términos prohibidos). */
export function todoElTexto(): string {
  const partes: string[] = textosLiterales().map((t) => t.texto);
  for (const s of Object.values(episodio1.scenes)) {
    [...s.intro, ...(s.outro ?? [])].forEach((l) => partes.push(...rt(l.text)));
    if (s.decision.kind === 'choice') {
      for (const o of s.decision.options) {
        o.consequence.forEach((l) => partes.push(...rt(l.text)));
        if (o.sourceNote) partes.push(o.sourceNote);
        if (o.outcome.type === 'pausa_y_vuelve') partes.push(o.outcome.pauseNote);
        if (o.outcome.type === 'repara_y_avanza') o.outcome.repairFollowUp?.forEach((l) => partes.push(...rt(l.text)));
      }
      if (s.decision.complementaryNote) partes.push(s.decision.complementaryNote);
    } else {
      partes.push(s.decision.prompt, s.decision.simulationLabel);
      s.decision.cards.forEach((c) => partes.push(c.explanation));
    }
  }
  for (const h of herramientas) {
    partes.push(h.title, h.summary, ...h.sources);
    for (const sec of h.sections) {
      partes.push(sec.heading, ...(sec.paragraphs ?? []), ...(sec.bullets ?? []));
      sec.table?.rows.forEach((r) => partes.push(...r));
    }
  }
  partes.push(...Object.values(panelApoyos));
  for (const p of preguntas) partes.push(p.stem, p.explanation, ...p.options.map((o) => o.text), p.criterion);
  for (const c of canales) partes.push(c.nombre, c.descripcion, c.contacto ?? '', c.url ?? '');
  for (const s of serviciosPublicos) partes.push(s.nombre, s.descripcion, s.contacto ?? '', s.url ?? '');
  partes.push(avisoServicios);
  return partes.join('\n');
}
