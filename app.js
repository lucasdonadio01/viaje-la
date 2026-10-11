(() => {
  const BASE = window.VIAJE;
  const RUTAS = window.RUTAS || {};
  const LS = "viajeLA26";
  const TILE_BASE = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
  const TILE_REF = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clon = (o) => JSON.parse(JSON.stringify(o));
  const SEM = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const SEMC = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const MES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const fUsd0 = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const fUsd2 = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const fArs = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const fNum = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });
  const usd = (v) => fUsd0.format(Math.round(v || 0));
  const usdPP = (v) => (v >= 100 ? fUsd0.format(Math.round(v)) : fUsd2.format(v || 0));

  const ms = (n, fill) => `<span class="ms${fill ? " fill" : ""}" aria-hidden="true">${n}</span>`;
  const IC = {
    auto: ms("directions_car", 1),
    pie: ms("directions_walk"),
    grupo: ms("directions_bus", 1),
    reloj: ms("schedule"),
    pin: ms("location_on"),
    lapiz: ms("edit"),
    mas: ms("add"),
    casa: ms("home", 1),
    dolar: ms("attach_money"),
    alerta: ms("warning"),
    ok: ms("check_circle"),
    ruta: ms("route"),
    uber: ms("hail"),
    compartir: ms("share"),
    bajar: ms("download"),
    alarma: ms("alarm"),
    valija: ms("luggage"),
    lista: ms("list"),
    ahorro: ms("savings"),
    cerrar: ms("close")
  };

  let S, baseVersion, hayGuardado = false, diaSel = 0, mapa = null, capa = null, lineas = {}, marcas = {}, selKey = null;
  let rutasExtra = {}, pendientes = new Set(), planes = [], eligiendo = false;
  let edit = null;
  let carSel = null, carInfo = {}, timerCar = null;
  const esMovil = () => window.innerWidth < 900;

  function cargar() {
    let g = null;
    try { g = JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { g = null; }
    try { rutasExtra = JSON.parse(localStorage.getItem(LS + ":rutas") || "{}"); } catch (e) { rutasExtra = {}; }
    Object.assign(rutasExtra, BASE.rutasExtra || {});
    if (g && g.data && g.data.dias) {
      S = g.data;
      baseVersion = g.baseVersion || 0;
      hayGuardado = true;
      if ((BASE.version || 0) > baseVersion) $("#aviso-nueva").hidden = false;
    } else {
      S = clon(BASE);
      baseVersion = BASE.version || 0;
    }
    S.ajustes = Object.assign({}, BASE.ajustes, S.ajustes);
    S.tarifa = Object.assign({}, BASE.tarifa, S.tarifa);
    S.lugares = Object.assign({}, BASE.lugares, S.lugares);
  }

  function guardar() {
    hayGuardado = true;
    try { localStorage.setItem(LS, JSON.stringify({ baseVersion, data: S })); } catch (e) {}
  }

  const aMin = (h) => {
    if (!h) return null;
    const [a, b] = String(h).split(":").map(Number);
    return a * 60 + (b || 0);
  };
  const hhmm = (m) => {
    if (m == null || isNaN(m)) return "--:--";
    m = Math.round(m);
    m = ((m % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  };
  const dur = (m) => {
    m = Math.round(m);
    if (m < 60) return m + " min";
    const h = Math.floor(m / 60), r = m % 60;
    return h + " h" + (r ? " " + String(r).padStart(2, "0") + " min" : "");
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fecha = (f) => new Date(f + "T12:00:00");
  const km = (m) => fNum.format(m / 1000) + " km";

  function ahoraLA() {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: S.zona || "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const g = (t) => (p.find((x) => x.type === t) || {}).value;
    return { fecha: `${g("year")}-${g("month")}-${g("day")}`, min: (+g("hour") % 24) * 60 + +g("minute") };
  }

  function distM(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dp = (b.lat - a.lat) * r, dl = (b.lng - a.lng) * r;
    const h = Math.sin(dp / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dl / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  const memoPoly = new Map();
  function decodificar(s) {
    if (memoPoly.has(s)) return memoPoly.get(s);
    const pts = [];
    let i = 0, lat = 0, lng = 0;
    while (i < s.length) {
      for (let k = 0; k < 2; k++) {
        let sh = 0, r = 0, b;
        do { b = s.charCodeAt(i++) - 63; r |= (b & 31) << sh; sh += 5; } while (b >= 32);
        const v = r & 1 ? ~(r >> 1) : r >> 1;
        if (k === 0) lat += v; else lng += v;
      }
      pts.push([lat / 1e5, lng / 1e5]);
    }
    memoPoly.set(s, pts);
    return pts;
  }

  function lugarDe(ref) {
    if (!ref) return null;
    if (typeof ref === "string") {
      const l = S.lugares[ref];
      return l ? Object.assign({ key: ref }, l) : null;
    }
    if (ref.lat == null || ref.lng == null) return null;
    return ref;
  }

  function ruta(a, b, pie) {
    const d = distM(a, b);
    if (d < 150) return { mismo: true };
    const pre = pie ? "pie:" : "";
    if (a.key && b.key) {
      const r1 = RUTAS[pre + a.key + "|" + b.key];
      if (r1) return { m: r1.m, s: r1.s, pts: decodificar(r1.p) };
      const r2 = RUTAS[pre + b.key + "|" + a.key];
      if (r2) return { m: r2.m, s: r2.s, pts: decodificar(r2.p).slice().reverse() };
    }
    const ck = pre + [a.lat, a.lng, b.lat, b.lng].map((v) => (+v).toFixed(5)).join(",");
    const c = rutasExtra[ck];
    if (c) return { m: c.m, s: c.s, pts: decodificar(c.p) };
    pedirRuta(a, b, pie, ck);
    const m = d * 1.35;
    return { m, s: pie ? m / 1.3 : m / 10.5, pts: [[a.lat, a.lng], [b.lat, b.lng]], aprox: true };
  }

  let timerRender = null;
  function pedirRuta(a, b, pie, ck) {
    if (pendientes.has(ck) || !navigator.onLine) return;
    pendientes.add(ck);
    const coords = `${a.lng},${a.lat};${b.lng},${b.lat}`;
    const url = pie
      ? `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coords}?overview=full&geometries=polyline`
      : `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (!j.routes || !j.routes[0]) return;
        const r = j.routes[0];
        rutasExtra[ck] = { m: Math.round(r.distance), s: Math.round(r.duration), p: r.geometry };
        try { localStorage.setItem(LS + ":rutas", JSON.stringify(rutasExtra)); } catch (e) {}
        clearTimeout(timerRender);
        timerRender = setTimeout(render, 150);
      })
      .catch(() => {})
      .finally(() => setTimeout(() => pendientes.delete(ck), 4000));
  }

  function factor(f, min) {
    const wd = fecha(f).getDay();
    const h = (((min % 1440) + 1440) % 1440) / 60;
    if (wd === 0 || wd === 6) {
      if (h < 9) return 1.1;
      if (h < 12) return 1.25;
      if (h < 20) return 1.35;
      return 1.25;
    }
    if (h < 6) return 1.1;
    if (h < 7) return 1.25;
    if (h < 10) return 1.6;
    if (h < 15) return 1.35;
    if (h < 19.5) return 1.7;
    if (h < 21) return 1.25;
    return 1.1;
  }

  function baseMin(r) {
    const mi = r.m / 1609.34;
    const v = 25 + ((Math.min(Math.max(mi, 8), 30) - 8) / 22) * 20;
    return Math.max(r.s / 60, (mi / v) * 60);
  }

  function minViaje(r, modo, f, hora) {
    if (modo === "pie") return Math.max(2, r.s / 60);
    return baseMin(r) * factor(f, hora) + 3;
  }

  function tramo(f, a, b, modo, cuando, real, vehiculo) {
    const A = S.ajustes;
    const t = { tipo: "tramo", desde: a, hacia: b, modo };
    let r;
    if (!a || !b) {
      t.provisorio = true;
      r = { m: 8 * 1609.34, s: 17 * 60, pts: null };
    } else {
      r = ruta(a, b, modo === "pie");
      if (r.mismo) { t.mismo = true; t.costo = 0; return t; }
    }
    t.m = r.m;
    t.pts = r.pts;
    t.aprox = !!r.aprox;
    const espera = modo === "uber" ? +A.esperaUber || 0 : 0;
    if (cuando.llegar != null) {
      const T = cuando.llegar;
      let s = T - baseMin(r) * 1.4;
      for (let k = 0; k < 2; k++) s = T - minViaje(r, modo, f, s);
      t.min = T - s;
      t.salir = s;
      t.llega = T;
      t.pedir = s - espera;
      t.objetivo = true;
    } else {
      t.pedir = cuando.salir;
      t.salir = t.pedir + espera;
      t.min = minViaje(r, modo, f, t.salir);
      t.llega = t.salir + t.min;
    }
    if (modo === "uber") {
      const T = S.tarifa, mi = r.m / 1609.34;
      let rec = 0;
      if (a) rec += (+a.recargo || 0) + (+a.recargoSalida || 0);
      if (b) rec += +b.recargo || 0;
      t.estimado = Math.max(+T.minima || 0, (+T.base || 0) + (+T.porMilla || 0) * mi + (+T.porMinuto || 0) * t.min) + rec;
      t.vehiculo = vehiculo || S.vehiculo || "UberXL";
      if (vehiculo === "UberXXL") t.estimado *= +T.factorXXL || 1.15;
      const prop = 1 + (+A.propina || 0) / 100;
      t.real = real > 0 ? +real : null;
      t.costo = t.real ? t.real * prop : t.estimado * (1 + (+A.margenDinamica || 0) / 100) * prop;
    } else {
      t.costo = 0;
    }
    return t;
  }

  function colchonDe(modo) {
    const c = +S.ajustes.colchonMin || 0;
    return modo === "uber" ? c : modo === "pie" ? Math.min(5, c) : 0;
  }

  function planDia(di, saltear) {
    const d = S.dias[di];
    const nodos = [];
    const ini = lugarDe(d.inicio || "casa"), fin = lugarDe(d.fin || "casa");
    const acts = (d.actividades || []).filter((_, i) => i !== saltear);
    nodos.push({ tipo: "borde", rol: "inicio", loc: ini });
    let prevLoc = ini, prevEnd = null, n = 0;
    acts.forEach((a, i) => {
      const loc = lugarDe(a.lugar);
      const modo = a.llegada || "uber";
      const fija = !!a.hora;
      const objetivo = fija ? aMin(a.hora) - colchonDe(modo) : null;
      const desde = prevEnd != null ? prevEnd : 600;
      const t = tramo(d.fecha, prevLoc, loc, modo, fija ? { llegar: objetivo } : { salir: desde }, a.precioReal, a.vehiculo);
      t.key = `${di}-${n++}`;
      t.destino = i;
      if (fija) t.inicioAct = aMin(a.hora);
      t.dia = di;
      if (fija && prevEnd != null) {
        const sale = t.mismo ? aMin(a.hora) : modo === "uber" ? t.pedir : t.salir;
        t.libre = sale - prevEnd;
        t.desdeFin = prevEnd;
      }
      if (i === 0 && t.mismo) { nodos[0].oculto = true; t.oculto = true; }
      nodos.push(t);
      const empieza = fija ? aMin(a.hora) : t.mismo ? desde : t.llega;
      let termina = fija && a.finHora ? aMin(a.finHora) : empieza + (+a.duracion || 30);
      if (termina < empieza) termina += 1440;
      nodos.push({ tipo: "act", act: a, idx: i, loc, ini: empieza, fin: termina, fija, llegaTramo: t });
      prevLoc = loc;
      prevEnd = termina;
    });
    if (acts.length) {
      const mismoFin = prevLoc && fin && distM(prevLoc, fin) < 150;
      if (!mismoFin && fin) {
        const t = tramo(d.fecha, prevLoc, fin, d.regresoModo || "uber", { salir: prevEnd }, d.regresoPrecioReal, d.regresoVehiculo);
        t.key = `${di}-${n++}`;
        t.regreso = true;
        t.dia = di;
        nodos.push(t);
        nodos.push({ tipo: "borde", rol: "fin", loc: fin, llega: t.llega });
      }
    }
    const tramos = nodos.filter((x) => x.tipo === "tramo" && !x.mismo);
    const ubers = tramos.filter((x) => x.modo === "uber");
    return {
      nodos,
      tramos,
      ubers: ubers.length,
      total: ubers.reduce((s, x) => s + x.costo, 0),
      sinColchon: ubers.reduce((s, x) => s + (x.real || x.estimado), 0),
      provisorio: tramos.some((x) => x.provisorio)
    };
  }

  function calcular() {
    planes = S.dias.map((_, i) => planDia(i));
  }

  const sigHTML = (l, extra = "") => {
    if (!l) return `<span class="sig vacio ${extra}">?</span>`;
    const s = l.sigla === "casa" ? IC.casa : esc(l.sigla || (l.nombre || "?").slice(0, 2).toUpperCase());
    return `<span class="sig ${extra}" style="background:${esc(l.color || "#e9e9e9")}">${s}</span>`;
  };

  function etiquetaDia(d) {
    return d.agenda ? "Día " + d.agenda : d.titulo || "Libre";
  }

  function tituloLargo(d) {
    const f = fecha(d.fecha);
    return `${SEM[f.getDay()]} ${f.getDate()} de ${MES[f.getMonth()]}`;
  }

  const tactil = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  function linkUber(a, b) {
    if (!tactil) {
      const j = (l) => encodeURIComponent(JSON.stringify({ addressLine1: l.nombre || "", addressLine2: l.direccion || "", latitude: +l.lat, longitude: +l.lng }));
      return `https://m.uber.com/looking?pickup=${j(a)}&drop%5B0%5D=${j(b)}`;
    }
    const q = (k, v) => `${k}=${encodeURIComponent(v)}`;
    return "https://m.uber.com/ul/?" + [
      q("action", "setPickup"),
      q("pickup[latitude]", a.lat), q("pickup[longitude]", a.lng), q("pickup[nickname]", a.nombre || "Origen"), q("pickup[formatted_address]", a.direccion || ""),
      q("dropoff[latitude]", b.lat), q("dropoff[longitude]", b.lng), q("dropoff[nickname]", b.nombre || "Destino"), q("dropoff[formatted_address]", b.direccion || "")
    ].join("&");
  }

  function linkMaps(pts, modo) {
    const f = (l) => `${l.lat},${l.lng}`;
    const o = pts[0], d = pts[pts.length - 1], w = pts.slice(1, -1).slice(0, 9);
    let u = `https://www.google.com/maps/dir/?api=1&origin=${f(o)}&destination=${f(d)}&travelmode=${modo === "pie" ? "walking" : "driving"}`;
    if (w.length) u += "&waypoints=" + encodeURIComponent(w.map(f).join("|"));
    return u;
  }

  function puntosDia(p) {
    const pts = [];
    p.nodos.forEach((n) => {
      const l = n.tipo === "act" || n.tipo === "borde" ? n.loc : null;
      if (l && (!pts.length || distM(pts[pts.length - 1], l) > 150)) pts.push(l);
    });
    return pts;
  }

  function renderDias() {
    const hoy = ahoraLA().fecha;
    $("#dias").innerHTML = S.dias.map((d, i) => {
      const f = fecha(d.fecha);
      const cls = ["dia-chip", d.agenda ? "agenda" : "", i === diaSel ? "activo" : "", d.fecha === hoy ? "hoy" : ""].join(" ");
      return `<button class="${cls}" data-dia="${i}"><small>${SEMC[f.getDay()]} ${f.getDate()}</small><b>${esc(etiquetaDia(d))}</b></button>`;
    }).join("");
    const act = $(".dia-chip.activo");
    if (act) act.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function alertasTramo(t) {
    const out = [];
    if (t.provisorio) {
      const falta = !t.desde ? "de dónde salen" : "la dirección";
      out.push(`<div class="alerta amarilla">${IC.alerta}<span>Falta ${falta}: horario y precio provisorios (≈ 13 km). Cargala y se recalcula.</span></div>`);
    }
    if (t.libre != null && !t.mismo) {
      if (t.libre < 0) {
        const tarde = Math.round(-t.libre);
        const colchon = colchonDe(t.modo);
        if (tarde <= colchon) {
          out.push(`<div class="alerta amarilla">${IC.alerta}<span>Lo anterior termina ${hhmm(t.desdeFin)}: salen ${tarde} min tarde y llegan con ${colchon - tarde} min de margen en vez de ${colchon}.</span></div>`);
        } else {
          out.push(`<div class="alerta roja">${IC.alerta}<span>No llegan: lo anterior termina ${hhmm(t.desdeFin)} y tendrían que ${t.modo === "uber" ? "pedir el Uber" : "salir"} a las ${hhmm(t.modo === "uber" ? t.pedir : t.salir)}. Llegan ≈ ${tarde - colchon} min tarde.</span></div>`);
        }
      } else if (t.libre >= 30) {
        out.push(`<div class="alerta verde">${IC.ok}<span>Tienen ${dur(Math.round(t.libre))} libres antes de ${t.modo === "uber" ? "pedir el Uber" : "salir"}. Ideal para una parada extra.</span></div>`);
      }
    }
    if (t.modo === "uber" && t.vehiculo === "UberXXL") {
      out.push(`<div class="alerta gris">${IC.valija}<span>En la app elegí <b>UberXXL</b>: tiene lugar asegurado para las valijas (el XL no).</span></div>`);
    }
    if (t.modo === "uber" && t.pedir != null && ((t.pedir % 1440) + 1440) % 1440 < 390) {
      out.push(`<div class="alerta gris">${IC.alarma}<span>Muy temprano: conviene programarlo la noche anterior con Uber Reserve.</span></div>`);
    }
    if (t.aprox && !t.provisorio) {
      out.push(`<div class="alerta gris">${IC.ruta}<span>Distancia aproximada: se ajusta sola cuando haya conexión.</span></div>`);
    }
    return out.join("");
  }

  function htmlTramo(t) {
    if (t.mismo) return `<div class="tramo t-mismo">Mismo lugar</div>`;
    const nombreModo = { uber: t.vehiculo || S.vehiculo || "UberXL", pie: "A pie", grupo: "Con el grupo" }[t.modo];
    const icono = { uber: IC.auto, pie: IC.pie, grupo: IC.grupo }[t.modo];
    const personas = +S.personas || 1;
    let precio = "";
    if (t.modo === "uber") {
      precio = `<div class="precio"><strong class="${t.real ? "real" : ""}">${usd(t.costo)}</strong><small>${usdPP(t.costo / personas)} c/u</small></div>`;
    } else {
      precio = `<div class="precio"><strong>US$ 0</strong><small>${t.modo === "pie" ? "caminando" : "incluido"}</small></div>`;
    }
    const para = t.objetivo && t.inicioAct != null && colchonDe(t.modo) ? `<em>para ${hhmm(t.inicioAct)}</em>` : "";
    let horas;
    if (t.modo === "uber") {
      horas = `<div class="horas">
        <div class="hora-box clave"><small>Pedir Uber</small><b>${hhmm(t.pedir)}</b></div>
        <div class="hora-box"><small>Salen</small><b>${hhmm(t.salir)}</b></div>
        <div class="hora-box"><small>Llegan</small><b>${hhmm(t.llega)}</b>${para}</div>
      </div>`;
    } else {
      horas = `<div class="horas dos">
        <div class="hora-box clave"><small>Salen</small><b>${hhmm(t.salir)}</b></div>
        <div class="hora-box"><small>Llegan</small><b>${hhmm(t.llega)}</b>${para}</div>
      </div>`;
    }
    const conLugares = t.desde && t.hacia;
    const btns = [];
    if (conLugares && t.modo === "uber") btns.push(`<a class="mini-btn prim" href="${esc(linkUber(t.desde, t.hacia))}" target="_blank" rel="noopener">${IC.uber}Abrir Uber</a>`);
    if (conLugares) btns.push(`<a class="mini-btn" href="${esc(linkMaps([t.desde, t.hacia], t.modo))}" target="_blank" rel="noopener">${IC.ruta}Maps</a>`);
    if (t.modo === "uber") btns.push(`<label class="precio-real">Real US$<input type="number" min="0" step="1" inputmode="decimal" data-real="${t.key}" value="${t.real || ""}" placeholder="${Math.round(t.estimado)}"></label>`);
    btns.push(`<button class="mini-btn" data-parada="${t.key}">${IC.mas}Parada</button>`);
    return `<div class="tramo t-${t.modo}">
      <div class="tramo-caja${selKey === t.key ? " sel" : ""}" data-tramo="${t.key}">
        <div class="tramo-cab">
          <button class="modo" data-modo="${t.key}" title="Cambiar cómo van">${icono}${esc(nombreModo)}</button>
          <span class="dist">${t.provisorio ? "≈ " : ""}${km(t.m)} · ${dur(t.min)}</span>
          ${precio}
        </div>
        ${horas}
        ${alertasTramo(t)}
        <div class="tramo-btns">${btns.join("")}</div>
      </div>
    </div>`;
  }

  function htmlAct(n, di) {
    const a = n.act, l = n.loc;
    const horario = n.fija
      ? `${hhmm(n.ini)}${a.finHora && a.finHora !== a.hora ? " – " + hhmm(n.fin) : ""}`
      : `≈ ${hhmm(n.ini)} – ${hhmm(n.fin)}`;
    const lugarTxt = l ? esc(l.nombre) : "Lugar a confirmar";
    let badge = a.aConfirmar ? ` <span class="badge">A confirmar</span>` : "";
    if (/^x/.test(a.id || "")) {
      const extra = planes[di].total - planDia(di, n.idx).total;
      badge += ` <span class="badge extra">Parada extra${extra > 0.5 ? " · +" + usd(extra) : ""}</span>`;
    }
    const nota = a.nota || (l && l.nota) || "";
    return `<div class="act${selKey === "a" + di + "-" + n.idx ? " sel" : ""}" data-act="${n.idx}" id="act-${di}-${n.idx}">
      ${sigHTML(l)}
      <div class="act-txt">
        <h3>${esc(a.nombre)}${badge}</h3>
        <div class="meta"><span class="hora">${horario}</span><span class="punto">•</span><span>${lugarTxt}</span></div>
        ${l && l.direccion ? `<div class="dir">${esc(l.direccion)}</div>` : ""}
        ${nota ? `<div class="nota">${esc(nota)}</div>` : ""}
        ${!l ? `<div class="tramo-btns"><button class="mini-btn prim" data-cargar="${n.idx}">${IC.pin}Cargar dirección</button></div>` : ""}
      </div>
      <div class="act-acc">
        <button class="icono-btn" data-editar="${n.idx}" aria-label="Editar">${IC.lapiz}</button>
        ${l ? `<button class="icono-btn" data-ver="${n.idx}" aria-label="Ver en el mapa">${IC.pin}</button>` : ""}
      </div>
    </div>`;
  }

  function htmlBorde(n) {
    const l = n.loc;
    if (!l) return "";
    const txt = n.rol === "inicio" ? `Salen de ${esc(l.nombre)}` : `Vuelven a ${esc(l.nombre)}`;
    const sub = n.rol === "fin" && n.llega != null ? `<span class="hora">Llegan ≈ ${hhmm(n.llega)}</span><span class="punto">•</span>` : "";
    return `<div class="act borde" data-borde="${n.rol}">
      ${sigHTML(l)}
      <div class="act-txt">
        <h3>${txt}</h3>
        <div class="meta">${sub}<span>${esc(l.direccion || "")}</span></div>
      </div>
      <div class="act-acc"></div>
    </div>`;
  }

  function htmlAhora(p, di) {
    const now = ahoraLA();
    if (S.dias[di].fecha !== now.fecha) return "";
    const prox = p.tramos.find((t) => (t.modo === "uber" ? t.pedir : t.salir) >= now.min - 2);
    if (!prox) return `<div class="ahora"><small>Ahora</small><strong>No quedan traslados hoy</strong></div>`;
    const cuando = prox.modo === "uber" ? prox.pedir : prox.salir;
    const falta = cuando - now.min;
    const verbo = prox.modo === "uber" ? "Pedir el Uber" : "Salir";
    const dest = prox.hacia ? prox.hacia.nombre : "a confirmar";
    const org = prox.desde ? prox.desde.nombre : "a confirmar";
    return `<div class="ahora"><small>Próximo traslado</small><strong>${verbo} a las ${hhmm(cuando)} · ${falta <= 0 ? "¡ya!" : "en " + dur(falta)}</strong><span>${esc(org)} → ${esc(dest)}</span></div>`;
  }

  function renderLista() {
    const d = S.dias[diaSel], p = planes[diaSel];
    const personas = +S.personas || 1;
    const etiqueta = d.agenda ? `Día ${d.agenda} de la agenda` : d.titulo === "Libre" ? "Día libre" : d.titulo;
    const titulo = d.agenda ? d.titulo : "";
    const lineaResumen = p.ubers
      ? `<span class="resumen">${p.ubers} ${p.ubers === 1 ? "Uber" : "Ubers"} · ${usd(p.total)} · ${usdPP(p.total / personas)} c/u</span>${p.provisorio ? " · con tramos provisorios" : ""}`
      : "Sin Ubers por ahora";
    const pts = puntosDia(p);
    let h = `<div class="dia-cab">
      <h2>${tituloLargo(d)}</h2>
      <p>${esc(etiqueta)}${titulo ? " · " + esc(titulo) : ""}</p>
      <p>${lineaResumen}</p>
      <div class="dia-acciones">
        ${pts.length > 1 ? `<a class="mini-btn" href="${esc(linkMaps(pts, "uber"))}" target="_blank" rel="noopener">${IC.ruta}Ruta del día en Maps</a>` : ""}
        <button class="mini-btn" id="btn-compartir">${IC.compartir}Compartir día</button>
      </div>
    </div>`;
    h += htmlAhora(p, diaSel);
    p.nodos.forEach((n) => {
      if (n.oculto) return;
      if (n.tipo === "borde") h += htmlBorde(n);
      else if (n.tipo === "act") h += htmlAct(n, diaSel);
      else h += htmlTramo(n);
    });
    if (!(d.actividades || []).length) {
      const R = resumen();
      const est = R.libres.includes(diaSel) ? `<span class="libre-est">${R.manual ? "Estimado por día libre" : `Día libre típico (2 lugares, ${R.ubersLibre} Ubers)`}: ≈ ${usd(R.porLibre)} de Uber (${usdPP(R.porLibre / personas)} c/u).</span>` : "";
      h += `<div class="libre"><b>${d.titulo === "Libre" ? "Día libre" : "Sin actividades"}</b>Agregá paseos, comidas o compras y se calcula a qué hora salir y cuánto sale el Uber.${est}</div>`;
    }
    h += `<button class="agregar" data-agregar="fin">${IC.mas}Agregar parada o actividad</button>`;
    const lista = $("#lista");
    const y = lista.scrollTop;
    lista.innerHTML = h;
    lista.scrollTop = y;
  }

  function resumen() {
    const personas = +S.personas || 1, A = S.ajustes;
    const suma = (arr) => arr.reduce((t, x) => t + x, 0);
    const agenda = planes.filter((_, i) => S.dias[i].agenda);
    const cerca = agenda.filter((p) => !p.tramos.some((t) => t.m > 40000));
    const promAgenda = agenda.length ? suma(agenda.map((p) => p.total)) / agenda.length : 0;
    const promCerca = cerca.length ? suma(cerca.map((p) => p.total)) / cerca.length : promAgenda;
    const esLax = (l) => l && l.key === "lax";
    const viajes = planes.flatMap((p) => p.tramos).filter((t) => t.modo === "uber" && t.m <= 40000 && !t.provisorio && !esLax(t.desde) && !esLax(t.hacia));
    const promViaje = viajes.length ? suma(viajes.map((t) => t.costo)) / viajes.length : 0;
    const T = S.tarifa;
    const viajeLibre = Math.max(+T.minima || 0, (+T.base || 0) + (+T.porMilla || 0) * (+A.viajeLibreMillas || 6) + (+T.porMinuto || 0) * (+A.viajeLibreMinutos || 22)) * (1 + (+A.margenDinamica || 0) / 100) * (1 + (+A.propina || 0) / 100);
    const ubersLibre = A.ubersDiaLibre == null || A.ubersDiaLibre === "" ? 3 : +A.ubersDiaLibre;
    const tipico = Math.round(viajeLibre * ubersLibre);
    const manual = A.gastoDiaLibre != null && A.gastoDiaLibre !== "" && !isNaN(+A.gastoDiaLibre);
    const porLibre = manual ? +A.gastoDiaLibre : tipico;
    const libres = S.dias.map((_, i) => i).filter((i) => {
      const d = S.dias[i];
      return !d.agenda && !d.inicio && !d.fin && !(d.actividades || []).length;
    });
    const calculado = suma(planes.map((p) => p.total));
    const estLibres = libres.length * porLibre;
    return {
      personas, promAgenda, promCerca, promViaje, porLibre, manual, libres, calculado, estLibres, viajeLibre, ubersLibre, tipico,
      total: calculado + estLibres,
      ubers: suma(planes.map((p) => p.ubers)),
      nAgenda: agenda.length,
      nCerca: cerca.length
    };
  }

  function renderPie() {
    const R = resumen(), personas = R.personas;
    const p = planes[diaSel];
    const libre = R.libres.includes(diaSel);
    $("#presu-dia").textContent = libre ? "≈ " + usd(R.porLibre) : usd(p.total);
    $("#presu-dia-pp").textContent = libre ? "estimado · " + usdPP(R.porLibre / personas) + " c/u" : usdPP(p.total / personas) + " c/u";
    $("#presu-total").textContent = usd(R.total);
    $("#presu-total-pp").textContent = usdPP(R.total / personas) + " c/u";
    $("#chip-vehiculo").textContent = `${S.vehiculo || "UberXL"} · ${personas}`;
    $("#chip-margen").textContent = `+${+S.ajustes.margenDinamica || 0}%`;
  }

  function renderEstado() {
    const now = ahoraLA();
    const primero = S.dias[0].fecha, ultimo = S.dias[S.dias.length - 1].fecha;
    let txt = "";
    if (now.fecha < primero) {
      const n = Math.round((fecha(primero) - fecha(now.fecha)) / 86400000);
      txt = n === 1 ? "Falta 1 día" : `Faltan ${n} días`;
    } else if (now.fecha <= ultimo) {
      txt = `LA ${hhmm(now.min)}`;
    }
    $("#estado").textContent = txt;
    $("#titulo").textContent = S.titulo || "LA";
    $("#subtitulo").textContent = S.subtitulo || "";
  }

  function iconoMarca(l, chip, sel) {
    return L.divIcon({
      className: "",
      iconSize: [110, 76],
      iconAnchor: [55, 22],
      popupAnchor: [0, -18],
      html: `<div class="mk${sel ? " sel" : ""}">${sigHTML(l)}<span class="mk-chip">${chip}</span></div>`
    });
  }

  function popupHTML(info) {
    const { l, act, n, t } = info;
    const personas = +S.personas || 1;
    const llega = t && !t.mismo && t.llega != null ? `<em>Llegan ${hhmm(t.llega)}</em>` : "";
    const distTxt = t && !t.mismo && t.m ? km(t.m) + (llega ? " • " : "") : "";
    const pills = [];
    if (n) pills.push(`<span>${IC.reloj}${n.fija ? "" : "≈ "}${hhmm(n.ini)}</span>`);
    if (t && !t.mismo && t.min) pills.push(`<span>${{ uber: IC.auto, pie: IC.pie, grupo: IC.grupo }[t.modo]}${dur(t.min)}</span>`);
    if (t && t.modo === "uber" && !t.mismo) pills.push(`<span>${IC.dolar}${usd(t.costo)} · ${usdPP(t.costo / personas)}</span>`);
    return `<div class="pop">
      <div class="pop-cab">${sigHTML(l)}<div><b>${esc(l.nombre)}</b><small>${distTxt}${llega}</small></div></div>
      ${pills.length ? `<div class="pop-pills">${pills.join("")}</div>` : ""}
      ${act ? `<p class="pop-t">${esc(act.nombre)}</p>` : ""}
      <p class="pop-d">${esc(l.direccion || "")}${(act && act.nota) || l.nota ? " · " + esc((act && act.nota) || l.nota) : ""}</p>
      ${n ? `<button class="pop-btn" data-pop-ver="${n.idx}">Ver en la agenda</button>` : ""}
    </div>`;
  }

  function renderMapa(encuadrar) {
    if (!mapa) return;
    capa.clearLayers();
    lineas = {};
    marcas = {};
    const p = planes[diaSel];
    const grupos = new Map();
    p.nodos.forEach((n) => {
      if (n.tipo === "tramo") {
        if (n.mismo || !n.pts) return;
        const estilo = n.modo === "uber"
          ? { color: "#7be0ad", weight: 4, opacity: 0.95 }
          : n.modo === "pie"
            ? { color: "#f4f4f4", weight: 3, opacity: 0.9, dashArray: "2 8" }
            : { color: "#a6a6a6", weight: 3, opacity: 0.8, dashArray: "8 8" };
        const pl = L.polyline(n.pts, Object.assign({ lineCap: "round", lineJoin: "round" }, estilo)).addTo(capa);
        pl.on("click", () => seleccionarTramo(n.key, true));
        lineas[n.key] = { pl, estilo };
        return;
      }
      const l = n.loc;
      if (!l) return;
      const k = l.key || `${(+l.lat).toFixed(5)},${(+l.lng).toFixed(5)}`;
      if (!grupos.has(k)) grupos.set(k, { l, items: [] });
      grupos.get(k).items.push(n);
    });
    grupos.forEach((g, k) => {
      const actN = g.items.find((x) => x.tipo === "act");
      const chip = actN ? `${IC.reloj}${actN.fija ? "" : "≈"}${hhmm(actN.ini)}` : g.l.sigla === "casa" ? `${IC.casa}Casa` : esc(g.l.nombre);
      const m = L.marker([g.l.lat, g.l.lng], { icon: iconoMarca(g.l, chip, false), riseOnHover: true }).addTo(capa);
      const t = actN ? actN.llegaTramo : null;
      if (esMovil()) {
        m.on("click", () => {
          const k2 = actN ? "a" + actN.idx : carInfo.r && g.items.some((x) => x.rol === "fin") ? "r" : null;
          if (k2) seleccionarCar(k2, true);
        });
      } else {
        m.bindPopup(() => popupHTML({ l: g.l, act: actN && actN.act, n: actN, t }), { maxWidth: 300, minWidth: 270, autoPanPadding: [40, 40] });
      }
      marcas[k] = { m, g };
      if (actN) g.items.filter((x) => x.tipo === "act").forEach((x) => (marcas["a" + x.idx] = { m, g, k }));
    });
    resaltar();
    if (encuadrar) encuadrarDia();
  }

  function encuadrarDia() {
    if (!mapa) return;
    const capas = capa.getLayers();
    if (!capas.length) { mapa.setView([34.06, -118.3], 11, { animate: false }); return; }
    const b = L.featureGroup(capas).getBounds();
    if (!b.isValid()) return;
    const ancho = window.innerWidth >= 900;
    mapa.fitBounds(b, { paddingTopLeft: [50, 70], paddingBottomRight: [50, ancho ? 50 : ($("#carrusel").offsetHeight || 0) + 30], maxZoom: 15, animate: false });
  }

  function resaltar() {
    Object.entries(lineas).forEach(([k, { pl, estilo }]) => {
      if (!selKey || !lineas[selKey]) pl.setStyle({ opacity: estilo.opacity, weight: estilo.weight });
      else if (k === selKey) { pl.setStyle({ opacity: 1, weight: estilo.weight + 3 }); pl.bringToFront(); }
      else pl.setStyle({ opacity: 0.28, weight: estilo.weight });
    });
  }

  function seleccionarTramo(key, desdeMapa) {
    selKey = selKey === key && !desdeMapa ? null : key;
    $$(".tramo-caja").forEach((el) => el.classList.toggle("sel", el.dataset.tramo === selKey));
    resaltar();
    if (selKey && lineas[selKey] && mapa) {
      mapa.fitBounds(lineas[selKey].pl.getBounds(), { padding: [70, 70], maxZoom: 15 });
    }
    if (desdeMapa) {
      const el = $(`.tramo-caja[data-tramo="${key}"]`);
      if (el && window.innerWidth >= 900) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function verActEnMapa(idx) {
    const mk = marcas["a" + idx];
    if (!mk || !mapa) return;
    if (window.innerWidth < 900) cambiarVista("mapa");
    setTimeout(() => {
      mapa.setView(mk.m.getLatLng(), Math.max(mapa.getZoom(), 14), { animate: true });
      mk.m.openPopup();
    }, window.innerWidth < 900 ? 120 : 0);
  }

  function irAAct(idx) {
    if (window.innerWidth < 900) cambiarVista("agenda");
    const el = $(`#act-${diaSel}-${idx}`);
    if (!el) return;
    $$(".act.sel").forEach((x) => x.classList.remove("sel"));
    el.classList.add("sel");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function render(encuadrar) {
    calcular();
    renderEstado();
    renderDias();
    renderLista();
    renderPie();
    renderMapa(encuadrar);
    renderCarrusel();
  }

  function renderCarrusel() {
    const cont = $("#carrusel");
    if (!cont) return;
    const p = planes[diaSel], d = S.dias[diaSel];
    carInfo = {};
    const viaje = (t) => {
      if (!t || t.oculto) return "";
      if (t.mismo) return `<div class="car-viaje">${IC.pin}<span>Mismo lugar</span></div>`;
      const pre = t.provisorio ? "≈ " : "";
      if (t.modo === "uber") return `<div class="car-viaje">${IC.auto}<span>Pedir ${t.vehiculo === "UberXXL" ? "UberXXL" : "Uber"} <b>${hhmm(t.pedir)}</b> · llegan ${hhmm(t.llega)}</span><strong>${pre}${usd(t.costo)}</strong></div>`;
      if (t.modo === "pie") return `<div class="car-viaje">${IC.pie}<span>Salir a pie <b>${hhmm(t.salir)}</b> · llegan ${hhmm(t.llega)}</span></div>`;
      return `<div class="car-viaje">${IC.grupo}<span>Con el grupo · llegan ${hhmm(t.llega)}</span></div>`;
    };
    const uber = (t) => (t && t.modo === "uber" && !t.mismo && t.desde && t.hacia ? `<a class="mini-btn prim" href="${esc(linkUber(t.desde, t.hacia))}" target="_blank" rel="noopener">${IC.uber}Abrir Uber</a>` : "");
    const tarjetas = [];
    p.nodos.forEach((n) => {
      if (n.tipo === "act") {
        const k = "a" + n.idx, l = n.loc, t = n.llegaTramo;
        carInfo[k] = { loc: l, tramo: t && !t.mismo && t.pts ? t.key : null };
        const horario = `${n.fija ? "" : "≈ "}${hhmm(n.ini)}${n.fija && n.act.finHora && n.act.finHora !== n.act.hora ? " – " + hhmm(n.fin) : ""}`;
        tarjetas.push(`<article class="car" data-car="${k}">
          <div class="car-cab">${sigHTML(l)}<div><b>${esc(n.act.nombre)}</b><small><em>${horario}</em> · ${l ? esc(l.nombre) : "Lugar a confirmar"}</small></div></div>
          ${viaje(t)}
          <div class="car-btns">${uber(t)}<button class="mini-btn" data-car-agenda="${n.idx}">${IC.lista}Ver en la agenda</button></div>
        </article>`);
      } else if (n.tipo === "tramo" && n.regreso) {
        const l = n.hacia;
        carInfo.r = { loc: l, tramo: !n.mismo && n.pts ? n.key : null };
        tarjetas.push(`<article class="car" data-car="r">
          <div class="car-cab">${sigHTML(l)}<div><b>Vuelta a ${esc(l ? l.nombre : "casa")}</b><small><em>Llegan ≈ ${hhmm(n.llega)}</em></small></div></div>
          ${viaje(n)}
          <div class="car-btns">${uber(n)}</div>
        </article>`);
      }
    });
    if (!tarjetas.length) {
      tarjetas.push(`<article class="car" data-car="libre">
        <div class="car-cab">${sigHTML(lugarDe(d.inicio || "casa"))}<div><b>${d.titulo === "Libre" ? "Día libre" : esc(d.titulo || "Sin actividades")}</b><small>Agregá paradas y aparecen acá</small></div></div>
        <div class="car-btns"><button class="mini-btn prim" data-car-parada>${IC.mas}Agregar parada</button></div>
      </article>`);
    }
    cont.innerHTML = tarjetas.join("");
    cont.scrollLeft = 0;
    carSel = null;
    medirCarrusel();
  }

  function medirCarrusel() {
    const c = $("#carrusel");
    if (c) document.documentElement.style.setProperty("--car-h", (c.offsetHeight || 0) + "px");
  }

  function marcarMarca(l) {
    Object.values(marcas).forEach(({ m }) => {
      const el = m.getElement && m.getElement();
      const mk = el && el.querySelector(".mk");
      if (mk) mk.classList.remove("sel");
      m.setZIndexOffset(0);
    });
    if (!l) return;
    const reg = marcas[l.key || `${(+l.lat).toFixed(5)},${(+l.lng).toFixed(5)}`];
    if (!reg) return;
    const el = reg.m.getElement && reg.m.getElement();
    const mk = el && el.querySelector(".mk");
    if (mk) mk.classList.add("sel");
    reg.m.setZIndexOffset(1000);
  }

  function seleccionarCar(k, desplazar) {
    carSel = k;
    $$("#carrusel .car").forEach((c) => c.classList.toggle("sel", c.dataset.car === k));
    if (desplazar) {
      const el = $(`#carrusel [data-car="${k}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    const info = carInfo[k];
    if (!info || !mapa) return;
    selKey = info.tramo;
    resaltar();
    marcarMarca(info.loc);
    const opts = { paddingTopLeft: [36, 64], paddingBottomRight: [36, ($("#carrusel").offsetHeight || 0) + 24], maxZoom: 15 };
    if (selKey && lineas[selKey]) mapa.fitBounds(lineas[selKey].pl.getBounds(), opts);
    else if (info.loc) mapa.fitBounds(L.latLng(info.loc.lat, info.loc.lng).toBounds(700), opts);
  }

  function cambiarVista(v) {
    const app = $("#app");
    app.dataset.vista = v;
    $$(".tabbar button").forEach((b) => b.classList.toggle("activo", b.dataset.vista === v));
    if (v === "mapa" && mapa) {
      medirCabecera();
      mapa.invalidateSize({ animate: false });
      medirCarrusel();
    }
    if (v === "agenda") window.scrollTo({ top: 0 });
  }

  function medirCabecera() {
    const c = $(".cabecera"), d = $("#dias");
    const hc = c.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--cab-h", hc + "px");
    document.documentElement.style.setProperty("--alto-cab", hc + d.getBoundingClientRect().height + "px");
  }

  function elegirDia(i, encuadrar = true) {
    diaSel = Math.max(0, Math.min(S.dias.length - 1, i));
    selKey = null;
    try { localStorage.setItem(LS + ":dia", S.dias[diaSel].fecha); } catch (e) {}
    calcular();
    renderDias();
    renderLista();
    renderPie();
    renderMapa(encuadrar);
    renderCarrusel();
    if (window.innerWidth < 900 && $("#app").dataset.vista === "agenda") window.scrollTo({ top: 0 });
    else $("#lista").scrollTop = 0;
  }

  function diaInicial() {
    const hoy = ahoraLA().fecha;
    const iHoy = S.dias.findIndex((d) => d.fecha === hoy);
    if (iHoy >= 0) return iHoy;
    let g = null;
    try { g = localStorage.getItem(LS + ":dia"); } catch (e) {}
    const iG = S.dias.findIndex((d) => d.fecha === g);
    if (iG >= 0) return iG;
    const iA = S.dias.findIndex((d) => d.agenda === 1);
    return iA >= 0 ? iA : 0;
  }

  function buscarTramo(key) {
    for (const p of planes) for (const n of p.nodos) if (n.tipo === "tramo" && n.key === key) return n;
    return null;
  }

  function ordenar(acts) {
    const grupos = [];
    let g = null;
    acts.forEach((a) => {
      if (a.hora || !g) { g = { h: a.hora ? aMin(a.hora) : -1, items: [] }; grupos.push(g); }
      g.items.push(a);
    });
    const lead = grupos.length && grupos[0].h === -1 ? [grupos.shift()] : [];
    grupos.sort((x, y) => x.h - y.h);
    return lead.concat(grupos).flatMap((x) => x.items);
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("ver");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove("ver"), 2400);
  }

  function abrirModal(id) {
    const m = $(id);
    if (!m.open) m.showModal();
  }

  function abrirParada(opc) {
    const d = S.dias[opc.di];
    const acts = d.actividades || [];
    edit = { di: opc.di, idx: opc.idx, insertar: opc.insertar, lugar: null, tipo: "corrido", modo: "uber" };
    const a = opc.idx != null ? acts[opc.idx] : null;
    $("#parada-titulo").textContent = a ? "Editar" : "Agregar parada";
    $("#p-borrar").hidden = !a;
    $("#p-nombre").value = a ? a.nombre : "";
    $("#p-nota").value = a ? a.nota || "" : "";
    $("#p-buscar").value = opc.consulta || "";
    $("#p-resultados").innerHTML = "";
    if (a) {
      edit.lugar = a.lugar || null;
      edit.tipo = a.hora ? "fija" : "corrido";
      edit.modo = a.llegada || "uber";
      $("#p-hora").value = a.hora || "";
      $("#p-fin").value = a.finHora || "";
      $("#p-dur").value = a.duracion || "";
    } else {
      const p = planes[opc.di];
      const antes = p.nodos.filter((n) => n.tipo === "act" && n.idx < opc.insertar).pop();
      edit.tipo = antes ? "corrido" : "fija";
      $("#p-hora").value = antes ? hhmm(antes.fin) : "10:00";
      $("#p-fin").value = "";
      $("#p-dur").value = 45;
    }
    pintarLugarElegido();
    pintarRapidos();
    pintarSegmentos();
    abrirModal("#modal-parada");
    setTimeout(() => (opc.foco === "buscar" || (!a && !opc.consulta) ? $("#p-buscar") : $("#p-nombre")).focus(), 60);
    if (opc.consulta) buscarLugares(opc.consulta);
  }

  function pintarSegmentos() {
    $$("#p-tipo-hora button").forEach((b) => b.classList.toggle("activo", b.dataset.v === edit.tipo));
    $$("#p-modo button").forEach((b) => b.classList.toggle("activo", b.dataset.v === edit.modo));
    const fija = edit.tipo === "fija";
    $("#p-hora-wrap").hidden = !fija;
    $("#p-fin-wrap").hidden = !fija;
    $("#p-dur-wrap").hidden = fija;
    $("#p-ayuda-hora").textContent = fija
      ? "Calculamos a qué hora pedir el Uber para llegar con el colchón de minutos."
      : "Van directo desde lo anterior: la hora de llegada se calcula sola.";
  }

  function pintarLugarElegido() {
    const l = lugarDe(edit.lugar);
    $("#p-lugar-elegido").innerHTML = l
      ? `${sigHTML(l)}<div><b>${esc(l.nombre)}</b><small>${esc(l.direccion || "")}</small></div><button type="button" class="icono-btn" id="p-quitar" aria-label="Quitar lugar">${IC.cerrar}</button>`
      : "";
  }

  function pintarRapidos() {
    const usados = new Set();
    S.dias.forEach((d) => (d.actividades || []).forEach((a) => typeof a.lugar === "object" && a.lugar && usados.add(JSON.stringify(a.lugar))));
    const conocidos = Object.keys(S.lugares).map((k) => ({ ref: k, l: lugarDe(k) }));
    const propios = [...usados].map((s) => JSON.parse(s)).map((l) => ({ ref: l, l }));
    $("#p-rapidos").innerHTML = conocidos.concat(propios).map((x, i) =>
      `<button type="button" data-rapido="${i}">${sigHTML(x.l)}${esc(x.l.nombre)}</button>`).join("");
    pintarRapidos.lista = conocidos.concat(propios);
  }

  let timerBusca = null, ultimaBusca = 0;
  function buscarLugares(q) {
    q = q.trim();
    const res = $("#p-resultados");
    if (q.length < 3) { res.innerHTML = ""; return; }
    const locales = Object.keys(S.lugares).filter((k) => (S.lugares[k].nombre + " " + S.lugares[k].direccion).toLowerCase().includes(q.toLowerCase()));
    const htmlLocal = locales.map((k) => `<button type="button" data-res-local="${k}"><b>${esc(S.lugares[k].nombre)}</b><small>${esc(S.lugares[k].direccion)}</small></button>`).join("");
    if (!navigator.onLine) {
      res.innerHTML = htmlLocal || `<div class="vacio">Sin conexión: elegí un lugar de la lista o tocalo en el mapa.</div>`;
      return;
    }
    res.innerHTML = htmlLocal + `<div class="vacio">Buscando…</div>`;
    const id = ++ultimaBusca;
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=34.05&lon=-118.30&limit=7&lang=en&bbox=-119.1,33.55,-117.5,34.45`;
    fetch(url).then((r) => r.json()).then((j) => {
      if (id !== ultimaBusca) return;
      buscarLugares.feats = (j.features || []).map((f) => {
        const p = f.properties || {};
        const calle = [p.housenumber, p.street].filter(Boolean).join(" ");
        const nombre = p.name || calle || p.city || "Lugar";
        const dir = [calle && calle !== nombre ? calle : "", p.district || p.locality || "", p.city || "", p.state === "California" ? "CA" : p.state || "", p.postcode || ""].filter(Boolean).join(", ");
        return { nombre, direccion: dir, lat: +f.geometry.coordinates[1].toFixed(6), lng: +f.geometry.coordinates[0].toFixed(6) };
      });
      const h = buscarLugares.feats.map((f, i) => `<button type="button" data-res="${i}"><b>${esc(f.nombre)}</b><small>${esc(f.direccion)}</small></button>`).join("");
      res.innerHTML = htmlLocal + (h || (htmlLocal ? "" : `<div class="vacio">No encontré nada. Probá con la dirección (número y calle).</div>`));
    }).catch(() => {
      if (id !== ultimaBusca) return;
      res.innerHTML = htmlLocal || `<div class="vacio">No se pudo buscar. Probá de nuevo o tocá el mapa.</div>`;
    });
  }

  function elegirLugar(ref) {
    edit.lugar = ref;
    const l = lugarDe(ref);
    if (l && !$("#p-nombre").value.trim()) $("#p-nombre").value = l.nombre;
    $("#p-resultados").innerHTML = "";
    $("#p-buscar").value = "";
    pintarLugarElegido();
  }

  function guardarParada() {
    const d = S.dias[edit.di];
    d.actividades = d.actividades || [];
    const nombre = $("#p-nombre").value.trim() || (lugarDe(edit.lugar) || {}).nombre || "Parada";
    const previo = edit.idx != null ? d.actividades[edit.idx] : {};
    const a = { id: previo.id || "x" + Date.now().toString(36), nombre, lugar: edit.lugar || null };
    if (edit.tipo === "fija") {
      const h = $("#p-hora").value;
      if (!h) { toast("Poné la hora de inicio"); $("#p-hora").focus(); return false; }
      a.hora = h;
      const f = $("#p-fin").value;
      if (f) a.finHora = f;
      else a.duracion = 60;
    } else {
      a.duracion = Math.max(5, +$("#p-dur").value || 30);
    }
    if (edit.modo !== "uber") a.llegada = edit.modo;
    const nota = $("#p-nota").value.trim();
    if (nota) a.nota = nota;
    if (!a.lugar) a.aConfirmar = true;
    else if (previo.aConfirmar && previo.lugar === a.lugar && edit.idx != null) a.aConfirmar = true;
    if (previo.precioReal && JSON.stringify(previo.lugar) === JSON.stringify(a.lugar)) a.precioReal = previo.precioReal;
    if (edit.idx != null) d.actividades[edit.idx] = a;
    else d.actividades.splice(edit.insertar, 0, a);
    d.actividades = ordenar(d.actividades);
    guardar();
    render(true);
    toast(edit.idx != null ? "Cambios guardados" : "Parada agregada");
    return true;
  }

  function borrarParada() {
    const d = S.dias[edit.di];
    const a = d.actividades[edit.idx];
    if (!confirm(`¿Borrar "${a.nombre}"?`)) return;
    d.actividades.splice(edit.idx, 1);
    guardar();
    $("#modal-parada").close();
    render(true);
    toast("Borrada");
  }

  function iniciarEleccionMapa() {
    if (!mapa) { toast("El mapa no está disponible sin conexión"); return; }
    eligiendo = true;
    $("#modal-parada").close();
    $("#app").classList.add("eligiendo");
    if (window.innerWidth < 900) cambiarVista("mapa");
    toast("Tocá el mapa donde está la parada");
  }

  function terminarEleccionMapa(latlng) {
    eligiendo = false;
    $("#app").classList.remove("eligiendo");
    const l = { nombre: "Punto en el mapa", direccion: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`, lat: +latlng.lat.toFixed(6), lng: +latlng.lng.toFixed(6) };
    const seguir = () => {
      if (window.innerWidth < 900) cambiarVista("agenda");
      elegirLugar(l);
      abrirModal("#modal-parada");
    };
    if (!navigator.onLine) { seguir(); return; }
    fetch(`https://photon.komoot.io/reverse?lon=${l.lng}&lat=${l.lat}&lang=en`).then((r) => r.json()).then((j) => {
      const p = ((j.features || [])[0] || {}).properties || {};
      const calle = [p.housenumber, p.street].filter(Boolean).join(" ");
      if (p.name || calle) l.nombre = p.name || calle;
      const dir = [calle, p.city, p.state === "California" ? "CA" : p.state].filter(Boolean).join(", ");
      if (dir) l.direccion = dir;
    }).catch(() => {}).finally(seguir);
  }

  function renderPresu() {
    const A = S.ajustes, R = resumen(), personas = R.personas;
    const tot = R.total;
    const sin = planes.reduce((s, x) => s + x.sinColchon, 0);
    const tc = +A.tipoCambio || 0;
    const filas = S.dias.map((d, i) => {
      const p = planes[i], f = fecha(d.fecha);
      const nombre = `${SEMC[f.getDay()]} ${f.getDate()}/${f.getMonth() + 1} · ${esc(etiquetaDia(d))}${p.provisorio ? " *" : ""}`;
      if (R.libres.includes(i)) return `<tr class="estimado"><td>${nombre}</td><td>—</td><td>≈ ${usd(R.porLibre)}</td><td class="pp">≈ ${usdPP(R.porLibre / personas)}</td></tr>`;
      return `<tr class="${p.ubers ? "" : "cero"}"><td>${nombre}</td><td>${p.ubers}</td><td>${usd(p.total)}</td><td class="pp">${usdPP(p.total / personas)}</td></tr>`;
    }).join("");
    $("#presu-contenido").innerHTML = `
      <div class="presu-gran">
        <div class="destacado"><small>Llevar para Uber</small><b>${usd(tot)}</b><em>${R.ubers} viajes${R.libres.length ? ` + ${R.libres.length} días libres` : ""} · ${+A.margenDinamica || 0}% de colchón</em></div>
        <div><small>Por persona</small><b>${usdPP(tot / personas)}</b><em>${personas} personas${tc ? " · " + fArs.format((tot / personas) * tc) : ""}</em></div>
      </div>
      <p class="nota-chica">Calculado viaje por viaje: ${usd(R.calculado)} (${usdPP(R.calculado / personas)} c/u)${R.libres.length ? ` + días libres: ${R.libres.length} × ${usd(R.porLibre)} = ${usd(R.estLibres)}` : ""}. Sin colchón, lo calculado sería ${usd(sin)}.${tc ? ` Total en pesos: ${fArs.format(tot * tc)}.` : ""}${+A.propina ? ` Incluye ${A.propina}% de propina.` : " Sin propina."}</p>
      <section class="libres-caja">
        <h3>${IC.ahorro}Días libres</h3>
        <div class="stats">
          <div><small>Día libre típico</small><b>${usd(R.tipico)}</b><em>${usdPP(R.tipico / personas)} c/u · ${R.ubersLibre} Ubers</em></div>
          <div><small>Por viaje (≈ 10 km)</small><b>${usd(R.viajeLibre)}</b><em>${usdPP(R.viajeLibre / personas)} c/u</em></div>
          <div><small>Día de agenda (referencia)</small><b>${usd(R.promAgenda)}</b><em>${usdPP(R.promAgenda / personas)} c/u · más viajes y más largos</em></div>
        </div>
        <div class="ajustes">
          <label class="ajuste"><small>Ubers por día libre</small><input type="number" min="0" max="10" step="1" value="${R.ubersLibre}" data-aj="ajustes.ubersDiaLibre"></label>
          <label class="ajuste"><small>O un monto fijo por día (US$)</small><input type="number" min="0" step="5" value="${R.manual ? +A.gastoDiaLibre : ""}" placeholder="${R.tipico}" data-aj="ajustes.gastoDiaLibre" data-vacio="null"></label>
        </div>
        <p class="nota-chica">Típico = ir a 2 lugares y volver: 3 Ubers de unos 10 km y 22 min, con el ${+A.margenDinamica || 0}% de colchón. Ejemplos desde la casa: The Grove + LACMA ≈ US$ 100 (US$ 70 si caminan entre los dos), Griffith + cartel de Hollywood ≈ US$ 145, Santa Monica + Venice ≈ US$ 210, Malibu + Santa Monica ≈ US$ 310. Si cargan las actividades de un día libre, ese día se calcula viaje por viaje.</p>
      </section>
      <div class="ajustes">
        <label class="ajuste ancho"><small>Colchón por tarifa dinámica: <span class="rango-val">${+A.margenDinamica || 0}%</span></small><input type="range" min="0" max="60" step="5" value="${+A.margenDinamica || 0}" data-aj="ajustes.margenDinamica"></label>
        <label class="ajuste"><small>Propina %</small><input type="number" min="0" max="30" step="1" value="${+A.propina || 0}" data-aj="ajustes.propina"></label>
        <label class="ajuste"><small>Dólar en pesos (opcional)</small><input type="number" min="0" step="1" value="${tc || ""}" placeholder="Ej: 1450" data-aj="ajustes.tipoCambio"></label>
      </div>
      <table class="presu-tabla">
        <thead><tr><th>Día</th><th>Ubers</th><th>Total</th><th>c/u</th></tr></thead>
        <tbody>${filas}</tbody>
        <tfoot><tr><td>Total</td><td>${R.ubers}</td><td>${usd(tot)}</td><td class="pp">${usdPP(tot / personas)}</td></tr></tfoot>
      </table>
      ${planes.some((p) => p.provisorio) ? `<p class="nota-chica">* Días con tramos sin dirección: se estimaron con un viaje típico de 13 km.</p>` : ""}
      <p class="nota-chica">Precios de ${esc(S.vehiculo || "UberXL")} calibrados con los promedios que publica Uber para rutas de LA. Cuando carguen el precio real de un viaje, se usa ese.</p>
      <div class="fila-btns"><button class="btn" data-exportar="csv">${IC.bajar}Descargar Excel</button></div>`;
  }

  function renderAjustes() {
    const A = S.ajustes, T = S.tarifa;
    $("#ajustes-contenido").innerHTML = `
      <div class="ajustes">
        <h3>Grupo</h3>
        <label class="ajuste"><small>Personas</small><input type="number" min="1" max="12" step="1" value="${+S.personas || 1}" data-aj="personas"></label>
        <label class="ajuste"><small>Vehículo</small><input type="text" value="${esc(S.vehiculo || "UberXL")}" data-aj="vehiculo"></label>
        <h3>Horarios</h3>
        <label class="ajuste"><small>Llegar antes (min)</small><input type="number" min="0" max="90" step="5" value="${+A.colchonMin || 0}" data-aj="ajustes.colchonMin"></label>
        <label class="ajuste"><small>Espera del Uber (min)</small><input type="number" min="0" max="30" step="1" value="${+A.esperaUber || 0}" data-aj="ajustes.esperaUber"></label>
        <h3>Precio</h3>
        <label class="ajuste ancho"><small>Colchón por tarifa dinámica: <span class="rango-val">${+A.margenDinamica || 0}%</span></small><input type="range" min="0" max="60" step="5" value="${+A.margenDinamica || 0}" data-aj="ajustes.margenDinamica"></label>
        <label class="ajuste"><small>Propina %</small><input type="number" min="0" max="30" step="1" value="${+A.propina || 0}" data-aj="ajustes.propina"></label>
        <label class="ajuste"><small>Dólar en pesos (opcional)</small><input type="number" min="0" step="1" value="${+A.tipoCambio || ""}" placeholder="Ej: 1450" data-aj="ajustes.tipoCambio"></label>
        <h3>Tarifa ${esc(S.vehiculo || "UberXL")} (US$)</h3>
        <label class="ajuste"><small>Base</small><input type="number" min="0" step="0.5" value="${T.base}" data-aj="tarifa.base"></label>
        <label class="ajuste"><small>Por milla</small><input type="number" min="0" step="0.05" value="${T.porMilla}" data-aj="tarifa.porMilla"></label>
        <label class="ajuste"><small>Por minuto</small><input type="number" min="0" step="0.05" value="${T.porMinuto}" data-aj="tarifa.porMinuto"></label>
        <label class="ajuste"><small>Mínimo por viaje</small><input type="number" min="0" step="1" value="${T.minima}" data-aj="tarifa.minima"></label>
        <label class="ajuste"><small>UberXXL (veces el XL)</small><input type="number" min="1" step="0.05" value="${T.factorXXL || 1.15}" data-aj="tarifa.factorXXL"></label>
        <h3>Exportar y compartir</h3>
        <div class="ajuste ancho ajustes-acc">
          <button class="btn btn-sec" data-exportar="csv">${IC.bajar}Descargar Excel (todos los viajes)</button>
          <button class="btn btn-sec" data-exportar="resumen">${IC.compartir}Copiar resumen de todo el viaje</button>
          <button class="btn btn-sec" data-exportar="datos">${IC.bajar}Descargar datos.js (para subir a GitHub)</button>
          <button class="btn btn-sec" data-exportar="tarifa">Volver a la tarifa original</button>
          <button class="btn btn-peligro" data-exportar="reset">Volver al itinerario publicado</button>
        </div>
      </div>`;
  }

  function aplicarAjuste(el) {
    const ruta = el.dataset.aj.split(".");
    let v = el.type === "number" || el.type === "range" ? parseFloat(el.value) : el.value;
    if (el.type !== "text" && isNaN(v)) v = el.dataset.vacio === "null" ? null : 0;
    if (ruta.length === 1) S[ruta[0]] = v;
    else S[ruta[0]][ruta[1]] = v;
    const lbl = el.closest(".ajuste") && el.closest(".ajuste").querySelector(".rango-val");
    if (lbl) lbl.textContent = v + "%";
    guardar();
    calcular();
    renderLista();
    renderPie();
    renderCarrusel();
    clearTimeout(aplicarAjuste.t);
    aplicarAjuste.t = setTimeout(() => {
      renderMapa(false);
      if ($("#modal-presu").open && !el.closest("#modal-presu")) renderPresu();
      if ($("#modal-presu").open && el.closest("#modal-presu") && el.type !== "range") {
        const id = el.dataset.aj;
        renderPresu();
        const nuevo = $(`#modal-presu [data-aj="${id}"]`);
        if (nuevo && document.activeElement !== nuevo) { nuevo.focus(); try { nuevo.setSelectionRange(nuevo.value.length, nuevo.value.length); } catch (e) {} }
      }
    }, 350);
  }

  function descargar(nombre, contenido, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function exportarCSV() {
    const personas = +S.personas || 1;
    const n = (v, dec = 2) => (v == null || isNaN(v) ? "" : (+v).toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: false }));
    const filas = [["Fecha", "Día", "Desde", "Hasta", "Cómo", "Pedir Uber", "Salen", "Llegan", "Actividad", "Empieza", "km", "Millas", "Minutos", "Estimado USD", "Con colchón USD", "Precio real USD", "Por persona USD", "Aviso"]];
    S.dias.forEach((d, i) => {
      const p = planes[i];
      const f = fecha(d.fecha);
      p.nodos.forEach((t, j) => {
        if (t.tipo !== "tramo" || t.mismo) return;
        const sig = p.nodos[j + 1];
        const act = sig && sig.tipo === "act" ? sig : null;
        let aviso = t.provisorio ? "Falta dirección" : "";
        if (t.libre != null && t.libre < 0) aviso = (aviso ? aviso + "; " : "") + `Lo anterior termina ${hhmm(t.desdeFin)}`;
        filas.push([
          `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`,
          `${SEM[f.getDay()]} · ${etiquetaDia(d)}`,
          t.desde ? t.desde.nombre : "A confirmar",
          t.hacia ? t.hacia.nombre : "A confirmar",
          { uber: t.vehiculo || S.vehiculo || "UberXL", pie: "A pie", grupo: "Con el grupo" }[t.modo],
          t.modo === "uber" ? hhmm(t.pedir) : "",
          hhmm(t.salir),
          hhmm(t.llega),
          act ? act.act.nombre : t.regreso ? "Vuelta" : "",
          act ? hhmm(act.ini) : "",
          n(t.m / 1000, 1),
          n(t.m / 1609.34, 1),
          Math.round(t.min),
          t.modo === "uber" ? n(t.estimado) : "0",
          t.modo === "uber" && !t.real ? n(t.costo) : t.modo === "uber" ? "" : "0",
          t.real ? n(t.real) : "",
          t.modo === "uber" ? n(t.costo / personas) : "0",
          aviso
        ]);
      });
    });
    const R = resumen();
    R.libres.forEach((i) => {
      const d = S.dias[i], f = fecha(d.fecha);
      filas.push([`${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`, `${SEM[f.getDay()]} · ${etiquetaDia(d)}`, "", "", "Día libre (estimado)", "", "", "", "", "", "", "", "", "", n(R.porLibre), "", n(R.porLibre / personas), R.manual ? "Monto fijo por día libre" : `Día libre típico (${R.ubersLibre} Ubers)`]);
    });
    filas.push([]);
    filas.push(["Total Uber", "", "", "", "", "", "", "", "", "", "", "", "", "", n(R.total), "", n(R.total / personas), ""]);
    const csv = "﻿" + filas.map((r) => r.map((c) => {
      c = String(c == null ? "" : c);
      return /[;"\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
    }).join(";")).join("\r\n");
    descargar("viajes-uber-la.csv", csv, "text/csv;charset=utf-8");
    toast("Excel descargado");
  }

  function textoDia(i) {
    const d = S.dias[i], p = planes[i], personas = +S.personas || 1;
    const f = fecha(d.fecha);
    const L1 = [`*${tituloLargo(d)}*${d.agenda ? ` · Día ${d.agenda}` : ""}`];
    p.nodos.forEach((n) => {
      if (n.tipo === "act") {
        L1.push(`${n.fija ? "" : "≈"}${hhmm(n.ini)} ${n.act.nombre}${n.loc ? "" : " (lugar a confirmar)"}`);
      } else if (n.tipo === "tramo" && !n.mismo) {
        const dest = n.hacia ? n.hacia.nombre : "a confirmar";
        if (n.modo === "uber") L1.push(`   🚗 pedir ${n.vehiculo === "UberXXL" ? "UberXXL" : "Uber"} ${hhmm(n.pedir)} → ${dest} (llegan ${hhmm(n.llega)}) · ~${usd(n.costo)}`);
        else if (n.modo === "pie") L1.push(`   🚶 salir ${hhmm(n.salir)} caminando → ${dest}`);
        else L1.push(`   🚌 con el grupo → ${dest}`);
      }
    });
    if (p.ubers) L1.push(`Uber del día: ${usd(p.total)} · ${usdPP(p.total / personas)} c/u`);
    return L1.join("\n");
  }

  async function compartir(texto) {
    if (navigator.share && window.innerWidth < 900) {
      try { await navigator.share({ text: texto }); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(texto); toast("Copiado: pegalo en WhatsApp"); }
    catch (e) { prompt("Copiá el texto:", texto); }
  }

  function exportar(tipo) {
    if (tipo === "csv") exportarCSV();
    else if (tipo === "resumen") {
      const R = resumen(), personas = R.personas;
      const partes = S.dias.map((_, i) => i).filter((i) => (S.dias[i].actividades || []).length).map(textoDia);
      if (R.libres.length) partes.push(`Días libres: ${R.libres.length} × ~${usd(R.porLibre)} = ~${usd(R.estLibres)} (día libre típico)`);
      partes.push(`*Total Uber del viaje: ${usd(R.total)} · ${usdPP(R.total / personas)} c/u*`);
      compartir(partes.join("\n\n"));
    } else if (tipo === "datos") {
      const out = clon(S);
      out.version = Math.max(BASE.version || 0, baseVersion || 0) + 1;
      if (Object.keys(rutasExtra).length) out.rutasExtra = rutasExtra;
      descargar("datos.js", "window.VIAJE = " + JSON.stringify(out, null, 2) + ";\n", "text/javascript;charset=utf-8");
      toast("Subí este datos.js al repositorio para que lo vean todos");
    } else if (tipo === "tarifa") {
      S.tarifa = clon(BASE.tarifa);
      guardar();
      render(false);
      renderAjustes();
      toast("Tarifa original");
    } else if (tipo === "reset") {
      if (!confirm("¿Volver al itinerario publicado? Se borran los cambios hechos en este dispositivo.")) return;
      try { localStorage.removeItem(LS); } catch (e) {}
      S = clon(BASE);
      baseVersion = BASE.version || 0;
      hayGuardado = false;
      $("#modal-ajustes").close();
      $("#aviso-nueva").hidden = true;
      render(true);
      toast("Itinerario original");
    }
  }

  function tilesPara(lat1, lng1, lat2, lng2, z) {
    const n = 2 ** z;
    const tx = (lng) => Math.floor(((lng + 180) / 360) * n);
    const ty = (lat) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n); };
    const out = [];
    for (let x = tx(Math.min(lng1, lng2)); x <= tx(Math.max(lng1, lng2)); x++)
      for (let y = ty(Math.max(lat1, lat2)); y <= ty(Math.min(lat1, lat2)); y++) out.push([z, x, y]);
    return out;
  }

  async function descargarMapas() {
    if (!("caches" in window)) { $("#estado-offline").textContent = "Este navegador no permite guardar el mapa. Abrí la web publicada (https) en Chrome o Safari."; return; }
    const btn = $("#btn-offline");
    btn.disabled = true;
    const pts = [];
    Object.values(S.lugares).forEach((l) => pts.push(l));
    S.dias.forEach((d) => (d.actividades || []).forEach((a) => { const l = lugarDe(a.lugar); if (l) pts.push(l); }));
    const lats = pts.map((p) => p.lat), lngs = pts.map((p) => p.lng);
    const set = new Map();
    const add = ([z, x, y]) => [TILE_BASE, TILE_REF].forEach((t, i) => set.set(`${i}/${z}/${x}/${y}`, t.replace("{z}", z).replace("{y}", y).replace("{x}", x)));
    for (let z = 9; z <= 12; z++) tilesPara(Math.min(...lats) - 0.04, Math.min(...lngs) - 0.05, Math.max(...lats) + 0.04, Math.max(...lngs) + 0.05, z).forEach(add);
    pts.forEach((p) => {
      [[13, 0.03], [14, 0.015], [15, 0.008], [16, 0.0045]].forEach(([z, r]) => tilesPara(p.lat - r, p.lng - r * 1.2, p.lat + r, p.lng + r * 1.2, z).forEach(add));
    });
    planes.forEach((p) => p.tramos.forEach((t) => (t.pts || []).forEach((q, i) => { if (i % 3 === 0) tilesPara(q[0], q[1], q[0], q[1], 13).forEach(add); })));
    const urls = [...set.values()];
    const cache = await caches.open("la26-tiles");
    const barra = $("#barra-offline"), est = $("#estado-offline");
    barra.hidden = false;
    let hechos = 0, fallas = 0;
    const cola = urls.slice();
    const trabajar = async () => {
      while (cola.length) {
        const u = cola.shift();
        try {
          if (!(await cache.match(u))) {
            const r = await fetch(u, { mode: "cors" });
            if (r.ok) await cache.put(u, r);
            else fallas++;
          }
        } catch (e) { fallas++; }
        hechos++;
        if (hechos % 10 === 0 || !cola.length) {
          barra.firstElementChild.style.width = Math.round((hechos / urls.length) * 100) + "%";
          est.textContent = `${hechos} de ${urls.length} partes del mapa`;
        }
      }
    };
    await Promise.all(Array.from({ length: 6 }, trabajar));
    est.textContent = fallas ? `Listo, con ${fallas} partes que no bajaron. Probá de nuevo con mejor wifi.` : "Listo: el mapa de todos los lugares quedó guardado.";
    btn.disabled = false;
    try { localStorage.setItem(LS + ":offline", String(Date.now())); } catch (e) {}
  }

  function eventos() {
    $("#dias").addEventListener("click", (e) => {
      const b = e.target.closest("[data-dia]");
      if (b) elegirDia(+b.dataset.dia);
    });

    $("#lista").addEventListener("click", (e) => {
      const t = e.target;
      const g = (sel) => t.closest(sel);
      let el;
      if ((el = g("[data-parada]"))) {
        const tr = buscarTramo(el.dataset.parada);
        if (!tr) return;
        abrirParada({ di: tr.dia, insertar: tr.regreso ? (S.dias[tr.dia].actividades || []).length : tr.destino });
        return;
      }
      if ((el = g("[data-modo]"))) {
        const tr = buscarTramo(el.dataset.modo);
        if (!tr) return;
        const orden = ["uber", "pie", "grupo"];
        const nuevo = orden[(orden.indexOf(tr.modo) + 1) % orden.length];
        const d = S.dias[tr.dia];
        if (tr.regreso) { if (nuevo === "uber") delete d.regresoModo; else d.regresoModo = nuevo; }
        else { const a = d.actividades[tr.destino]; if (nuevo === "uber") delete a.llegada; else a.llegada = nuevo; }
        guardar();
        render(false);
        toast({ uber: "En Uber", pie: "Caminando", grupo: "Con el grupo (sin costo)" }[nuevo]);
        return;
      }
      if ((el = g("[data-agregar]"))) { abrirParada({ di: diaSel, insertar: (S.dias[diaSel].actividades || []).length }); return; }
      if ((el = g("[data-editar]"))) { abrirParada({ di: diaSel, idx: +el.dataset.editar }); return; }
      if ((el = g("[data-cargar]"))) { abrirParada({ di: diaSel, idx: +el.dataset.cargar, foco: "buscar" }); return; }
      if ((el = g("[data-ver]"))) { verActEnMapa(+el.dataset.ver); return; }
      if ((el = g("#btn-compartir"))) { compartir(textoDia(diaSel)); return; }
      if (g("a, button, input, label")) return;
      if ((el = g("[data-tramo]"))) { seleccionarTramo(el.dataset.tramo); return; }
      if ((el = g("[data-act]")) && window.innerWidth >= 900) { verActEnMapa(+el.dataset.act); }
    });

    $("#lista").addEventListener("change", (e) => {
      const el = e.target.closest("[data-real]");
      if (!el) return;
      const tr = buscarTramo(el.dataset.real);
      if (!tr) return;
      const v = parseFloat(el.value);
      const d = S.dias[tr.dia];
      if (tr.regreso) { if (v > 0) d.regresoPrecioReal = v; else delete d.regresoPrecioReal; }
      else { const a = d.actividades[tr.destino]; if (v > 0) a.precioReal = v; else delete a.precioReal; }
      guardar();
      render(false);
      toast(v > 0 ? "Precio real guardado" : "Volvió al estimado");
    });

    $("#buscador").addEventListener("click", () => abrirParada({ di: diaSel, insertar: (S.dias[diaSel].actividades || []).length, foco: "buscar" }));
    $("#chip-vehiculo").addEventListener("click", () => { renderAjustes(); abrirModal("#modal-ajustes"); });
    $("#chip-ajustes").addEventListener("click", () => { renderAjustes(); abrirModal("#modal-ajustes"); });
    $("#chip-margen").addEventListener("click", () => { renderPresu(); abrirModal("#modal-presu"); });
    $("#btn-presu").addEventListener("click", () => { renderPresu(); abrirModal("#modal-presu"); });
    $("#pie-presu").addEventListener("click", (e) => { if (window.innerWidth < 900 && !e.target.closest("#btn-presu")) { renderPresu(); abrirModal("#modal-presu"); } });
    $("#btn-info").addEventListener("click", () => abrirModal("#modal-info"));
    $("#btn-offline").addEventListener("click", descargarMapas);
    $("#btn-encuadrar").addEventListener("click", () => {
      selKey = null;
      carSel = null;
      $$(".tramo-caja.sel, #carrusel .car.sel").forEach((x) => x.classList.remove("sel"));
      resaltar();
      marcarMarca(null);
      encuadrarDia();
    });

    $("#carrusel").addEventListener("click", (e) => {
      const ag = e.target.closest("[data-car-agenda]");
      if (ag) { irAAct(+ag.dataset.carAgenda); return; }
      if (e.target.closest("[data-car-parada]")) { abrirParada({ di: diaSel, insertar: (S.dias[diaSel].actividades || []).length, foco: "buscar" }); return; }
      if (e.target.closest("a, button")) return;
      const c = e.target.closest(".car");
      if (c) seleccionarCar(c.dataset.car, true);
    });
    $("#carrusel").addEventListener("scroll", () => {
      clearTimeout(timerCar);
      timerCar = setTimeout(() => {
        const c = $("#carrusel");
        const medio = c.scrollLeft + c.clientWidth / 2;
        let mejor = null, dist = Infinity;
        $$(".car", c).forEach((el) => {
          const dd = Math.abs(el.offsetLeft + el.offsetWidth / 2 - medio);
          if (dd < dist) { dist = dd; mejor = el; }
        });
        if (mejor && mejor.dataset.car !== carSel && c.scrollLeft > 4) seleccionarCar(mejor.dataset.car, false);
      }, 160);
    }, { passive: true });

    $$(".tabbar button").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.vista === "presu") { renderPresu(); abrirModal("#modal-presu"); return; }
      cambiarVista(b.dataset.vista);
      if (b.dataset.vista === "mapa") { if (selKey && lineas[selKey]) seleccionarTramo(selKey, true); else encuadrarDia(); }
    }));

    $$("[data-cerrar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
    $$("dialog").forEach((dl) => dl.addEventListener("click", (e) => { if (e.target === dl) dl.close(); }));

    ["#modal-presu", "#modal-ajustes"].forEach((id) => {
      $(id).addEventListener("input", (e) => { const el = e.target.closest("[data-aj]"); if (el) aplicarAjuste(el); });
      $(id).addEventListener("click", (e) => { const el = e.target.closest("[data-exportar]"); if (el) exportar(el.dataset.exportar); });
    });

    $("#p-buscar").addEventListener("input", (e) => {
      clearTimeout(timerBusca);
      const q = e.target.value;
      timerBusca = setTimeout(() => buscarLugares(q), 380);
    });
    $("#p-buscar").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(timerBusca); buscarLugares(e.target.value); } });
    $("#p-resultados").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.resLocal) elegirLugar(b.dataset.resLocal);
      else if (b.dataset.res != null) elegirLugar(buscarLugares.feats[+b.dataset.res]);
    });
    $("#p-rapidos").addEventListener("click", (e) => {
      const b = e.target.closest("[data-rapido]");
      if (b) elegirLugar(pintarRapidos.lista[+b.dataset.rapido].ref);
    });
    $("#p-lugar-elegido").addEventListener("click", (e) => { if (e.target.closest("#p-quitar")) { edit.lugar = null; pintarLugarElegido(); } });
    $("#p-en-mapa").addEventListener("click", iniciarEleccionMapa);
    $("#p-tipo-hora").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { edit.tipo = b.dataset.v; pintarSegmentos(); } });
    $("#p-modo").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { edit.modo = b.dataset.v; pintarSegmentos(); } });
    $("#p-borrar").addEventListener("click", borrarParada);
    $("#form-parada").addEventListener("submit", (e) => {
      e.preventDefault();
      if (guardarParada()) $("#modal-parada").close();
    });

    $("#usar-nueva").addEventListener("click", () => {
      try { localStorage.removeItem(LS); } catch (e) {}
      S = clon(BASE);
      baseVersion = BASE.version || 0;
      hayGuardado = false;
      $("#aviso-nueva").hidden = true;
      render(true);
    });
    $("#mantener-mia").addEventListener("click", () => {
      baseVersion = BASE.version || 0;
      guardar();
      $("#aviso-nueva").hidden = true;
    });

    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea, dialog")) return;
      if (e.key === "ArrowRight") elegirDia(diaSel + 1);
      if (e.key === "ArrowLeft") elegirDia(diaSel - 1);
      if (e.key === "Escape" && eligiendo) { eligiendo = false; $("#app").classList.remove("eligiendo"); abrirModal("#modal-parada"); }
    });

    let eraMovil = esMovil();
    window.addEventListener("resize", () => {
      medirCabecera();
      medirCarrusel();
      if (mapa) mapa.invalidateSize();
      if (esMovil() !== eraMovil) { eraMovil = esMovil(); renderMapa(false); }
    });
    window.addEventListener("online", () => render(false));

    setInterval(() => {
      renderEstado();
      const hoy = ahoraLA().fecha;
      if (S.dias[diaSel].fecha === hoy && !document.activeElement.closest("#lista input")) renderLista();
    }, 30000);
  }

  function iniciarMapa() {
    if (!window.L) { $("#mapa-sin").hidden = false; return; }
    mapa = L.map("mapa", { zoomControl: false, attributionControl: true, preferCanvas: false }).setView([34.06, -118.3], 11);
    L.control.zoom({ position: "bottomright" }).addTo(mapa);
    L.tileLayer(TILE_BASE, {
      maxZoom: 19,
      maxNativeZoom: 16,
      crossOrigin: true,
      attribution: 'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);
    L.tileLayer(TILE_REF, { maxZoom: 19, maxNativeZoom: 16, crossOrigin: true, className: "capa-nombres" }).addTo(mapa);
    mapa.attributionControl.setPrefix(false);
    capa = L.layerGroup().addTo(mapa);
    mapa.on("click", (e) => { if (eligiendo) terminarEleccionMapa(e.latlng); });
    const zoomClase = () => $("#mapa").classList.toggle("lejos", mapa.getZoom() < 12);
    mapa.on("zoomend", zoomClase);
    zoomClase();
    $("#mapa").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pop-ver]");
      if (b) { mapa.closePopup(); irAAct(+b.dataset.popVer); }
    });
  }

  cargar();
  diaSel = diaInicial();
  iniciarMapa();
  eventos();
  medirCabecera();
  render(true);

  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
