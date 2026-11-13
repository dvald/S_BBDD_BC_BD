# CosechaDirecta · pruebas y aportaciones al portfolio

Todo el caso y sus datos son ficticios. Los recursos pertenecen a los problemas
de los temas 3, 4 y 5. No añaden una actividad evaluable ni cambian la Actividad 1.

## Informe relacional

Requisito: Python 3.9 o posterior; solo biblioteca estándar.

Descarga `lab_relacional.py` y ejecuta en una carpeta propia:

```sh
python3 lab_relacional.py --salida evidencia-relacional.json
```

El programa usa bases y archivos temporales que él mismo crea. No modifica bases
existentes. Ejecuta una búsqueda concatenada y otra parametrizada con tres
entradas, dos consultas con alcance por cliente y una copia/restauración SQLite.
Valida filas e integridad y mide restauración más validación local. Importa su
JSON en «Consulta y pruebas» del tema 3 y explica qué demuestra.

La medida no es el RTO de una aplicación. No ejecuta TDE, roles PostgreSQL ni
PITR. La condición por cliente pertenece a la consulta de la aplicación.
`comprobar_tde.sql` es una consulta de inspección para un laboratorio SQL Server
con permisos adecuados. La ejecución y restauración TDE requieren ese entorno.
No guardes claves ni certificados privados en el portfolio.

## Diseño distribuido y runbook

Descarga `revisar_despliegue.py` y uno de los dos planes JSON:

```sh
python3 revisar_despliegue.py catalogo_inicial.json
python3 revisar_despliegue.py catalogo_propuesto.json
```

El inicial devuelve código 1 por incumplimientos y el propuesto código 0. Un
formato inválido devuelve código 2. Se verifica un contrato didáctico, no un
manifiesto ejecutable ni la efectividad de políticas en un clúster.

Para demostrar un despliegue automatizado hay que aportar configuración concreta,
versiones, ejecución y pruebas de acceso y continuidad del entorno elegido.
La demo prepara las decisiones y comprobaciones pertinentes, no afirma ese logro.

Completa `runbook_catalogo.md` para la credencial filtrada del caso. Distingue
cliente, confianza entre miembros y clave de cifrado. Ensayar el runbook exige
un laboratorio real y evidencia adicional.

## Protección criptográfica

El tema 5 usa Web Crypto para ejecutar AES-256-GCM en memoria sobre un texto
ficticio. Comprueba ida/vuelta, rechazo de alteración y clave ajena. Si el
navegador no ofrece la API, informa de que no se ha ejecutado. El modelo de
rotación es una explicación de dependencias, no una migración de claves real.

## Continuar el trabajo

Las notas y evidencias se guardan en este navegador cuando lo permite. Si al
abrir archivos locales el navegador no comparte o no conserva almacenamiento,
exporta el portfolio JSON antes de cambiar de página e impórtalo para continuar.
El Markdown reúne las dos experiencias y conserva el origen de cada registro.
Una decisión, un resultado de modelo y una prueba local tienen alcances distintos.
