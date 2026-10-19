// Recolección de todos los textos publicados de cada módulo, para comprobaciones automáticas.
import { avisoServicios, canales, serviciosPublicos } from '../config/canales';
import { episodios } from './episodios';
import { panelApoyos, todasLasHerramientas } from './herramientas';
import type { Episode, Line, RoleText } from './types';

const rt = (t: RoleText): string[] => (typeof t === 'string' ? [t] : [t.cf, t.socio]);

export interface TextoLiteral {
  origen: string;
  texto: string;
}

/** Diálogos y opciones de un módulo que deben coincidir literalmente con su guion. */
export function textosLiterales(ep: Episode): TextoLiteral[] {
  const out: TextoLiteral[] = [];
  const lines = (ls: Line[] | undefined, origen: string) =>
    ls?.filter((l) => l.literal).forEach((l) => rt(l.text).forEach((texto) => out.push({ origen, texto })));
  for (const s of Object.values(ep.scenes)) {
    lines(s.intro, `${s.id} intro`);
    lines(s.outro, `${s.id} salida`);
    const d = s.decision;
    if (d.kind === 'choice') {
      out.push({ origen: `${d.id} pregunta`, texto: d.prompt });
      for (const o of d.options) {
        rt(o.label).forEach((texto) => out.push({ origen: o.id, texto }));
        if (!o.feedbackEditorial) out.push({ origen: `${o.id} retroalimentación`, texto: o.feedback });
        lines(o.consequence, `${o.id} consecuencia`);
        if (o.outcome.type === 'repara_y_avanza') {
          lines(o.outcome.repair, `${o.id} reparación`);
          lines(o.outcome.repairFollowUp, `${o.id} reparación`);
        }
        if (o.outcome.type === 'complementa_y_avanza') lines(o.outcome.complement, `${o.id} complemento`);
      }
    } else if (d.kind === 'cards') {
      d.cards.forEach((c) => out.push({ origen: c.id, texto: c.text }));
      out.push({ origen: `${d.id} faltan`, texto: d.messages.missing });
      out.push({ origen: `${d.id} sobran`, texto: d.messages.extra });
      out.push({ origen: `${d.id} final`, texto: d.successText });
    } else if (d.kind === 'checklist') {
      out.push({ origen: `${d.id} incompleta`, texto: d.incompleteMessage });
    } else if (d.kind === 'variante') {
      out.push({ origen: `${d.id} pregunta`, texto: d.prompt });
      d.opciones.forEach((o) => out.push({ origen: o.id, texto: o.label }, { origen: `${o.id} descripción`, texto: o.descripcion }));
    } else if (d.kind === 'solicitudes') {
      for (const sol of d.solicitudes) {
        out.push({ origen: sol.id, texto: sol.titulo }, { origen: `${sol.id} explicación`, texto: sol.explicacion });
        sol.opciones.forEach((o) => out.push({ origen: o.id, texto: o.texto }));
      }
      out.push({ origen: `${d.id} final`, texto: d.successText }, { origen: `${d.id} incorrecta`, texto: d.incorrectMessage });
    } else {
      out.push({ origen: `${d.id} botón`, texto: d.label });
    }
  }
  lines(ep.closing.lines, 'CIERRE');
  ep.closing.variantes?.forEach((v) => lines(v.lines, `CIERRE tras ${v.siVisitada}`));
  for (const s of Object.values(ep.scenes)) s.consultas?.forEach((c) => lines(c.lines, `${s.id} consulta`));
  out.push({ origen: 'CIERRE contribución', texto: ep.closing.contribution });
  ep.closing.reflection.forEach((texto) => out.push({ origen: 'CIERRE reflexión', texto }));
  const p = ep.portada;
  out.push({ origen: 'portada', texto: p.lead }, { origen: 'aviso', texto: p.aviso }, { origen: 'rol', texto: p.rolMensaje });
  out.push({ origen: 'rol pregunta', texto: p.rolPregunta });
  if (p.rolNotas) out.push({ origen: 'rol cf', texto: p.rolNotas.cf }, { origen: 'rol socio', texto: p.rolNotas.socio });
  if (ep.number === 1 && ep.panelTransferencia) out.push({ origen: 'panel transferencia', texto: ep.panelTransferencia });
  // El módulo 1 adaptó la evaluación en docs/cambios-editoriales.md; desde el módulo 2 se compara literalmente.
  if (ep.number > 1) {
    for (const q of ep.evaluacion.preguntas) {
      out.push({ origen: `${q.id} enunciado`, texto: q.stem }, { origen: `${q.id} explicación`, texto: q.explanation });
      q.options.forEach((o) => out.push({ origen: o.id, texto: o.text }));
    }
  }
  const editoriales = new Set(ep.textosEditoriales ?? []);
  return out.filter((t) => !editoriales.has(t.texto));
}

/** Todo el texto publicado de todos los módulos (para buscar términos prohibidos). */
export function todoElTexto(): string {
  const partes: string[] = [];
  for (const ep of episodios) {
    partes.push(...textosLiterales(ep).map((t) => t.texto));
    if (ep.panelTransferencia) partes.push(ep.panelTransferencia);
    partes.push(...(ep.panelApoyos ?? []), ...(ep.textosEditoriales ?? []));
    ep.closing.variantes?.forEach((v) => v.lines.forEach((l) => partes.push(...rt(l.text))));
    for (const s of Object.values(ep.scenes)) {
      [...s.intro, ...(s.outro ?? []), ...(s.consultas ?? []).flatMap((c) => c.lines)].forEach((l) => partes.push(...rt(l.text)));
      s.consultas?.forEach((c) => partes.push(c.titulo));
      if (s.ficha) partes.push(s.ficha.titulo, ...s.ficha.filas.map((f) => f.aspecto));
      if (s.chat) partes.push(s.chat.titulo, ...s.chat.mensajes.flatMap((m) => [m.autor, ...m.partes.map((x) => (typeof x === 'string' ? x : x.oculto))]));
      const d = s.decision;
      if (d.kind === 'choice') {
        for (const o of d.options) {
          partes.push(o.feedback);
          o.consequence.forEach((l) => partes.push(...rt(l.text)));
          if (o.sourceNote) partes.push(o.sourceNote);
          if (o.outcome.type === 'pausa_y_vuelve') partes.push(o.outcome.pauseNote);
          if (o.outcome.type === 'repara_y_avanza') o.outcome.repairFollowUp?.forEach((l) => partes.push(...rt(l.text)));
        }
        if (d.complementaryNote) partes.push(d.complementaryNote);
      } else if (d.kind === 'cards') {
        partes.push(d.prompt, d.simulationLabel);
        d.cards.forEach((c) => partes.push(c.explanation));
      } else if (d.kind === 'checklist') {
        partes.push(d.prompt, d.simulationLabel, d.pendingState, d.doneState, d.successText);
        d.items.forEach((i) => partes.push(i.label));
        if (d.alternative) partes.push(d.alternative.label);
      } else if (d.kind === 'solicitudes') {
        partes.push(d.prompt, d.simulationLabel);
      } else if (d.kind === 'continuar' && d.note) {
        partes.push(d.note);
      }
    }
    for (const p of ep.evaluacion.preguntas) partes.push(p.stem, p.explanation, ...p.options.map((o) => o.text), p.criterion);
  }
  for (const h of todasLasHerramientas) {
    partes.push(h.title, h.summary, ...h.sources);
    for (const sec of h.sections) {
      partes.push(sec.heading, ...(sec.paragraphs ?? []), ...(sec.bullets ?? []));
      sec.table?.rows.forEach((r) => partes.push(...r));
    }
  }
  partes.push(...Object.values(panelApoyos));
  for (const c of canales) partes.push(c.nombre, c.descripcion, c.contacto ?? '', c.url ?? '');
  for (const s of serviciosPublicos) partes.push(s.nombre, s.descripcion, s.contacto ?? '', s.url ?? '');
  partes.push(avisoServicios);
  return partes.join('\n');
}
