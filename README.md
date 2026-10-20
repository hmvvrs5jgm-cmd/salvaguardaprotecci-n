# Decisiones que protegen

Juego web formativo en español para personas adultas del personal técnico de ChildFund Ecuador y de organizaciones socias. Es una novela gráfica interactiva de decisiones ramificadas con consecuencias explicadas.

**Módulo 1 — «Una ayuda con condiciones»** (guion v1.2): reconocer una posible explotación sexual vinculada con una ayuda, escuchar sin culpabilizar, atender la seguridad sin investigar, explicar los límites de la confidencialidad, activar el mecanismo institucional, compartir información mínima y distinguir reporte, asistencia e investigación.

**Módulo 2 — «Gracias por escucharme»** (guion v1.0): escuchar a una adolescente sin investigar ni culpabilizar, explicar la confidencialidad con lenguaje adecuado a la edad, atender un riesgo inmediato dentro del rol, no contactar automáticamente a la familia, comunicar con información mínima y contribuir a una derivación segura, verificada y con seguimiento.

**Módulo 3 — «Antes de abrir las puertas»** (guion v1.0): planificar, adaptar y realizar actividades seguras con niñas, niños y adolescentes. Revisar riesgos antes y durante la actividad, mantener la supervisión, respetar la participación voluntaria y la decisión sobre imágenes, controlar visitas, coordinar transporte y entrega segura, y adaptar o suspender lo que no tiene condiciones. Tiene dos ramas válidas: jornada adaptada y jornada suspendida.

**Módulo 4 — «La información también protege»** (guion v1.0): confidencialidad, necesidad de conocimiento y respuesta ante una exposición. Diferenciar interés, jerarquía y necesidad funcional; reconocer la identificación indirecta; compartir lo mínimo por canales y permisos aprobados; comunicar una exposición, también si el error es propio, y contener sin ocultar, borrar ni investigar.

**Módulo 5 — «Es alguien importante»** (guion v1.0): reporte seguro, conflictos de interés y prevención de represalias. Reconocer que el prestigio no exime del deber de reporte, separar hechos de suposiciones, usar un canal alternativo ante un posible conflicto, explicar los límites del anonimato y comunicar presiones o cambios adversos sin calificarlos como hechos probados. Tiene dos rutas: canal habitual y posible conflicto.

**Módulo 6 — «Una imagen que no debió publicarse»** (guion v1.0): uso seguro de imágenes, participación y respuesta ante exposición pública. Diferenciar participar, aceptar una foto y autorizar su publicación; reconocer la identificación por contexto; coordinar la contención sin difundir ni borrar registros; escuchar a la niña sin condicionar su participación, y no dar por cerrado un caso al retirar una publicación. Tiene dos desenlaces: no republicar o preparar contenido general independiente.

Cada módulo tiene su ruta (`#/m1` a `#/m6`), su progreso local, su evaluación y su resultado en el registro (por `episode_id` y versión). Las rutas anteriores (`#/jugar`, `#/evaluacion`…) llevan al módulo 1.

> Todas las personas y situaciones del juego son ficticias. El juego no es un sistema de denuncias: no envía información a ningún canal.

## Estado

| Pieza | Estado |
|---|---|
| Juego completo en local (modo demostración) | ✅ Funciona sin credenciales; resultados rotulados como «demostración no registrada» |
| Registro privado (Supabase) | 🟡 Preparado y probado en un PostgreSQL local con emulación de Supabase; **no se ha probado contra un proyecto Supabase real** |
| Publicación en GitHub Pages | 🟡 Flujo preparado y manual; **no se ha publicado** |

## Probar sin instalar nada

`npm run build:archivo` genera `decisiones-que-protegen-demo.html`, un único archivo autocontenido (modo demostración) que se abre con doble clic en cualquier navegador, sin conexión. Este archivo no aplica la política de seguridad de contenido del sitio publicado: úsalo solo para revisar.

## Ejecutar en local

Requisitos: Node 20+ (probado con 22).

```bash
npm ci
npm run dev          # http://localhost:5173 (modo demostración)
npm run build        # compilación estática en dist/
npm run preview      # sirve dist/ en http://localhost:4173
```

## Pruebas

```bash
npm run lint && npm run typecheck
npm test                       # unidades y componentes (Vitest + Testing Library)
npm run test:e2e               # Playwright + axe (escritorio, móvil 320 px, subruta de Pages)
npm run test:db                # migraciones y pruebas SQL en PostgreSQL local (sin Docker)
npm run validate:content       # grafo narrativo de cada módulo
npm run check:guion            # textos literales frente a los guiones locales (omite si no están)
npm run gen:assessment-sql -- --check   # banco del servidor sincronizado con el contenido
```

Si ya tienes un Chromium instalado: `PW_CHROMIUM_PATH=/ruta/a/chrome npm run test:e2e`.

## Modos

- **`demo`** (por defecto). La práctica y la evaluación se resuelven en el dispositivo. Nada se registra, y cada resultado lo indica. El panel del Punto Focal muestra datos ficticios.
- **`registro`** (`VITE_APP_MODE=registro`). La persona se identifica con un código de un solo uso enviado a su correo. El servidor crea el intento, decide el orden y calcula el puntaje y la aprobación. El navegador solo envía los IDs de las opciones elegidas. Si falla la red o el servidor, no se crea ninguna aprobación local.

El modo se fija en la compilación, nunca según la disponibilidad de la red.

## Estructura

```
src/
  content/            contenido tipado (único origen): episodio1/ a episodio6/ (escenas, evaluación, clave), herramientas, registro de módulos
  config/             canales y contactos (verificado/pendiente), privacidad, fuentes, modo
  engine/             motor de práctica (reductor puro), grafo, puntuación, mezcla, almacenamiento
  screens/ ui/        pantallas y componentes (modo gráfico y versión de lectura)
  services/           cliente del registro (Supabase), demostración, CSV
supabase/
  migrations/         esquema, RLS, funciones del servidor, banco generado
  tests/              pruebas SQL y ejecutor local
scripts/              validación del grafo, comparación con el guion, generación del banco, control de compilación
tests/e2e/            Playwright + axe
docs/                 despliegue, guía del Punto Focal, discrepancias, cambios editoriales, checklist, contraste de fuentes
```

## Fuentes institucionales

El guion, la política, el procedimiento y la PPT **se quedan en `referencias/`**, carpeta ignorada por git, y no se publican. Solo se publican los contenidos formativos necesarios para jugar, con sus fuentes citadas en cada herramienta. Consulta `docs/contraste_fuentes.md` y `docs/discrepancias.md`.

## Documentación

- [Guía de despliegue](docs/despliegue.md), con las decisiones técnicas y los límites de seguridad.
- [Guía del Punto Focal](docs/guia-punto-focal.md)
- [Checklist de configuración pendiente](docs/checklist-configuracion.md)
- [Discrepancias](docs/discrepancias.md) · [Cambios editoriales](docs/cambios-editoriales.md) · [Contraste de fuentes](docs/contraste_fuentes.md)
- [Prompt de construcción 1.2](docs/prompt/Prompt_Claude_Code_Decisiones_que_protegen.md)

## Límites conocidos

- La regla de aprobación de cada módulo (8/10 y críticas 2, 3, 4 y 6 en los módulos 1 y 2; 2, 4, 6 y 8 en el módulo 3; 2, 5, 6 y 7 en el módulo 4; 2, 4, 6 y 8 en el módulo 5; 2, 4, 5 y 6 en el módulo 6) es un **criterio pedagógico provisional**, no un requisito de la política.
- El repositorio es público: la evaluación es formativa y sin supervisión, no un examen seguro. La aprobación corresponde solo al módulo y la versión; no es un certificado.
- Mientras no exista un banco alternativo revisado, los nuevos intentos repiten las mismas diez preguntas («práctica reforzada»).
- Las personas que operan el proyecto Supabase tienen acceso técnico a los datos. «Único rol autorizado» se refiere a la aplicación.
- Personajes generados con IA, de cuerpo entero sobre un fondo neutro (`docs/activos-graficos.md`); términos de uso pendientes de confirmar. El color verde es provisional. No se usa el logotipo de ChildFund.
