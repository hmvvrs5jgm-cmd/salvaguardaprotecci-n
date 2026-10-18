# Decisiones que protegen

Juego web formativo en español para personas adultas del personal técnico de ChildFund Ecuador y de organizaciones socias. Es una novela gráfica interactiva de decisiones ramificadas con consecuencias explicadas.

**Episodio 1 — «Una ayuda con condiciones»** (guion v1.1): reconocer una posible explotación sexual vinculada con una ayuda, escuchar sin culpabilizar, atender la seguridad sin investigar, explicar los límites de la confidencialidad, activar el mecanismo institucional, compartir información mínima y distinguir reporte, asistencia e investigación.

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
npm run validate:content       # grafo narrativo
npm run check:guion            # textos literales frente al guion local (omite si no está)
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
  content/            contenido tipado (único origen): escenas, herramientas, evaluación, clave
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

- La regla de aprobación (8/10 y críticas 2, 3, 4 y 6) es un **criterio pedagógico provisional**, no un requisito de la política.
- El repositorio es público: la evaluación es formativa y sin supervisión, no un examen seguro. La aprobación corresponde solo al episodio y versión; no es un certificado.
- Mientras no exista un banco alternativo revisado, los nuevos intentos repiten las mismas diez preguntas («práctica reforzada»).
- Las personas que operan el proyecto Supabase tienen acceso técnico a los datos. «Único rol autorizado» se refiere a la aplicación.
- Ilustraciones proporcionadas por la institución (`docs/activos-graficos.md`); derechos de uso pendientes de confirmar. El color verde es provisional. No se usa el logotipo de ChildFund.
