# Contratos

`openapi.yaml` es una **copia** del contrato de la AgroApp API. El original se versiona en `agro-back` (`src/apps/agroApi/openapi/openapi.yaml`) y es la fuente de verdad: cuando el front no coincide con él, el error está en el front.

No se edita aquí. Cuando el back entregue una versión nueva, se sustituye el archivo y se actualiza esta tabla.

| Fecha de entrega | Origen en `agro-back`  | SHA-256 de `openapi.yaml`                                          | Cambios destacados                                                                                                                     |
| ---------------- | ---------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-04       | Commit sin especificar | `f1a6017f6a26ddceb6c023f337e758a2d1cbfa237a87ca632fe033d9c3e2b22e` | `201` de `/auth/register` sin cuerpo; auth opcional en `GET /plants` y `GET /plants/{id}`; payload del JWT documentado en `bearerAuth` |
