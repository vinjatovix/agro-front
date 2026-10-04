# agro-front: contexto para agentes

## Exploración de código: CodeGraph primero

Este repo está indexado con CodeGraph (`.codegraph/`). Antes de usar `grep`, `find`, `Read`,
`cat` o cualquier otra herramienta para localizar o entender código, **MUST** consultarse
CodeGraph:

- Herramienta MCP `codegraph_explore` (si aparece como diferida, cargarla con la búsqueda de
  herramientas).
- Si el MCP no está disponible: `codegraph explore "<símbolos o pregunta>"` en la shell.

Solo se recurre a `grep`/`Read` cuando CodeGraph no cubre lo que se busca (por ejemplo,
documentos Markdown, YAML o archivos no indexados) o su respuesta es insuficiente.

## Documentos de referencia

- `.specify/memory/constitution.md`: principios y quality gates (prevalece sobre todo lo demás).
- `docs/context.md`: estado real del sistema.
- `docs/design.md`: diseño.
- `contracts/openapi.yaml`: contrato de la API (no se edita a mano).
