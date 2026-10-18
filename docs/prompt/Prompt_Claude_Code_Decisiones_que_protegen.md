# Prompt para Claude Code: Decisiones que protegen

Versión del prompt 1.1 (revisada a partir de la 1.0 y contrastada con el guion «Una ayuda con condiciones», versión de diseño 1.0).

Copia este documento completo en Claude Code. Coloca el guion y los tres documentos institucionales en una carpeta local `referencias/`. No publiques esa carpeta.

---

Actúa con las competencias de desarrollo web full stack, diseño de videojuegos educativos, aprendizaje adulto, accesibilidad y salvaguarda. Construye una aplicación funcional llamada **Decisiones que protegen**. No te limites a proponer una arquitectura: implementa, ejecuta las verificaciones disponibles y entrega el proyecto listo para probar y preparar su despliegue.

## 1. Objetivo y alcance

Desarrolla un juego web en español (registro neutro, trato de «tú», como en el guion) para personas mayores de 18 años: personal técnico de ChildFund Ecuador y organizaciones socias. La mecánica principal es una simulación narrativa con decisiones ramificadas y consecuencias explicadas.

Implementa completamente el episodio **Una ayuda con condiciones**, de acuerdo con el guion adjunto. Prepara la arquitectura para añadir episodios sin inventar ni presentar como terminados los que todavía no existen (en la interfaz pueden aparecer como «Próximamente» solo si no muestran títulos ni contenidos inventados).

El juego será público, con práctica sin cuenta. Para registrar aprobación se requiere identidad verificada. Cada participante verá su propio resultado. El **Punto Focal de Salvaguarda será el único rol de aplicación que puede consultar las aprobaciones de otras personas y administrar ese registro**. No hay plataforma institucional existente.

## 2. Archivos fuente y lectura inicial

Busca primero en el repositorio y en `referencias/`:

- `Guion_Una_ayuda_con_condiciones.md`.
- `ChildFund Safeguarding Policy_Spanish June 13.2023-PRO-POL-080.pdf`.
- `ChildFund Safeguarding Procedure_Approved June 13.2023_PRO-PRO-080.pdf`.
- `PPT Salvaguarda actualizado.pptx`.

Antes de copiar cualquier archivo al repositorio, añade `referencias/` y los nombres de esas fuentes a `.gitignore` y comprueba con `git status` que no quedan rastreados.

Lee el guion completo y extrae el texto de los documentos pertinentes con herramientas locales (por ejemplo `pdftotext` y `python-pptx`). La usuaria confirmó que no hay versiones posteriores a las compartidas. La PPT contiene la ruta operativa de tres niveles y las derivaciones (diapositivas 59–62 y 64–66 según el guion). Conserva esas responsabilidades y utiliza orientaciones genéricas donde falten contactos o datos verificables.

No publiques los PDF, la PPT ni el guion íntegro en los archivos estáticos. Publica únicamente los contenidos formativos necesarios para jugar. No incluyas datos personales ni contactos internos no autorizados.

La política y el procedimiento sustentan las reglas institucionales; el guion define su adaptación pedagógica. Si encuentras una discrepancia material, regístrala en `docs/discrepancias.md` (fuente, apartado, texto citado brevemente, impacto, propuesta) y deja ese punto configurable, sin inventar una resolución. No bloquees el trabajo independiente de esa discrepancia.

Si falta el guion, desarrolla la estructura técnica y señala que no puedes declarar el episodio completo. No inventes contenido institucional para suplirlo. Si faltan los PDF o la PPT, implementa el episodio desde el guion y marca como «pendiente de contraste» los textos que dependen de ellos.

### 2.1 Fidelidad al guion

- Los textos entre comillas del guion son diálogos literales: cópialos sin parafrasear. Las indicaciones de pantalla y notas de implementación no se muestran como diálogo.
- Cualquier ajuste editorial (erratas, longitud en móvil, accesibilidad) se documenta en `docs/cambios-editoriales.md` con el texto original y el nuevo. No cambies el sentido pedagógico.
- Genera un script de comprobación que compare los diálogos del contenido estructurado con los del guion local, si el guion está disponible, y reporte diferencias. El script no debe fallar en CI cuando el guion no esté presente (por estar ignorado).

## 3. Decisiones técnicas

Si el repositorio está vacío, utiliza React, TypeScript (modo estricto) y Vite para el frontend; Supabase Auth, PostgreSQL y Edge Functions para el registro privado; Vitest y Testing Library para pruebas unitarias y de componentes; Playwright con axe-core para pruebas de extremo a extremo y accesibilidad. Usa versiones estables compatibles y consulta documentación oficial actual al configurar autenticación, autorización y despliegue. Si ya existe una base adecuada, adáptala y explica cualquier cambio relevante. Evita dependencias innecesarias.

El frontend debe poder publicarse en GitHub Pages. Configura correctamente la ruta base del repositorio (`base` de Vite configurable por variable), assets y retorno de autenticación. Usa HashRouter para evitar errores 404 al recargar rutas en Pages. No uses un servidor Node como requisito del sitio estático.

**Atención a la colisión entre HashRouter y la autenticación:** el flujo implícito devuelve tokens en el fragmento `#` de la URL y entra en conflicto con HashRouter. Prefiere verificación del correo mediante **código de un solo uso (OTP) introducido en la aplicación**, o bien flujo PKCE con el parámetro `code` en la query string procesado antes de inicializar el router. En cualquier caso, elimina tokens y códigos de la URL y del historial inmediatamente después de procesarlos.

GitHub Pages no aloja la base privada. El backend se despliega por separado. Entrega migraciones, funciones, ejemplos de variables y pasos reproducibles para configurarlo. Si Docker o la CLI de Supabase no están disponibles en tu entorno, escribe igualmente las pruebas de base de datos (por ejemplo con pgTAP) y documenta cómo ejecutarlas.

Sin credenciales debe funcionar una **demostración local completa**, con datos ficticios y práctica. Rotula sus resultados como demostración no registrada en cada pantalla donde aparezcan. Nunca simules que una aprobación quedó registrada en un servicio inexistente. No debe existir un fallback automático a aprobaciones locales cuando falle el backend real: el modo (demostración o registro) se decide por configuración de compilación, no por disponibilidad de red.

**Clave de evaluación y modo demostración:** como el repositorio y el paquete de la demostración son públicos, la clave estará necesariamente al alcance de quien la busque. Acéptalo y documéntalo. En modo registro, la puntuación oficial la calcula exclusivamente el servidor con su propia copia del banco (generada desde la misma fuente de contenido durante el despliegue del backend), y el frontend de ese modo no debe necesitar la clave para funcionar.

No crees servicios de pago ni publiques el sitio por tu cuenta. Prepara el despliegue y documenta los pasos que requieren acceso a cuentas o secretos. Continúa con todo el trabajo local que puedas completar.

## 4. Experiencia visual

Diseña una novela gráfica interactiva 2D, sobria y cercana para adultos. Debe sentirse como un juego de decisiones: escenas, personajes, diálogos y avance narrativo.

Usa ilustración editorial vectorial (SVG locales), fondos claros, contraste alto, tipografía legible autoalojada y verde como acento provisional, definido como variable de tema reemplazable. No declares colores oficiales sin manual de marca. No inventes ni deformes el logotipo de ChildFund. Si no hay activos autorizados, utiliza un título tipográfico y recursos locales reemplazables. No uses fotografías reales de participantes ni imágenes de violencia.

Activos mínimos (guion, apartado 22): fondos de centro comunitario, espacio discreto de conversación, salida del centro y oficina de coordinación; retratos de Mariela, Elena y el Referente con expresiones respetuosas y no estereotipadas. La persona jugadora («Tú») puede representarse sin rostro definido. La persona señalada no tiene retrato ni aparece en escena. Cada imagen tiene texto alternativo o se marca como decorativa.

Muestra una decisión principal por pantalla, opciones amplias, progreso, pausa, herramientas y retorno a la escena. Evita paneles recargados. Diseña primero para teléfono (desde 320 px) y adapta a tableta y escritorio. Mantén recursos ligeros y sin dependencias de imágenes, fuentes o scripts remotos en tiempo de ejecución.

Sin música de tensión, gritos, efectos de castigo, vidas, cuenta regresiva, puntos ni rankings. El sonido, si existe, es opcional y desactivado por defecto. Las animaciones son discretas, nunca necesarias para entender el contenido, y se desactivan con `prefers-reduced-motion` o desde el panel de accesibilidad. Las opciones equivocadas no se marcan solo con color rojo: usa texto e iconografía.

## 5. Pantallas y recorridos

Implementa:

1. Portada con el texto, aviso de contenido y botones del guion (apartado 3), más confirmación de público adulto sin pedir fecha de nacimiento.
2. Accesibilidad (tamaño de texto, movimiento, contraste, sonido), versión de lectura equivalente y opción de salir que conserva el progreso.
3. Selección de rol: ChildFund o socio local, con el mensaje común del guion. El rol puede cambiarse desde el menú de pausa, avisando que el recorrido se reinicia desde E01.
4. Motor narrativo del episodio completo: escenas E01–E08 y E05B, las nueve decisiones D1–D9 (D7 es una selección múltiple de tarjetas, no una elección única), reparaciones, pausas pedagógicas, reintentos y paneles contextuales (transferencia en E03, referencia de canales en E05B, apoyos en E07).
5. Herramientas de consulta disponibles desde el inicio, sin requisitos: guía de escucha; tarjeta de seguridad y contacto; guía de reporte e información mínima; roles y niveles; opciones de apoyo.
6. Insignias de práctica separadas de la aprobación.
7. Cierre narrativo, reflexión sin campos abiertos y repaso de decisiones.
8. Identificación y autenticación para registrar evaluación.
9. Evaluación final independiente, con diez preguntas.
10. Resultado privado (tres estados del guion, apartado 17), recuperación y nuevo intento.
11. Panel privado del Punto Focal.
12. Panel claramente separado e identificado como información institucional para consultar cómo comunicar una preocupación real, distinto según el rol elegido.

### 5.1 Contenido estructurado y motor

La ruta narrativa y todos los diálogos se cargan desde contenido estructurado tipado (un único origen), separado de componentes. Tanto el modo gráfico como la versión de lectura se generan desde ese mismo contenido, con las mismas decisiones y retroalimentación; la versión de lectura es interactiva, no un volcado de texto.

Usa IDs estables para escenas, decisiones, opciones, tarjetas, herramientas y preguntas. Tipifica cada opción con un resultado explícito, tomado del guion:

| Tipo | Comportamiento | Ejemplos del guion |
|---|---|---|
| `avanza` | Consecuencia, retroalimentación y paso a la escena destino. | D1-A, D2-B, D3-A, D4-C |
| `repara_y_avanza` | Consecuencia y retroalimentación; la persona debe seleccionar o leer y confirmar la reparación antes de continuar. | D1-B, D1-C, D2-A, D2-C |
| `pausa_y_vuelve` | Se detiene antes de ejecutar la acción (confrontación o investigación), sin dramatizar daño, y vuelve a la misma decisión. | D1-D, D3-B |
| `reintenta` | Retroalimentación y regreso a la misma decisión. | D3-C, D4-A, D5-B/C/D, D6-B/C, D8-A/C, D9-B/C |
| `complementa_y_avanza` | Respuesta parcialmente útil: se muestra la opción completa como complemento y se avanza. | D3-D |

Las variantes por rol (como D5-A para ChildFund o socio, y el panel de comunicación real) se modelan como contenido condicionado por rol, no con lógica dispersa en componentes. El Referente puede tener etiquetas configurables según la ruta de cada rol, sin inventar intermediarios.

E05B se presenta explícitamente como «variación ficticia» dentro del recorrido y regresa al hilo principal. En E07, D8 pregunta qué orientación corresponde en una conversación conducida por el rol competente: no conviertas a la persona jugadora en quien entrevista a Mariela.

Para D7: cinco tarjetas, sin campo abierto, solución 1, 2 y 3. Si faltan y sobran tarjetas a la vez, muestra ambos mensajes. Reintentos ilimitados. El formulario está rotulado «SIMULACIÓN. Este ejercicio no envía reportes» y no realiza ninguna solicitud de red (verificable en las pruebas).

Valida en una prueba automatizada: destinos inexistentes, nodos inaccesibles, IDs duplicados, decisiones sin opción correcta, ciclos sin salida, ausencia de final y cobertura de ambos roles.

Guarda el progreso anónimo localmente (rol, escena actual, herramientas consultadas, insignias) con versión de contenido. Si la versión guardada no coincide, informa y ofrece reiniciar, sin errores. Ofrece borrar el progreso. No uses puntuaciones de «confianza» de Mariela ni presentes su reacción como prueba de verdad.

### 5.2 Insignias

Implementa las tres insignias del guion como reglas configurables: «Escucha respetuosa» (D1–D2), «Reporte responsable» (D4–D7) y «Respuesta centrada en la persona» (D3, D8–D9). Interpreta «con comprensión» como completar esas decisiones llegando a la opción adecuada o a su reparación; equivocarse antes no impide obtenerla. Deja documentada esta interpretación como provisional. Las insignias no equivalen a aprobación ni se envían al servidor.

### 5.3 Reglas de interacción

- No hay campos de texto libre en el juego. Los únicos campos editables son los del perfil (nombre y organización) y el correo para autenticación.
- Las alternativas equivocadas muestran consecuencias respetuosas y explicaciones que dicen qué riesgo introducen y cómo mejorar, sin humillar.
- No produzcas daño a un personaje como castigo por fallar.

## 6. Reglas de salvaguarda obligatorias

- Escuchar sin culpabilizar ni interrogar.
- No pedir detalles íntimos, pruebas ni relatos reales a la persona jugadora.
- No prometer secreto absoluto.
- Explicar el deber de reporte y los límites de confidencialidad.
- Atender seguridad y necesidades inmediatas dentro del propio rol.
- No confrontar al señalado ni investigar personalmente.
- Reportar con información disponible, sin esperar certeza ni una clasificación previa.
- Compartir información mínima por vías restringidas.
- Distinguir reporte institucional, consentimiento para apoyos y obligaciones aplicables.
- Evitar represalias y no condicionar apoyos a demostrar lo ocurrido.
- No prometer resultados que no dependen de la persona jugadora (por ejemplo, la obtención de una plaza).

La obligación general de reporte dentro de 24 horas de conocer la preocupación no debe confundirse con los plazos específicos de escalamiento. No conviertas referencias de 48/72 horas en una instrucción para esperar.

La tarjeta de niveles debe explicar que nivel 1 se refiere a protección infantil vinculada a actores externos no afiliados y puede incluir daños graves; no significa «leve». Nivel 2 y nivel 3 se explican conforme a las fuentes y su valoración corresponde a los roles competentes. No uses una escala «menor/moderado/grave». No solicites asignar nivel antes de reportar. La tarjeta aclara que el caso del episodio afecta a una persona adulta y que la clasificación aplicable la determina el referente.

Los datos faltantes de la ruta se resuelven mediante texto genérico y configuración centralizada (un único archivo de configuración de contactos y canales, con estado `verificado` / `pendiente`), sin teléfonos, autoridades ni personas inventadas. Corrige el error tipográfico de Speak Up presente en la PPT, contrastándolo con la política. Mantén cualquier contacto no verificado sin enlace activo y señalado como pendiente de configuración.

El juego no es un sistema de denuncias. Ningún formulario simulado envía información a canales reales. El botón de reporte real no transfiere decisiones, perfil ni historial del juego, y no precarga datos en formularios externos. No añadas un chatbot ni generación de respuestas mediante IA en tiempo real.

## 7. Evaluación y registro confiable

Implementa como configuración pedagógica provisional: diez preguntas, un punto cada una; aprobación con al menos 8/10 **y** acierto en las preguntas críticas 2, 3, 4 y 6. Son condiciones simultáneas. No atribuyas ese umbral a la política; muéstralo como criterio pedagógico propuesto.

La evaluación es accesible sin completar la práctica (el guion la declara independiente), aunque se recomienda hacerla después del cierre. Puede realizarse sin cuenta como resultado de práctica no registrado; ese resultado nunca se convierte después en aprobación registrada. Para registrar, la persona se autentica **antes** de iniciar el intento.

La retroalimentación de práctica es inmediata. La evaluación oculta soluciones hasta el envío final; después muestra, por pregunta, si fue correcta y la explicación del guion. Mezcla el orden de opciones (y, si lo deseas, de preguntas) mediante IDs, conservando la correspondencia correcta; no muestres letras A/B/C ligadas a la clave. No cambies el sentido de preguntas.

Resultado: usa los tres textos del guion (aprobación, puntaje suficiente con error crítico, puntaje insuficiente). Ante un error crítico, muestra el criterio afectado, la herramienta correspondiente y un breve caso de recuperación con explicación, nunca un juicio sobre la persona. Mientras solo existan diez ítems, el nuevo intento repite esta versión y lo informa como «práctica reforzada»; no declares un banco alternativo ni independencia entre intentos. Deja la estructura preparada para un banco de ítems equivalentes revisados. No hay bloqueo por número de intentos ni espera punitiva.

El servidor crea el intento (ID, versión de contenido, orden de presentación y vencimiento) y, al recibir el envío, calcula puntaje, criterios críticos, fecha y aprobación. Nunca acepta `passed`, puntaje, rol, organización de otro usuario o identidad como datos confiables enviados por el cliente. Valida sesión, propietario del intento, versión, conjunto completo de preguntas y opciones; rechaza duplicados, preguntas omitidas y opciones ajenas al intento. Cada intento solo puede enviarse una vez (idempotencia frente a repetición y doble clic). Aplica límites de solicitudes por usuario, implementados en base de datos o en la función, generosos para reintentos educativos.

La clave de evaluación no se expone mediante una API pública ni en respuestas anteriores al envío. Documenta que el repositorio público puede contener el contenido y que una evaluación formativa sin supervisión no impide consultar respuestas. No prometas condiciones de examen seguro.

Registra solo identificador, nombre, correo verificado, organización, episodio y versión, fecha, puntaje y estado. Añade datos de intentos solo si son necesarios para integridad y seguimiento, y documenta su finalidad. Nombre y organización son autodeclarados; indícalo en el panel. No guardes relatos, datos de casos, decisiones de práctica ni información de personajes.

La aprobación corresponde al episodio y su versión. No generes certificados oficiales ni afirmes aprobación total del curso ni habilitación para investigar o gestionar casos.

## 8. Autenticación y autorización

Usa correo verificado, admitiendo correos de socios externos; no asumas un dominio único. Configura el retorno de autenticación compatible con GitHub Pages (véase el apartado 3) y elimina datos sensibles de la URL tras procesarlos.

Habilita RLS y privilegios mínimos en las tablas expuestas. Cada participante solo puede leer su propio perfil y resultados y actualizar nombre y organización. No puede escribir puntajes, cambiar aprobaciones, asignarse roles ni consultar otras personas. Los resultados solo se escriben desde la función de evaluación.

La asignación del Punto Focal se realiza mediante un mecanismo administrativo de backend documentado (por ejemplo, un script o una función SQL ejecutable solo por el operador del servicio). Nunca mediante selector de rol, correo enviado desde el navegador, `localStorage`, metadatos editables por la persona usuaria o botones ocultos. El rol de práctica «ChildFund/socio» no otorga privilegios administrativos.

Un único Punto Focal activo administra el registro, garantizado por una restricción de base de datos. Documenta su sustitución y revocación sin permitir autodesignación. Exige MFA para el acceso administrativo y compruébalo en el servidor y en las políticas (nivel de garantía de la sesión, no solo la interfaz).

La exigencia de único rol autorizado en la aplicación no elimina el acceso técnico de operadores del servicio: documenta esa limitación y minimiza esos permisos. No prometas exclusividad criptográfica que no has construido.

Las claves elevadas y secretos se quedan en el servidor. Solo las claves públicas previstas por el proveedor pueden estar en variables de frontend. Protege endpoints, funciones, vistas, exportaciones y tablas; no basta con ocultar el panel. Configura CORS por entorno y nunca lo uses como sustituto de autorización.

## 9. Panel del Punto Focal y privacidad

«Administrar el registro» significa: consultar registros, filtrar por organización, episodio, versión, estado y fecha, exportar CSV privado y, si es necesario, anular un registro con motivo obligatorio y trazabilidad. El Punto Focal no edita puntajes ni crea aprobaciones manuales.

Protege la exportación contra inyección de fórmulas de hoja de cálculo, genérala en el servidor con la misma autorización y registra el acceso administrativo con metadatos mínimos. Evita resultados personales en logs, URLs, notificaciones públicas y cachés compartidas (respuestas con `Cache-Control: no-store`).

No construyas un ranking ni estadísticas por persona visibles para terceros. No añadas roles de consulta para coordinaciones o socios. Cada participante conserva acceso solo a su resultado. El apoyo formativo del Punto Focal se ofrece sin publicar resultados.

Incluye el aviso previo al registro del guion (apartado 18) y un aviso de privacidad configurable. No inventes responsable del tratamiento, plazos de conservación ni bases jurídicas: documenta qué debe completar la institución antes de activar el registro real, y bloquea la activación del modo registro en producción mientras esos campos estén vacíos. Evita analítica y rastreadores de terceros. Cerrar sesión debe limpiar datos de interfaz, estado en memoria y caché privados, sin borrar el progreso anónimo de práctica salvo que la persona lo pida.

## 10. Estructura y entrega

Incluye código organizado, contenido del episodio, esquema de datos, migraciones, políticas RLS, funciones de evaluación, pruebas, `.env.example`, `.gitignore`, README, guía de despliegue, guía del Punto Focal, `docs/discrepancias.md`, `docs/cambios-editoriales.md` y checklist de configuración pendiente (contactos, aviso de privacidad, umbral pedagógico, activos de marca, banco de ítems).

Prepara GitHub Actions para validar (tipos, lint, pruebas, validación del grafo) y generar el frontend, y un flujo separado para publicarlo en Pages que solo se ejecute cuando el propietario lo habilite (por ejemplo, de forma manual). Separa el despliegue del backend y la configuración de secretos. No ejecutes una publicación externa sin instrucción expresa.

Los archivos fuente institucionales permanecen locales e ignorados. No incluyas claves reales, cuentas administrativas por defecto, datos reales ni contraseñas de ejemplo que puedan funcionar en producción.

## 11. Verificación necesaria

Ejecuta compilación, análisis de tipos, lint y pruebas relevantes:

- Validación del grafo narrativo y recorrido completo de ambos roles, incluidas todas las opciones de D1–D9.
- Cada tipo de resultado de opción: reparación obligatoria antes de avanzar, pausa que vuelve a la decisión sin ejecutar la acción, reintento y complemento.
- D7: solución correcta, faltantes, sobrantes, ambos casos y ausencia de solicitudes de red.
- Pausa, recuperación del progreso, cambio de versión de contenido, borrado del progreso y consulta de herramientas desde cualquier escena con retorno al mismo punto.
- Versión de lectura con las mismas decisiones que el modo gráfico.
- Móvil (320 px), teclado, foco movido al encabezado de la nueva escena tras cada cambio, anuncios para lector de pantalla, contraste (axe sin infracciones graves, objetivo WCAG 2.2 AA) y movimiento reducido.
- Aprobación con 8/10 y críticos correctos; no aprobación con 7/10 aunque los críticos estén correctos; no aprobación con 9/10 si falla un crítico.
- Preguntas y opciones mezcladas sin alterar claves.
- Anónimo sin acceso a registros; usuario A sin acceso a B, incluso por API directa.
- Usuario sin capacidad de editar puntaje, rol, aprobación ni identificador ajeno.
- Endpoint de evaluación que rechaza resultados falsificados, intentos ajenos, envíos repetidos, versiones incorrectas y respuestas incompletas o ajenas al intento.
- Punto Focal con autorización backend y MFA; exportación protegida y neutralizada frente a fórmulas; imposibilidad de un segundo Punto Focal activo.
- Modo sin backend claramente demostrativo; fallos de red que no crean una falsa aprobación.
- Rutas, recursos y retorno de autenticación compatibles con la subruta de Pages, sin tokens residuales en la URL.

Si no puedes ejecutar un control por falta de herramientas o credenciales, informa exactamente qué verificaste, qué queda pendiente y cómo ejecutarlo. No afirmes una integración real o prueba exitosa que no realizaste.

## 12. Forma de trabajo

Inspecciona primero el repositorio y respeta sus instrucciones. Presenta un plan breve y comienza la implementación. Avanza con decisiones reversibles razonables sin detenerte por preferencias menores. Trabaja por fases y confirma cada una con commits pequeños:

1. Configuración del proyecto, `.gitignore` de fuentes y extracción local de textos.
2. Contenido estructurado del episodio y validador del grafo.
3. Motor narrativo jugable con ambos roles, herramientas, insignias y versión de lectura.
4. Evaluación en modo demostración y pantallas de resultado.
5. Accesibilidad y pruebas de extremo a extremo.
6. Backend: esquema, RLS, función de evaluación, Punto Focal con MFA, exportación y pruebas.
7. CI, documentación y checklist de configuración pendiente.

No sustituyas requisitos difíciles por simulaciones silenciosas.

Al terminar entrega: resumen breve, comandos para ejecutar localmente, pruebas realizadas y resultado, archivos relevantes, discrepancias encontradas y pasos precisos que requieren configuración por el propietario. Distingue claramente funcionamiento local, backend preparado y despliegue real.

**Comienza ahora leyendo las fuentes y construyendo el proyecto.**
