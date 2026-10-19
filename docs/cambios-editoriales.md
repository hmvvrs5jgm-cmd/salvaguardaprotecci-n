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

## Módulo 3 — «Antes de abrir las puertas» (guion v1.0)

Los diálogos, opciones, retroalimentaciones, reparaciones, preguntas, claves y textos de resultado se copian literalmente. `npm run check:guion` comprueba 163 textos contra el guion local. Los textos redactados para el juego están en `ED` y en `textosEditoriales` (`src/content/episodio3/escenas.ts`), y las indicaciones narradas llevan `literal: false`.

| Lugar | Guion (indicación) | Texto en el juego | Motivo |
|---|---|---|---|
| Pausas (D01-C, D02-A/C, D03-C, D04-A/C, D05-A/C, D06-A, D08-A, D09-A/C, D10-A/C) | «Pausa: …» | El texto del guion como retroalimentación, con la narración «El ejercicio se detiene antes de ejecutar esta acción.» | Igual que en los módulos 1 y 2. |
| Rol | Sin pregunta de rol | «¿Desde qué rol actuarás?» y las aclaraciones de cada rol bajo cada opción. | Coherencia con el módulo 2. |
| E01 | «Ficha de trabajo inicial» | Tabla «Ficha de trabajo inicial (simulación)» con los siete aspectos y el estado «Pendiente de verificar», también en la herramienta 1. | La ficha se ve antes de la decisión; el estado se indica con texto. |
| E02 | «Subescena opcional de consulta: ¿Y si el relevo no llega?» | Desplegable opcional con la respuesta literal de Elena. | Consulta sin cambiar el recorrido. |
| E03-B | Sin retroalimentación | Retroalimentación editorial. | El guion no la define. |
| M3_E03B | «Decisión de adaptación» sin elección | Narración y retroalimentación literal; desplegable «¿Y si no puede confirmarse una adaptación segura?»; botón «Continuar con la preparación». | Escena sin elección. |
| E05, salida | «Cierre de escena: en esta historia la visita se reprograma…» | Narración al salir de la escena. | — |
| D05-B, D06-B, D07-B, D02-A | — | Notas de fuente (Procedimiento 5.1.3, 5.1.10, 5.1.11.5 y 5.1.14). | Refuerzo con fuentes sin modificar el guion. |
| D06 y D10 | Notas del guion | Notas complementarias visibles junto a la retroalimentación. | Contenido pedagógico relevante. |
| E07 / M3_REVELACION | «Subescena de transferencia… recurso opcional de consulta que vuelve a E07» | Desplegable opcional en E07 «Si alguien comunica una preocupación durante la actividad», con la remisión al módulo 2 y el panel de vías institucionales. | Es una consulta que no obliga a revelar ni guarda relatos; no se representa como escena aparte. |
| E08 | «Antes de iniciar, revisas la ficha» | Tabla «Ficha de condiciones (simulación)» con los estados `verificado`, `pendiente_de_verificar`, `suspendido` y `no_viable`, deducidos de la narración. | Estados de planificación del apartado 21, siempre con texto. |
| D08-B, D09-B, D10-B | Solo consecuencia | Retroalimentaciones editoriales. | El guion no las define. |
| M3_INICIO_ADAPTADO, M3_SUSPENSION | Escenas sin elección | Botones «Comenzar el taller interior» y «Coordinar la salida»; rótulos «Jornada adaptada» y «Jornada suspendida». | Hacen visible la rama. |
| M3_E09S | «Opciones equivalentes: A, reducir supervisión…; B, mantener…; C, delegar…» | Opciones y retroalimentaciones redactadas a partir de E09, sin mencionar un taller. La C reutiliza la retroalimentación literal de E09-C. | El guion solo resume las opciones. |
| Cierre | Dos versiones y narración común | La línea de Elena depende de la rama recorrida más recientemente (`variantes` del cierre); después, la narración común y Camila. | El sistema conserva la variante y no muestra escenas incompatibles. |
| Insignia «Adaptación responsable» | «D08–D10» | Cuenta D09 o su variante D09S. | Suspender de forma protectora también permite obtenerla. |

## Módulo 4 — «La información también protege» (guion v1.0)

Los diálogos, opciones, retroalimentaciones, reparaciones, las tres solicitudes de D04, las preguntas, las claves y los textos de resultado se copian literalmente. `npm run check:guion` comprueba 160 textos contra el guion local. Los textos redactados para el juego están en `ED` y en `textosEditoriales` (`src/content/episodio4/escenas.ts`).

| Lugar | Guion (indicación) | Texto en el juego | Motivo |
|---|---|---|---|
| Pausas (D01-A, D02-B, D05-A/B, D06-C/D, D07-B/C, D08-A, D09-C, D10-A/B) | «Pausa antes del envío» / «Pausa» | El texto del guion como retroalimentación, con la narración «El ejercicio se detiene antes del envío. No se comparte ningún dato.» | Las acciones que ampliarían la exposición se detienen antes de ejecutarse. |
| D01-C | «Reparación B» | La reparación muestra el texto B y la respuesta de Elena. | Igual que en los módulos anteriores. |
| E03 | «Texto ficticio» y «Versión propuesta para revisión» | Líneas rotuladas «Texto ficticio». | Diferencia el documento de la narración. |
| E04, D04 | «Interacción: tres solicitudes ficticias. Elegir la acción autorizable en cada una» | Tres grupos de opciones accesibles por teclado; instrucción y mensaje de revisión redactados para el juego. La explicación literal aparece en cada solicitud mal resuelta y en todas al terminar. | «Cada error explica finalidad, mínimo y autorización y permite corregir». |
| E05 | «Tarjeta de contraste» | Desplegable opcional «Tarjeta de contraste: herramientas externas». | Consulta sin cambiar el recorrido. |
| E06 | «Chat completamente ficticio… bloques ocultos y etiquetas de tipo de dato» | Chat simulado con la frase «Comparto el avance del informe:» y etiquetas «Dato oculto: …». Ningún dato sensible está en el DOM, el texto alternativo ni los registros. | Guion, apartado 23. |
| M4_CONTENCION | Narración, aviso mínimo y estado de pantalla | El aviso literal como «Texto ficticio»; ficha «Estado de la exposición (simulación)» con los estados `comunicada`, `contencion_en_curso` y `riesgo_en_evaluacion`; nota «Revocar un enlace no equivale a “todo resuelto”». | Estados del apartado 22; nunca «Todo resuelto». |
| E09 | «Variación de transferencia» | Rótulo «Variación hipotética» y narración de salida: «Termina la variación hipotética. En la historia principal, el mensaje lo envió Elena.» | La variación no cambia los hechos de E06. |
| D02-A, D05-A, D10-C | — | Notas de fuente (Plan, anexos 1 y 6; Protocolo, 10.2, 10.4, 10.5 y 10.5.1). | Refuerzo con fuentes sin modificar el guion. |

## Módulo 5 — «Es alguien importante» (guion v1.0)

Los diálogos, opciones, retroalimentaciones, reparaciones, tarjetas de D06, preguntas, claves y textos de resultado se copian literalmente. `npm run check:guion` comprueba 156 textos contra el guion local. Los textos redactados para el juego están en `ED` y en `textosEditoriales` (`src/content/episodio5/escenas.ts`).

| Lugar | Guion (indicación) | Texto en el juego | Motivo |
|---|---|---|---|
| Pausas | «Pausa: …» | El texto del guion como retroalimentación, con la narración «El ejercicio se detiene antes de ejecutar esta acción.» | Igual que en los módulos anteriores. |
| E04 | «Se presenta una variación elegible de la situación» | Pregunta «¿Qué variación quieres practicar?» con dos opciones descritas y la aclaración «Elegir una variación no se puntúa: ambas son válidas.» | La elección de rama no es una decisión evaluada. |
| M5_CANAL_HABITUAL | «D04 se muestra como ejercicio breve equivalente: elegir reportar por el mecanismo sin esperar autorización de la persona señalada, frente a esperar o difundir» | Decisión D04H con tres opciones redactadas a partir de esa indicación; la retroalimentación de la opción adecuada es el texto del guion «Comunicar mediante ese mecanismo…». | El guion solo describe el ejercicio. |
| Ambas rutas | «Tarjeta de transferencia» sobre alternativas | Desplegable en la ruta habitual y panel «Vías institucionales de referencia» en ambas. | Se aprende la alternativa sin exigir usarla cuando no hay conflicto. |
| D04-D | «Mostrar herramienta de canales y volver a D04» | Narración que remite al panel de vías de la escena y reintento. | El panel está siempre disponible en la escena. |
| E06, D06 | Selección de tarjetas; la 4 solo en la ruta de conflicto | Instrucción, mensajes de revisión y texto final redactados para el juego. La tarjeta 4 solo aparece y solo se exige si se recorrió M5_CONFLICTO; las tarjetas se numeran en orden de aparición. | «No exigir una información que la historia no proporcionó». |
| M5_MEDIDAS | Ejemplos de medidas y límites | Narraciones con los textos del guion; botón «Continuar». | Escena sin elección. |
| D02-C, D07-A | — | Notas de fuente (Política 2.9; Procedimiento 5.2.4.3; Plan de Salvaguarda, no represalias). | Refuerzo con fuentes sin modificar el guion. |
| D09 | Nota sobre mensajes recibidos espontáneamente | Nota complementaria visible. | Contenido pedagógico relevante. |

## Módulo 6 — «Una imagen que no debió publicarse» (guion v1.0)

Los diálogos, opciones, retroalimentaciones, reparaciones, tarjetas de D03, preguntas, claves y textos de resultado se copian literalmente. `npm run check:guion` comprueba 155 textos contra el guion local. Los textos redactados para el juego están en `ED` y en `textosEditoriales` (`src/content/episodio6/escenas.ts`).

| Lugar | Guion (indicación) | Texto en el juego | Motivo |
|---|---|---|---|
| Pausas | «Pausa: …» | El texto del guion como retroalimentación, con la narración «El ejercicio se detiene antes de ejecutar esta acción. No se publica ni se comparte nada.» | Las opciones que ampliarían la exposición se detienen antes de ejecutarse. |
| E01 y E03 | «Publicación completamente ficticia con una figura ilustrada genérica y etiquetas» | Bloque «SIMULACIÓN. Publicación ficticia, sin conexión con redes reales», con etiquetas «Dato oculto: …» y sin imagen. | No se incorpora material sensible en el DOM, el texto alternativo ni los metadatos. |
| E03, D03 | Seis tarjetas: «Revisar» o no | Selección múltiple con el rótulo «Revisar»; instrucción y mensajes de revisión redactados para el juego. | Interacción accesible sin arrastrar. |
| E04, salida | «Estado: Contenido propio restringido/retirado; alcance externo pendiente de valoración» | Narración al salir de la escena. | — |
| E06 y E10 | Estados pedagógicos | Fichas «Estado de la exposición (simulación)» con los estados `comunicada`, `contenido_restringido`, `riesgo_en_evaluacion`, `copias_en_gestion` y `seguimiento_asignado`. | Nunca «internet limpio» ni «caso resuelto». |
| D07-C | «Reparación B» | La reparación muestra el texto de la opción B. | Igual que en los módulos anteriores. |
| M6_NO_REPUBLICAR y M6_CONTENIDO_ALTERNATIVO | Escenas sin elección | Rótulos «Desenlace: …» y botón «Continuar». La retroalimentación de cada desenlace del guion se muestra al elegir D08-B o D08-C. | Hace visible la rama. |
| Cierre | Narración común y línea según la ruta | La línea de la ruta recorrida aparece al final, después de la narración común (`variantesAlFinal`). | Orden del guion. |
| D02-C | — | Nota de fuente (Procedimiento 5.1.14.4 y 5.1.14.5). | Refuerzo con fuentes sin modificar el guion. |
