# Material docente HTML

## Finalidad indicada por el docente

Los HTML sirven para **enseñar en clase**. Deben desarrollar conceptos y mecanismos con explicaciones progresivas, ejemplos visuales resueltos y demostraciones que permitan comprender por qué cambia un resultado. Las páginas principales no son fichas de ejercicios ni formularios de entrega.

Antes de pedir una decisión o prueba al alumnado, explicar el concepto y mostrar un ejemplo. Cerrar el problema inicial con una solución razonada. Dejar prácticas, plantillas y aportaciones al portfolio como complementos posteriores u opcionales.

Aplicar las 4P de UNIR: Problemas, Proyectos, Personas y Portfolio. Son dimensiones del aprendizaje, no una obligación de añadir cuadros para rellenar en cada apartado.

Mantener texto legible al proyectar, navegación accesible, funcionamiento sin conexión y límites claros entre explicación, simulación y ejecución real. Las interacciones deben mostrar el mecanismo, no limitarse a puntuar respuestas.

## Alcance de la revisión del 13/11/2026

El usuario ha pedido corregir los HTML nuevos de los temas 3 y 4 **sin tocar los que ya estaban commiteados** y mantener el trabajo solo local. En esta revisión se conservan todos los archivos que ya estaban versionados en el estado que tenían al iniciarla, incluidos el índice y los recursos compartidos. No revertir cambios previos del usuario o de otras tareas. No hacer commit, push ni publicación sin una nueva instrucción.

Los estilos y comportamientos nuevos de los temas 3 y 4 viven en archivos exclusivos con sufijo `_docencia`. `manifiesto_docencia_local.json` conserva las huellas de aquella revisión y de los archivos protegidos en ese momento; es un registro histórico.

## Publicación autorizada del 13/11/2026

Después de revisar la integración local, el usuario autorizó expresamente hacer commit, push y ejecutar GitHub Pages. La publicación comprende el sitio público de los temas 1–5, con los temas 3 y 4 corregidos y la navegación integrada. `manifiesto.json` es el registro vigente de sus 35 archivos. Conservar los contenidos de los temas 1 y 2 y excluir materiales oficiales, guías privadas, soluciones del profesor, PPTX y ZIP docentes. Comprobar el despliegue y los archivos servidos antes de declararlo publicado.

## Fuentes y regeneración

Las fuentes editables se encuentran en `../../Demos/fuentes_docencia/` y los recursos exclusivos en `../../Demos/`. Al generar o sincronizar, conservar ambas copias coherentes. No regenerar las fichas antiguas ni copiar todo el paquete sobre archivos protegidos. El helper `../../Demos/sincronizar_docencia_local.py` comprueba este límite antes de copiar los recursos nuevos.

La pauta docente completa está en `../../Demos/CRITERIOS_DOCENTES.md` y las instrucciones generales de la asignatura en `../../CLAUDE.md`.
