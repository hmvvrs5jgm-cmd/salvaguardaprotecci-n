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

## Módulo 2 — «Gracias por escucharme» (guion v1.0)

Los diálogos, opciones, retroalimentaciones, reparaciones, preguntas, claves y textos de resultado se copian literalmente. `npm run check:guion` comprueba 187 textos contra el guion local. Los cambios siguientes están marcados como `literal: false` o `feedbackEditorial: true` en `src/content/episodio2/escenas.ts`.

| Lugar | Guion (indicación) | Texto en el juego | Motivo |
|---|---|---|---|
| Pausas preventivas (D01-C, D02-C, D03-C, D04-B, DURG-B/C, D05-A, D08-C, D09-A, D10-C) | «Pausa: …» | El texto del guion se muestra como retroalimentación, con la narración «El ejercicio se detiene antes de ejecutar esta acción.» y la nota «Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.» | Hace visible que la acción no ocurre, como en el módulo 1. |
| D01-B | «Lucía mira al grupo y calla.» | Narración. | La consecuencia se muestra como narración. |
| D03-D | «Mostrar explicación B como reparación, con confirmación de lectura.» | La reparación muestra el texto B; la confirmación es el botón «Reparar respuesta» y una narración que pide leerla antes de continuar. | Equivale a la confirmación de lectura sin un control adicional. |
| D05-C, D07-C, D09-C | «Reparación B.» | La reparación muestra el texto de la opción B (y, en D05 y D07, la respuesta del Referente). | Idem. |
| URGENTE, A | Consecuencia sin retroalimentación | Narración de la consecuencia y retroalimentación editorial: «Respondes ahora y dentro de tu rol…» | El guion no define la retroalimentación de la opción adecuada. |
| URGENTE | Nota de producción sobre emergencias | Panel «Si hubiera peligro inmediato» con el 911 y el texto «Si el peligro es inminente, activa la respuesta de emergencia disponible…» | Hace operativa la nota sin convertir la escena en una prueba de rapidez. |
| E05, intro | «El Referente toma la coordinación. En la variante socio…» | Narración con variante por rol. | La indicación se convierte en narración. |
| E05, salida | Transición narrativa | Se muestra literal al salir de la escena. | — |
| E06, D06 | «Clasifica cinco tarjetas como “Compartir por canal restringido” o “Excluir”.» | Selección múltiple: las tarjetas marcadas se comparten y las demás quedan excluidas. El resultado usa ambos rótulos. | Interacción accesible sin arrastrar. |
| D08-A | «El juego muestra una ficha con “Recepción no confirmada” y “Barreras sin resolver”.» | Narración con ambos estados. | Idem. |
| D08-B | Consecuencia sin retroalimentación | Narración de la consecuencia y retroalimentación editorial. | El guion no define la retroalimentación. |
| M2_VERIFICAR | Interacción con seis campos | Lista de casillas con estado «En coordinación» / «Alternativa confirmada»; botón «Ver la contingencia» para M2_SIN_SERVICIO. | Ficha accesible por teclado (guion, apartado 23). |
| M2_SIN_SERVICIO | Descripción de la rama | Narraciones con el estado «Derivación pendiente» y nota bajo el botón «Volver al ejemplo principal». | El guion pide no presentar la vuelta como una solución real de la falta de cupo. |
| Rol | «Variante ChildFund / Variante socio» | Aclaraciones bajo cada opción de rol. | — |
| Evaluación | Textos de resultado | El texto de aprobado añade la versión del módulo. | Trazabilidad de la versión aprobada. |

