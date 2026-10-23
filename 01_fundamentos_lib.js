// Clase 2 · Fundamentos y directrices · funciones de cálculo de la demo (sin dependencias).
// Se usan en el navegador (window.SBD) y en Node para las pruebas (pruebas/prueba_01.cjs).
(function (root) {
  "use strict";

  // ------------------------------------------------------------ SHA-256 (FIPS 180-4) sobre UTF-8
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  function utf8(str) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(str);
    return Uint8Array.from(Buffer.from(str, "utf8"));
  }
  function sha256(str) {
    const msg = utf8(str);
    const l = msg.length;
    const n = (((l + 9 + 63) >> 6) << 6);
    const b = new Uint8Array(n);
    b.set(msg);
    b[l] = 0x80;
    const bits = l * 8;
    const dv = new DataView(b.buffer);
    dv.setUint32(n - 8, Math.floor(bits / 0x100000000));
    dv.setUint32(n - 4, bits >>> 0);
    let h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const w = new Uint32Array(64);
    const rotr = (x, r) => (x >>> r) | (x << (32 - r));
    for (let off = 0; off < n; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, bb, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & bb) ^ (a & c) ^ (bb & c);
        const t2 = (S0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = bb; bb = a; a = (t1 + t2) >>> 0;
      }
      h = h.map((x, i) => (x + [a, bb, c, d, e, f, g, hh][i]) >>> 0);
    }
    return h.map((x) => x.toString(16).padStart(8, "0")).join("");
  }
  // Posiciones (0-63) en las que dos resúmenes hexadecimales difieren
  function difHex(a, b) {
    const out = [];
    for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) out.push(i);
    return out;
  }

  // ------------------------------------------------------------ LIKE de SQLite (sin ESCAPE)
  // «%» = cualquier secuencia; «_» = un carácter; mayúsculas y minúsculas iguales solo en ASCII.
  function likeRegex(patron) {
    let re = "^";
    for (const ch of patron) {
      if (ch === "%") re += "[\\s\\S]*";
      else if (ch === "_") re += "[\\s\\S]";
      else if (/[A-Za-z]/.test(ch)) re += "[" + ch.toLowerCase() + ch.toUpperCase() + "]";
      else re += ch.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
    }
    return new RegExp(re + "$", "u");
  }
  const like = (valor, patron) => likeRegex(patron).test(valor);

  const SQL_VULNERABLE = "SELECT nombre, precio FROM productos WHERE nombre LIKE '%{texto}%'";
  const SQL_PARAMETRIZADA = "SELECT nombre, precio FROM productos WHERE nombre LIKE ?";
  // Búsqueda con texto libre. Las entradas preparadas (A, B, C) usan los resultados reales de Python;
  // con comillas en modo vulnerable no se emula el SQL resultante: se indica cómo ejecutarlo de verdad.
  function buscar(texto, modo, datos) {
    const pre = (datos.busquedas || []).find((r) => r.modo === modo && r.entrada === texto);
    if (pre) return Object.assign({ origen: "python" }, pre);
    if (modo === "parametrizada") {
      const parametro = "%" + texto + "%";
      const filas = datos.productos.filter((p) => like(p[0], parametro));
      return { modo, entrada: texto, sql: SQL_PARAMETRIZADA, parametro, filas, error: null, origen: "emulado" };
    }
    const sql = SQL_VULNERABLE.replace("{texto}", texto);
    if (texto.includes("'")) {
      return { modo, entrada: texto, sql, parametro: null, filas: null, error: null, origen: "script",
               aviso: "Con comillas, el texto cambia la sentencia: ejecútala de verdad con el script." };
    }
    const filas = datos.productos.filter((p) => like(p[0], "%" + texto + "%"));
    return { modo, entrada: texto, sql, parametro: null, filas, error: null, origen: "emulado" };
  }

  // ------------------------------------------------------------ fechas (zona Europe/Madrid, con horario de verano)
  // Un plazo de 72 h es tiempo real transcurrido. En hora de reloj de Madrid, el cambio de octubre (los
  // relojes atrasan una hora el último domingo) puede adelantar una hora el vencimiento. Para que el cálculo
  // no mienta, se trabaja en el instante real (UTC en milisegundos) y se formatea en hora peninsular española.
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const pad = (n) => String(n).padStart(2, "0");
  // Último domingo (día del mes) del mes dado, mes en base 1.
  function ultimoDomingo(y, mes) {
    const ultimoDia = new Date(Date.UTC(y, mes, 0)).getUTCDate();
    const dow = new Date(Date.UTC(y, mes - 1, ultimoDia)).getUTCDay();   // 0 = domingo
    return ultimoDia - dow;
  }
  // Desfase de Madrid (minutos) en el instante dado: CEST (+120) entre el último domingo de marzo y el de
  // octubre, a las 01:00 UTC; CET (+60) el resto. Península; Canarias no se modela (el caso es peninsular).
  function desfaseMadrid(ms) {
    const y = new Date(ms).getUTCFullYear();
    const inicio = Date.UTC(y, 2, ultimoDomingo(y, 3), 1, 0);
    const fin = Date.UTC(y, 9, ultimoDomingo(y, 10), 1, 0);
    return ms >= inicio && ms < fin ? 120 : 60;
  }
  // Hora de reloj de Madrid -> instante real (ms UTC).
  function instanteDesdeReloj(y, mes, d, h, mi) {
    const comoUTC = Date.UTC(y, mes - 1, d, h, mi);
    let off = desfaseMadrid(comoUTC), inst = comoUTC - off * 60000;
    const off2 = desfaseMadrid(inst);
    if (off2 !== off) inst = comoUTC - off2 * 60000;
    return inst;
  }
  // Instante real (ms UTC) -> hora de reloj de Madrid.
  function relojMadrid(ms) {
    const loc = new Date(ms + desfaseMadrid(ms) * 60000);
    return { y: loc.getUTCFullYear(), mes: loc.getUTCMonth() + 1, d: loc.getUTCDate(),
             h: loc.getUTCHours(), mi: loc.getUTCMinutes(), dow: loc.getUTCDay() };
  }
  function validarFecha(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s);
    if (!m) return { fecha: null, error: "Introduce una fecha y hora completas." };
    const [y, mes, d, h, mi] = m.slice(1).map(Number);
    const comoUTC = Date.UTC(y, mes - 1, d, h, mi), c = new Date(comoUTC);
    if (c.getUTCFullYear() !== y || c.getUTCMonth() + 1 !== mes || c.getUTCDate() !== d ||
        c.getUTCHours() !== h || c.getUTCMinutes() !== mi) {
      return { fecha: null, error: "La fecha o la hora no es válida." };
    }
    // datetime-local no incluye el desfase. Rechazamos una hora inexistente (marzo) o repetida
    // (octubre) en lugar de elegir silenciosamente un instante y dar un vencimiento incorrecto.
    const candidatos = [60, 120].map((off) => comoUTC - off * 60000).filter((ms) => {
      const r = relojMadrid(ms);
      return r.y === y && r.mes === mes && r.d === d && r.h === h && r.mi === mi;
    });
    if (candidatos.length === 0) return { fecha: null, error: "Esa hora no existe en Madrid por el cambio al horario de verano. Elige otra hora." };
    if (candidatos.length > 1) return { fecha: null, error: "Esa hora se repite en Madrid por el cambio al horario de invierno. Este ejemplo no admite horas ambiguas; elige otra hora." };
    return { fecha: new Date(candidatos[0]), error: null };
  }
  const leerFecha = (s) => validarFecha(s).fecha;
  function fmtFecha(d, conHora = true) {
    const r = relojMadrid(d.getTime());
    const base = DIAS[r.dow] + " " + r.d + "/" + r.mes + "/" + r.y;
    return conHora ? base + ", " + pad(r.h) + ":" + pad(r.mi) : base;
  }
  const masHoras = (d, h) => new Date(d.getTime() + h * 3600000);   // horas reales transcurridas
  function masUnMes(d) {             // un mes natural en hora de reloj de Madrid
    const r = relojMadrid(d.getTime());
    let y = r.y, m = r.mes + 1;
    if (m > 12) { m = 1; y += 1; }
    const ultimo = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return new Date(instanteDesdeReloj(y, m, Math.min(r.d, ultimo), r.h, r.mi));
  }
  // Calendario didáctico de Brasilia (UTC−3): n días hábiles desde el día siguiente.
  // Solo descuenta fines de semana y festivos nacionales fijos; no calcula un vencimiento jurídico completo.
  function diasHabiles(d, n, festivos) {
    const local = new Date(d.getTime() - 3 * 3600000);
    let cursor = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
    const saltados = [];
    let k = 0;
    while (k < n) {
      cursor += 86400000;
      const c = new Date(cursor);
      const mmdd = pad(c.getUTCMonth() + 1) + "-" + pad(c.getUTCDate());
      const finde = c.getUTCDay() === 0 || c.getUTCDay() === 6;
      const aMedianoche = (cc) => new Date(instanteDesdeReloj(cc.getUTCFullYear(), cc.getUTCMonth() + 1, cc.getUTCDate(), 0, 0));
      if (!finde && festivos.includes(mmdd)) saltados.push(aMedianoche(c));
      if (!finde && !festivos.includes(mmdd)) k++;
    }
    const fin = new Date(cursor);
    return { fecha: new Date(instanteDesdeReloj(fin.getUTCFullYear(), fin.getUTCMonth() + 1, fin.getUTCDate(), 0, 0)),
             festivosSaltados: saltados };
  }

  // Hitos de notificación. o = {improbable, altoRiesgo, ininteligibles, nis2, brasil}
  function plazos(constancia, o, festivos) {
    const d = leerFecha(constancia);
    if (!d) return [];
    const out = [];
    if (o.improbable) {
      out.push({ norma: "RGPD", hito: "Autoridad (AEPD)", fecha: null,
                 texto: "No se notifica: es improbable que haya riesgo para las personas. Se documenta igualmente.",
                 base: "art. 33.1 y 33.5" });
    } else {
      const f = masHoras(d, 72);
      out.push({ norma: "RGPD", hito: "Autoridad (AEPD)", fecha: f,
                 texto: "Sin dilación indebida y, a más tardar, el " + fmtFecha(f) + " (72 horas naturales).",
                 base: "art. 33.1" });
    }
    if (o.altoRiesgo && !o.ininteligibles) {
      out.push({ norma: "RGPD", hito: "Personas afectadas", fecha: null,
                 texto: "Comunicar sin dilación indebida (no hay un plazo en horas).", base: "art. 34.1" });
    } else if (o.altoRiesgo && o.ininteligibles) {
      out.push({ norma: "RGPD", hito: "Personas afectadas", fecha: null,
                 texto: "Puede aplicarse la excepción si las medidas apropiadas hacían ininteligibles los datos afectados para cualquier persona no autorizada.", base: "art. 34.3 a)" });
    } else {
      out.push({ norma: "RGPD", hito: "Personas afectadas", fecha: null,
                 texto: "Sin comunicación obligatoria: no hay alto riesgo para ellas.", base: "art. 34.1" });
    }
    if (o.nis2) {
      const a = masHoras(d, 24), nn = masHoras(d, 72), fin = masUnMes(nn);
      out.push({ norma: "NIS2", hito: "Alerta temprana", fecha: a, texto: "Sin demora indebida y, como máximo, el " + fmtFecha(a) + " (24 h).", base: "art. 23.4 a)" });
      out.push({ norma: "NIS2", hito: "Notificación del incidente", fecha: nn, texto: "Sin demora indebida y, como máximo, el " + fmtFecha(nn) + " (72 h, régimen general).", base: "art. 23.4 b)" });
      out.push({ norma: "NIS2", hito: "Informe final", fecha: fin,
                 texto: "A más tardar un mes después de notificar: el " + fmtFecha(fin) + " si se notifica en el límite. Si sigue en curso, procede un informe de situación y un informe final tras gestionarlo.", base: "art. 23.4 d)-e)" });
    }
    if (o.brasil) {
      const r = diasHabiles(d, 3, festivos);
      const extra = r.festivosSaltados.length ? " (salta festivo: " + r.festivosSaltados.map((x) => fmtFecha(x, false)).join(", ") + ")" : "";
      out.push({ norma: "LGPD", hito: "ANPD y titulares", fecha: r.fecha,
                 texto: "Regla general: tres días hábiles. Fecha orientativa con el calendario simplificado: " + fmtFecha(r.fecha, false) + extra + ".",
                 base: "Res. CD/ANPD 15/2024, arts. 6 y 9" });
    }
    return out;
  }

  // ------------------------------------------------------------ riesgo
  function nivelRiesgo(v) {
    if (v <= 4) return "Bajo";
    if (v <= 9) return "Medio";
    if (v <= 14) return "Alto";
    return "Crítico";
  }

  // ------------------------------------------------------------ revisión de una directriz
  // AVISO: es una ayuda orientativa sobre la FORMA (¿está concreta, con responsable, con evidencia, trazable?).
  // Se apoya en longitud y palabras clave, así que no valida el fondo: una directriz puede salir «bien planteada»
  // en todos los puntos y seguir siendo inadecuada o desproporcionada. La valoración final es del docente.
  const VAGOS = /\b(adecuad[oa]s?|segur[oa]s?|peri[oó]dic[oa]s?|cuando sea necesario|si procede|lo antes posible)\b/i;
  const NO_ROL = /^(todos|todo el mundo|it|ti|sistemas|inform[aá]tica|el departamento.*|la empresa|la organizaci[oó]n|direcci[oó]n|seguridad|nadie|ningun[oa]|n\.?\/?a\.?|sin (asignar|responsable|determinar)|por (asignar|determinar)|pendiente|[-—]+)\.?$/i;
  const FRECUENCIA = /\b(diari[oa]|cada|semanal|mensual|trimestral|anual|semestral|antes de|tras|al (dar|crear|terminar|cargar)|en cada|horas?|d[ií]as?|semanas?|meses|continu[oa]|autom[aá]tic[oa])\b/i;
  const ARTEFACTO = /\b(informe|registro|log|acta|ticket|captura|panel|listado|evidencia|resultado|alerta|auditor[ií]a)\b/i;
  // Negación que recae sobre el propio artefacto, p. ej. «no generar ningún informe», «sin registro».
  const ARTEFACTO_NEGADO = /\b(no|sin|ning[uú]n[oa]?|nunca|jam[aá]s|nada de)\b(?:\s+\w+){0,2}\s+(informe|registro|log|acta|ticket|captura|panel|listado|evidencia|resultado|alerta|auditor[ií]a)\b/i;
  const ORIGEN_RIESGO = /\bR\d\b/;
  const ORIGEN_NORMA = /\b(art\.|art[ií]culo|control|ISO|ENS|NIS2|RGPD|LOPDGDD|LGPD|CIS|NIST)\b/i;
  function revisarDirectriz(c, proporcional) {
    const que = (c.que || "").trim(), cuando = (c.cuando || "").trim(), resp = (c.responsable || "").trim();
    const evid = (c.evidencia || "").trim(), orig = (c.origen || "").trim();
    const r = [];
    const palabras = que.split(/\s+/).filter(Boolean).length;
    r.push({ criterio: "Concreta", ok: palabras >= 10 && !(VAGOS.test(que) && palabras < 16),
             motivo: palabras < 10 ? "El «qué» es demasiado corto: ¿qué datos, qué medida?" :
                     (VAGOS.test(que) && palabras < 16 ? "Usa palabras vagas («segura», «periódica», «adecuada») sin concretarlas." : "Dice qué se hace y sobre qué.") });
    const verif = ARTEFACTO.test(evid) && !ARTEFACTO_NEGADO.test(evid);
    r.push({ criterio: "Verificable", ok: verif,
             motivo: !evid ? "Falta la evidencia." :
                     (ARTEFACTO_NEGADO.test(evid) ? "La evidencia niega el propio documento o registro: así no hay nada que revisar." :
                      (verif ? "Hay algo que un tercero puede revisar." : "La evidencia no nombra un documento, registro o informe.")) });
    r.push({ criterio: "Con responsable", ok: !!resp && !NO_ROL.test(resp),
             motivo: !resp ? "Falta el responsable." : (NO_ROL.test(resp) ? "«" + resp + "» no es un rol que responda." : "Hay un rol que responde.") });
    r.push({ criterio: "Con frecuencia", ok: FRECUENCIA.test(cuando),
             motivo: cuando ? (FRECUENCIA.test(cuando) ? "Se sabe cuándo se aplica." : "No dice cada cuánto ni en qué momento.") : "Falta el «cuándo»." });
    const tr = ORIGEN_RIESGO.test(orig) && ORIGEN_NORMA.test(orig);
    r.push({ criterio: "Trazable", ok: tr,
             motivo: tr ? "Nace de un riesgo y de una norma o control." : "El origen debe citar el riesgo (R1…R8) y un artículo o control." });
    r.push({ criterio: "Proporcional", ok: proporcional === true ? true : proporcional === false ? false : null,
             motivo: "Lo decide el grupo: ¿su coste encaja con el riesgo que reduce?" });
    return r;
  }

  const api = { sha256, difHex, likeRegex, like, buscar, validarFecha, leerFecha, fmtFecha, masHoras, masUnMes, diasHabiles,
                plazos, nivelRiesgo, revisarDirectriz, SQL_VULNERABLE, SQL_PARAMETRIZADA };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SBD = api;
})(this);
