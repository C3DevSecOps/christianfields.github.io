(() => {
  const D = window.PORTFOLIO;
  const app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ---------------- Settings (per-viewer, best effort) ---------------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = window.SETTINGS = { music: false, sounds: true, motion: !reduced, blur: true };
  try { Object.assign(S, JSON.parse(localStorage.getItem("cf-settings") || "{}")); } catch { /* storage blocked */ }
  S.music = false; // browsers need a click before audio can start
  const saveSettings = () => {
    try { localStorage.setItem("cf-settings", JSON.stringify(S)); } catch { /* storage blocked */ }
    document.body.classList.toggle("no-blur", !S.blur);
  };
  saveSettings();

  /* ---------------- Audio: click + generative ambient music ---------------- */
  let audio, master, musicTimer;
  const ac = () => (audio ||= new (window.AudioContext || window.webkitAudioContext)());
  function click() {
    if (!S.sounds) return;
    try {
      const a = ac(), o = a.createOscillator(), g = a.createGain(), now = a.currentTime;
      o.type = "sine";
      o.frequency.setValueAtTime(1300, now);
      o.frequency.exponentialRampToValueAtTime(700, now + 0.03);
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      o.connect(g).connect(a.destination);
      o.start(now); o.stop(now + 0.06);
    } catch { /* audio unavailable */ }
  }

  const SCALE_HZ = [146.83, 185.0, 220.0, 246.94, 293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
  function note(freq, when, len = 3.5) {
    const a = ac();
    [["sine", 1, 0.5], ["triangle", 2, 0.08]].forEach(([type, mul, level]) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.value = freq * mul;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(level, when + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, when + len);
      o.connect(g).connect(master);
      o.start(when); o.stop(when + len + 0.1);
    });
  }
  function musicLoop() {
    const a = ac(), t = a.currentTime + 0.05;
    const i = Math.floor(Math.random() * (SCALE_HZ.length - 3));
    note(SCALE_HZ[i], t);
    if (Math.random() < 0.45) note(SCALE_HZ[i + 2 + Math.floor(Math.random() * 2)], t + 0.35);
    if (Math.random() < 0.25) note(SCALE_HZ[Math.max(0, i - 4)] / 2, t, 6);
    musicTimer = setTimeout(musicLoop, 1600 + Math.random() * 2600);
  }
  function setMusic(on) {
    S.music = on;
    try {
      const a = ac();
      if (!master) {
        master = a.createGain();
        const delay = a.createDelay(), fb = a.createGain(), wet = a.createGain();
        delay.delayTime.value = 0.42; fb.gain.value = 0.38; wet.gain.value = 0.5;
        master.connect(a.destination);
        master.connect(delay); delay.connect(fb).connect(delay); delay.connect(wet).connect(a.destination);
      }
      a.resume();
      clearTimeout(musicTimer);
      master.gain.setTargetAtTime(on ? 0.12 : 0, a.currentTime, 0.4);
      if (on) musicLoop();
    } catch { S.music = false; }
    document.querySelectorAll("[data-music]").forEach((b) => b.setAttribute("aria-pressed", S.music));
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(title, text) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
    el.innerHTML = `<b>${esc(title)}</b><span>${esc(text)}</span>`;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3600);
  }

  /* ---------------- Icons ---------------- */
  const stroke = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    list: stroke(`<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>`),
    file: stroke(`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>`),
    sliders: stroke(`<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>`),
    music: stroke(`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`),
    chevron: stroke(`<path d="M6 9l6 6 6-6"/>`),
    external: stroke(`<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`),
  };

  /* ---------------- Screens ---------------- */
  const btn = (label, href, extra = "") => `<a class="btn ${extra}" href="${href}">${esc(label)}</a>`;
  const ext = (label, url, extra = "") => `<a class="btn ${extra}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  const tool = (icon, label, attrs) => `<a class="tool" ${attrs} aria-label="${esc(label)}" title="${esc(label)}">${ICONS[icon]}</a>`;
  const initials = (s) => s.split(/\s+/).filter((w) => /^[A-Z]/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const link = (icon) => D.links.find((l) => l.icon === icon);
  // Resume opens the PDF when one is set; otherwise the on-site version.
  const resumeAttrs = () => D.resumeUrl ? `href="${esc(D.resumeUrl)}" target="_blank" rel="noopener"` : `href="#resume"`;

  function title() {
    const gh = link("github"), li = link("linkedin");
    return `
      <header class="topbar">
        <div class="account">
          <button class="chip" type="button" data-account aria-haspopup="menu" aria-expanded="false">
            ${D.avatar ? `<img src="${esc(D.avatar)}" alt="" width="24" height="24">` : `<span class="avatar">${initials(D.name)}</span>`}
            <span class="chip-name">${esc(D.name)}</span>${ICONS.chevron}
          </button>
          <div class="pop" role="menu" hidden>
            ${D.links.map((l) => `<a role="menuitem" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)} ${ICONS.external}</a>`).join("")}
          </div>
        </div>
        <nav class="tools" aria-label="Shortcuts">
          ${tool("sliders", "Options", `href="#options"`)}
          ${gh ? tool("github", "GitHub", `href="${esc(gh.url)}" target="_blank" rel="noopener"`) : ""}
          ${li ? tool("linkedin", "LinkedIn", `href="${esc(li.url)}" target="_blank" rel="noopener"`) : ""}
        </nav>
      </header>
      <div class="hero">
        <h1 class="logo-h"><img class="emblem" src="${esc(D.logo)}" alt="${esc(D.name)}" width="942" height="558"></h1>
        <nav class="menu" aria-label="Main menu">
          ${btn("Experience", "#experience")}
          ${btn("Projects", "#projects")}
          ${btn("About Me", "#about")}
          <div class="row"><a class="btn" ${resumeAttrs()}>Resume</a>${btn("Contact", "#contact")}</div>
        </nav>
      </div>
      <footer class="foot">
        <span>${esc(D.version)}</span>
        <span class="legal">© ${new Date().getFullYear()} ${esc(D.name)}. Not an official Minecraft product.<br>Not approved by or associated with Mojang or Microsoft.</span>
      </footer>`;
  }

  let selected = 0, shownProject = 0;
  function listScreen({ heading, items, render, actions }) {
    selected = Math.min(selected, Math.max(0, items.length - 1));
    return `
      <section class="screen">
        <h2>${esc(heading)}</h2>
        <div class="list" role="listbox" aria-label="${esc(heading)}">
          ${items.map((it, i) => `<button class="entry ${i === selected ? "sel" : ""}" role="option" aria-selected="${i === selected}" data-i="${i}">${render(it, i)}</button>`).join("")}
        </div>
        <div class="actions">${actions(items[selected])}</div>
      </section>`;
  }

  const badge = (text, i) => `<div class="badge b${i % 4}">${esc(text)}</div>`;
  const skillChips = () => Object.entries(D.skills).map(([k, v]) =>
    `<div class="cat">${esc(k)}</div><div class="chips">${v.map((s) => `<span class="chip-s">${esc(s)}</span>`).join("")}</div>`).join("");

  // Full-width page: title bar, scrolling body, button bar (the Experience/Resume layout).
  const page = (heading, body, foot) => `
    <section class="page">
      <header class="page-head"><h2>${esc(heading)}</h2></header>
      <div class="page-body"><div class="page-inner">${body}</div></div>
      <footer class="page-foot">${foot}</footer>
    </section>`;
  // One timeline row: date (and place) on the left, "Title - Org" and bullets on the right.
  const row = (dates, place, title, org, points = []) => `
    <article class="xp">
      <div class="xp-when">${esc(dates || "")}${place ? `<span>${esc(place)}</span>` : ""}</div>
      <div>
        <h3 class="xp-title">${esc(title)}${org ? ` <span>- ${esc(org)}</span>` : ""}</h3>
        ${points.length ? `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      </div>
    </article>`;
  const experienceRows = () => D.experience.map((e) => row(e.dates, e.place, e.title, e.org, e.points)).join("");

  const screens = {
    experience: () => {
      const li = link("linkedin");
      const body = D.experience.length
        ? experienceRows()
        : `<p class="empty">My full work history is on LinkedIn.</p>`;
      return page("Experience", body, `${!D.experience.length && li ? ext("Open LinkedIn", li.url, "primary") : ""}${btn("Back", "#")}`);
    },

    projects: () => listScreen({
      heading: "Projects",
      items: D.projects,
      render: (p, i) => `
        ${badge(initials(p.name), i)}
        <div><div class="name">${esc(p.name)}</div>${p.description ? `<div class="desc">${esc(p.description)}</div>` : ""}
        <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`,
      actions: (p) => {
        shownProject = selected;
        const more = p.points?.length || p.images?.length;
        return `${more ? btn("View Details", "#project") : ""}${p.url ? ext("Open on GitHub", p.url) : ""}${btn("Back", "#")}`;
      },
    }),

    // Detail page for the project last selected on the Projects screen.
    project: () => {
      const p = D.projects[shownProject];
      const body = `
        <article class="xp">
          <div class="xp-when">About</div>
          <div>
            ${p.description ? `<p class="proj-desc">${esc(p.description)}</p>` : ""}
            <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            ${p.points?.length ? `<ul>${p.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          </div>
        </article>
        ${p.images?.length ? `<div class="gallery">${p.images.map((im) => `
          <a href="${esc(im.src)}" target="_blank" rel="noopener"><img src="${esc(im.src)}" alt="${esc(im.alt)}" loading="lazy"></a>`).join("")}</div>` : ""}`;
      return page(p.name, body, `${p.url ? ext("Open on GitHub", p.url, "primary") : ""}${btn("Back", "#projects")}`);
    },

    contact: () => {
      const items = [...D.links];
      if (D.email) items.push({ name: "Email", motd: D.email, url: `mailto:${D.email}` });
      return listScreen({
        heading: "Contact",
        items,
        render: (s, i) => `
          ${ICONS[s.icon] ? `<div class="badge b${i % 4}">${ICONS[s.icon]}</div>` : badge(s.name.slice(0, 2), i)}
          <div><div class="name">${esc(s.name)}</div><div class="desc">${esc(s.motd)}</div></div>`,
        actions: (s) => `${ext("Open", s.url)}${btn("Send a Message", "#message")}${btn("Back", "#", "full")}`,
      });
    },

    message: () => `
      <section class="screen">
        <h2>Send a Message</h2>
        <form id="msg" class="list form">
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" required maxlength="80" autocomplete="name"></div>
          <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="6" required maxlength="2000"></textarea></div>
          <p class="field note">${D.email
            ? "Opens your email app with the message filled in."
            : "Copies your message and opens LinkedIn so you can send it there."}</p>
        </form>
        <div class="actions"><button class="btn primary" form="msg" type="submit">Send Message</button>${btn("Cancel", "#contact")}</div>
      </section>`,

    resume: () => {
      const contact = [
        D.email && `<a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`,
        D.location && esc(D.location),
        ...D.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>`),
      ].filter(Boolean).join(`<span class="dot">·</span>`);
      const chips = (items) => `<div class="chips">${items.map((s) => `<span class="chip-s">${esc(s)}</span>`).join("")}</div>`;
      const labeled = (label, html) => `<article class="xp"><div class="xp-when">${esc(label)}</div><div>${html}</div></article>`;
      const body = `
        <div class="cv-head">
          <div class="n">${esc(D.name)}</div>
          <div class="r">${esc(D.role)}</div>
          <div class="c">${contact}</div>
        </div>
        ${D.experience.length ? `<h3 class="cv-h">Work Experience</h3>${experienceRows()}` : ""}
        ${D.certifications.length ? `<h3 class="cv-h">Certifications</h3>${labeled("Certified", chips(D.certifications.map((c) => c.name)))}` : ""}
        <h3 class="cv-h">Skills</h3>
        ${Object.entries(D.skills).map(([k, v]) => labeled(k, chips(v))).join("")}
        ${D.education.length ? `<h3 class="cv-h">Education</h3>${D.education.map((e) => row(e.dates, "", e.school, "", [e.degree])).join("")}` : ""}
        <h3 class="cv-h">Projects</h3>
        ${D.projects.map((p) => row("", "", p.name, "", p.description ? [p.description] : p.points || [])).join("")}`;
      return page("Resume", body, `
        ${D.resumeUrl ? ext("Download PDF", D.resumeUrl, "primary") : `<button class="btn" type="button" onclick="print()">Print</button>`}
        ${btn("Back", "#")}`);
    },

    about: () => `
      <section class="screen">
        <h2>About Me</h2>
        <article class="paper">
          <h3>Who I am</h3>${[].concat(D.about).map((p) => `<p>${esc(p)}</p>`).join("")}
          ${D.certifications.length ? `<h3>Certifications</h3><div class="chips">${D.certifications.map((c) => `<span class="chip-s">${esc(c.name)}</span>`).join("")}</div>` : ""}
        </article>
        <div class="actions">${btn("Contact Me", "#contact")}${btn("Back", "#")}</div>
      </section>`,

    options: () => {
      const row = (key, label, hint) => `
        <div class="opt">
          <div><div class="name">${label}</div><div class="desc">${hint}</div></div>
          <button class="switch" type="button" role="switch" aria-checked="${S[key]}" aria-label="${label}" data-opt="${key}"><i></i></button>
        </div>`;
      return `
        <section class="screen narrow">
          <h2>Options</h2>
          <div class="list opts">
            ${row("music", "Music", "Soft generated ambient piano")}
            ${row("sounds", "Interface sounds", "Click sound on buttons")}
            ${row("motion", "Background motion", "Slowly rotate the scenery")}
            ${row("blur", "Background blur", "Turn off for sharper scenery")}
          </div>
          <div class="actions">${btn("Done", "#", "full")}</div>
        </section>`;
    },
  };

  function render() {
    app.innerHTML = route.current ? screens[route.current]() : title();
  }
  function route() {
    const key = location.hash.slice(1);
    const screen = screens[key] ? key : "";
    // Coming back from a project's detail page keeps that project selected.
    if (screen !== route.current) selected = screen === "projects" && route.current === "project" ? shownProject : 0;
    route.current = screen;
    document.body.classList.toggle("sub", !!screen);
    render();
    document.title = screen ? `${screen[0].toUpperCase() + screen.slice(1)} — ${D.name}` : `${D.name} — Portfolio`;
    app.focus({ preventScroll: true });
  }
  app.tabIndex = -1;
  app.style.outline = "none";

  const setMenu = (open) => {
    const chip = app.querySelector("[data-account]"), pop = app.querySelector(".pop");
    if (!chip) return;
    chip.setAttribute("aria-expanded", open);
    pop.hidden = !open;
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn, .entry, .tool, .chip, .switch, .pop a")) click();
    if (e.target.closest("[data-music]")) setMusic(!S.music);

    const chip = e.target.closest("[data-account]");
    if (chip) setMenu(chip.getAttribute("aria-expanded") !== "true");
    else if (!e.target.closest(".pop") || e.target.closest(".pop a")) setMenu(false);

    const opt = e.target.closest("[data-opt]")?.dataset.opt;
    if (opt) {
      if (opt === "music") setMusic(!S.music);
      else S[opt] = !S[opt];
      saveSettings();
      render();
      app.querySelector(`[data-opt="${opt}"]`)?.focus();
    }

    const entry = e.target.closest(".entry");
    if (entry) {
      const i = +entry.dataset.i;
      if (i === selected) return app.querySelector(".actions .btn")?.click();
      selected = i;
      render();
      app.querySelector(`.entry[data-i="${i}"]`)?.focus();
    }
  });

  app.addEventListener("submit", async (e) => {
    if (e.target.id !== "msg") return;
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `${f.get("message")}\n\n— ${f.get("name")}`;
    if (D.email) {
      location.href = `mailto:${D.email}?subject=${encodeURIComponent(`Portfolio message from ${f.get("name")}`)}&body=${encodeURIComponent(body)}`;
      toast("Message ready", "Your email app should open now.");
    } else {
      let copied = true;
      try { await navigator.clipboard.writeText(body); } catch { copied = false; }
      const li = link("linkedin");
      if (li) window.open(li.url, "_blank", "noopener");
      toast(copied ? "Message copied" : "Opening LinkedIn", copied ? "Paste it into a LinkedIn message." : "Send your message there.");
    }
  });

  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (app.querySelector(".pop:not([hidden])")) setMenu(false);
    else if (location.hash) location.hash = "";
  });
  addEventListener("hashchange", route);
  route();
})();
