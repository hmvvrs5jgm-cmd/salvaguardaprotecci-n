# Cambios editoriales respecto del guion v1.1

Todos los diálogos y textos entre comillas del guion se copian literalmente. `npm run check:guion` lo comprueba contra el guion local (102 textos al 18/10/2026). Esta tabla recoge las indicaciones de pantalla que se convirtieron en narración o en texto de interfaz (marcadas `literal: false` en `src/content/episodio1/escenas.ts`), además de las adaptaciones de interacción. El sentido pedagógico no cambia.

| Lugar | Guion (indicación) | Texto en el juego | Motivo |
|---|---|---|---|
| E01, D1-A | «Consecuencia: Mariela acepta hablar en un espacio accesible y discreto… Tú respetas esa preferencia.» | Narración: «Mariela acepta hablar en un espacio accesible y discreto.» / «Tú respetas esa preferencia.» | La consecuencia se muestra como narración. |
| E01, D1-B | «Mariela decide continuar.» | Narración tras la reparación. | Idem. |
| E01, D1-C | «Mariela mira a las personas cercanas y baja la voz.» | Narración. | Idem. |
| E01, D1-D | «Antes de realizar la llamada, aparece una pausa pedagógica. No se ejecuta la confrontación.» | Narración: «Antes de realizar la llamada, el ejercicio se detiene. La llamada no se realiza.» y nota «Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.» | Hace visible que la acción no ocurre, sin dramatizar daño. |
| E03, D3-B | «Pausa pedagógica… Reintento D3.» | Nota «Pausa pedagógica: no se formula esta pregunta. Vuelve a la decisión.» | Idem. |
| E03, D3-D | «Se muestra la pregunta A. Destino E04.» | Bajo «Respuesta completa» se muestran la pregunta A y la respuesta de Mariela a A. | Coherencia con E06: la tarjeta 3 menciona la hermana y el horario de llamada. |
| E04 | Visual: «Mariela se retira acompañada conforme a su preferencia. Elena conversa contigo en un espacio privado. No se comparte información identificable con ella.» | Narración: «Mariela se retira acompañada, como prefirió. Más tarde, Elena conversa contigo en un espacio privado. No compartes con ella información que identifique a Mariela.» | La indicación visual se narra para el lector de pantalla y la versión de lectura. |
| E05B, salida | «Regresa al hilo principal» (prompt 5.1) | Narración: «Termina la variación ficticia. Vuelves al caso de Mariela.» | Deja claro el fin de la variación ficticia. |
| E06, D7 | «Interacción D7: seleccionar cuáles de las siguientes cinco tarjetas incluir…» | Instrucción: «Selecciona qué tarjetas incluirías en la comunicación. Puedes marcar varias.» | Instrucción de interfaz para una selección múltiple. |
| E07 | «Mariela, en una conversación posterior realizada por el rol competente y mediante el contacto acordado:» | Narración: «Más adelante, el rol competente conversa con Mariela mediante el contacto acordado. Tú no conduces esa conversación.» | Aclara que la persona jugadora no entrevista a Mariela (prompt 5.1). |
| D1-B y D3-B | — | Nota de fuente sobre no revictimización (PPT, diapositivas 26–28 y 33). | Prompt 2.2.8: refuerzo sin modificar el texto del guion. |
| Opciones | Letras A, B, C, D | Sin letras visibles. | Evita ligar posiciones a la clave; en la evaluación, las opciones se mezclan. |
| Evaluación | Solo explicaciones | Se añade «Respuesta adecuada: …» en las preguntas falladas, tras el envío. | Retroalimentación completa después de enviar. |
| Recuperación tras error crítico | «Breve caso de recuperación con explicación» (sin texto en el guion) | Remite a la escena de práctica relacionada, con su respuesta adecuada y su retroalimentación literales, y a la herramienta correspondiente. | Evita inventar casos nuevos sin revisión institucional. |
