(() => {
  const D = window.PRESUPUESTO;
  const LS = "viajeLA26:presupuestos";
  const LS_UBER = "viajeLA26:uberPP";
  const TIENDAS = D.tiendas;
  const COLORES = ["#9ec5ff", "#f7c1dc", "#f5c96a", "#7be0ad", "#c9b6ff", "#ffb38a", "#8fe3e8", "#e3e08f"];
  const OTRA = { id: "otra", nombre: "Otra tienda", sigla: "+", color: "#e9e9e9" };
  const AYUDA_LINK = "Con el link se completan la tienda y el nombre. El precio lo anotás vos.";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clon = (o) => JSON.parse(JSON.stringify(o));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fUsd0 = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const fUsd2 = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt = (v) => fUsd0.format(Math.round(v || 0));
  const fmt2 = (v) => fUsd2.format(v || 0);
  const n0 = (v) => { const x = parseFloat(v); return isFinite(x) ? x : 0; };
  const ms = (n) => `<span class="ms" aria-hidden="true">${n}</span>`;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const urlOk = (u) => /^https?:\/\/[^\s"'<>]+$/i.test(String(u || "").trim());
  const str = (v, max) => String(v == null ? "" : v).slice(0, max);
  const lista = (v) => (Array.isArray(v) ? v : []);
  const cant = (c) => Math.max(1, Math.round(n0(c.cant)) || 1);
  const sigla = (nombre) => {
    const p = String(nombre || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "?";
    return (p.length > 1 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase();
  };

  let E, P, toastT;
  let editPersona = null, colorSel = null, editItem = null;
  let editCompra = null, tiendaSel = "", fotoSel = "", nombreAuto = false;

  const colorLibre = () => {
    const usados = E ? E.personas.map((p) => p.color) : [];
    return COLORES.find((c) => !usados.includes(c)) || COLORES[(E ? E.personas.length : 0) % COLORES.length];
  };

  function uberAgenda() {
    let v = null;
    try { v = parseFloat(localStorage.getItem(LS_UBER)); } catch (e) { v = null; }
    return isFinite(v) && v > 0 ? v : null;
  }

  function limpiarItem(it) {
    return { id: str(it.id || uid(), 40), nombre: str(it.nombre, 90), nota: str(it.nota, 300), precio: n0(it.precio), on: it.on !== false };
  }

  function limpiarCompra(c) {
    const base = { id: str(c.id || uid(), 40), tienda: str(c.tienda || "otra", 40) };
    if (base.tienda === "otra") base.tiendaNombre = str(c.tiendaNombre, 40);
    if (Array.isArray(c.opciones)) {
      return Object.assign(base, {
        grupo: str(c.grupo, 90),
        sel: c.sel == null ? null : str(c.sel, 40),
        opciones: c.opciones.map((o) => ({ id: str(o.id || uid(), 40), nombre: str(o.nombre, 90), nota: str(o.nota, 300), precio: n0(o.precio), img: urlOk(o.img) ? o.img.trim() : "" }))
      });
    }
    return Object.assign(base, {
      nombre: str(c.nombre, 90),
      nota: str(c.nota, 300),
      precio: n0(c.precio),
      cant: cant(c),
      on: !!c.on,
      link: urlOk(c.link) ? c.link.trim() : "",
      img: urlOk(c.img) ? c.img.trim() : "",
      alerta: !!c.alerta,
      aviso: str(c.aviso, 400)
    });
  }

  function normalizar(x) {
    if (!x || typeof x !== "object" || !String(x.nombre || "").trim()) return null;
    const t = D.plantilla;
    const def = (k, v) => (x[k] == null || x[k] === "" ? v : n0(x[k]));
    return {
      id: str(x.id || uid(), 40),
      nombre: str(x.nombre, 24).trim(),
      color: /^#[0-9a-f]{6}$/i.test(x.color) ? x.color : COLORES[0],
      recibo: n0(x.recibo),
      dias: def("dias", t.dias),
      almuerzo: def("almuerzo", t.almuerzo),
      cena: def("cena", t.cena),
      impuesto: def("impuesto", D.impuesto),
      franquicia: def("franquicia", D.franquicia),
      conImpuesto: x.conImpuesto !== false,
      miParte: x.miParte !== false,
      reservas: lista(x.reservas).map(limpiarItem),
      snacks: lista(x.snacks).map(limpiarItem),
      compras: lista(x.compras).map(limpiarCompra)
    };
  }

  function crearPersona(datos, conAgenda) {
    const p = Object.assign(clon(D.plantilla), { impuesto: D.impuesto, franquicia: D.franquicia }, clon(datos));
    p.id = p.id || uid();
    p.color = p.color || colorLibre();
    const est = conAgenda ? uberAgenda() : null;
    const uber = p.reservas.find((r) => r.id === "uber");
    if (est && uber) uber.precio = Math.ceil(est / 10) * 10;
    return normalizar(p);
  }

  function cargar() {
    let g = null;
    try { g = JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { g = null; }
    if (g && Array.isArray(g.personas) && g.super && Array.isArray(g.super.items) && Array.isArray(g.super.tiendas)) {
      E = { sel: g.sel, listo: !!g.listo, personas: g.personas.map(normalizar).filter(Boolean), super: g.super };
    } else {
      E = { sel: null, listo: false, personas: [], super: clon(D.super) };
      D.personas.forEach((p) => E.personas.push(crearPersona(p, false)));
    }
    elegir(E.sel);
  }

  function elegir(id) {
    P = E.personas.find((p) => p.id === id) || E.personas[0] || null;
    E.sel = P ? P.id : null;
  }

  const guardar = () => { try { localStorage.setItem(LS, JSON.stringify(E)); } catch (e) {} };

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("ver");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("ver"), 2600);
  }

  function abrir(sel) {
    const d = $(sel);
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
  }

  const tiendaDe = (c) => {
    const t = TIENDAS.find((x) => x.id === c.tienda);
    if (t) return t;
    const nombre = String(c.tiendaNombre || "").trim() || "Otra tienda";
    return { id: "otra:" + nombre.toLowerCase(), nombre, sigla: sigla(nombre), color: "#e9e9e9", otra: true };
  };

  function urlBuscar(t, q) {
    q = String(q || "").trim();
    if (t && t.buscar && q) return t.buscar.includes("{q}") ? t.buscar.replace("{q}", encodeURIComponent(q)) : t.buscar + encodeURIComponent(q);
    if (t && t.web && !q) return t.web;
    return "https://www.google.com/search?udm=28&q=" + encodeURIComponent([q, t && !t.otra ? t.nombre : ""].filter(Boolean).join(" "));
  }

  const urlMapa = (t) => (t.online ? "" : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(t.mapa || `${t.nombre} near Hollywood, Los Angeles, CA`));

  const MAYUS = {
    iphone: "iPhone", ipad: "iPad", airpods: "AirPods", airtag: "AirTag", macbook: "MacBook", imac: "iMac", playstation: "PlayStation",
    ps5: "PS5", xbox: "Xbox", dji: "DJI", jbl: "JBL", lg: "LG", hp: "HP", tv: "TV", usb: "USB", hdmi: "HDMI", ssd: "SSD", rtx: "RTX",
    oled: "OLED", qled: "QLED", led: "LED", "4k": "4K", gb: "GB", tb: "TB", mah: "mAh", og: "OG", nfl: "NFL", nba: "NBA", la: "LA"
  };
  const CHICAS = ["with", "and", "for", "the", "of", "in", "on", "to", "by", "a", "an", "y", "de", "con", "para"];
  const esSlug = (s) => /[a-z]{2,}/i.test(s) && /[-_ ]/.test(s) && !/[.=]/.test(s);
  const sinExt = (s) => s.replace(/\.(html?|p|aspx?|jsp)$/i, "");
  const sinCodigo = (ws) => {
    const u = ws[ws.length - 1] || "";
    return ws.length > 1 && /^[a-z][a-z0-9]*[A-Z][A-Za-z0-9]*$/.test(u) && !MAYUS[u.toLowerCase()] ? ws.slice(0, -1) : ws;
  };
  const lindo = (s) => sinCodigo(String(s || "").replace(/[-_+]+/g, " ").replace(/\s+/g, " ").trim().split(" ")).map((w, i) => {
    const k = w.toLowerCase();
    if (MAYUS[k]) return MAYUS[k];
    if (/^\d+(gb|tb)$/i.test(w)) return w.toUpperCase();
    if (i > 0 && CHICAS.includes(k)) return k;
    return /^[a-z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w;
  }).join(" ").slice(0, 90);

  function nombreDeLink(u) {
    let url;
    try { url = new URL(u); } catch (e) { return ""; }
    const host = url.hostname.replace(/^www\d*\./, "");
    const seg = url.pathname.split("/").filter(Boolean).map((s) => { try { return decodeURIComponent(s); } catch (e) { return s; } });
    const tras = (k) => { const i = seg.indexOf(k); return i >= 0 ? seg[i + 1] || "" : ""; };
    let slug = "";
    if (/(^|\.)bestbuy\.com$/.test(host)) slug = tras("site") || tras("product");
    else if (/(^|\.)walmart\.com$/.test(host)) slug = tras("ip");
    else if (/(^|\.)target\.com$/.test(host)) slug = tras("p");
    else if (/(^|\.)amazon\.com$/.test(host)) { const i = seg.indexOf("dp"); slug = i > 0 ? seg[i - 1] : ""; }
    else if (/(^|\.)costco\.com$/.test(host)) slug = (seg[seg.length - 1] || "").replace(/\.product\..*$/i, "");
    slug = sinExt(slug);
    if (!esSlug(slug)) slug = seg.map(sinExt).filter(esSlug).sort((a, b) => b.length - a.length)[0] || "";
    if (!slug) slug = ["st", "q", "k", "keyword", "searchTerm", "query", "Ntt", "search"].map((k) => url.searchParams.get(k)).find((v) => v && v.trim()) || "";
    return lindo(slug);
  }

  function tiendaDeLink(u) {
    let h;
    try { h = new URL(u).hostname.replace(/^www\d*\./, ""); } catch (e) { return null; }
    return TIENDAS.find((t) => (t.dominios || []).some((d) => h === d || h.endsWith("." + d))) || null;
  }

  function fotoDeLink(u) {
    let url;
    try { url = new URL(u); } catch (e) { return ""; }
    if (!/(^|\.)bestbuy\.com$/.test(url.hostname)) return "";
    const sku = [url.searchParams.get("skuId") || "", (url.pathname.match(/\/sku\/(\d{7})/) || [])[1], (url.pathname.match(/\/(\d{7})\.p$/) || [])[1]].find((v) => /^\d{7}$/.test(v || ""));
    return sku ? `https://pisces.bbystatic.com/image2/BestBuy_US/images/products/${sku.slice(0, 4)}/${sku}_sd.jpg;maxHeight=200;maxWidth=200?format=webp` : "";
  }

  function totalSuper() {
    const SU = E.super, ti = SU.tienda;
    return SU.items.reduce((a, x) => a + (x.on ? n0(x.cant) * n0(x.p[ti]) * (x.imp ? 1 + D.impuesto / 100 : 1) : 0), 0);
  }

  function elegido(c) {
    if (c.opciones) {
      const o = c.opciones.find((x) => x.id === c.sel);
      return o ? { precio: n0(o.precio), n: 1 } : null;
    }
    return c.on ? { precio: n0(c.precio) * cant(c), n: cant(c) } : null;
  }

  function calcular(p) {
    const reservas = p.reservas.reduce((a, r) => a + (r.on ? n0(r.precio) : 0), 0);
    const comida = n0(p.dias) * (n0(p.almuerzo) + n0(p.cena));
    const snacks = p.snacks.reduce((a, r) => a + (r.on ? n0(r.precio) : 0), 0);
    let base = 0, elegidos = 0;
    p.compras.forEach((c) => { const x = elegido(c); if (x) { base += x.precio; elegidos += x.n; } });
    const SU = E.super;
    const superTot = totalSuper();
    const aporte = n0(SU.pozo) / Math.max(1, n0(SU.personas) || 1);
    const miParte = p.miParte ? aporte : 0;
    const imp = p.conImpuesto ? (base * n0(p.impuesto)) / 100 : 0;
    const compras = base + imp;
    const gastos = reservas + comida + snacks + compras + miParte;
    const aduana = Math.max(0, base - n0(p.franquicia)) * 0.5;
    return { superTot, aporte, miParte, reservas, comida, snacks, base, imp, compras, elegidos, gastos, aduana, queda: n0(p.recibo) - gastos };
  }

  function subtotales() {
    const m = {};
    P.compras.forEach((c) => {
      const id = tiendaDe(c).id;
      const g = m[id] || (m[id] = { n: 0, sub: 0 });
      const x = elegido(c);
      if (x) { g.n += x.n; g.sub += x.precio; }
    });
    return m;
  }

  const sw = (on, attrs, label) => `<label class="sw"><input type="checkbox" ${on ? "checked" : ""} ${attrs} aria-label="${esc(label)}"><i></i></label>`;
  const num = (v, attrs, step = 1) => `<input class="num chico" type="number" min="0" step="${step}" inputmode="decimal" value="${n0(v)}" ${attrs}>`;
  const sigHTML = (t, cls = "") => `<span class="sig ${cls}" style="background:${esc(t.color)}">${esc(t.sigla)}</span>`;
  const fotoHTML = (img, t) => (urlOk(img)
    ? `<img class="foto" src="${esc(img)}" alt="" loading="lazy" data-sigla="${esc(t.sigla)}" data-color="${esc(t.color)}">`
    : `<span class="foto sig" style="background:${esc(t.color)}">${esc(t.sigla)}</span>`);

  function pintarPersonas() {
    $("#personas").innerHTML = E.personas.map((p) => {
      const R = calcular(p), sel = P && p.id === P.id;
      return `<button class="persona ${sel ? "sel" : ""}" data-persona="${esc(p.id)}" ${sel ? 'aria-current="true"' : ""}>
        <span class="sig" style="background:${esc(p.color)}">${esc(sigla(p.nombre))}</span>
        <span><b>${esc(p.nombre)}</b><small class="${R.queda < 0 ? "neg" : ""}">${R.queda < 0 ? "se pasa " + fmt(-R.queda) : "queda " + fmt(R.queda)}</small></span>
      </button>`;
    }).join("") + `<button class="persona nueva" data-accion="nueva-persona">
        <span class="sig vacio">${ms("add")}</span>
        <span><b>Agregar</b><small>mi presupuesto</small></span>
      </button>`;
  }

  function pintarBienvenida() {
    $("#bienvenida").hidden = E.listo && E.personas.length > 0;
    $("#bienvenida-btns").innerHTML = E.personas.map((p) => `<button class="btn btn-sec" data-persona="${esc(p.id)}" data-listo>Soy ${esc(p.nombre)}</button>`).join("") +
      `<button class="btn" data-accion="nueva-persona">${ms("add")}Agregar mi presupuesto</button>`;
  }

  function pintarListas() {
    $("#reservas").innerHTML = P.reservas.map((r, i) => {
      let extra = "";
      const est = r.id === "uber" ? uberAgenda() : null;
      if (est && Math.abs(est - n0(r.precio)) >= 1) extra = `<small class="uber-est">La agenda calcula ${fmt(est)} por persona · <button type="button" class="link-btn" data-usar-uber="${i}">Usar</button></small>`;
      return `<div class="fila ${r.on ? "" : "off"}">
        ${sw(r.on, `data-res="${i}"`, r.nombre)}
        <div class="txt"><button type="button" class="nombre" data-editar="reservas" data-i="${i}"><b>${esc(r.nombre)}</b></button>${r.nota ? `<small>${esc(r.nota)}</small>` : ""}${extra}</div>
        <div class="precio"><em>US$</em>${num(r.precio, `data-res-p="${i}"`)}</div></div>`;
    }).join("") || '<p class="vacio-compras">No hay reservas cargadas.</p>';

    $("#snacks").innerHTML = P.snacks.map((r, i) => `<div class="snack ${r.on ? "" : "off"}">
      ${sw(r.on, `data-sn="${i}"`, r.nombre)}
      <div><button type="button" class="nombre" data-editar="snacks" data-i="${i}"><b>${esc(r.nombre)}</b></button>${r.nota ? `<small>${esc(r.nota)}</small>` : ""}</div>
      ${num(r.precio, `data-sn-p="${i}"`)}</div>`).join("");

    pintarCompras();
  }

  function filaCompra(c, i, t) {
    if (c.opciones) {
      return `<div class="grupo">
        <div class="grupo-cab"><b>${esc(c.grupo)}</b><button type="button" class="icono-btn chico" data-borrar-grupo="${i}" aria-label="Borrar ${esc(c.grupo)}" title="Borrar">${ms("delete")}</button></div>
        <div class="opciones">${[{ id: null, nombre: "No compro", nota: "", precio: null }].concat(c.opciones).map((o) => `<label class="opcion ${c.sel === o.id ? "sel" : ""}">
          <input type="radio" name="g${i}" ${c.sel === o.id ? "checked" : ""} data-op="${i}" data-op-id="${esc(o.id || "")}">
          ${o.id ? fotoHTML(o.img, t) : '<span class="foto vacia"></span>'}
          <span><b>${esc(o.nombre)}</b>${o.nota ? `<small>${esc(o.nota)}</small>` : ""}</span>
          ${o.precio != null ? `<span class="precio"><em>US$</em>${num(o.precio, `data-op-p="${i}" data-op-pid="${esc(o.id)}"`, 0.01)}</span>` : "<span></span>"}
        </label>`).join("")}</div>
      </div>`;
    }
    const k = cant(c);
    const propio = urlOk(c.link);
    const link = propio ? c.link : urlBuscar(t, c.nombre);
    const txtLink = propio ? "Ver el producto" : t.buscar ? `Buscar en ${esc(t.nombre)}` : "Buscar el precio";
    return `<div class="fila con-foto ${c.on ? "" : "off"}">
      ${sw(c.on, `data-co="${i}"`, c.nombre)}
      ${fotoHTML(c.img, t)}
      <div class="txt">
        <button type="button" class="nombre" data-editar-compra="${i}"><b>${esc(c.nombre)}${c.alerta ? '<span class="tag">ojo con el precio</span>' : ""}</b></button>
        ${c.nota ? `<small>${esc(c.nota)}</small>` : ""}
        <small><a href="${esc(link)}" target="_blank" rel="noopener">${txtLink}${ms("open_in_new")}</a></small>
      </div>
      <div class="precio"><em>US$</em>${num(c.precio, `data-co-p="${i}"`, 0.01)}${k > 1 ? `<em>× ${k}</em>` : ""}</div></div>`;
  }

  function textoSubtotal(t, s) {
    if (s && s.n) return `${s.n} ${s.n === 1 ? "cosa" : "cosas"} · ${fmt2(s.sub)}${P.conImpuesto ? " + impuesto" : ""}`;
    return t.nota || "Nada activado todavía";
  }

  function pintarCompras() {
    const grupos = [];
    P.compras.forEach((c, i) => {
      const t = tiendaDe(c);
      let g = grupos.find((x) => x.t.id === t.id);
      if (!g) grupos.push((g = { t, items: [] }));
      g.items.push(i);
    });
    const subs = subtotales();
    $("#compras").innerHTML = grupos.length ? grupos.map(({ t, items }) => {
      const mapa = urlMapa(t);
      const agregar = t.otra ? `data-agregar-compra="otra" data-nombre-tienda="${esc(t.nombre)}"` : `data-agregar-compra="${esc(t.id)}"`;
      const links = [
        t.otra ? "" : `<a href="${esc(urlBuscar(t, ""))}" target="_blank" rel="noopener">Web${ms("open_in_new")}</a>`,
        mapa ? `<a href="${esc(mapa)}" target="_blank" rel="noopener">Mapa${ms("map")}</a>` : ""
      ].join("");
      return `<div class="tienda-grupo">
        <div class="tienda-cab">
          ${sigHTML(t, "chico")}
          <div class="tienda-txt">
            <b>${esc(t.nombre)}</b>
            <small data-sub-tienda="${esc(t.id)}">${esc(textoSubtotal(t, subs[t.id]))}</small>
            ${links ? `<span class="tienda-links">${links}</span>` : ""}
          </div>
          <button type="button" class="icono-btn chico" ${agregar} aria-label="Agregar algo de ${esc(t.nombre)}" title="Agregar algo de ${esc(t.nombre)}">${ms("add")}</button>
        </div>
        ${items.map((i) => filaCompra(P.compras[i], i, t)).join("")}
      </div>`;
    }).join("") : '<p class="vacio-compras">Todavía no hay compras. Tocá <b>Agregar algo para comprar</b>, elegí la tienda y anotá el precio que ves en la web o en el local.</p>';

    $("#impuesto").innerHTML = `<div class="fila ${P.conImpuesto ? "" : "off"}">
      ${sw(P.conImpuesto, "data-imp", "Sumar impuesto de venta")}
      <div class="txt"><b>Sumar impuesto de venta</b><small>En LA los precios no lo incluyen: se agrega en la caja (10,25 % en casi todo LA desde octubre)</small></div>
      <div class="precio">${num(P.impuesto, "data-imp-p", 0.25)}<em>%</em></div></div>`;
  }

  function pintarSuper() {
    const SU = E.super;
    $("#tiendas").innerHTML = SU.tiendas.map((t) => `<label class="opcion ${SU.tienda === t.id ? "sel" : ""}">
      <input type="radio" name="tienda-super" ${SU.tienda === t.id ? "checked" : ""} data-tienda-super="${esc(t.id)}">
      <span class="ms caminar" aria-hidden="true">directions_walk</span>
      <span><b>${esc(t.nombre)}</b><small>${esc(t.dir)} · ${esc(t.camino)}</small></span><span></span></label>`).join("");
    $("#super").innerHTML = SU.items.map((x, i) => `<div class="fila ${x.on ? "" : "off"}">
      ${sw(x.on, `data-su="${i}"`, x.nombre)}
      <div class="txt"><b>${esc(x.nombre)}</b><small>${fmt2(n0(x.p[SU.tienda]))} c/u${x.imp ? " + impuesto" : ""}</small></div>
      <div class="precio">${num(x.cant, `data-su-c="${i}"`)}<em>×</em><b class="sub-tot" data-su-t="${i}"></b></div></div>`).join("");
    $("#mi-parte").className = "fila" + (P.miParte ? "" : " off");
    $("#mi-parte").innerHTML = `${sw(P.miParte, "data-miparte", "Sumar mi parte del pozo")}<div class="txt"><b>Sumar mi parte del pozo a mi presupuesto</b><small>Lo que pongo yo: pozo ÷ personas</small></div><div class="precio"><b id="mi-aporte"></b></div>`;
  }

  function pintarResumen() {
    const R = calcular(P);
    const sig = $("#p-sig");
    sig.textContent = sigla(P.nombre);
    sig.style.background = P.color;
    $("#p-nombre").textContent = P.nombre;
    $("#p-fechas").textContent = `${D.fechas} · todo en dólares`;
    $$("[data-k]").forEach((el) => { if (el !== document.activeElement) el.value = n0(P[el.dataset.k]); });
    $("#queda").classList.toggle("neg", R.queda < 0);
    $("#queda-n").textContent = (R.queda < 0 ? "− " : "") + fmt(Math.abs(R.queda));
    $("#queda-sub").textContent = R.queda < 0 ? `Me paso por ${fmt(-R.queda)}` : `de ${fmt(P.recibo)} · gasto ${fmt(R.gastos)}`;
    $("#t-reservas").textContent = fmt(R.reservas);
    $("#t-comida").textContent = fmt(R.comida);
    $("#t-comida-sub").textContent = `${n0(P.dias)} días × ${fmt(n0(P.almuerzo) + n0(P.cena))}`;
    $("#t-snacks").textContent = fmt(R.snacks);
    $("#t-snacks-sub").textContent = `${P.snacks.filter((s) => s.on).length} de ${P.snacks.length}`;

    const SU = E.super, personas = Math.max(1, n0(SU.personas) || 1);
    $("#super-sub").textContent = `Primera compra para la casa, entre los ${personas}`;
    SU.items.forEach((x, i) => {
      const el = $(`[data-su-t="${i}"]`);
      if (el) el.textContent = fmt2(n0(x.cant) * n0(x.p[SU.tienda]) * (x.imp ? 1 + D.impuesto / 100 : 1));
    });
    $$("[data-sk]").forEach((el) => { if (el !== document.activeElement) el.value = n0(SU[el.dataset.sk]); });
    $("#t-super").textContent = fmt(R.superTot);
    $("#t-super-sub").textContent = `${fmt2(R.superTot / personas)} c/u`;
    const sobra = n0(SU.pozo) - R.superTot;
    $("#pozo").className = "pozo" + (sobra < 0 ? " neg" : "");
    $("#pozo").textContent = sobra < 0
      ? `El carrito se pasa del pozo por ${fmt2(-sobra)}: pongan ${fmt2(R.superTot / personas)} cada uno o saquen algo.`
      : `Entra en el pozo de ${fmt(SU.pozo)} (${fmt2(R.aporte)} cada uno) y sobran ${fmt2(sobra)}.`;
    const ma = $("#mi-aporte");
    if (ma) ma.textContent = fmt2(R.aporte);

    $("#t-compras").textContent = fmt(R.compras);
    $("#t-compras-sub").textContent = `${R.elegidos} ${R.elegidos === 1 ? "cosa" : "cosas"}${R.imp ? ` · ${fmt(R.imp)} de impuesto` : ""}`;
    const subs = subtotales();
    $$("[data-sub-tienda]").forEach((el) => {
      const c = P.compras.find((x) => tiendaDe(x).id === el.dataset.subTienda);
      if (c) el.textContent = textoSubtotal(tiendaDe(c), subs[el.dataset.subTienda]);
    });

    const partes = [
      ["Reservas", R.reservas, "var(--blue)"],
      ["Comida", R.comida, "var(--amber)"],
      ["Snacks", R.snacks, "var(--pink)"],
      ["Súper (mi parte)", R.miParte, "var(--mint)"],
      ["Compras", R.compras, "var(--violet)"]
    ];
    const tope = Math.max(n0(P.recibo), R.gastos, 1);
    $("#barra").innerHTML = partes.map(([, v, c]) => `<i style="width:${(v / tope) * 100}%;background:${c}"></i>`).join("");
    $("#leyenda").innerHTML = partes.map(([n, v, c]) => `<span style="--c:${c}">${n}</span><b>${fmt(v)}</b>`).join("") +
      `<span class="total">Total gastos</span><b class="total">${fmt(R.gastos)}</b>`;

    const av = [];
    if (!n0(P.recibo)) av.push(`<div class="aviso">${ms("warning")}<span>Anotá arriba cuánta plata llevás para ver cuánto te queda.</span></div>`);
    P.compras.forEach((c) => { if (c.aviso && c.on) av.push(`<div class="aviso">${ms("warning")}<span>${esc(c.aviso)}</span></div>`); });
    if (R.base > n0(P.franquicia)) av.push(`<div class="aviso">${ms("warning")}<span>Las compras suman ${fmt(R.base)} sin impuesto: pasás la franquicia de ${fmt(P.franquicia)} por persona. En Ezeiza el excedente paga 50 % ≈ <b>${fmt(R.aduana)}</b> (no está restado). El celular y la notebook de uso personal no cuentan.</span></div>`);
    av.push(`<div class="aviso gris">${ms("payments")}<span>Si pagás con tarjeta argentina, pagá el resumen con dólares para evitar el 30 % de percepción.</span></div>`);
    $("#avisos").innerHTML = av.join("");

    pintarPersonas();
  }

  function todo() {
    pintarBienvenida();
    $("#wrap").hidden = !P;
    if (P) {
      pintarListas();
      pintarSuper();
      pintarResumen();
    } else {
      pintarPersonas();
    }
    document.title = P ? `Presupuesto de ${P.nombre} · LA 26` : "LA 26 · Presupuestos";
  }

  function pintarColores() {
    $("#pe-colores").innerHTML = COLORES.map((c) => `<button type="button" class="color ${c === colorSel ? "sel" : ""}" style="background:${c}" data-color="${c}" aria-label="Color ${c}" aria-pressed="${c === colorSel}"></button>`).join("");
  }

  function abrirPersona(p) {
    editPersona = p;
    $("#persona-titulo").textContent = p ? "Editar presupuesto" : "Nuevo presupuesto";
    $("#pe-nombre").value = p ? p.nombre : "";
    $("#pe-recibo").value = p && n0(p.recibo) ? n0(p.recibo) : "";
    colorSel = p ? p.color : colorLibre();
    pintarColores();
    $("#pe-ayuda").hidden = !!p;
    $("#pe-borrar").hidden = !p;
    $("#pe-guardar").textContent = p ? "Guardar" : "Crear";
    abrir("#modal-persona");
    if (!p) setTimeout(() => $("#pe-nombre").focus(), 60);
  }

  function abrirItem(cual, i) {
    const it = i == null ? null : P[cual][i];
    editItem = { cual, i };
    const res = cual === "reservas";
    $("#item-titulo").textContent = (it ? "Editar " : "Agregar ") + (res ? "reserva" : "comida");
    $("#it-nota-label").textContent = res ? "Detalle" : "Dónde";
    $("#it-nombre").placeholder = res ? "Ej: Entrada a Six Flags" : "Ej: Hamburguesa de In-N-Out";
    $("#it-nombre").value = it ? it.nombre : "";
    $("#it-nota").value = it ? it.nota || "" : "";
    $("#it-precio").value = it ? n0(it.precio) : "";
    $("#it-borrar").hidden = !it;
    $("#it-guardar").textContent = it ? "Guardar" : "Agregar";
    abrir("#modal-item");
    if (!it) setTimeout(() => $("#it-nombre").focus(), 60);
  }

  function tiendaDialogo() {
    if (tiendaSel === "otra") {
      const n = $("#c-tienda-otra").value.trim() || "Otra tienda";
      return { id: "otra", nombre: n, sigla: sigla(n), color: "#e9e9e9", otra: true };
    }
    return TIENDAS.find((t) => t.id === tiendaSel) || null;
  }

  function pintarTiendasDialogo() {
    const cats = [];
    TIENDAS.forEach((t) => {
      let c = cats.find((x) => x.n === t.cat);
      if (!c) cats.push((c = { n: t.cat, ts: [] }));
      c.ts.push(t);
    });
    cats[cats.length - 1].ts.push(OTRA);
    $("#c-tiendas").innerHTML = cats.map((c) => `<div class="tiendas-cat">${esc(c.n)}</div>
      <div class="tiendas-grid">${c.ts.map((t) => `<button type="button" class="tienda-chip" data-elegir-tienda="${esc(t.id)}">${sigHTML(t, "chico")}${esc(t.nombre)}</button>`).join("")}</div>`).join("");
    marcarTienda(true);
  }

  function marcarTienda(centrar) {
    $$(".tienda-chip", $("#c-tiendas")).forEach((b) => {
      const on = b.dataset.elegirTienda === tiendaSel;
      b.classList.toggle("sel", on);
      b.setAttribute("aria-pressed", on);
      if (on && centrar) {
        const fila = b.parentElement;
        fila.scrollLeft = b.offsetLeft - fila.offsetLeft - (fila.clientWidth - b.offsetWidth) / 2;
      }
    });
    $("#c-tienda-otra").hidden = tiendaSel !== "otra";
  }

  function actualizarBuscar() {
    const t = tiendaDialogo(), q = $("#c-nombre").value.trim();
    const btns = [];
    if (t && !t.otra) btns.push(`<a class="btn btn-sec btn-chico" href="${esc(urlBuscar(t, q))}" target="_blank" rel="noopener">${ms("search")}${q ? (t.buscar ? "Buscar en " : "Buscar el precio en ") : "Abrir "}${esc(t.nombre)}</a>`);
    if (q) btns.push(`<a class="btn btn-sec btn-chico" href="${esc(urlBuscar(null, q))}" target="_blank" rel="noopener">${ms("open_in_new")}Comparar precios</a>`);
    $("#c-buscar").innerHTML = btns.join("");
    $("#c-buscar").hidden = !btns.length;
  }

  function ayudaLink(msg, ok) {
    const a = $("#c-link-ayuda");
    a.textContent = msg || AYUDA_LINK;
    a.classList.toggle("ok", !!ok);
  }

  function abrirCompra(i, tiendaId, nombreTienda) {
    const c = i == null ? null : P.compras[i];
    editCompra = c ? i : null;
    $("#compra-titulo").textContent = c ? "Editar compra" : "Agregar compra";
    $("#c-link").value = c ? c.link || "" : "";
    $("#c-nombre").value = c ? c.nombre : "";
    $("#c-precio").value = c ? n0(c.precio) : "";
    $("#c-cant").value = c ? cant(c) : 1;
    $("#c-nota").value = c ? c.nota || "" : "";
    tiendaSel = c ? c.tienda : tiendaId || "";
    $("#c-tienda-otra").value = c ? c.tiendaNombre || "" : nombreTienda || "";
    fotoSel = c ? c.img || "" : "";
    nombreAuto = false;
    $("#c-borrar").hidden = !c;
    $("#c-guardar").textContent = c ? "Guardar" : "Agregar";
    ayudaLink("");
    abrir("#modal-compra");
    pintarTiendasDialogo();
    actualizarBuscar();
    $(".modal-cuerpo", $("#modal-compra")).scrollTop = 0;
  }

  function textoResumen() {
    const R = calcular(P);
    const l = [
      `Presupuesto LA 26 · ${P.nombre}`,
      `Llevo ${fmt(P.recibo)} · gasto ${fmt(R.gastos)} · ${R.queda < 0 ? "me paso por " + fmt(-R.queda) : "me quedan " + fmt(R.queda)}`,
      "",
      `Reservas: ${fmt(R.reservas)}`,
      `Comida: ${fmt(R.comida)}`,
      `Snacks: ${fmt(R.snacks)}`,
      `Súper (mi parte): ${fmt(R.miParte)}`,
      `Compras: ${fmt(R.compras)}${R.imp ? " con impuesto" : ""}`
    ];
    const porTienda = [];
    P.compras.forEach((c) => {
      const x = elegido(c);
      if (!x) return;
      const o = c.opciones ? c.opciones.find((y) => y.id === c.sel) : null;
      const nombre = o ? `${c.grupo}: ${o.nombre}` : `${c.nombre}${x.n > 1 ? " ×" + x.n : ""}`;
      const t = tiendaDe(c);
      let g = porTienda.find((y) => y.n === t.nombre);
      if (!g) porTienda.push((g = { n: t.nombre, items: [] }));
      g.items.push(`• ${nombre} · ${fmt2(x.precio)}`);
    });
    if (porTienda.length) {
      l.push("", "Lista de compras");
      porTienda.forEach((g) => { l.push(`${g.n}:`); l.push(...g.items); });
    }
    return l.join("\n");
  }

  async function compartir() {
    const txt = textoResumen();
    if (navigator.share) {
      try { await navigator.share({ title: `Presupuesto de ${P.nombre}`, text: txt }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(txt);
      toast("Resumen copiado: pegalo en el grupo");
    } catch (e) {
      toast("No se pudo copiar el resumen");
    }
  }

  function exportar() {
    const datos = { tipo: "presupuesto-la26", version: 1, personas: [clon(P)] };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    const nombre = P.nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "presupuesto";
    a.href = URL.createObjectURL(blob);
    a.download = `presupuesto-la-${nombre}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("Copia guardada");
  }

  async function importar(f) {
    let d = null;
    try { d = JSON.parse(await f.text()); } catch (e) { d = null; }
    if (!d || d.tipo !== "presupuesto-la26" || !Array.isArray(d.personas)) { toast("Ese archivo no es un presupuesto de esta página"); return; }
    let n = 0, ultimo = null;
    d.personas.forEach((x) => {
      const q = normalizar(x);
      if (!q) return;
      const i = E.personas.findIndex((p) => p.id === q.id || p.nombre.toLowerCase() === q.nombre.toLowerCase());
      if (i >= 0) {
        if (!confirm(`Ya hay un presupuesto de ${E.personas[i].nombre} en este celular. ¿Lo reemplazo por el del archivo?`)) return;
        q.id = E.personas[i].id;
        E.personas[i] = q;
      } else {
        E.personas.push(q);
      }
      ultimo = q.id;
      n++;
    });
    if (!n) return;
    elegir(ultimo);
    E.listo = true;
    guardar();
    todo();
    toast(n === 1 ? `Listo: cargué el presupuesto de ${P.nombre}` : `Listo: cargué ${n} presupuestos`);
  }

  document.addEventListener("change", (e) => {
    const t = e.target, d = t.dataset;
    if (!P) return;
    if (d.res != null) P.reservas[+d.res].on = t.checked;
    else if (d.sn != null) P.snacks[+d.sn].on = t.checked;
    else if (d.co != null) P.compras[+d.co].on = t.checked;
    else if (d.op != null) P.compras[+d.op].sel = d.opId || null;
    else if (d.tiendaSuper) E.super.tienda = d.tiendaSuper;
    else if (d.su != null) E.super.items[+d.su].on = t.checked;
    else if (t.hasAttribute("data-miparte")) P.miParte = t.checked;
    else if (t.hasAttribute("data-imp")) P.conImpuesto = t.checked;
    else return;
    guardar();
    todo();
  });

  document.addEventListener("input", (e) => {
    const t = e.target, d = t.dataset;
    if (!P) return;
    const v = n0(t.value);
    if (d.k) P[d.k] = v;
    else if (d.sk) E.super[d.sk] = v;
    else if (d.suC != null) E.super.items[+d.suC].cant = v;
    else if (d.resP != null) P.reservas[+d.resP].precio = v;
    else if (d.snP != null) P.snacks[+d.snP].precio = v;
    else if (d.coP != null) P.compras[+d.coP].precio = v;
    else if (d.opP != null) { const o = P.compras[+d.opP].opciones.find((x) => x.id === d.opPid); if (o) o.precio = v; }
    else if (t.hasAttribute("data-imp-p")) P.impuesto = v;
    else return;
    guardar();
    pintarResumen();
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const d = b.dataset;
    if (b.hasAttribute("data-cerrar")) { b.closest("dialog").close(); return; }
    if (d.persona != null) {
      elegir(d.persona);
      E.listo = true;
      guardar();
      todo();
      if (d.listo != null) window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (d.accion === "nueva-persona") { abrirPersona(null); return; }
    if (!P) return;
    if (b.id === "editar-persona") abrirPersona(P);
    else if (d.agregar) abrirItem(d.agregar, null);
    else if (d.editar) abrirItem(d.editar, +d.i);
    else if (d.agregarCompra != null) abrirCompra(null, d.agregarCompra, d.nombreTienda);
    else if (d.editarCompra != null) abrirCompra(+d.editarCompra);
    else if (d.borrarGrupo != null) {
      const c = P.compras[+d.borrarGrupo];
      if (c && confirm(`¿Sacar "${c.grupo}" de tu lista?`)) { P.compras.splice(+d.borrarGrupo, 1); guardar(); todo(); }
    } else if (d.usarUber != null) {
      const est = uberAgenda();
      if (est) { P.reservas[+d.usarUber].precio = Math.round(est); guardar(); todo(); }
    }
  });

  $$("dialog").forEach((dl) => dl.addEventListener("click", (e) => { if (e.target === dl) dl.close(); }));

  $("#pe-colores").addEventListener("click", (e) => {
    const b = e.target.closest("[data-color]");
    if (!b) return;
    colorSel = b.dataset.color;
    pintarColores();
  });

  $("#form-persona").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("#pe-nombre").value.trim().slice(0, 24);
    if (!nombre) { $("#pe-nombre").focus(); toast("Poné un nombre"); return; }
    const recibo = n0($("#pe-recibo").value);
    const nuevo = !editPersona;
    if (editPersona) {
      Object.assign(editPersona, { nombre, recibo, color: colorSel });
    } else {
      const ya = E.personas.find((p) => p.nombre.toLowerCase() === nombre.toLowerCase());
      if (ya) {
        elegir(ya.id);
        toast(`Ya había un presupuesto de ${ya.nombre}: te lo abrí`);
      } else {
        const p = crearPersona({ nombre, recibo, color: colorSel }, true);
        E.personas.push(p);
        elegir(p.id);
        toast(`Listo, ${nombre}: este es tu presupuesto`);
      }
    }
    E.listo = true;
    guardar();
    $("#modal-persona").close();
    todo();
    if (nuevo) window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("#pe-borrar").addEventListener("click", () => {
    if (!editPersona) return;
    if (!confirm(`¿Borrar el presupuesto de ${editPersona.nombre} de este celular?`)) return;
    E.personas = E.personas.filter((p) => p !== editPersona);
    elegir(E.personas[0] && E.personas[0].id);
    guardar();
    $("#modal-persona").close();
    todo();
  });

  $("#form-item").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("#it-nombre").value.trim().slice(0, 80);
    if (!nombre) { $("#it-nombre").focus(); return; }
    const datos = { nombre, nota: $("#it-nota").value.trim().slice(0, 120), precio: n0($("#it-precio").value) };
    const L = P[editItem.cual];
    if (editItem.i == null) L.push(Object.assign({ id: uid(), on: true }, datos));
    else Object.assign(L[editItem.i], datos);
    guardar();
    $("#modal-item").close();
    todo();
  });

  $("#it-borrar").addEventListener("click", () => {
    if (!editItem || editItem.i == null) return;
    P[editItem.cual].splice(editItem.i, 1);
    guardar();
    $("#modal-item").close();
    todo();
  });

  $("#c-tiendas").addEventListener("click", (e) => {
    const b = e.target.closest("[data-elegir-tienda]");
    if (!b) return;
    tiendaSel = b.dataset.elegirTienda;
    marcarTienda(false);
    actualizarBuscar();
    if (tiendaSel === "otra") $("#c-tienda-otra").focus();
  });

  $("#c-link").addEventListener("input", () => {
    const txt = $("#c-link").value;
    const m = txt.match(/https?:\/\/[^\s"'<>]+/i);
    if (!m) { ayudaLink(""); return; }
    const u = m[0];
    if (u !== txt.trim()) $("#c-link").value = u;
    const t = tiendaDeLink(u), nombre = nombreDeLink(u);
    if (t) { tiendaSel = t.id; marcarTienda(true); }
    if (nombre && (!$("#c-nombre").value.trim() || nombreAuto)) { $("#c-nombre").value = nombre; nombreAuto = true; }
    fotoSel = fotoDeLink(u) || (t && t.id === "bestbuy" ? "" : fotoSel);
    actualizarBuscar();
    if (t) ayudaLink(`Tienda: ${t.nombre}${nombre ? " · nombre completado, revisalo" : ""}. Anotá el precio que ves en la página.`, true);
    else ayudaLink("No reconozco esa tienda: elegila abajo y completá el nombre.");
  });

  $("#c-nombre").addEventListener("input", () => { nombreAuto = false; actualizarBuscar(); });
  $("#c-tienda-otra").addEventListener("input", actualizarBuscar);

  $("#form-compra").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = $("#c-nombre").value.trim().slice(0, 90);
    const otra = $("#c-tienda-otra").value.trim().slice(0, 40);
    if (!tiendaSel) { toast("Elegí la tienda"); $("#c-tiendas").scrollIntoView({ block: "nearest", behavior: "smooth" }); return; }
    if (tiendaSel === "otra" && !otra) { $("#c-tienda-otra").focus(); toast("Poné el nombre de la tienda"); return; }
    if (!nombre) { $("#c-nombre").focus(); toast("Poné qué querés comprar"); return; }
    const link = $("#c-link").value.trim();
    const datos = {
      tienda: tiendaSel,
      tiendaNombre: tiendaSel === "otra" ? otra : "",
      nombre,
      precio: n0($("#c-precio").value),
      cant: Math.max(1, Math.round(n0($("#c-cant").value)) || 1),
      nota: $("#c-nota").value.trim().slice(0, 120),
      link: urlOk(link) ? link : "",
      img: urlOk(fotoSel) ? fotoSel : ""
    };
    if (editCompra == null) {
      P.compras.push(limpiarCompra(Object.assign({ id: uid(), on: true }, datos)));
      toast("Agregado a tu lista");
    } else {
      const c = P.compras[editCompra];
      Object.assign(c, datos);
      if (tiendaSel !== "otra") delete c.tiendaNombre;
      toast("Guardado");
    }
    guardar();
    $("#modal-compra").close();
    todo();
  });

  $("#c-borrar").addEventListener("click", () => {
    if (editCompra == null) return;
    P.compras.splice(editCompra, 1);
    guardar();
    $("#modal-compra").close();
    todo();
  });

  $("#todo-off").addEventListener("click", () => {
    P.compras.forEach((c) => { if (c.opciones) c.sel = null; else c.on = false; });
    guardar();
    todo();
  });

  $("#reset").addEventListener("click", () => {
    if (!confirm(`¿Volver el presupuesto de ${P.nombre} a los valores iniciales? Se pierden las compras y los cambios que hiciste.`)) return;
    const seed = D.personas.find((s) => s.id === P.id);
    const nuevo = seed ? crearPersona(seed, false) : crearPersona({ id: P.id, nombre: P.nombre, color: P.color, recibo: P.recibo }, true);
    E.personas[E.personas.indexOf(P)] = nuevo;
    elegir(nuevo.id);
    guardar();
    todo();
  });

  $("#compartir").addEventListener("click", compartir);
  $("#exportar").addEventListener("click", exportar);
  $("#archivo").addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importar(f);
    e.target.value = "";
  });

  document.addEventListener("error", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLImageElement) || !t.classList.contains("foto")) return;
    const s = document.createElement("span");
    s.className = "foto sig";
    s.style.background = t.dataset.color || "#e9e9e9";
    s.textContent = t.dataset.sigla || "?";
    t.replaceWith(s);
  }, true);

  cargar();
  todo();

  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("../sw.js").catch(() => {}));
  }
})();
