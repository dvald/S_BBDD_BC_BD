# Seguridad en Bases de Datos, Blockchain y Big Data

Demos visuales de la asignatura del Grado en Ciberseguridad de UNIR.

**Web:** [dvald.github.io/S_BBDD_BC_BD](https://dvald.github.io/S_BBDD_BC_BD/)

## Contenido disponible

- **Tema 1 — Fundamentos y directrices:** clasificación, integridad, inyección SQL, permisos, riesgo, plazos y directrices verificables.
- **Tema 2 — Almacenamiento:** ruta hasta el dato, objetos/archivos/bloques, controles de acceso, configuración y deriva, y copias de seguridad.
- **Tema 3 — Bases de datos relacionales:** permisos, SQLi, alcance de TDE y máscaras, recuperación, métricas e informe de hardening.
- **Tema 4 — NoSQL y sistemas distribuidos:** rutas y consultas, revisión del plan, miembros y claves, respuesta a incidentes y runbook.
- **Tema 5 — Criptografía:** prueba local AES-GCM, ciclo de claves, identidad del destino y evidencias para el portfolio.

La portada enlaza 28 apartados. Cada demo permite volver al índice y recorrer los cinco temas mediante la navegación superior y los enlaces anterior/siguiente.

## Material docente del 13/11/2026

El sitio incorpora las demos de los temas 1–5. Los HTML de los temas 3 y 4 desarrollan los conceptos con explicaciones progresivas, ejemplos resueltos y demostraciones interactivas. Los ejercicios y las aportaciones al portfolio quedan como complementos. El modelo 4P conecta Problemas, Proyectos, Personas y Portfolio.

Abre `index.html` para recorrer el sitio. La clase del 13/11/2026 corresponde a [Tema 3 — Relacionales](03_relacionales.html) y [Tema 4 — NoSQL y sistemas distribuidos](04_distribuidas.html), en dos bloques de 60 minutos. El tema 5 es un material separado.

## Uso

Abre la web o descarga el repositorio y abre `index.html`. El sitio funciona sin servidor ni dependencias externas. Los enlaces a las fuentes requieren conexión.

Las demos emplean el caso ficticio CosechaDirecta. Combinan cálculos, resultados precalculados y simulaciones didácticas; no se conectan a servicios reales. El botón `i` de cada apartado explica la procedencia. El cálculo de plazos es orientativo y explicita sus límites.

El CSV y el ejercicio opcional de SQLite se descargan desde el tema 1. Para el ejercicio se necesita Python; para las demos del navegador no hace falta instalarlo.

Los recursos de los temas 3–5 se describen en [recursos/LEEME_345.md](recursos/LEEME_345.md). El laboratorio relacional ejecuta consultas y restauración en SQLite. El revisor del plan distribuido comprueba un contrato didáctico. Sus resultados no acreditan TDE, un clúster real ni políticas de red desplegadas. Las notas del portfolio se pueden exportar antes de cambiar de página si el navegador limita el almacenamiento de archivos locales.

## Publicación

GitHub Pages sirve la rama `main`, carpeta raíz `/`, con HTTPS. `.nojekyll` permite servir los archivos estáticos sin procesamiento adicional.

Este repositorio contiene el paquete público generado desde el proyecto docente. `manifiesto.json` registra las huellas SHA-256 de los 35 archivos actuales del sitio. `manifiesto_docencia_local.json` conserva el registro histórico de la revisión local previa a la publicación. Los materiales oficiales, las guías privadas, los PowerPoint del profesor y los generadores no forman parte de este paquete.
