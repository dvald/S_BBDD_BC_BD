// Clase 3 · Almacenamiento · funciones de cálculo de la demo (sin dependencias, salvo el SHA-256 de la demo 01).
// Espejo en JavaScript de Clases/Clase03_Tema2_Almacenamiento/ejercicios/simulador_acceso.py y auditor_config.py.
// Se usa en el navegador (window.ALM) y en Node para las pruebas (pruebas/prueba_02.cjs).
// SIMULADOR Y AUDITOR DIDÁCTICOS: reglas simplificadas del caso ficticio; no prueban un despliegue real.
(function (root) {
  "use strict";
  const sha256 = (typeof module !== "undefined" && module.exports)
    ? require("./01_fundamentos_lib.js").sha256
    : root.SBD.sha256;

  // ------------------------------------------------------------ simulador de acceso
  // «» siempre; «O1» si O1 está activo; «B1&!B2» si B1 está activo y B2 no.
  function cumple(condicion, activos) {
    if (!condicion) return true;
    return condicion.split("&").every((parte) => {
      const negada = parte.startsWith("!");
      const nombre = parte.replace(/^!+/, "");
      return activos.has(nombre) !== negada;
    });
  }

  function evaluar(sol, activosLista, capas) {
    const activos = new Set(activosLista);
    const traza = [];
    for (const [capa] of capas) {
      const reglas = sol.capas[capa];
      if (!reglas || !reglas.length) continue;
      const r = reglas.find((x) => cumple(x.si, activos));
      traza.push({ capa, efecto: r.efecto, corto: r.corto, texto: r.texto });
    }
    const deniegan = traza.filter((t) => t.efecto === "deniega");
    let decide, decision;
    if (deniegan.length) { decide = deniegan[0]; decision = "DENEGADO"; }
    else {
      const permiten = traza.filter((t) => t.efecto === "permite");
      decide = permiten.length ? permiten[permiten.length - 1] : traza[traza.length - 1];
      decision = "PERMITIDO";
    }
    const valoracion = sol.legitima
      ? (decision === "PERMITIDO" ? "correcto" : "acceso legítimo roto")
      : (decision === "DENEGADO" ? "correcto" : "acceso indebido");
    return { id: sol.id, decision, capa: decide.capa, corto: decide.corto, texto: decide.texto,
             tambien: deniegan.slice(1).map((t) => t.capa), traza, legitima: sol.legitima, valoracion };
  }

  function evaluarTodas(solicitudes, activos, capas) { return solicitudes.map((s) => evaluar(s, activos, capas)); }
  function resumen(resultados) {
    return { indebidos: resultados.filter((r) => r.valoracion === "acceso indebido").map((r) => r.id),
             rotos: resultados.filter((r) => r.valoracion === "acceso legítimo roto").map((r) => r.id) };
  }

  // ------------------------------------------------------------ auditor de configuración
  const BLOQUE = /^(cuenta|modulo|contenedor)\s+"([^"]+)"\s*\{$/;
  const ATRIBUTO = /^([a-z_]+)\s*=\s*"([^"]*)"$/;
  const tiene = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  // «a», «b» o «c»
  function lista(valores) {
    const v = valores.map((x) => "«" + x + "»");
    return v.length === 1 ? v[0] : v.slice(0, -1).join(", ") + " o " + v[v.length - 1];
  }

  // atributo conocido para ese tipo de bloque y valor admitido (D.atributos); si no, error con su línea
  function validar(n, tipo, atributo, valor, atributos) {
    if (tipo === "contenedor" && atributo === "usa") return;
    const admitidos = atributos[tipo === "cuenta" ? "cuenta" : "contenedor"];
    if (!tiene(admitidos, atributo)) {
      const nombres = (tipo === "contenedor" ? ["usa"] : []).concat(Object.keys(admitidos));
      throw new Error("línea " + n + ": «" + atributo + "» no es un atributo de " + tipo + " (se admite: " + lista(nombres) + ")");
    }
    if (!admitidos[atributo].includes(valor)) {
      throw new Error("línea " + n + ": " + atributo + " = «" + valor + "» no es un valor admitido (se admite: " + lista(admitidos[atributo]) + ")");
    }
  }

  function leer(texto, atributos) {
    // Los nombres son datos: «__proto__» también debe ser una clave normal.
    const cfg = { cuenta: Object.create(null), modulo: Object.create(null), contenedor: Object.create(null) };
    let actual = null, tipo = null;
    const lineas = texto.split("\n");
    for (let i = 0; i < lineas.length; i++) {
      const n = i + 1;
      const limpia = lineas[i].split("#")[0].trim();
      if (!limpia) continue;
      let m = BLOQUE.exec(limpia);
      if (m) {
        if (actual !== null) throw new Error("línea " + n + ": falta cerrar el bloque anterior con «}»");
        tipo = m[1];
        const nombre = m[2];
        if (tiene(cfg[tipo], nombre)) throw new Error("línea " + n + ": " + tipo + " «" + nombre + "» repetido");
        actual = cfg[tipo][nombre] = {};
        continue;
      }
      if (limpia === "}") {
        if (actual === null) throw new Error("línea " + n + ": «}» sin bloque abierto");
        actual = null;
        continue;
      }
      m = ATRIBUTO.exec(limpia);
      if (m && actual !== null) {
        const [, atributo, valor] = m;
        if (tiene(actual, atributo)) throw new Error("línea " + n + ": «" + atributo + "» repetido en el mismo bloque");
        validar(n, tipo, atributo, valor, atributos);
        actual[atributo] = valor;
        continue;
      }
      throw new Error("línea " + n + ": no se entiende «" + limpia + "»");
    }
    if (actual !== null) throw new Error("falta cerrar el último bloque con «}»");
    if (Object.keys(cfg.cuenta).length !== 1) throw new Error("debe haber exactamente un bloque cuenta");
    return cfg;
  }

  function resolver(cfg) {
    const [cuenta, attrs] = Object.entries(cfg.cuenta)[0];
    const contenedores = Object.create(null);
    for (const [nombre, propios] of Object.entries(cfg.contenedor)) {
      let base = {};
      if (tiene(propios, "usa")) {
        if (!tiene(cfg.modulo, propios.usa)) throw new Error("el contenedor «" + nombre + "» usa un módulo que no existe: «" + propios.usa + "»");
        base = Object.assign({}, cfg.modulo[propios.usa]);
      }
      for (const [k, v] of Object.entries(propios)) if (k !== "usa") base[k] = v;
      if (!tiene(base, "clasificacion")) throw new Error("el contenedor «" + nombre + "» no declara clasificacion (decide qué comprobaciones se le aplican)");
      contenedores[nombre] = base;
    }
    return { cuenta: [cuenta, Object.assign({}, attrs)], contenedores };
  }

  const version = (texto) => sha256(texto).slice(0, 7);
  // «==»: igual al valor; «en»: uno de la lista. Un atributo ausente («(sin valor)») no cumple ninguno.
  function cumpleAttr(actual, op, esperado) {
    if (op === "==") return actual === esperado;
    if (op === "en") return esperado.includes(actual);
    throw new Error("operador desconocido: " + op);
  }
  // lo que pide una condición, para el detalle de un fallo
  const espera = (op, esperado) => (op === "==" ? "«" + esperado + "»" : lista(esperado));

  function comprobar(res, comprobaciones) {
    const out = [];
    const [cuenta, cattrs] = res.cuenta;
    const objetivos = [["cuenta", cuenta, cattrs]].concat(Object.entries(res.contenedores).map(([n, a]) => ["contenedor", n, a]));
    for (const chk of comprobaciones) {
      for (const [ambito, nombre, attrs] of objetivos) {
        if (ambito !== chk.ambito) continue;
        if (chk.filtro && attrs[chk.filtro[0]] !== chk.filtro[1]) continue;
        const valor = (a) => (tiene(attrs, a) ? attrs[a] : "(sin valor)");
        const fallos = chk.condiciones.filter(([a, op, v]) => !cumpleAttr(valor(a), op, v)).map(([a, op, v]) => [a, valor(a), op, v]);
        out.push({ id: chk.id, recurso: nombre, ok: fallos.length === 0, fallos });
      }
    }
    return out;
  }

  // La sintaxis admite otros recursos; las pruebas de esta demo solo cubren este caso.
  // Borrar un contenedor o reclasificarlo no debe convertir el caso en «sin fallos».
  function alcanceCaso(res, D) {
    const base = resolver(leer(D.config_v2, D.atributos));
    const problemas = [];
    if (res.cuenta[0] !== base.cuenta[0]) problemas.push("La cuenta del caso debe ser «" + base.cuenta[0] + "».");
    for (const [nombre, attrs] of Object.entries(base.contenedores)) {
      if (!tiene(res.contenedores, nombre)) problemas.push("Falta el contenedor del caso «" + nombre + "».");
      else if (res.contenedores[nombre].clasificacion !== attrs.clasificacion) {
        problemas.push("«" + nombre + "» contiene datos confidenciales en este caso: cambiar la etiqueta no cambia los datos.");
      }
    }
    for (const nombre of Object.keys(res.contenedores)) {
      if (!tiene(base.contenedores, nombre)) problemas.push("«" + nombre + "» queda fuera de las pruebas de acceso de este caso.");
    }
    return problemas;
  }

  function controlesDesplegados(res) {
    const activos = new Set(["W"]);
    if (res.cuenta[1].bloqueo_anonimo === "si") activos.add("O1");
    const lago = res.contenedores["cd-datalake-historico"] || {};
    if (lago.endpoint_privado === "si") activos.add("O2");
    if (lago.red_publica === "solo_privada") activos.add("O3");
    return activos;
  }

  function pruebasAcceso(res, D) {
    const activos = [...controlesDesplegados(res)];
    return [["P1", "DENEGADO"], ["P10", "PERMITIDO"]].map(([sid, esperado]) => {
      const sol = D.solicitudes.find((s) => s.id === sid);
      const r = evaluar(sol, activos, D.capas);
      return { id: sid, quien: sol.quien, esperado, obtenido: r.decision, ok: r.decision === esperado,
               motivo: nombreCapa(D, r.capa) + ": " + r.corto };
    });
  }
  const nombreCapa = (D, capa) => D.capas.find((c) => c[0] === capa)[1];

  // ------------------------------------------------------------ deriva y alerta (horas en UTC; se muestran en hora peninsular)
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const t = (iso) => new Date(iso);
  const local = (d, D) => new Date(d.getTime() + D.zona.desfase_h * 3600000);
  const dos = (n) => String(n).padStart(2, "0");
  function hora(d, D, segundos = true) {
    const l = local(d, D);
    return dos(l.getUTCHours()) + ":" + dos(l.getUTCMinutes()) + (segundos ? ":" + dos(l.getUTCSeconds()) : "");
  }
  function fecha(d, D) {
    const l = local(d, D);
    return DIAS[l.getUTCDay()] + " " + l.getUTCDate() + "/" + (l.getUTCMonth() + 1) + "/" + l.getUTCFullYear();
  }
  function duracion(ms) {
    const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [].concat(h ? [h + " h"] : [], (m || h) ? [m + " min"] : [], [sec + " s"]).join(" ");
  }

  function estadoReal(res, cambios) {
    const cuenta = res.cuenta[0];
    const real = { cuenta: [cuenta, Object.assign({}, res.cuenta[1])], contenedores: {} };
    for (const [n, a] of Object.entries(res.contenedores)) real.contenedores[n] = Object.assign({}, a);
    for (const c of cambios) {
      const [, recurso, atributo, , despues] = c;
      if (recurso === "cuenta " + cuenta) real.cuenta[1][atributo] = despues;
      else real.contenedores[recurso][atributo] = despues;
    }
    return real;
  }

  function deriva(deseado, real, cambios) {
    const cuenta = deseado.cuenta[0];
    const pares = [["cuenta " + cuenta, deseado.cuenta[1], real.cuenta[1]]]
      .concat(Object.keys(deseado.contenedores).map((n) => [n, deseado.contenedores[n], real.contenedores[n]]));
    const filas = [];
    for (const [recurso, d, r] of pares) {
      for (const atributo of Object.keys(d)) {
        if (d[atributo] !== r[atributo]) {
          const c = cambios.find((x) => x[1] === recurso && x[2] === atributo) || null;
          filas.push({ recurso, atributo, esperado: d[atributo], actual: r[atributo],
                       cuando: c ? c[0] : null, quien: c ? c[5] : null, donde: c ? c[6] : null });
        }
      }
    }
    return filas;
  }

  function expuesto(real, contenedor) {
    const a = real.contenedores[contenedor];
    return real.cuenta[1].bloqueo_anonimo === "no" && a.acceso_anonimo === "lectura" && a.red_publica === "abierta";
  }

  function alerta(res, textoCfg, vigilancia, D) {
    const cambios = D.cambios.slice().sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    const real = estadoReal(res, cambios);
    const filas = deriva(res, real, cambios);
    const contenedor = "cd-datalake-historico";
    let expuestoDesde = null, parcial = estadoReal(res, []);
    for (const c of cambios) {
      parcial = estadoReal(parcial, [c]);
      if (expuesto(parcial, contenedor)) { expuestoDesde = t(c[0]); break; }
    }
    const aviso = vigilancia === "evento"
      ? new Date(t(cambios[0][0]).getTime() + D.latencia_alerta_min * 60000)
      : t(D.comprobacion_diaria);
    const reversion = new Date(aviso.getTime() + D.objetivo_reversion_min * 60000);
    const anonimos = D.accesos.filter((a) => a[1] === "anónimo");
    const enVentana = anonimos.filter((a) => expuestoDesde && expuestoDesde <= t(a[0]) && t(a[0]) < reversion);
    const hastaAviso = anonimos.filter((a) => expuestoDesde && expuestoDesde <= t(a[0]) && t(a[0]) < aviso);
    return { vigilancia, version: version(textoCfg), deriva: filas, expuestoDesde, aviso, reversion,
             ventana: expuestoDesde ? reversion - expuestoDesde : 0, descargasVentana: enVentana,
             descargasAlAvisar: hastaAviso, ips: [...new Set(enVentana.map((a) => a[2]))].sort(), contenedor };
  }

  function lineasAlerta(al, D) {
    const out = ["ALERTA CRÍTICA · " + fecha(al.aviso, D) + ", " + hora(al.aviso, D) + " (" + D.zona.nombre + ")",
      "Deriva de configuración en almacenamiento con datos confidenciales (" + al.contenedor + ": histórico de " +
      D.clientes_txt + " clientes).",
      "Evidencia (código: versión " + al.version + " de almacenamiento_v2.cfg):"];
    for (const f of al.deriva) {
      out.push("  - " + f.recurso + " · " + f.atributo + ": esperado «" + f.esperado + "», actual «" + f.actual + "» · " +
               hora(t(f.cuando), D) + " · " + f.quien + " · " + f.donde);
    }
    out.push("  - Ningún cambio aprobado en el repositorio para estos atributos.");
    out.push("  - Lectura anónima desde Internet posible desde las " + hora(al.expuestoDesde, D) +
             "; descargas anónimas hasta el aviso: " + al.descargasAlAvisar.length + ".");
    out.push("Destinatario: " + D.alerta_destino + ".");
    out.push("Acción prevista:");
    D.alerta_acciones.forEach((a, i) => out.push("  " + (i + 1) + ". " + a));
    return out;
  }

  const api = { cumple, evaluar, evaluarTodas, resumen, leer, resolver, version, comprobar, alcanceCaso, espera, controlesDesplegados,
                pruebasAcceso, nombreCapa, hora, fecha, duracion, estadoReal, deriva, expuesto, alerta, lineasAlerta };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ALM = api;
})(this);
