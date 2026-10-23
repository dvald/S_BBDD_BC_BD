// Generado por generar_datos_01.py a partir del caso, del script de SQLite y del CSV. No editar a mano.
const SBD_DATOS = {
 "empresa": {
  "nombre": "CosechaDirecta S.L.",
  "actividad": "mercado en línea de productores agroalimentarios",
  "empleados": 120,
  "facturacion": "18 M€",
  "paises": "España, Portugal y Brasil",
  "clientes": 48210,
  "productores": 1204
 },
 "niveles": [
  [
   "Público",
   "su divulgación no causa daño"
  ],
  [
   "Interno",
   "solo para la organización; daño limitado"
  ],
  [
   "Confidencial",
   "datos personales o financieros no públicos"
  ],
  [
   "Secreto",
   "daño severo para el negocio si se compromete"
  ]
 ],
 "clasificacion": [
  [
   "Fotos del catálogo",
   "MongoDB",
   "Público",
   "se publican; importa su integridad"
  ],
  [
   "Manual de devoluciones",
   "Back-office",
   "Interno",
   "solo para la plantilla"
  ],
  [
   "Correo de los clientes",
   "PostgreSQL",
   "Confidencial",
   "dato personal (RGPD)"
  ],
  [
   "Registros de acceso",
   "Servidor web",
   "Confidencial",
   "IP y usuario identifican personas"
  ],
  [
   "Navegación por cliente",
   "Data lake",
   "Confidencial",
   "permite perfilar a cada persona"
  ],
  [
   "Copias de seguridad",
   "Cloud externa",
   "Confidencial",
   "heredan el nivel de lo que copian"
  ],
  [
   "Plan de expansión",
   "Back-office",
   "Secreto",
   "su filtración dañaría el negocio"
  ]
 ],
 "csv_original": "email,nombre,importe_ultimo_pedido\nana@ejemplo.test,Ana,100\nluis@ejemplo.test,Luis,45\nmarta@ejemplo.test,Marta,230\n",
 "csv_modificado": "email,nombre,importe_ultimo_pedido\nana@ejemplo.test,Ana,1000\nluis@ejemplo.test,Luis,45\nmarta@ejemplo.test,Marta,230\n",
 "sha_original": "acda9a1b98d82122142c1f71d7e79f77b51a1449b4f945920fe85807e97726f6",
 "sha_modificado": "567caf251878cea010c1eadfb19cdf2a83e61c8257b5767325a93d8a09f974c3",
 "productos": [
  [
   "Tomate rosa",
   3.2
  ],
  [
   "Tomate cherry",
   2.9
  ],
  [
   "Aceite de oliva virgen extra",
   9.5
  ],
  [
   "Queso curado de oveja",
   14.0
  ],
  [
   "Miel de romero",
   6.8
  ]
 ],
 "entradas": [
  [
   "A",
   "tomate",
   "búsqueda normal"
  ],
  [
   "B",
   "x' OR 1=1 --",
   "la condición se cumple siempre"
  ],
  [
   "C",
   "x' UNION SELECT email, nombre FROM clientes --",
   "añade filas de otra tabla"
  ]
 ],
 "modos": {
  "vulnerable": "concatena el texto en la SQL",
  "parametrizada": "sentencia y dato por separado",
  "minimo": "concatena, pero la cuenta solo lee productos"
 },
 "busquedas": [
  {
   "modo": "vulnerable",
   "entrada": "tomate",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE '%tomate%'",
   "parametro": null,
   "filas": [
    [
     "Tomate rosa",
     3.2
    ],
    [
     "Tomate cherry",
     2.9
    ]
   ],
   "error": null,
   "id": "A"
  },
  {
   "modo": "vulnerable",
   "entrada": "x' OR 1=1 --",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE '%x' OR 1=1 --%'",
   "parametro": null,
   "filas": [
    [
     "Tomate rosa",
     3.2
    ],
    [
     "Tomate cherry",
     2.9
    ],
    [
     "Aceite de oliva virgen extra",
     9.5
    ],
    [
     "Queso curado de oveja",
     14.0
    ],
    [
     "Miel de romero",
     6.8
    ]
   ],
   "error": null,
   "id": "B"
  },
  {
   "modo": "vulnerable",
   "entrada": "x' UNION SELECT email, nombre FROM clientes --",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE '%x' UNION SELECT email, nombre FROM clientes --%'",
   "parametro": null,
   "filas": [
    [
     "ana@ejemplo.test",
     "Ana"
    ],
    [
     "luis@ejemplo.test",
     "Luis"
    ],
    [
     "marta@ejemplo.test",
     "Marta"
    ]
   ],
   "error": null,
   "id": "C"
  },
  {
   "modo": "parametrizada",
   "entrada": "tomate",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE ?",
   "parametro": "%tomate%",
   "filas": [
    [
     "Tomate rosa",
     3.2
    ],
    [
     "Tomate cherry",
     2.9
    ]
   ],
   "error": null,
   "id": "A"
  },
  {
   "modo": "parametrizada",
   "entrada": "x' OR 1=1 --",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE ?",
   "parametro": "%x' OR 1=1 --%",
   "filas": [],
   "error": null,
   "id": "B"
  },
  {
   "modo": "parametrizada",
   "entrada": "x' UNION SELECT email, nombre FROM clientes --",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE ?",
   "parametro": "%x' UNION SELECT email, nombre FROM clientes --%",
   "filas": [],
   "error": null,
   "id": "C"
  },
  {
   "modo": "minimo",
   "entrada": "tomate",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE '%tomate%'",
   "parametro": null,
   "filas": [
    [
     "Tomate rosa",
     3.2
    ],
    [
     "Tomate cherry",
     2.9
    ]
   ],
   "error": null,
   "id": "A"
  },
  {
   "modo": "minimo",
   "entrada": "x' OR 1=1 --",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE '%x' OR 1=1 --%'",
   "parametro": null,
   "filas": [
    [
     "Tomate rosa",
     3.2
    ],
    [
     "Tomate cherry",
     2.9
    ],
    [
     "Aceite de oliva virgen extra",
     9.5
    ],
    [
     "Queso curado de oveja",
     14.0
    ],
    [
     "Miel de romero",
     6.8
    ]
   ],
   "error": null,
   "id": "B"
  },
  {
   "modo": "minimo",
   "entrada": "x' UNION SELECT email, nombre FROM clientes --",
   "sql": "SELECT nombre, precio FROM productos WHERE nombre LIKE '%x' UNION SELECT email, nombre FROM clientes --%'",
   "parametro": null,
   "filas": [],
   "error": "DatabaseError: access to clientes.email is prohibited",
   "id": "C"
  }
 ],
 "riesgos": {
  "R1": {
   "nombre": "Data lake en lectura pública",
   "activo": "Histórico de compras y navegación",
   "amenaza": "Mala configuración cloud",
   "vulnerabilidad": "Contenedor abierto en lectura pública «unos días»",
   "p": 4,
   "i": 5,
   "controles": [
    [
     "Bloqueo de acceso público a nivel de cuenta",
     "p",
     2,
     "Cierra la puerta: es mucho menos probable que alguien lea el contenedor."
    ],
    [
     "Minimizar el histórico (sin campos innecesarios y con plazo de borrado)",
     "i",
     4,
     "Si se filtra, se expone menos información de cada cliente."
    ]
   ]
  },
  "R2": {
   "nombre": "Inyección SQL en el buscador",
   "activo": "Base de datos de clientes y pedidos",
   "amenaza": "Inyección SQL",
   "vulnerabilidad": "La búsqueda concatena el texto del usuario en la SQL",
   "p": 3,
   "i": 5,
   "controles": [
    [
     "Consultas parametrizadas",
     "p",
     1,
     "La entrada viaja como dato: la inyección deja de funcionar."
    ],
    [
     "Cuenta de BD con mínimo privilegio",
     "i",
     3,
     "Si hay inyección, la cuenta no puede leer clientes ni borrar tablas."
    ]
   ]
  },
  "R3": {
   "nombre": "Ransomware cifra producción y copias",
   "activo": "Bases de datos y copias",
   "amenaza": "Ransomware",
   "vulnerabilidad": "Copias en la misma cuenta y sin restauración probada",
   "p": 3,
   "i": 5,
   "controles": [
    [
     "Parches y segmentación de la red",
     "p",
     2,
     "Es más difícil entrar y propagarse."
    ],
    [
     "Copia inmutable o fuera de línea con restauración probada",
     "i",
     3,
     "Si cifra producción, hay a qué volver (aunque los datos robados siguen fuera)."
    ]
   ]
  },
  "R4": {
   "nombre": "Abuso de la cuenta de soporte externo",
   "activo": "Bases de datos de clientes y productores",
   "amenaza": "Abuso de privilegios",
   "vulnerabilidad": "Cuenta de administrador permanente sin MFA",
   "p": 2,
   "i": 4,
   "controles": [
    [
     "Acceso temporal aprobado y con MFA",
     "p",
     1,
     "Fuera de la ventana aprobada, la cuenta no sirve."
    ],
    [
     "Alerta ante exportaciones masivas",
     "i",
     3,
     "Se detecta pronto y se corta antes de que salga todo."
    ]
   ]
  },
  "R5": {
   "nombre": "Intrusión por el framework sin parchear",
   "activo": "Web, API y lo que alcanzan",
   "amenaza": "Vulnerabilidad conocida explotada",
   "vulnerabilidad": "Framework web sin actualizar desde hace meses",
   "p": 4,
   "i": 5,
   "controles": [
    [
     "Parchear en plazo (críticos en días, no meses)",
     "p",
     2,
     "La vulnerabilidad publicada deja de estar disponible."
    ],
    [
     "Segmentar web y base de datos",
     "i",
     4,
     "Quien entra por la web no llega directamente a todo."
    ]
   ]
  },
  "R6": {
   "nombre": "Fuga desde preproducción",
   "activo": "Copia de clientes en preproducción",
   "amenaza": "Fuga o exposición inadvertida",
   "vulnerabilidad": "Preproducción con datos reales y acceso amplio",
   "p": 4,
   "i": 3,
   "controles": [
    [
     "Acceso nominal y registrado a preproducción",
     "p",
     3,
     "Menos personas y cada acceso queda trazado."
    ],
    [
     "Datos sintéticos o anonimizados en pruebas",
     "i",
     1,
     "Si se filtran, no hay datos personales (seudonimizar no basta)."
    ]
   ]
  },
  "R7": {
   "nombre": "Tienda caída en campañas",
   "activo": "Web y API",
   "amenaza": "Denegación de servicio (DoS/DDoS)",
   "vulnerabilidad": "Sin protección frente a picos ni ataques volumétricos",
   "p": 3,
   "i": 3,
   "controles": [
    [
     "Protección anti-DDoS y red de distribución de contenidos",
     "p",
     2,
     "El tráfico malicioso se filtra antes de llegar."
    ]
   ]
  },
  "R8": {
   "nombre": "Listados de clientes por correo",
   "activo": "Datos de clientes",
   "amenaza": "Fuga por error humano",
   "vulnerabilidad": "Se envían listados completos a proveedores por correo",
   "p": 3,
   "i": 3,
   "controles": [
    [
     "Prevención de pérdida de datos (DLP) en el correo saliente",
     "p",
     2,
     "El envío de datos personales a destinos externos se bloquea o se revisa."
    ]
   ]
  }
 },
 "permisos_columnas": [
  "Leer catálogo",
  "Leer clientes",
  "Modificar pedidos",
  "Exportar tablas",
  "Cambiar estructura"
 ],
 "permisos": {
  "app_web": [
   "la web y la API",
   [
    "sí",
    "sí",
    "sí",
    "sí",
    "sí"
   ],
   [
    "sí",
    "solo el cliente con sesión",
    "sí",
    "no",
    "no"
   ]
  ],
  "analista_bi": [
   "informes de negocio",
   [
    "sí",
    "sí",
    "no",
    "sí",
    "no"
   ],
   [
    "sí",
    "vista con lo necesario",
    "no",
    "no",
    "no"
   ]
  ],
  "soporte_ext": [
   "proveedor de soporte",
   [
    "sí",
    "sí",
    "sí",
    "sí",
    "sí"
   ],
   [
    "temporal",
    "temporal",
    "temporal",
    "no",
    "no"
   ]
  ]
 },
 "registro": [
  [
   "05/11 09:14:02",
   "app_web",
   "10.0.1.20",
   "SELECT",
   "productos",
   "2",
   false
  ],
  [
   "05/11 09:14:07",
   "app_web",
   "10.0.1.20",
   "SELECT",
   "clientes (id = 1842)",
   "1",
   false
  ],
  [
   "05/11 11:02:40",
   "analista_bi",
   "10.0.3.15",
   "SELECT",
   "pedidos (total por día)",
   "31",
   false
  ],
  [
   "05/11 23:30:00",
   "copia_bd",
   "10.0.2.5",
   "copia programada",
   "todas las tablas",
   "—",
   false
  ],
  [
   "06/11 03:12:44",
   "soporte_ext",
   "198.51.100.23",
   "COPY … TO STDOUT",
   "clientes",
   "48 210",
   true
  ],
  [
   "06/11 03:13:09",
   "soporte_ext",
   "198.51.100.23",
   "COPY … TO STDOUT",
   "productores",
   "1 204",
   true
  ]
 ],
 "alerta_motivos": [
  "cuenta de un proveedor, a las 3 de la madrugada",
  "dirección IP externa que no es la habitual",
  "exporta tablas completas con datos personales"
 ],
 "plazos": {
  "constancia": "2026-11-06T18:00",
  "escenario": "El viernes 6 de noviembre a las 18:00, el equipo confirma que la cuenta del soporte externo exportó las tablas de clientes y productores sin cifrar. Hay clientes en España, Portugal y Brasil.",
  "rgpd": "lunes 9/11/2026, 18:00",
  "nis2_alerta": "sábado 7/11/2026, 18:00",
  "nis2_notificacion": "lunes 9/11/2026, 18:00",
  "nis2_final": "miércoles 9/12/2026, 18:00",
  "anpd": "miércoles 11/11/2026"
 },
 "festivos_br": [
  "01-01",
  "04-21",
  "05-01",
  "09-07",
  "10-12",
  "11-02",
  "11-15",
  "11-20",
  "12-25"
 ],
 "campos": [
  [
   "que",
   "Qué"
  ],
  [
   "cuando",
   "Cuándo"
  ],
  [
   "responsable",
   "Responsable"
  ],
  [
   "evidencia",
   "Evidencia"
  ],
  [
   "origen",
   "Origen"
  ]
 ],
 "directrices": {
  "vaga": {
   "id": "—",
   "nombre": "Copias de seguridad",
   "que": "Se realizarán copias de seguridad periódicas de forma segura.",
   "cuando": "",
   "responsable": "",
   "evidencia": "",
   "origen": ""
  },
  "copias": {
   "id": "DIR-03",
   "nombre": "Copias de seguridad",
   "que": "Las BD de clientes, pedidos y productores se copian cada día; una copia se guarda cifrada e inmutable o fuera de línea, en una cuenta distinta de la de producción.",
   "cuando": "Copia diaria; cada mes se restaura una copia completa en un entorno aislado y se mide el tiempo.",
   "responsable": "Jefe de Operaciones.",
   "evidencia": "Informe mensual de restauración (fecha, alcance, resultado y tiempo).",
   "origen": "R3 · RGPD art. 32.1 c) · ISO/IEC 27001:2022, control 8.13."
  },
  "R1": {
   "id": "DIR-01",
   "nombre": "Almacenamiento cloud sin acceso público",
   "que": "Ningún contenedor del data lake con datos de clientes admite acceso público: se impone con un bloqueo a nivel de cuenta. Los contenidos destinados al público se publican en un recurso separado, sin datos personales, tras revisión y autorización de Seguridad.",
   "cuando": "Comprobación automática diaria; revisión de permisos cada trimestre.",
   "responsable": "Responsable de la plataforma de datos.",
   "evidencia": "Informe automático diario sin contenedores públicos en el data lake y acta de la revisión trimestral.",
   "origen": "R1 · RGPD art. 32 · ISO/IEC 27001:2022, controles 5.15 y 5.23."
  },
  "R6": {
   "id": "DIR-06",
   "nombre": "Datos en entornos de prueba",
   "que": "Fuera de producción solo hay datos sintéticos o anonimizados, con una evaluación documentada de que no permiten reidentificar. Los datos seudonimizados siguen siendo personales: solo como excepción autorizada, con acceso mínimo, cifrado, registro y borrado.",
   "cuando": "En cada carga de datos en preproducción.",
   "responsable": "Responsable de Desarrollo.",
   "evidencia": "Registro de cada carga y revisión trimestral de una muestra.",
   "origen": "R6 · RGPD arts. 5.1 c) y 25 · ISO/IEC 27001:2022, controles 8.31 y 8.33."
  }
 },
 "criterios": [
  [
   "Concreta",
   "dice qué se hace y sobre qué datos"
  ],
  [
   "Verificable",
   "un tercero la comprueba con una evidencia"
  ],
  [
   "Con responsable",
   "un rol concreto, no «todos» ni «IT»"
  ],
  [
   "Con frecuencia",
   "o un momento claro en que se aplica"
  ],
  [
   "Trazable",
   "nace de un riesgo y de una norma o control"
  ],
  [
   "Proporcional",
   "su coste encaja con el riesgo que reduce"
  ]
 ]
};
if (typeof module !== "undefined" && module.exports) module.exports = SBD_DATOS; else window.SBD_DATOS = SBD_DATOS;
