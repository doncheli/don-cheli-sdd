# Product

## Register

product

## Users

Usuarios principales: desarrolladores y product managers que están construyendo software con Don Cheli SDD, un framework de Desarrollo Dirigido por Especificaciones que se apoya en asistentes de IA (Claude Code, Cursor, Gemini, Codex, OpenCode y otros).

Usan el Studio en paralelo a su editor de IA. En el editor le piden cosas al asistente ("especifica esto", "planifica esto", "construye esto"); en el Studio ven en tiempo real qué está haciendo el asistente, cuánto está gastando, qué archivos fue generando, y si algún control de calidad falló. Sesiones típicas son largas (20 a 40 minutos) y ocurren varias veces al día durante la jornada laboral.

El usuario puede ser muy técnico (desarrolladores senior) o relativamente no técnico (PMs, fundadores sin background profundo de ingeniería). La herramienta tiene que funcionar bien para los dos.

## Product Purpose

Don Cheli Studio es la torre de control visual del framework Don Cheli SDD.

Propósito: que con un solo vistazo el usuario sepa
1. si algo requiere su atención ahora,
2. cómo van los trabajos que tiene corriendo,
3. cuánto está invirtiendo en la IA,
4. qué capacidades tiene disponibles para pedir más.

Éxito se ve como: el usuario abre el Studio varias veces al día sin fricción, confía en los números que ve, encuentra rápido el trabajo o el archivo que busca, y puede explicarle a otra persona qué está pasando con solo compartir pantalla.

El Studio no reemplaza al editor de IA donde se hace el trabajo; lo acompaña.

## Brand Personality

Cuatro palabras:

1. **Fácil de entender** — alguien que nunca abrió Don Cheli debería sentirse orientado en su primer minuto.
2. **Cercano** — el tono es de un colega que te muestra cómo funciona, no de un manual corporativo.
3. **Amigable** — invita a usarse. No es frío, no es pesado.
4. **Claro** — cada número, cada estado, cada etiqueta dice exactamente lo que significa.

Voz: tuteo colombiano neutro. Frases cortas. Sin jerga técnica innecesaria. Cuando algo requiera explicarse, se explica completo. Nunca se usa el voseo rioplatense ni modismos argentinos.

## Anti-references

Lo que Don Cheli Studio NO debe parecer:

- **Enterprise aburrido** (Salesforce, SAP, JIRA, ServiceNow): azules corporativos genéricos, cajas grises, interfaces pesadas que requieren entrenamiento para ser usables. La antigua forma de vender "seriedad".

- **Juguetón o cutesy** (Duolingo UI, Notion con stickers, Mailchimp cartoon): iconos sonrientes, colores pastel, ilustraciones infantiles, tono que intenta ser simpático a toda costa. La herramienta trata un trabajo profesional, no es un juego.

- **Data-dense tipo Bloomberg** (Bloomberg Terminal, trading platforms, muchos Datadog dashboards): pantallas saturadas, cada píxel usado, sin aire para respirar, diseñadas solo para power-users que ya saben dónde está todo.

## Design Principles

1. **Legibilidad sobre densidad.** Cabe menos, pero lo que cabe se lee. Si tenemos que elegir entre meter un dato más o dejar aire, gana el aire.

2. **Lenguaje humano.** El copy explica. "Qué está haciendo Don Cheli" antes que "Stream WebSocket de la fase actual". El Glosario y la Guía están para los tecnicismos cuando el usuario los quiera.

3. **Torre de control, no consola de monitoreo.** El dashboard ayuda a diagnosticar cuando hace falta; no a mirar 8 horas del día. Las alertas avisan; la interfaz investiga.

4. **Calidez sin caer en caricatura.** El producto es amigable pero se toma su trabajo en serio. Sin iconos sonrientes, sin colores pastel, sin bromas en el copy.

5. **Progressive disclosure.** Lo que necesitas ver siempre está a la vista; lo que necesitas solo a veces está a un clic. Las tres capas de información (de un vistazo / trabajar / consultar) encarnan esto.

## Accessibility & Inclusion

- **WCAG AA** como estándar: contraste mínimo 4.5:1 en texto normal, 3:1 en texto grande e iconos.
- Navegación completa por teclado con `Tab` y `Shift+Tab`. Atajos documentados en la Guía.
- `prefers-reduced-motion` respetado: animaciones decorativas se desactivan cuando el sistema lo pide.
- Iconografía siempre acompañada de texto o `aria-label`.
- Los estados (en marcha, terminado, con error, pausado) nunca se comunican solo por color. Texto o forma siempre presentes junto al color.
- El tuteo se mantiene pero no asume edad, género ni nivel técnico del lector.
- Los números y monedas siguen convención latinoamericana (punto para miles, coma para decimales solo en español; el código fuente puede usar el formato inverso).
