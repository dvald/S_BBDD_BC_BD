// Generado por generar_datos_02.py a partir del caso, de la configuración y de los programas de la clase 3. No editar a mano.
const ALM_DATOS = {
 "empresa": {
  "nombre": "CosechaDirecta S.L.",
  "actividad": "mercado en línea de productores agroalimentarios",
  "empleados": 120,
  "facturacion": "18 M€",
  "paises": "España, Portugal y Brasil",
  "clientes": 48210,
  "productores": 1204
 },
 "clientes_txt": "48 210",
 "almacenes": [
  [
   "datalake",
   "Objetos",
   "cd-datalake-historico",
   "Proveedor cloud (cuenta cd-almacen)",
   "Histórico de compras y navegación de 48 210 clientes",
   "Confidencial",
   "API HTTPS: leer o escribir un objeto por su nombre",
   "Política del contenedor y roles; bloqueo de acceso anónimo de la cuenta"
  ],
  [
   "fotos",
   "Objetos",
   "cd-fotos-catalogo",
   "Proveedor cloud (cuenta cd-almacen)",
   "Fotos de los productos",
   "Público",
   "La web las lee con su propia identidad y las sirve",
   "Política del contenedor: solo la identidad de la web"
  ],
  [
   "nas",
   "Archivos",
   "nas-oficina \\\\listados",
   "Oficina",
   "Listados de clientes con dirección para la empresa de reparto",
   "Confidencial",
   "SMB 3 desde los PC; panel de administración HTTPS en el puerto 5001",
   "ACL de la compartición (usuarios y grupos del dominio)"
  ],
  [
   "san",
   "Bloques",
   "cabina-cpd · LUN pg-datos",
   "CPD (nube privada)",
   "Ficheros de PostgreSQL: clientes, pedidos y productores",
   "Confidencial",
   "iSCSI (puerto 3260): el servidor monta la LUN como un disco",
   "Zonificación y LUN masking (qué iniciador ve qué LUN); luego, el sistema operativo del servidor"
  ]
 ],
 "modalidades": [
  [
   "Objetos",
   "«dame el objeto 2026/10/navegacion.parquet del contenedor»",
   "objeto con nombre y metadatos",
   "el servicio: cada petición lleva identidad (o ninguna)",
   "política del contenedor, roles, bloqueo de acceso anónimo"
  ],
  [
   "Archivos",
   "«abre \\\\nas-oficina\\listados\\clientes_reparto.xlsx»",
   "fichero dentro de carpetas",
   "el NAS: conoce usuarios, grupos y carpetas",
   "ACL de la compartición y del fichero"
  ],
  [
   "Bloques",
   "«lee los bloques 0 a 2047 de la LUN 3»",
   "bloque de tamaño fijo, sin nombre",
   "nadie en la cabina: solo ve iniciadores; los ficheros los arma el servidor",
   "zonificación y LUN masking; después, el sistema operativo"
  ]
 ],
 "ejemplos_modalidad": [
  [
   "cd-datalake-historico (contenedor de objetos)",
   "Objetos",
   "HTTPS (API REST)",
   "Política del contenedor y roles",
   "Caso ficticio"
  ],
  [
   "\\\\nas-oficina\\listados",
   "Archivos",
   "SMB 3",
   "ACL de la compartición",
   "Caso ficticio"
  ],
  [
   "LUN pg-datos de la cabina del CPD",
   "Bloques",
   "iSCSI (TCP 3260)",
   "LUN masking; después, el sistema operativo",
   "Caso ficticio"
  ],
  [
   "Amazon EFS",
   "Archivos en cloud",
   "NFS v4.0 y v4.1",
   "Políticas IAM y grupos de seguridad; permisos POSIX",
   "docs.aws.amazon.com/efs/latest/ug/whatisefs.html"
  ],
  [
   "Azure Files",
   "Archivos en cloud",
   "SMB, NFS y API REST",
   "Identidad (AD o Entra ID) y red",
   "learn.microsoft.com/azure/storage/files/storage-files-introduction"
  ],
  [
   "Volumen de Amazon EBS conectado a una máquina virtual",
   "Bloques en cloud",
   "Se conecta a la instancia como un disco",
   "Quién puede conectarlo; después, el sistema operativo",
   "docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html"
  ]
 ],
 "capas": [
  [
   "red",
   "Red",
   "¿Llega?"
  ],
  [
   "waf",
   "WAF",
   "¿Pasa por la web?"
  ],
  [
   "identidad",
   "Identidad",
   "¿Quién es?"
  ],
  [
   "permisos",
   "Permisos",
   "¿Qué puede hacer?"
  ],
  [
   "proteccion",
   "Protección del dato",
   "¿Se puede borrar?"
  ]
 ],
 "solicitudes": [
  {
   "id": "P1",
   "medio": "Objetos",
   "quien": "Anónimo",
   "origen": "Internet",
   "ip": "203.0.113.45",
   "servicio": "API del almacén, directa",
   "recurso": "cd-datalake-historico/2026/10/navegacion.parquet",
   "operacion": "Leer",
   "pide": "navegacion.parquet del data lake",
   "legitima": false,
   "por_que": "Datos confidenciales de clientes: nadie de fuera debe leerlos.",
   "capas": {
    "red": [
     {
      "si": "O3",
      "efecto": "deniega",
      "corto": "Red pública cerrada",
      "texto": "El contenedor solo acepta tráfico por el endpoint privado; esta solicitud llega desde Internet al endpoint público y se rechaza."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Endpoint público abierto",
      "texto": "El endpoint público del almacén acepta conexiones desde cualquier dirección."
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "Va directa al servicio de almacenamiento; el WAF está delante de la web y nunca ve esta solicitud."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Anónima",
      "texto": "Sin credenciales: el servicio la trata como anónima."
     }
    ],
    "permisos": [
     {
      "si": "O1",
      "efecto": "deniega",
      "corto": "Bloqueo anónimo de la cuenta",
      "texto": "El bloqueo a nivel de cuenta prevalece sobre la política del contenedor: se rechaza toda lectura anónima."
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "Lectura para cualquiera",
      "texto": "La política del contenedor concede lectura a cualquiera («*»)."
     }
    ]
   },
   "cifrado": "Cifrado en reposo activado con claves del proveedor: el servicio descifra al entregar el objeto a quien la política autoriza. No decide quién lo recibe."
  },
  {
   "id": "P2",
   "medio": "Objetos",
   "quien": "Cliente de la tienda",
   "origen": "Internet, por la web",
   "ip": "198.51.100.20",
   "servicio": "Web (HTTPS) con WAF",
   "recurso": "/fotos/tomate-rosa.jpg (sale de cd-fotos-catalogo)",
   "operacion": "Leer",
   "pide": "una foto del catálogo",
   "legitima": true,
   "por_que": "Las fotos son públicas por diseño: la web debe mostrarlas.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Web pública por diseño",
      "texto": "Web pública por diseño"
     }
    ],
    "waf": [
     {
      "si": "W",
      "efecto": "pasa",
      "corto": "Sin patrones de ataque",
      "texto": "El WAF inspecciona la petición HTTP(S) y no encuentra patrones de ataque."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Sin WAF delante de la web",
      "texto": "Sin WAF delante de la web"
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Visitante anónimo",
      "texto": "Visitante anónimo de la web; la web lee las fotos con su propia identidad."
     }
    ],
    "permisos": [
     {
      "si": "",
      "efecto": "permite",
      "corto": "La web lee con su identidad",
      "texto": "El contenedor de fotos no es público: solo la identidad de la web puede leerlo."
     }
    ]
   },
   "cifrado": "Cifrado en reposo activado con claves del proveedor: el servicio descifra al entregar el objeto a quien la política autoriza. No decide quién lo recibe."
  },
  {
   "id": "P3",
   "medio": "Objetos",
   "quien": "Bot",
   "origen": "Internet, por la web",
   "ip": "203.0.113.99",
   "servicio": "Web (HTTPS) con WAF",
   "recurso": "/api/facturas?id=1' OR '1'='1",
   "operacion": "Leer",
   "pide": "facturas con «' OR '1'='1»",
   "legitima": false,
   "por_que": "Es un intento de inyección SQL contra la API de facturas de los productores.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Web pública por diseño",
      "texto": "Web pública por diseño"
     }
    ],
    "waf": [
     {
      "si": "W",
      "efecto": "deniega",
      "corto": "Regla de inyección SQL",
      "texto": "La petición lleva ' OR '1'='1 en un parámetro: la regla de inyección SQL del WAF la bloquea antes de que llegue a la API."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Sin WAF: llega a la API",
      "texto": "Sin WAF, la petición llega a la API de facturas; que no saque datos depende de que la API use consultas parametrizadas."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Visitante anónimo",
      "texto": "Visitante anónimo"
     }
    ],
    "permisos": [
     {
      "si": "",
      "efecto": "permite",
      "corto": "Llega a la aplicación",
      "texto": "La API recibe la petición; el resultado depende de su código."
     }
    ]
   },
   "cifrado": "No aplica: la petición va a la API, no al almacén."
  },
  {
   "id": "P4",
   "medio": "Archivos",
   "quien": "m.ruiz (Diseño)",
   "origen": "Oficina",
   "ip": "192.168.10.23",
   "servicio": "SMB 3 (TCP 445)",
   "recurso": "\\\\nas-oficina\\listados\\clientes_reparto_2026-10.xlsx",
   "operacion": "Leer",
   "pide": "el listado del reparto",
   "legitima": false,
   "por_que": "Diseño no necesita direcciones de clientes: solo Logística las usa.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Oficina → NAS por SMB",
      "texto": "Oficina → NAS por SMB"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "SMB: el WAF no lo ve",
      "texto": "Es tráfico SMB dentro de la oficina: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Usuario del dominio m.ruiz",
      "texto": "Usuario del dominio m.ruiz"
     }
    ],
    "permisos": [
     {
      "si": "A1",
      "efecto": "deniega",
      "corto": "ACL: solo Logística",
      "texto": "La ACL de \\\\listados solo concede lectura al grupo Logística."
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "ACL: Todos, modificar",
      "texto": "La ACL de \\\\listados concede «modificar» a Todos: cualquiera puede leer, cambiar o borrar."
     }
    ]
   },
   "cifrado": "El volumen del NAS no está cifrado en reposo; cifrarlo protegería los discos robados, no este acceso."
  },
  {
   "id": "P5",
   "medio": "Archivos",
   "quien": "j.soto (Logística)",
   "origen": "Oficina",
   "ip": "192.168.10.41",
   "servicio": "SMB 3 (TCP 445)",
   "recurso": "\\\\nas-oficina\\listados\\clientes_reparto_2026-10.xlsx",
   "operacion": "Leer",
   "pide": "el mismo listado",
   "legitima": true,
   "por_que": "Logística prepara los repartos con ese listado.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Oficina → NAS por SMB",
      "texto": "Oficina → NAS por SMB"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "SMB: el WAF no lo ve",
      "texto": "Es tráfico SMB dentro de la oficina: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Usuario del dominio j.soto",
      "texto": "Usuario del dominio j.soto"
     }
    ],
    "permisos": [
     {
      "si": "A1",
      "efecto": "permite",
      "corto": "ACL: Logística, lectura",
      "texto": "ACL: Logística, lectura"
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "ACL: Todos, modificar (sobra)",
      "texto": "Entra, pero con más permisos de los necesarios: también podría modificar o borrar."
     }
    ]
   },
   "cifrado": "El volumen del NAS no está cifrado en reposo; cifrarlo protegería los discos robados, no este acceso."
  },
  {
   "id": "P6",
   "medio": "Archivos",
   "quien": "Bot de fuerza bruta",
   "origen": "Internet",
   "ip": "198.51.100.77",
   "servicio": "HTTPS, puerto 5001",
   "recurso": "Panel de administración del NAS",
   "operacion": "Iniciar sesión como admin",
   "pide": "el panel del NAS como «admin»",
   "legitima": false,
   "por_que": "La administración del NAS no debe estar al alcance de Internet.",
   "capas": {
    "red": [
     {
      "si": "A2",
      "efecto": "deniega",
      "corto": "5001 sin reenvío",
      "texto": "El router ya no reenvía el puerto 5001: el panel no es accesible desde Internet."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "5001 reenviado en el router",
      "texto": "El router reenvía el 5001 al NAS «para el teletrabajo»: el panel está en Internet."
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "El panel del NAS no está detrás del WAF de la web."
     }
    ],
    "identidad": [
     {
      "si": "A3",
      "efecto": "deniega",
      "corto": "admin desactivada; MFA",
      "texto": "La cuenta admin de fábrica está desactivada y la administración exige segundo factor."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "admin de fábrica, sin MFA",
      "texto": "La cuenta admin de fábrica sigue activa y sin MFA: basta con adivinar la contraseña."
     }
    ],
    "permisos": [
     {
      "si": "",
      "efecto": "permite",
      "corto": "Admin si adivina la clave",
      "texto": "Quien entra como admin controla comparticiones, usuarios y copias del NAS."
     }
    ]
   },
   "cifrado": "El volumen del NAS no está cifrado en reposo; cifrarlo protegería los discos robados, no este acceso."
  },
  {
   "id": "P7",
   "medio": "Archivos",
   "quien": "adm.sistemas (Sistemas)",
   "origen": "VPN de administración",
   "ip": "10.0.9.4",
   "servicio": "HTTPS, puerto 5001",
   "recurso": "Panel de administración del NAS",
   "operacion": "Iniciar sesión con MFA",
   "pide": "el panel del NAS, con MFA",
   "legitima": true,
   "por_que": "Sistemas administra el NAS desde la VPN de administración.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "VPN de administración",
      "texto": "Desde la VPN de administración se llega al puerto 5001 del NAS."
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "El panel del NAS no está detrás del WAF de la web."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Cuenta nominativa con MFA",
      "texto": "Cuenta nominativa con MFA"
     }
    ],
    "permisos": [
     {
      "si": "",
      "efecto": "permite",
      "corto": "Rol de administración del NAS",
      "texto": "La cuenta nominativa de Sistemas, con MFA, tiene el rol de administración."
     }
    ]
   },
   "cifrado": "El volumen del NAS no está cifrado en reposo; cifrarlo protegería los discos robados, no este acceso."
  },
  {
   "id": "P8",
   "medio": "Bloques",
   "quien": "preprod01 (preproducción)",
   "origen": "Red de servidores",
   "ip": "10.0.2.30",
   "servicio": "iSCSI (TCP 3260)",
   "recurso": "LUN pg-datos-snap (instantánea nocturna de pg-datos)",
   "operacion": "Montar y leer",
   "pide": "la instantánea de producción",
   "legitima": false,
   "por_que": "Preproducción no debe tener datos reales de clientes.",
   "capas": {
    "red": [
     {
      "si": "B2",
      "efecto": "deniega",
      "corto": "Al 3260 solo desde la VLAN 20",
      "texto": "La regla entre VLAN solo permite el puerto 3260 desde 10.0.20.0/24; preproducción está en la red de servidores."
     },
     {
      "si": "B1",
      "efecto": "pasa",
      "corto": "VLAN sin regla: pasa todo",
      "texto": "La VLAN de almacenamiento existe en el esquema, pero el router entre VLAN deja pasar todo: la solicitud llega igual."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Red plana: todo llega a todo",
      "texto": "Red plana: todo llega a todo"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "iSCSI: el WAF no lo ve",
      "texto": "Es tráfico iSCSI interno: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Iniciador preprod01, sin CHAP",
      "texto": "Se presenta con el iniciador iqn.2026-10.local.cd:preprod01, sin autenticación CHAP."
     }
    ],
    "permisos": [
     {
      "si": "B3",
      "efecto": "deniega",
      "corto": "LUN masking: solo copias",
      "texto": "El LUN masking solo presenta la instantánea al iniciador del servidor de copias."
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "LUN visible para todos",
      "texto": "La zona por defecto permite todo: cualquier iniciador que llegue ve todas las LUN."
     }
    ]
   },
   "cifrado": "La cabina no cifra en reposo; aunque lo hiciera, entrega los bloques en claro al iniciador que tiene la LUN asignada."
  },
  {
   "id": "P9",
   "medio": "Bloques",
   "quien": "pg01 (PostgreSQL)",
   "origen": "Red de almacenamiento",
   "ip": "10.0.20.11",
   "servicio": "iSCSI (TCP 3260)",
   "recurso": "LUN pg-datos",
   "operacion": "Leer y escribir",
   "pide": "su propia LUN",
   "legitima": true,
   "por_que": "Es el servidor de la base de datos de producción.",
   "capas": {
    "red": [
     {
      "si": "B2",
      "efecto": "pasa",
      "corto": "Desde la VLAN 20: permitido",
      "texto": "pg01 tiene su interfaz de almacenamiento en la VLAN 20, a la que la regla permite el 3260."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Red plana: todo llega a todo",
      "texto": "Red plana: todo llega a todo"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "iSCSI: el WAF no lo ve",
      "texto": "Es tráfico iSCSI interno: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Iniciador pg01",
      "texto": "Se presenta con el iniciador iqn.2026-10.local.cd:pg01."
     }
    ],
    "permisos": [
     {
      "si": "B3",
      "efecto": "permite",
      "corto": "LUN masking: para pg01",
      "texto": "El LUN masking presenta pg-datos solo al iniciador de pg01."
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "LUN visible para todos",
      "texto": "La zona por defecto permite todo: pg01 ve su LUN y también las demás."
     }
    ]
   },
   "cifrado": "La cabina no cifra en reposo; aunque lo hiciera, entrega los bloques en claro al iniciador que tiene la LUN asignada."
  },
  {
   "id": "P10",
   "medio": "Objetos",
   "quien": "analista_bi (Analítica)",
   "origen": "Red de analítica",
   "ip": "10.0.3.15",
   "servicio": "API del almacén (HTTPS)",
   "recurso": "cd-datalake-historico/2026/10/navegacion.parquet",
   "operacion": "Leer",
   "pide": "navegacion.parquet (informes)",
   "legitima": true,
   "por_que": "Analítica prepara los informes con el histórico.",
   "capas": {
    "red": [
     {
      "si": "O2",
      "efecto": "pasa",
      "corto": "Endpoint privado (10.0.30.5)",
      "texto": "Desde la red corporativa, el nombre del almacén resuelve al endpoint privado: no sale a Internet."
     },
     {
      "si": "O3",
      "efecto": "deniega",
      "corto": "Red cerrada y sin endpoint",
      "texto": "Sin endpoint privado, el tráfico de analítica sale por Internet al endpoint público, que ya no lo acepta: el acceso legítimo se rompe."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Endpoint público, por Internet",
      "texto": "El tráfico sale por la conexión a Internet de la empresa (192.0.2.10) hacia el endpoint público."
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "Va directa al servicio de almacenamiento; el WAF está delante de la web y nunca ve esta solicitud."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Rol analitica-bi, autenticado",
      "texto": "Rol analitica-bi, autenticado"
     }
    ],
    "permisos": [
     {
      "si": "",
      "efecto": "permite",
      "corto": "Lectura para analítica",
      "texto": "La política del contenedor concede lectura al rol analitica-bi."
     }
    ]
   },
   "cifrado": "Cifrado en reposo activado con claves del proveedor: el servicio descifra al entregar el objeto a quien la política autoriza. No decide quién lo recibe."
  },
  {
   "id": "P11",
   "medio": "Bloques",
   "quien": "copias01 (copias de BD)",
   "origen": "Red de almacenamiento",
   "ip": "10.0.20.15",
   "servicio": "iSCSI (TCP 3260)",
   "recurso": "LUN pg-datos-snap (instantánea nocturna de pg-datos)",
   "operacion": "Montar y leer",
   "pide": "la instantánea, para copiarla",
   "legitima": true,
   "por_que": "El servidor de copias saca cada noche la instantánea fuera de la cabina.",
   "capas": {
    "red": [
     {
      "si": "B2",
      "efecto": "pasa",
      "corto": "Desde la VLAN 20: permitido",
      "texto": "El servidor de copias usa su interfaz de almacenamiento (10.0.20.15), en la VLAN 20, a la que la regla permite el 3260. Su otra interfaz, 10.0.2.5, sigue en la red de servidores."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Red plana: todo llega a todo",
      "texto": "Red plana: todo llega a todo"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "iSCSI: el WAF no lo ve",
      "texto": "Es tráfico iSCSI interno: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Iniciador copias01",
      "texto": "Se presenta con el iniciador iqn.2026-10.local.cd:copias01."
     }
    ],
    "permisos": [
     {
      "si": "B3",
      "efecto": "permite",
      "corto": "LUN masking: para copias01",
      "texto": "El LUN masking presenta la instantánea solo al iniciador del servidor de copias."
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "LUN visible para todos",
      "texto": "La zona por defecto permite todo: el servidor de copias ve la instantánea y también las demás LUN."
     }
    ]
   },
   "cifrado": "La cabina no cifra en reposo; aunque lo hiciera, entrega los bloques en claro al iniciador que tiene la LUN asignada."
  }
 ],
 "controles": [
  [
   "O1",
   "Objetos",
   "Bloquear el acceso anónimo en toda la cuenta",
   "La cuenta rechaza cualquier lectura anónima, diga lo que diga la política de cada contenedor.",
   "Permisos (2.4: políticas restrictivas por defecto)"
  ],
  [
   "O2",
   "Objetos",
   "Endpoint privado para el data lake",
   "Desde la red corporativa, el data lake se alcanza por una dirección privada.",
   "Segmentación en cloud (2.4)"
  ],
  [
   "O3",
   "Objetos",
   "Cerrar el acceso por red pública al data lake",
   "El contenedor solo acepta tráfico que llega por el endpoint privado.",
   "Segmentación en cloud (2.4)"
  ],
  [
   "W",
   "Web",
   "WAF delante de la web",
   "Inspecciona las peticiones HTTP(S) que llegan a la web y a su API.",
   "WAF (2.4)"
  ],
  [
   "A1",
   "Archivos",
   "ACL de \\\\listados: solo Logística, lectura",
   "Se quita «Todos: modificar»; Logística conserva la lectura.",
   "Permisos mínimos (2.3 y 2.4)"
  ],
  [
   "A2",
   "Archivos",
   "Sin reenvío del 5001: administración solo por VPN",
   "El router deja de publicar el panel del NAS en Internet.",
   "Exposición de servicios (2.3) y segmentación (2.4)"
  ],
  [
   "A3",
   "Archivos",
   "admin de fábrica desactivada y MFA",
   "Se administra con cuentas nominativas y segundo factor.",
   "Credenciales y bastionado (2.3 y 2.4)"
  ],
  [
   "B1",
   "Bloques",
   "Crear la VLAN 20 de almacenamiento",
   "Aparece en el esquema de red; las reglas entre VLAN no cambian.",
   "Segmentación dibujada (2.4)"
  ],
  [
   "B2",
   "Bloques",
   "Regla entre VLAN: 3260 solo desde 10.0.20.0/24",
   "Solo llega a la cabina quien tiene interfaz en la VLAN de almacenamiento (pg01 y el servidor de copias).",
   "Segmentación efectiva (2.4)"
  ],
  [
   "B3",
   "Bloques",
   "LUN masking por iniciador",
   "pg-datos solo para pg01; la instantánea, solo para el servidor de copias.",
   "Zonificación y LUN masking (2.2 y 2.4)"
  ]
 ],
 "presets": {
  "antes": [
   "W"
  ],
  "despues": [
   "O1",
   "O2",
   "O3",
   "W",
   "A1",
   "A2",
   "A3",
   "B1",
   "B2",
   "B3"
  ]
 },
 "ej_contexto": [
  "Cada noche, a las 02:00, pg01 vuelca PostgreSQL, cifra el volcado y lo sube al contenedor de objetos cd-copias-bd con la clave cd-copias-script.",
  "La clave está escrita en /opt/copias/subir.sh, puede leer, escribir y borrar todo el contenedor y no se ha cambiado desde 2023. El contenedor no tiene versionado ni retención y no está en el código de configuración.",
  "Cada domingo, el servidor de copias deja otra copia en \\\\nas-oficina\\copias, una carpeta que todos los PC de la oficina tienen como unidad Z: con «Todos: modificar»."
 ],
 "ej_alerta": {
  "cuando": "sábado 24/10/2026, 03:10 (hora peninsular)",
  "texto": "312 objetos borrados en cd-copias-bd en 4 minutos con la clave cd-copias-script, desde 203.0.113.80. Esa clave solo debería usarse desde pg01, que sale a Internet por 192.0.2.10. A las 03:02 la misma clave descargó 2 volcados."
 },
 "ej_tareas": [
  "Tres cambios, cada uno con su porqué (qué riesgo reduce).",
  "Cómo comprobaréis cada cambio: qué solicitud debe fallar y cuál debe seguir funcionando.",
  "La alerta del sábado: quién actúa, primera acción y qué evidencia conserváis."
 ],
 "solicitudes_ej": [
  {
   "id": "E1",
   "medio": "Objetos",
   "quien": "Script de copias de pg01",
   "origen": "Salida a Internet de la empresa",
   "ip": "192.0.2.10",
   "servicio": "API del almacén (HTTPS)",
   "recurso": "cd-copias-bd/pg_2026-10-24.dump.enc",
   "operacion": "Subir",
   "pide": "subir la copia de esta noche",
   "legitima": true,
   "por_que": "Es la copia diaria: tiene que seguir funcionando.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Endpoint público del almacén",
      "texto": "Endpoint público del almacén"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "Va directa al servicio de almacenamiento; el WAF está delante de la web y nunca ve esta solicitud."
     }
    ],
    "identidad": [
     {
      "si": "X4",
      "efecto": "pasa",
      "corto": "Clave nueva, del gestor",
      "texto": "El script lee la clave nueva del gestor de secretos."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Clave escrita en el script",
      "texto": "Usa la clave cd-copias-script, escrita en el script."
     }
    ],
    "permisos": [
     {
      "si": "X1",
      "efecto": "permite",
      "corto": "La clave solo puede subir",
      "texto": "La clave solo puede subir"
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "Clave: leer, subir y borrar",
      "texto": "La clave puede leer, subir y borrar todo el contenedor."
     }
    ],
    "proteccion": [
     {
      "si": "X2",
      "efecto": "pasa",
      "corto": "Versión retenida 30 días",
      "texto": "La nueva versión queda con retención inmutable de 30 días."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Sin versionado ni retención",
      "texto": "Sin versionado ni retención"
     }
    ]
   },
   "cifrado": "El volcado ya va cifrado por el script; el contenedor añade su cifrado en reposo."
  },
  {
   "id": "E2",
   "medio": "Objetos",
   "quien": "Clave robada",
   "origen": "Internet",
   "ip": "203.0.113.80",
   "servicio": "API del almacén (HTTPS)",
   "recurso": "cd-copias-bd/* (312 objetos)",
   "operacion": "Borrar",
   "pide": "borrar todas las copias",
   "legitima": false,
   "por_que": "Es el ataque de la alerta: deja a la empresa sin copias.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Endpoint público del almacén",
      "texto": "Endpoint público del almacén"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "Va directa al servicio de almacenamiento; el WAF está delante de la web y nunca ve esta solicitud."
     }
    ],
    "identidad": [
     {
      "si": "X4",
      "efecto": "deniega",
      "corto": "Clave robada ya rotada",
      "texto": "La clave robada se ha rotado: ya no es válida."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Clave válida (robada)",
      "texto": "La clave robada del script sigue siendo válida."
     }
    ],
    "permisos": [
     {
      "si": "X3",
      "efecto": "deniega",
      "corto": "Solo desde 192.0.2.10",
      "texto": "La política solo acepta la clave desde la IP de salida de la empresa."
     },
     {
      "si": "X1",
      "efecto": "deniega",
      "corto": "La clave no puede borrar",
      "texto": "La clave no puede borrar"
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "La clave puede borrar todo",
      "texto": "La clave puede borrar todo"
     }
    ],
    "proteccion": [
     {
      "si": "X2",
      "efecto": "deniega",
      "corto": "Retención de 30 días",
      "texto": "Retención inmutable: ninguna versión se borra antes de 30 días."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Borrado definitivo",
      "texto": "Sin versionado: el borrado es definitivo."
     }
    ]
   },
   "cifrado": "Cifrar no impide borrar."
  },
  {
   "id": "E3",
   "medio": "Objetos",
   "quien": "Clave robada",
   "origen": "Internet",
   "ip": "203.0.113.80",
   "servicio": "API del almacén (HTTPS)",
   "recurso": "cd-copias-bd/pg_2026-10-23.dump.enc",
   "operacion": "Descargar",
   "pide": "descargar un volcado",
   "legitima": false,
   "por_que": "Saca una copia completa de la base de datos.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Endpoint público del almacén",
      "texto": "Endpoint público del almacén"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "Va directa al servicio de almacenamiento; el WAF está delante de la web y nunca ve esta solicitud."
     }
    ],
    "identidad": [
     {
      "si": "X4",
      "efecto": "deniega",
      "corto": "Clave robada ya rotada",
      "texto": "La clave robada se ha rotado: ya no es válida."
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Clave válida (robada)",
      "texto": "La clave robada del script sigue siendo válida."
     }
    ],
    "permisos": [
     {
      "si": "X3",
      "efecto": "deniega",
      "corto": "Solo desde 192.0.2.10",
      "texto": "La política solo acepta la clave desde la IP de salida de la empresa."
     },
     {
      "si": "X1",
      "efecto": "deniega",
      "corto": "La clave no puede leer",
      "texto": "La clave no puede leer"
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "La clave puede leer todo",
      "texto": "La clave puede leer todo"
     }
    ],
    "proteccion": [
     {
      "si": "X2",
      "efecto": "pasa",
      "corto": "La retención no impide leer",
      "texto": "La retención no impide leer"
     },
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Sin retención",
      "texto": "Sin retención"
     }
    ]
   },
   "cifrado": "El volcado va cifrado; si la clave de cifrado está en el mismo servidor que el script, también puede haberse robado."
  },
  {
   "id": "E4",
   "medio": "Archivos",
   "quien": "Ransomware en el PC de m.ruiz",
   "origen": "Oficina",
   "ip": "192.168.10.23",
   "servicio": "SMB 3 (unidad Z:)",
   "recurso": "\\\\nas-oficina\\copias\\semana_43.dump.enc",
   "operacion": "Sobrescribir",
   "pide": "cifrar la copia semanal",
   "legitima": false,
   "por_que": "Un PC infectado no debe alcanzar las copias.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Oficina → NAS por SMB",
      "texto": "Oficina → NAS por SMB"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "SMB: el WAF no lo ve",
      "texto": "Es tráfico SMB dentro de la oficina: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Sesión de m.ruiz",
      "texto": "El malware actúa con la sesión y los permisos de m.ruiz."
     }
    ],
    "permisos": [
     {
      "si": "X5",
      "efecto": "deniega",
      "corto": "ACL: solo svc-copias escribe",
      "texto": "ACL: solo svc-copias escribe"
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "ACL: Todos, modificar",
      "texto": "ACL: Todos, modificar"
     }
    ]
   },
   "cifrado": "Cifrar el volumen del NAS no impide que un usuario autorizado lo sobrescriba."
  },
  {
   "id": "E5",
   "medio": "Archivos",
   "quien": "svc-copias (servidor de copias)",
   "origen": "Red de servidores",
   "ip": "10.0.2.5",
   "servicio": "SMB 3",
   "recurso": "\\\\nas-oficina\\copias\\semana_44.dump.enc",
   "operacion": "Escribir",
   "pide": "dejar la copia del domingo",
   "legitima": true,
   "por_que": "Es la copia semanal: tiene que seguir funcionando.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Red de servidores → NAS",
      "texto": "Red de servidores → NAS"
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "SMB: el WAF no lo ve",
      "texto": "Es tráfico SMB interno: un WAF no lo inspecciona."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Cuenta de servicio svc-copias",
      "texto": "Cuenta de servicio svc-copias"
     }
    ],
    "permisos": [
     {
      "si": "X5",
      "efecto": "permite",
      "corto": "ACL: svc-copias, escritura",
      "texto": "ACL: svc-copias, escritura"
     },
     {
      "si": "",
      "efecto": "permite",
      "corto": "ACL: Todos, modificar",
      "texto": "ACL: Todos, modificar"
     }
    ]
   },
   "cifrado": "El volcado va cifrado."
  },
  {
   "id": "E6",
   "medio": "Objetos",
   "quien": "Operador de restauración (MFA)",
   "origen": "VPN de administración",
   "ip": "10.0.9.4",
   "servicio": "API del almacén (HTTPS)",
   "recurso": "cd-copias-bd/pg_2026-10-23.dump.enc",
   "operacion": "Descargar",
   "pide": "restaurar la copia del viernes",
   "legitima": true,
   "por_que": "Restaurar es para lo que existen las copias.",
   "capas": {
    "red": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Endpoint público, por 192.0.2.10",
      "texto": "Sale por la IP de la empresa (192.0.2.10) al endpoint público."
     }
    ],
    "waf": [
     {
      "si": "",
      "efecto": "no_aplica",
      "corto": "No pasa por el WAF",
      "texto": "Va directa al servicio de almacenamiento; el WAF está delante de la web y nunca ve esta solicitud."
     }
    ],
    "identidad": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Rol restaurar-copias, con MFA",
      "texto": "Rol restaurar-copias, con MFA"
     }
    ],
    "permisos": [
     {
      "si": "",
      "efecto": "permite",
      "corto": "Rol de restauración: lectura",
      "texto": "Rol de restauración: lectura"
     }
    ],
    "proteccion": [
     {
      "si": "",
      "efecto": "pasa",
      "corto": "Leer no borra nada",
      "texto": "Leer no borra nada"
     }
    ]
   },
   "cifrado": "El operador descifra el volcado con la clave de cifrado, guardada aparte."
  }
 ],
 "controles_ej": [
  [
   "X1",
   "Objetos",
   "La clave del script solo puede subir",
   "Sin leer, listar ni borrar: mínimo privilegio para una tarea que solo escribe.",
   "Permisos mínimos"
  ],
  [
   "X2",
   "Objetos",
   "Versionado y retención inmutable de 30 días",
   "Un borrado o una sobrescritura no destruyen la versión anterior durante 30 días.",
   "Protección del dato"
  ],
  [
   "X3",
   "Objetos",
   "La clave solo se acepta desde 192.0.2.10",
   "Condición de origen en la política: la clave robada no sirve desde otra dirección.",
   "Segmentación y política"
  ],
  [
   "X4",
   "Objetos",
   "Rotar la clave y guardarla en un gestor de secretos",
   "La clave robada deja de valer y ya no está escrita en el script.",
   "Credenciales"
  ],
  [
   "X5",
   "Archivos",
   "\\\\copias: solo svc-copias escribe; sin unidad Z:",
   "Los PC de la oficina dejan de ver y de poder modificar la copia semanal.",
   "Permisos mínimos y segmentación"
  ]
 ],
 "presets_ej": {
  "antes": [],
  "solucion": [
   "X1",
   "X2",
   "X5"
  ],
  "todos": [
   "X1",
   "X2",
   "X3",
   "X4",
   "X5"
  ]
 },
 "ej_solucion": {
  "cambios": [
   [
    "X1 · la clave del script solo puede subir",
    "El script solo necesita escribir; con borrar y leer, robar la clave equivale a poder destruir o llevarse todas las copias.",
    "Con la clave del script, intentar borrar un objeto de prueba: debe fallar (E2). Subir la copia de esta noche: debe funcionar (E1)."
   ],
   [
    "X2 · versionado y retención inmutable de 30 días",
    "Aunque alguien con permisos borre o sobrescriba, la versión anterior sigue ahí: el ataque deja de ser definitivo.",
    "Borrar una copia dentro del plazo de retención: debe fallar (E2). Y cada mes, restaurar una copia completa en un entorno aislado (E6) y medir el tiempo."
   ],
   [
    "X5 · \\\\copias solo para svc-copias, sin unidad Z:",
    "Un ransomware en un PC cifra lo que el usuario puede modificar; la copia semanal no puede estar a su alcance.",
    "Desde un PC de la oficina, abrir \\\\nas-oficina\\copias: acceso denegado (E4). El domingo, la copia de svc-copias debe llegar (E5)."
   ]
  ],
  "refuerzos": "X4 (rotar la clave y sacarla del script) es la contención inmediata de la alerta, no una mejora para más adelante. X3 (solo desde 192.0.2.10) reduce el valor de una clave robada. Y meter cd-copias-bd en el código hace que pase las mismas comprobaciones automáticas que el data lake.",
  "alerta": {
   "quien": "Dirige el Jefe de Operaciones, propietario de las copias; la guardia de seguridad investiga; se informa al delegado de protección de datos porque los volcados contienen datos personales.",
   "primera": "Contener: revocar la clave cd-copias-script (y bloquear 203.0.113.80). No borrar nada ni reinstalar pg01 todavía.",
   "evidencia": "Registro de accesos del contenedor (los 312 borrados y las 2 descargas: hora, IP, clave), registro de cambios de configuración, el script y el servidor pg01 tal como están, y la lista de copias que quedan (en el NAS o en versiones).",
   "despues": "Restaurar desde la copia semanal del NAS si está intacta; comprobar que la copia de esta noche funciona con la clave nueva; averiguar cómo salió la clave; valorar con el DPD si las 2 descargas suponen una violación de seguridad de datos personales (depende de si la clave de cifrado del volcado estaba también en pg01)."
  },
  "errores": [
   "«Borrar el contenedor» o «apagarlo todo»: destruye la evidencia y deja sin copias.",
   "«Cambiar la contraseña del NAS»: no es por donde entró el atacante.",
   "«Responsable: IT» o «todos»: sin un rol concreto nadie actúa a las 03:10.",
   "«Cifrar las copias»: ya lo estaban; cifrar no impide borrar.",
   "«Poner un WAF»: la API del almacén no pasa por la web; el WAF no ve estas peticiones.",
   "Cerrar el contenedor sin comprobar E1: la copia de esta noche fallaría y nadie lo sabría hasta necesitarla."
  ]
 },
 "config_v1": "# CosechaDirecta · contenedores de datos en la cuenta cd-almacen\n# Formato didáctico de la clase, inspirado en Terraform. No es Terraform ni lo lee ningún proveedor.\n# Propuesta del lunes: «que analítica y el consultor puedan leer sin pedir permisos».\n\ncuenta \"cd-almacen\" {\n  bloqueo_anonimo = \"no\"\n}\n\nmodulo \"contenedor_confidencial\" {\n  acceso_anonimo   = \"lectura\"\n  red_publica      = \"abierta\"\n  endpoint_privado = \"no\"\n  cifrado_reposo   = \"gestionado\"\n  registro_accesos = \"no\"\n}\n\ncontenedor \"cd-datalake-historico\" {\n  usa           = \"contenedor_confidencial\"\n  clasificacion = \"confidencial\"\n}\n\ncontenedor \"cd-exportaciones-bi\" {\n  usa           = \"contenedor_confidencial\"\n  clasificacion = \"confidencial\"\n}\n\ncontenedor \"cd-informes-ventas\" {\n  usa           = \"contenedor_confidencial\"\n  clasificacion = \"confidencial\"\n}\n",
 "config_v2": "# CosechaDirecta · contenedores de datos en la cuenta cd-almacen\n# Formato didáctico de la clase, inspirado en Terraform. No es Terraform ni lo lee ningún proveedor.\n# Corrección: se cambian el bloque de la cuenta y el módulo; los contenedores no se tocan.\n\ncuenta \"cd-almacen\" {\n  bloqueo_anonimo = \"si\"\n}\n\nmodulo \"contenedor_confidencial\" {\n  acceso_anonimo   = \"no\"\n  red_publica      = \"solo_privada\"\n  endpoint_privado = \"si\"\n  cifrado_reposo   = \"gestionado\"\n  registro_accesos = \"si\"\n}\n\ncontenedor \"cd-datalake-historico\" {\n  usa           = \"contenedor_confidencial\"\n  clasificacion = \"confidencial\"\n}\n\ncontenedor \"cd-exportaciones-bi\" {\n  usa           = \"contenedor_confidencial\"\n  clasificacion = \"confidencial\"\n}\n\ncontenedor \"cd-informes-ventas\" {\n  usa           = \"contenedor_confidencial\"\n  clasificacion = \"confidencial\"\n}\n",
 "atributos": {
  "cuenta": {
   "bloqueo_anonimo": [
    "si",
    "no"
   ]
  },
  "contenedor": {
   "clasificacion": [
    "publico",
    "interno",
    "confidencial"
   ],
   "acceso_anonimo": [
    "no",
    "lectura"
   ],
   "red_publica": [
    "abierta",
    "solo_privada"
   ],
   "endpoint_privado": [
    "si",
    "no"
   ],
   "cifrado_reposo": [
    "gestionado",
    "cliente",
    "no"
   ],
   "registro_accesos": [
    "si",
    "no"
   ]
  }
 },
 "comprobaciones": [
  {
   "id": "CHK-1",
   "ambito": "cuenta",
   "filtro": null,
   "condiciones": [
    [
     "bloqueo_anonimo",
     "==",
     "si"
    ]
   ],
   "texto": "La cuenta bloquea el acceso anónimo",
   "porque": "Aunque un contenedor se configure mal, nadie lee sin identificarse."
  },
  {
   "id": "CHK-2",
   "ambito": "contenedor",
   "filtro": [
    "clasificacion",
    "confidencial"
   ],
   "condiciones": [
    [
     "acceso_anonimo",
     "==",
     "no"
    ]
   ],
   "texto": "Un contenedor confidencial no admite lectura anónima",
   "porque": "Es la exposición pública del tema: un GET sin credenciales se lleva los datos."
  },
  {
   "id": "CHK-3",
   "ambito": "contenedor",
   "filtro": [
    "clasificacion",
    "confidencial"
   ],
   "condiciones": [
    [
     "red_publica",
     "==",
     "solo_privada"
    ],
    [
     "endpoint_privado",
     "==",
     "si"
    ]
   ],
   "texto": "Solo red privada, con endpoint privado",
   "porque": "Sin endpoint privado, cerrar la red pública deja fuera también a los usuarios legítimos."
  },
  {
   "id": "CHK-4",
   "ambito": "contenedor",
   "filtro": [
    "clasificacion",
    "confidencial"
   ],
   "condiciones": [
    [
     "cifrado_reposo",
     "en",
     [
      "gestionado",
      "cliente"
     ]
    ]
   ],
   "texto": "Cifrado en reposo activado",
   "porque": "Protege soportes y copias del proveedor; no decide quién lee."
  },
  {
   "id": "CHK-5",
   "ambito": "contenedor",
   "filtro": [
    "clasificacion",
    "confidencial"
   ],
   "condiciones": [
    [
     "registro_accesos",
     "==",
     "si"
    ]
   ],
   "texto": "Registro de accesos activado",
   "porque": "Sin registro no hay evidencia de quién leyó qué."
  }
 ],
 "zona": {
  "nombre": "hora peninsular",
  "desfase_h": 2
 },
 "cambios": [
  [
   "2026-10-22T14:40:31Z",
   "cuenta cd-almacen",
   "bloqueo_anonimo",
   "si",
   "no",
   "r.vidal (equipo de datos)",
   "consola web, 10.0.3.27"
  ],
  [
   "2026-10-22T14:41:48Z",
   "cd-datalake-historico",
   "acceso_anonimo",
   "no",
   "lectura",
   "r.vidal (equipo de datos)",
   "consola web, 10.0.3.27"
  ],
  [
   "2026-10-22T14:42:10Z",
   "cd-datalake-historico",
   "red_publica",
   "solo_privada",
   "abierta",
   "r.vidal (equipo de datos)",
   "consola web, 10.0.3.27"
  ]
 ],
 "motivo_cambio": "«Para que un consultor externo pudiera descargar un fichero sin pedir acceso».",
 "accesos": [
  [
   "2026-10-22T14:55:02Z",
   "analista_bi",
   "10.0.3.15",
   "2026/10/navegacion.parquet",
   200
  ],
  [
   "2026-10-22T16:05:12Z",
   "anónimo",
   "203.0.113.45",
   "2026/10/navegacion.parquet",
   200
  ],
  [
   "2026-10-22T19:40:03Z",
   "anónimo",
   "203.0.113.45",
   "2026/10/compras.parquet",
   200
  ],
  [
   "2026-10-22T21:12:44Z",
   "anónimo",
   "198.51.100.140",
   "2026/10/navegacion.parquet",
   200
  ]
 ],
 "latencia_alerta_min": 2,
 "objetivo_reversion_min": 15,
 "comprobacion_diaria": "2026-10-23T00:00:00Z",
 "alerta_destino": "Responsable de la plataforma de datos (propietario del recurso); copia a la guardia de seguridad",
 "alerta_acciones": [
  "Revertir aplicando el código (no a mano), en 15 minutos como máximo.",
  "Conservar el registro de cambios y el de accesos de la ventana de exposición.",
  "Revisar los accesos anónimos de esa ventana; si hubo descargas de datos personales, avisar al DPD para valorar una posible violación de seguridad.",
  "Revisar por qué r.vidal puede cambiar la configuración de la cuenta y ofrecer un canal correcto para compartir."
 ]
};
if (typeof module !== "undefined" && module.exports) module.exports = ALM_DATOS; else window.ALM_DATOS = ALM_DATOS;
