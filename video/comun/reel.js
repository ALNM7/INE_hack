(() => {
  const D = BRAND.duracion;
  const leer = (id) => JSON.parse(document.getElementById(id).textContent);
  const config = leer("d-config");
  const meta = leer("d-meta");
  const raiz = document.getElementById("root");
  const zona = config.zona_segura;
  raiz.style.setProperty("--arriba", `${zona.arriba}px`);
  raiz.style.setProperty("--abajo", `${zona.abajo}px`);
  raiz.style.setProperty("--lados", `${zona.lados}px`);

  const limpio = (t) => t.replace(/\*/g, "");

  function voraz(palabras, ancho) {
    const lineas = [];
    let actual = "";
    for (const palabra of palabras) {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (actual && limpio(prueba).length > ancho) {
        lineas.push(actual);
        actual = palabra;
      } else {
        actual = prueba;
      }
    }
    if (actual) lineas.push(actual);
    return lineas;
  }

  function partir(texto, corte = config.subtitulos.corte, maximo = config.subtitulos.max_caracteres) {
    const palabras = texto.split(/\s+/);
    const total = limpio(texto).length;
    const objetivo = Math.max(1, Math.ceil(total / corte));
    let lineas = voraz(palabras, corte);
    for (let ancho = Math.ceil(total / objetivo); ancho <= corte; ancho++) {
      const intento = voraz(palabras, ancho);
      if (intento.length === objetivo) {
        lineas = intento;
        break;
      }
    }
    for (const l of lineas) {
      if (limpio(l).length > maximo) throw new Error(`subtítulo de ${limpio(l).length} caracteres: ${limpio(l)}`);
    }
    return lineas;
  }

  function linea(texto) {
    const span = document.createElement("span");
    span.className = "linea";
    for (const trozo of texto.split(/(\*[^*]+\*)/)) {
      if (!trozo) continue;
      if (trozo.startsWith("*")) {
        const em = document.createElement("em");
        em.textContent = trozo.slice(1, -1);
        span.append(em);
      } else {
        span.append(document.createTextNode(trozo));
      }
    }
    return span;
  }

  const registro = [];

  function subtitulos(tl, lista) {
    const caja = document.createElement("div");
    caja.className = "subtitulos";
    caja.id = "subtitulos";
    raiz.append(caja);
    lista.forEach((s, i) => {
      const bloque = document.createElement("div");
      bloque.className = "subtitulo";
      bloque.id = `sub-${i + 1}`;
      const lineas = partir(s.texto);
      for (const l of lineas) bloque.append(linea(l));
      caja.append(bloque);
      registro.push({ id: bloque.id, desde: s.desde, hasta: s.hasta, lineas: lineas.map(limpio) });
      tl.fromTo(bloque, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: D.larga, ease: "entrada" }, s.desde);
      if (s.hasta !== undefined) tl.to(bloque, { opacity: 0, y: -10, duration: D.media, ease: "salida" }, s.hasta - D.media);
    });
    window.__subtitulos = registro;
  }

  function cabecera(tl) {
    const c = document.createElement("div");
    c.className = "cabecera";
    c.id = "cabecera";
    const foco = document.createElement("span");
    foco.className = "foco";
    const texto = document.createElement("span");
    texto.textContent = BRAND.nombre;
    c.append(foco, texto);
    raiz.append(c);
    tl.fromTo(c, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: D.larga, ease: "entrada" }, 0.1);
    return c;
  }

  function cierre(tl, desde) {
    const c = document.createElement("div");
    c.className = "cierre";
    c.id = "cierre";
    const regla = document.createElement("span");
    regla.className = "regla";
    regla.id = "cierre-regla";
    const titulo = document.createElement("span");
    titulo.className = "titulo marca-cierre";
    titulo.id = "cierre-titulo";
    titulo.textContent = BRAND.nombre;
    const url = document.createElement("span");
    url.className = "url";
    url.id = "cierre-url";
    url.textContent = config.url;
    const fuente = document.createElement("span");
    fuente.className = "nota fuente";
    fuente.id = "cierre-fuente";
    fuente.textContent = `Fuente: ${meta.fuente}.`;
    c.append(regla, titulo, url, fuente);
    raiz.append(c);
    tl.fromTo(regla, { opacity: 0, scaleX: 0.4 }, { opacity: 1, scaleX: 1, duration: D.escena, ease: "entrada" }, desde);
    tl.fromTo(titulo, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: D.escena, ease: "entrada" }, desde + D.corta);
    tl.fromTo(url, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: D.escena, ease: "entrada" }, desde + D.corta * 2);
    tl.fromTo(fuente, { opacity: 0 }, { opacity: 1, duration: D.escena, ease: "entrada" }, desde + D.corta * 3);
    return c;
  }

  const decimal = (v, d = 1) => Number(v).toFixed(d);

  window.Reel = { leer, config, meta, partir, subtitulos, cabecera, cierre, decimal, D, raiz };
})();
