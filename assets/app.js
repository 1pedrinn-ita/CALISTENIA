(function () {
  "use strict";

  var CFG = window.OFFER_CONFIG || {};
  var IMG = "assets/img/";
  var root = document.getElementById("root");

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  var MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function pad(n) { return String(n).padStart(2, "0"); }
  function fmtDayMonth(d) { return pad(d.getDate()) + " de " + MONTHS[d.getMonth()]; }
  function fmtDate(d) { return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function money(v) { return "R$" + Number(v).toFixed(2).replace(".", ","); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Guarda UTMs da primeira visita (igual ao original) para anexar ao checkout.
  (function () {
    var q = window.location.search;
    if (q && q.indexOf("utm_") !== -1) lsSet("utm_querystring", q);
  })();
  function utmQS() {
    var q = lsGet("utm_querystring") || "";
    return q ? (q.charAt(0) === "?" ? q : "?" + q) : "";
  }
  function checkoutHref() {
    var base = CFG.checkoutUrl || "";
    if (!base) return "#";
    var q = utmQS();
    if (q && base.indexOf("?") !== -1) q = "&" + q.slice(1);
    return base + q;
  }

  /* ------------------------------------------------------------------ */
  /* Ícones (lucide)                                                     */
  /* ------------------------------------------------------------------ */
  var ICONS = {
    "arrow-right": '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>',
    baby: '<path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>',
    battery: '<rect width="16" height="10" x="2" y="7" rx="2" ry="2"></rect><line x1="22" x2="22" y1="11" y2="13"></line>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
    calendar: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
    check: '<path d="M20 6 9 17l-5-5"></path>',
    "chevron-down": '<path d="m6 9 6 6 6-6"></path>',
    "chevron-right": '<path d="m9 18 6-6-6-6"></path>',
    "chevron-up": '<path d="m18 15-6-6-6 6"></path>',
    dumbbell: '<path d="M14.4 14.4 9.6 9.6"></path><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"></path><path d="m21.5 21.5-1.4-1.4"></path><path d="M3.9 3.9 2.5 2.5"></path><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"></path>',
    ellipsis: '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>',
    move: '<path d="M12 2v20"></path><path d="m15 19-3 3-3-3"></path><path d="m19 9 3 3-3 3"></path><path d="M2 12h20"></path><path d="m5 9-3 3 3 3"></path><path d="m9 5 3-3 3 3"></path>',
    pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path>',
    target: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
    "triangle-alert": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>'
  };
  function icon(name, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-' + name + " " + (cls || "") + '">' + ICONS[name] + "</svg>";
  }

  /* ------------------------------------------------------------------ */
  /* Componentes base                                                    */
  /* ------------------------------------------------------------------ */
  function header(showBack) {
    return '<header class="relative flex items-center justify-center px-4 py-3 bg-card hara-header">' +
      (showBack ? '<button data-action="back" class="absolute left-4 p-2 text-foreground hover:bg-muted rounded-lg transition-colors" aria-label="Voltar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg></button>' : "") +
      '<div class="hara-logo" aria-label="Hara · Calistenia Asiática">' +
      '<svg class="hara-enso" viewBox="0 0 32 32" aria-hidden="true"><path d="M26.6 11.2A11.4 11.4 0 1 1 19.7 5.1" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"></path><circle cx="16" cy="16" r="3" fill="currentColor"></circle></svg>' +
      '<span class="hara-word">HARA</span><span class="hara-sub">Calistenia<br>Asiática</span></div></header>';
  }
  function progress(cur, total) {
    var w = Math.min(cur / total * 100, 100);
    return '<div class="w-full h-1 bg-muted"><div class="h-full bg-primary transition-all duration-500 ease-out" style="width: ' + w + '%;"></div></div>';
  }
  // Layout padrão do quiz
  function layout(o) {
    var showProgress = o.showProgress !== false;
    return '<div class="h-screen bg-background flex flex-col overflow-hidden">' +
      header(true) +
      (showProgress ? progress(o.step, o.total) : "") +
      '<main class="flex-1 flex flex-col overflow-y-auto ' + (o.sticky ? "pb-24" : "") + '">' + o.body + "</main>" +
      (o.sticky ? '<div class="fixed bottom-0 left-0 right-0 p-4 z-50"><div class="max-w-md mx-auto">' + o.sticky + "</div></div>" : "") +
      "</div>";
  }
  // Botão principal
  function btn(label, action, opts) {
    opts = opts || {};
    return '<button type="button" data-action="' + action + '"' + (opts.disabled ? " disabled" : "") +
      ' class="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">' + label + "</button>";
  }
  // Card de opção
  function option(o) {
    var sel = !!o.selected;
    var cls = "w-full rounded-xl bg-card border-2 transition-all duration-200 text-left flex items-center gap-3 quiz-shadow hover:quiz-shadow-lg active:scale-[0.98] " +
      (o.image ? "p-2" : "p-4") + " " + (sel ? "border-primary bg-accent" : "border-transparent hover:border-muted-foreground/20");
    var h = '<button type="submit" data-action="' + o.action + '" data-value="' + esc(o.value) + '" class="' + cls + '">';
    if (o.image) h += '<div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"><img src="' + IMG + o.image + '" alt="" class="w-full h-full object-cover" loading="eager" decoding="async"></div>';
    if (o.emoji) h += '<span class="text-2xl flex-shrink-0">' + o.emoji + "</span>";
    if (o.icon) h += '<div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-primary">' + icon(o.icon, "w-5 h-5") + "</div>";
    h += '<div class="flex-1 min-w-0"><span class="font-semibold text-foreground block">' + o.label + "</span>" +
      (o.description ? '<span class="text-sm text-muted-foreground mt-0.5 block">' + o.description + "</span>" : "") + "</div>";
    if (o.arrow) h += icon("chevron-right", "w-5 h-5 text-muted-foreground flex-shrink-0");
    if (o.checkbox) h += '<div class="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ' +
      (sel ? "bg-primary border-primary" : "border-muted-foreground/30") + '">' + (sel ? icon("check", "w-4 h-4 text-primary-foreground") : "") + "</div>";
    return h + "</button>";
  }
  // Imagem com fundo de carregamento
  function lazyImg(src, alt, cls, opts) {
    opts = opts || {};
    var style = opts.style || "";
    var minH = opts.height ? opts.height + "px" : "auto";
    return '<div class="relative overflow-hidden bg-muted ' + (cls || "") + '" style="' + style + "min-height:" + minH + ';">' +
      '<img src="' + IMG + src + '" alt="' + esc(alt) + '"' + (opts.width ? ' width="' + opts.width + '"' : "") + (opts.height ? ' height="' + opts.height + '"' : "") +
      ' loading="' + (opts.priority ? "eager" : "lazy") + '" decoding="async" fetchpriority="' + (opts.priority ? "high" : "auto") + '" class="w-full h-full object-cover opacity-0" style="' + style + 'transition:opacity .2s" onload="this.classList.remove(\'opacity-0\')"></div>';
  }
  function title(text, extra) {
    return '<h1 class="text-xl md:text-2xl font-bold text-foreground ' + (extra || "mb-6") + ' text-center">' + text + "</h1>";
  }

  /* ------------------------------------------------------------------ */
  /* Estado                                                              */
  /* ------------------------------------------------------------------ */
  var state = {
    step: 1,
    data: {
      ageRange: "", calistheniaExperience: "", mainGoal: "", additionalGoals: [], bodyZones: [], targetZones: [],
      bodyType: "", dreamBody: "", fitnessHistory: "", limitations: [], comfortLevel: "", height: 165,
      currentWeight: 73, targetWeight: 57, exactAge: 50, lifestyle: "", energyLevel: "", waterIntake: "",
      sleepDuration: "", mealPreferences: [], habits: [], lifeEvents: [], motivationReal: "", commitmentLevel: ""
    },
    ui: {}
  };
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function every(fn, ms) { var t = setInterval(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }

  function go(n) {
    clearTimers();
    state.step = Math.max(1, n);
    state.ui = {};
    render();
    window.scrollTo(0, 0);
    preload(state.step);
  }
  function next() { go(state.step + 1); }
  function back() { go(state.step - 1); }
  function setData(k, v) { state.data[k] = v; }

  /* ------------------------------------------------------------------ */
  /* Etapas                                                              */
  /* ------------------------------------------------------------------ */
  var MULTI = {
    6: { key: "additionalGoals" },
    7: { key: "bodyZones" },
    8: { key: "targetZones" },
    13: { key: "limitations", none: "nenhuma" },
    24: { key: "mealPreferences" },
    25: { key: "habits", none: "nenhum" },
    26: { key: "lifeEvents", none: "nenhuma" }
  };
  function sel() { return state.ui.sel || (state.ui.sel = []); }

  var ZONES7 = [
    { id: "queixo", label: "Queixo duplo", image: "inline-ut.webp" },
    { id: "bracos", label: "Braços flácidos", image: "inline-xt.webp" },
    { id: "seios", label: "Seios caídos", image: "breasts-ExE0pzVF.webp" },
    { id: "barriga", label: "Gordura da barriga", image: "belly-BpYW2VsZ.webp" },
    { id: "joelhos", label: "Gordura nos joelhos", image: "inline-pt.webp" },
    { id: "traseiro", label: "Traseiro de alforje", image: "saddlebags-xkYTH-2j.webp" },
    { id: "nadegas", label: "Nádegas flácidas", image: "inline-gt.webp" },
    { id: "coxa", label: "Parte interna da coxa", image: "belly-BpYW2VsZ.webp" }
  ];

  function bmiOf(w, h) { var m = h / 100; return w / (m * m); }

  var STEPS = {};

  // 1 — Idade
  STEPS[1] = function () {
    var ages = ["39 – 45", "46 – 50", "51 – 60", "60+"];
    var b = ages.map(function (a) {
      return '<button data-action="pick" data-key="ageRange" data-value="' + a + '" class="w-full bg-[#f5f5f5] hover:bg-[#ebebeb] rounded-xl px-5 py-4 md:px-6 md:py-5 text-left text-base md:text-lg font-semibold text-foreground flex items-center justify-between transition-colors"><span>' + a + "</span>" + icon("arrow-right", "w-5 h-5 text-muted-foreground") + "</button>";
    }).join("");
    return '<div class="h-screen bg-background flex flex-col overflow-hidden">' + header(false) +
      '<main class="flex-1 flex flex-col overflow-y-auto "><div class="flex-1 flex flex-col relative"><div class="flex-1 flex flex-col items-center justify-start px-4 md:px-6 pt-4 md:pt-8 pb-6 md:pb-12 relative overflow-x-clip">' +
      '<div class="text-center mb-4 md:mb-8 w-full md:max-w-2xl relative z-10"><h1 class="text-[1.7rem] md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">Programa de Calistenia Asiática <span class="text-primary">para Mulheres</span></h1><p class="text-muted-foreground mt-2 md:mt-4 text-base md:text-lg">TESTE DE 1 MINUTO</p><div class="mt-3 md:mt-6"><span class="text-base md:text-lg text-foreground font-bold">Quantos anos você tem?</span></div></div>' +
      '<div class="relative w-full md:max-w-2xl"><div class="absolute right-[-180px] md:right-[-120px] lg:right-[-150px] top-[20px] md:bottom-[-60px] md:top-auto w-[420px] md:w-[380px] lg:w-[420px] h-[560px] md:h-[500px] lg:h-[560px] pointer-events-none z-0"><img src="images/asian-woman-fitness.webp" alt="Mulher asiática praticando calistenia" class="w-full h-full object-contain" width="420" height="560" loading="eager" decoding="sync" fetchpriority="high"></div>' +
      '<div class="space-y-3 w-[70%] md:w-full md:max-w-lg relative z-10 pb-8">' + b + "</div></div>" +
      '<div class="h-[500px] md:h-[100px]"></div></div></div>' +
      '<footer class="py-4 px-4 text-center text-xs text-muted-foreground"><p class="space-x-2"><span>Ao escolher sua idade e continuar, concorda com nossos</span><a href="#" class="underline hover:text-foreground">Termos de Serviço</a><span>e reconhece nossa</span><a href="#" class="underline hover:text-foreground">Política de Privacidade</a><span>e</span><a href="#" class="underline hover:text-foreground">Política de Cookies</a></p></footer>' +
      "</main></div>";
  };

  // 2 — Prova social
  STEPS[2] = function () {
    return layout({ step: 2, total: 35, showProgress: false, body:
      '<div class="flex-1 flex flex-col items-center justify-start md:justify-center px-4 py-2 md:py-8"><div class="max-w-md w-full text-center">' +
      lazyImg("women-group-new-Dm6Dh7Zz.webp", "Grupo de mulheres praticando exercícios", "mb-6 rounded-2xl quiz-shadow-lg w-full", { height: 256, priority: true }) +
      '<h1 class="text-2xl md:text-3xl font-bold text-foreground mb-2">Elas conseguiram e você também pode</h1><p class="text-muted-foreground mb-8">Mais de 27 milhões de mulheres já transformaram suas vidas com a Calistenia Asiática</p>' +
      btn("Continuar", "next") + "</div></div>" });
  };

  // 3 — Experiência
  STEPS[3] = function () {
    return layout({ step: 3, total: 35, body:
      '<div class="flex-1 flex flex-col items-center justify-start px-6 md:px-4 pt-6 md:pt-8 pb-6 relative overflow-hidden"><div class="text-center mb-6 md:mb-6 w-full max-w-md relative z-10 px-2"><h1 class="text-xl md:text-2xl font-bold text-foreground">Você já experimentou exercícios de calistenia?</h1></div>' +
      '<div class="relative w-full max-w-md min-h-[450px] md:min-h-0"><div class="absolute right-[-80px] top-[-100px] w-[480px] md:right-[-80px] md:top-[-80px] md:w-[260px] lg:right-[-60px] lg:w-[300px] pointer-events-none z-0"><img src="' + IMG + 'woman-calisthenics-CxC8mlGX.webp" alt="Mulher fitness" class="w-full h-auto object-contain" loading="eager" decoding="async" fetchpriority="high"></div>' +
      '<div class="space-y-3 w-[60%] md:w-[65%] relative z-10">' +
      option({ action: "pick", value: "sim", label: "Sim" }).replace('data-action="pick"', 'data-action="pick" data-key="calistheniaExperience"') +
      option({ action: "pick", value: "nao", label: "Não" }).replace('data-action="pick"', 'data-action="pick" data-key="calistheniaExperience"') +
      "</div></div></div>" });
  };

  // 4 — Educação (Sim / Não)
  STEPS[4] = function () {
    var sim = state.data.calistheniaExperience === "sim";
    var h1 = sim ? "Você já tem a base, mas a Calistenia Asiática é diferente da calistenia comum."
      : "Não se preocupe, a Calistenia Asiática é perfeita para quem está começando do zero!";
    var p = sim
      ? 'Enquanto o método tradicional foca apenas em força externa, nossa técnica ativa as <strong class="text-foreground">fibras profundas</strong>, agindo na musculatura interna, onde eliminamos a <strong class="text-foreground">gordura mais difícil de queimar</strong> e destravamos o seu metabolismo de forma definitiva.'
      : 'Calistenia significa usar apenas o peso do seu corpo, e nossa técnica simplifica tudo ao focar na ativação das <strong class="text-foreground">fibras profundas</strong>. É o caminho mais rápido para você <strong class="text-foreground">destravar o metabolismo</strong> e <strong class="text-foreground">secar a barriga</strong> sem o esforço exaustivo da academia.';
    var wrap = sim ? "flex-1 flex items-start md:items-center justify-start md:justify-center px-6 md:px-12 py-2 md:py-8" : "flex-1 flex items-center justify-center px-6 md:px-12 py-4 md:py-8";
    return layout({ step: 4, total: 35, body:
      '<div class="' + wrap + '"><div class="w-full max-w-5xl flex flex-col md:flex-row gap-4 md:gap-12 items-center"><div class="flex-1 text-center md:text-left"><h1 class="text-xl md:text-3xl lg:text-4xl font-bold text-foreground leading-snug md:leading-tight mb-2 md:mb-6">' + h1 + '</h1><p class="text-sm md:text-lg text-muted-foreground leading-relaxed">' + p + "</p></div>" +
      '<div class="w-full md:w-1/2 flex-shrink-0"><img src="' + IMG + 'woman-couch-exercise-DxhhEtty.webp" alt="Mulher praticando exercício" class="w-full h-auto rounded-2xl object-cover"></div></div></div>' +
      '<div class="fixed bottom-0 left-0 right-0 px-6 pb-4 pt-4"><button data-action="next" class="items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 w-full max-w-md mx-auto flex py-6 text-base font-semibold uppercase tracking-wide">Continuar</button></div>' });
  };

  // 5 — Objetivo principal
  STEPS[5] = function () {
    var o = [["perder-peso", "Perder peso", "scale"], ["desenvolver-musculos", "Desenvolver músculos", "dumbbell"], ["manter-peso", "Manter o peso e ficar em forma", "user-check"], ["melhorar-aptidao", "Melhorar a aptidão física", "zap"]];
    return layout({ step: 4, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-1 text-center">Qual é seu <span class="text-primary">principal objetivo</span>?</h1><div class="space-y-3 mt-6">' +
      o.map(function (x) { return option({ action: "pick", value: x[0], label: x[1], icon: x[2] }).replace('data-action="pick"', 'data-action="pick" data-key="mainGoal"'); }).join("") +
      "</div></div></div>" });
  };

  function multiList(items, extra) {
    var s = sel();
    return items.map(function (i) {
      return option({ action: "toggle", value: i.id, label: i.label, image: i.image, icon: i.icon, emoji: i.emoji, description: i.description, selected: s.indexOf(i.id) !== -1, checkbox: true });
    }).join("");
  }

  // 6 — Objetivos adicionais
  STEPS[6] = function () {
    var items = [
      { id: "energia", label: "Aumentar a energia", icon: "battery" },
      { id: "sono", label: "Melhorar o sono", icon: "moon" },
      { id: "estresse", label: "Reduzir o estresse", icon: "brain" },
      { id: "postura", label: "Melhorar a postura e a mobilidade", icon: "move" },
      { id: "flexibilidade", label: "Desenvolver flexibilidade", icon: "sparkles" }
    ];
    return layout({ step: 5, total: 35, sticky: btn("Continuar", "multi-next", { disabled: !sel().length }), body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title("O que mais você espera alcançar com este plano?", "mb-1") +
      '<p class="text-muted-foreground mb-6 text-center">Pode escolher várias opções</p><div class="space-y-3">' + multiList(items) + "</div></div></div>" });
  };

  // 7 — Zonas que preocupam
  STEPS[7] = function () {
    var on = !!state.ui.all;
    return layout({ step: 8, total: 36, sticky: btn("Próximo passo", "multi-next", { disabled: !sel().length }), body:
      '<div class="flex-1 px-4 py-6 overflow-y-auto"><div class="max-w-md mx-auto">' + title("Quais são as zonas que mais a preocupam?", "mb-1") +
      '<p class="text-muted-foreground mb-6 text-center">Por favor, selecione todas as opções aplicáveis</p>' +
      '<div class="flex items-center gap-3 mb-4"><button type="button" role="switch" aria-checked="' + on + '" data-state="' + (on ? "checked" : "unchecked") + '" value="on" data-action="toggle-all" class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"><span data-state="' + (on ? "checked" : "unchecked") + '" class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"></span></button><span class="font-medium text-foreground">Melhorar o corpo inteiro</span></div>' +
      '<div class="space-y-3">' + multiList(ZONES7) + "</div></div></div>" });
  };

  // 8 — Zonas alvo
  STEPS[8] = function () {
    var items = [
      { id: "barriga", label: "Barriga", image: "barriga-DAcogUxf.webp" },
      { id: "bunda", label: "Bunda", image: "inline-vt.webp" },
      { id: "pernas", label: "Pernas", image: "pernas-DV7nbtv6.webp" },
      { id: "peito", label: "Peito", image: "inline-jt.webp" },
      { id: "bracos", label: "Braços", image: "bracos-BmNkLcku.webp" },
      { id: "costas", label: "Costas", image: "inline-Nt.webp" }
    ];
    return layout({ step: 9, total: 36, sticky: btn("Próximo passo", "multi-next", { disabled: !sel().length }), body:
      '<div class="flex-1 px-4 py-6 pb-32 md:pb-48 overflow-y-auto"><div class="max-w-md mx-auto">' + title("Quais são as suas zonas alvo?", "mb-1") +
      '<p class="text-muted-foreground mb-6 text-center">Escolha todas as opções aplicáveis</p><div class="space-y-3">' + multiList(items) + "</div></div></div>" });
  };

  // 9 — Educação 7 minutos
  STEPS[9] = function () {
    return layout({ step: 9, total: 36, body:
      '<div class="flex-1 px-4 py-2 md:py-6 pb-16 overflow-y-auto"><div class="max-w-md mx-auto text-center"><div class="mb-2 md:mb-3 flex justify-center"><img src="' + IMG + 'woman-ok-asian-By6X2nVW.png" alt="Mulher fazendo sinal de OK" class="w-[80%] md:w-[70%] object-contain rounded-2xl quiz-shadow-lg" loading="eager" decoding="async" fetchpriority="high"></div>' +
      '<h1 class="text-base md:text-lg font-bold text-foreground mb-2">Apenas 7 minutos por dia — transformarão seu corpo e <span class="text-primary">destravarão o seu metabolismo</span> sem o esforço exaustivo da academia!</h1>' +
      '<p class="text-muted-foreground text-sm leading-relaxed">O Protocolo de Calistenia Asiática utiliza ativações de fibras profundas para derreter a gordura acumulada e chapar a barriga, agindo onde os exercícios comuns de academia não conseguem chegar, de forma simples e definitiva...</p></div></div>' +
      '<div class="fixed bottom-0 left-0 right-0 p-4 bg-background z-50"><div class="max-w-md mx-auto">' + btn("Continuar", "next") + "</div></div>" });
  };

  // 10 — Tipo de corpo
  STEPS[10] = function () {
    var a = [["magra", "Magra", "slim-BgG68MtM.webp"], ["falsa-magra", "Falsa Magra", "mid-sized-C-245tK-.webp"], ["acima-peso", "Acima do peso", "heavier-side-7tzmsUcd.webp"], ["sobrepeso", "Sobrepeso", "overweight-oo35LK1h.webp"]];
    return layout({ step: 8, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-4xl mx-auto">' + title("Como você descreveria o seu corpo atualmente?") +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">' + a.map(function (r) {
        return '<button data-action="pick" data-key="bodyType" data-value="' + r[0] + '" class="bg-card border-2 border-transparent rounded-2xl p-3 transition-all duration-200 quiz-shadow hover:quiz-shadow-lg hover:border-muted-foreground/20 active:scale-[0.98] flex flex-col items-center"><div class="w-full aspect-square rounded-xl overflow-hidden bg-muted mb-3" style="min-height:120px">' +
          lazyImg(r[2], r[1], "w-full h-full", { style: "object-fit:cover;object-position:top;" }) +
          '</div><span class="font-semibold text-foreground text-center text-sm md:text-base">' + r[1] + "</span></button>";
      }).join("") + "</div></div></div>" });
  };

  // 11 — Corpo dos sonhos
  STEPS[11] = function () {
    var a = [["curvilinea", "Curvado", "curvy-Dbj8VQuI.webp"], ["magro", "Magro", "thin-BWWpALK0.webp"], ["em-forma", "Em forma", "satisfied-DyDvcRJX.webp"], ["tonificado", "Tonificado", "bikini-body-BG5HLQ1-.webp"], ["satisfeita", "Estou bem com meu corpo", "inline-Dt.webp"]];
    return layout({ step: 9, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title("Qual é o corpo dos seus sonhos?") + '<div class="space-y-3">' +
      a.map(function (r) {
        return '<button data-action="pick" data-key="dreamBody" data-value="' + r[0] + '" class="w-full flex items-center gap-3 p-2 rounded-xl bg-card border-2 border-transparent hover:border-muted-foreground/20 transition-all duration-200 quiz-shadow hover:quiz-shadow-lg active:scale-[0.98]"><div class="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">' +
          lazyImg(r[2], r[1], "w-full h-full", { width: 64, height: 64 }) + '</div><span class="font-semibold text-foreground text-left">' + r[1] + "</span></button>";
      }).join("") + "</div></div></div>" });
  };

  function pickList(key, items) {
    return items.map(function (r) {
      return option({ action: "pick", value: r[0], label: r[1], emoji: r[2], icon: r[3], arrow: r[4] }).replace('data-action="pick"', 'data-action="pick" data-key="' + key + '"');
    }).join("");
  }

  // 12 — Melhor forma
  STEPS[12] = function () {
    return layout({ step: 10, total: 35, body:
      '<div class="flex-1 flex flex-col px-4 py-6"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-6 text-center max-w-md mx-auto">Há quanto tempo você estava na melhor forma da sua vida?</h1>' +
      '<div class="relative w-full h-[75vh] md:h-[420px]"><div class="absolute right-1/2 top-0 max-w-xs space-y-3">' +
      pickList("fitnessHistory", [["1-2-anos", "1 a 2 anos atrás"], ["3-5-anos", "3 a 5 anos atrás"], ["mais-5-anos", "Mais de 5 anos atrás"], ["nunca", "Nunca"]]) +
      '</div><img src="' + IMG + 'woman-fitness-abs-loFQOyPd.webp" alt="Mulher em forma" class="absolute left-1/2 top-0 h-full md:h-[400px] object-cover md:object-contain object-top pointer-events-none -translate-x-[30%]" loading="eager" decoding="async" fetchpriority="high"></div></div>' });
  };

  // 13 — Limitações
  STEPS[13] = function () {
    var items = [
      { id: "costas", label: "Costas sensíveis", image: "back-D2DUI9o8.webp" },
      { id: "joelhos", label: "Joelhos sensíveis", image: "knees-ankles-WZoJdNID.webp" },
      { id: "quadril", label: "Quadril sensível", image: "hip-E-F3cLZa.webp" },
      { id: "ombros", label: "Ombros e braços", image: "inline-Bt.webp" },
      { id: "panturrilhas", label: "Panturrilhas e tornozelos", image: "knees-ankles-WZoJdNID.webp" },
      { id: "nenhuma", label: "Nenhuma das opções acima" }
    ];
    return layout({ step: 12, total: 34, sticky: btn("Próximo passo", "multi-next", { disabled: !sel().length }), body:
      '<div class="flex-1 px-4 py-6 overflow-y-auto"><div class="max-w-md mx-auto">' + title("Você tem dificuldades com algum dos seguintes itens?", "mb-1") +
      '<p class="text-muted-foreground mb-6 text-center">Por favor, selecione todas as opções aplicáveis</p><div class="space-y-3">' + multiList(items) + "</div></div></div>" });
  };

  // 14 — Conforto
  STEPS[14] = function () {
    return layout({ step: 14, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title("Você se sente confortável ao se exercitar?") + '<div class="space-y-3">' +
      pickList("comfortLevel", [["dor", "Sinto dor/Desconforto", "😔"], ["dificuldade", "Sinto alguma dificuldade", "😐"], ["confortavel", "Sinto-me confortável", "😊"]]) +
      "</div></div></div>" });
  };

  // 15 — Encorajamento
  STEPS[15] = function () {
    var c = state.data.comfortLevel, r = c === "dor" || c === "dificuldade";
    return layout({ step: 15, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto text-center"><div class="mb-6 rounded-2xl overflow-hidden quiz-shadow-lg bg-muted"><img src="' + IMG + 'woman-thumbsup-asian-BszG4iHy.webp" alt="Mulher motivada" class="w-full object-contain" loading="eager" decoding="async" fetchpriority="high"></div>' +
      (r ? '<h1 class="text-xl md:text-2xl font-bold text-foreground mb-4">Nós cuidamos de você!</h1><p class="text-muted-foreground mb-6 text-sm leading-relaxed">A dor não vai te impedir. Adaptaremos seu programa para promover movimentos seguros e suaves.</p>'
        : '<h1 class="text-xl md:text-2xl font-bold text-foreground mb-4">Isso é ótimo!</h1><p class="text-muted-foreground mb-6 text-sm leading-relaxed">Você está pronta para seguir em frente - prepare-se para a transformação com a Calistenia Asiática.</p>') +
      btn("Continuar", "next") + "</div></div>" });
  };

  /* ---------------- Régua arrastável (altura / peso) ---------------- */
  var TICK = 14;
  var RULERS = {
    16: { title: "Qual é a sua altura?", step: 16, units: [["cm", "cm", 120, 220], ["pol", "pol", 47, 87]], init: 165 },
    17: { title: "Qual é o seu peso agora?", step: 17, units: [["kg", "kg", 30, 200], ["lb", "Libra", 66, 440]], init: 73, bmi: true },
    18: { title: "Qual é o seu peso alvo?", step: 18, units: [["kg", "kg", 30, 200], ["lb", "Libra", 66, 440]], init: 57 }
  };
  function rulerRange(cfg) {
    var u = state.ui.unit || cfg.units[0][0];
    for (var i = 0; i < cfg.units.length; i++) if (cfg.units[i][0] === u) return { unit: u, min: cfg.units[i][2], max: cfg.units[i][3] };
  }
  function rulerOffset(val, r) {
    var count = r.max - r.min + 1, z = count * TICK;
    return { z: z, w: (val - r.min) / (r.max - r.min) * z };
  }
  function bmiBox() {
    var u = state.ui.unit || "kg", v = state.ui.val;
    var kg = u === "kg" ? v : v / 2.205;
    var b = bmiOf(kg, state.data.height).toFixed(2), n = parseFloat(b);
    var q = n < 18.5 ? ["baixo peso", "text-bmi-underweight"] : n < 25 ? ["normal", "text-bmi-normal"] : n < 30 ? ["sobrepeso", "text-bmi-overweight"] : ["obeso", "text-bmi-obese"];
    return '<p class="text-sm text-foreground">Seu IMC é <span class="font-bold">' + b + '</span>, que é considerado <span class="font-bold ' + q[1] + '">' + q[0] + '</span>.</p><p class="text-xs text-muted-foreground mt-1">Mantenha-se positivo e concentre-se em uma dieta equilibrada e exercícios.</p>';
  }
  function rulerStep(n) {
    var cfg = RULERS[n];
    if (state.ui.val == null) state.ui.val = cfg.init;
    var r = rulerRange(cfg), val = state.ui.val, off = rulerOffset(val, r);
    var ticks = "", labels = "";
    for (var i = r.min; i <= r.max; i++) {
      ticks += '<div class="flex flex-col items-center" style="width:' + TICK + 'px;flex-shrink:0"><div class="w-px h-4 bg-muted-foreground/50"></div></div>';
      if (i % 10 === 0) labels += '<span class="absolute text-xs text-muted-foreground/60" style="left:' + ((i - r.min) * TICK) + 'px;transform:translateX(-50%)">' + i + "</span>";
    }
    var tx = "transform:translateX(-" + off.w + "px)";
    var unitLabel = r.unit;
    var unitBtns = cfg.units.map(function (u) {
      return '<button data-action="unit" data-value="' + u[0] + '" class="px-6 py-2 rounded-full text-sm font-medium transition-colors ' + (r.unit === u[0] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground") + '">' + u[1] + "</button>";
    }).join("");
    var info = cfg.bmi
      ? '<div class="bg-muted rounded-xl p-3 mb-4" data-bmi>' + bmiBox() + "</div>"
      : (n === 16 ? '<div class="bg-muted/50 rounded-xl p-3 mb-4"><div class="flex items-center gap-2"><div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"><span class="text-xs text-primary font-bold">i</span></div><span class="text-sm font-medium text-foreground">Calculando seu IMC</span></div></div>' : "");
    return layout({ step: cfg.step, total: 35, body:
      '<div class="flex-1 px-4 py-4"><div class="max-w-md mx-auto"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-4 text-center">' + cfg.title + "</h1>" +
      '<div class="flex justify-center gap-2 mb-4">' + unitBtns + "</div>" +
      '<div class="flex items-baseline justify-center mb-4"><span class="text-5xl font-black text-foreground tracking-tight" data-ruler-val>' + val + '</span><span class="text-base text-muted-foreground/60 ml-0.5">' + unitLabel + "</span></div>" +
      '<div class="mb-2"><div class="relative h-24 cursor-grab active:cursor-grabbing select-none overflow-hidden" data-ruler style="touch-action:pan-y">' +
      '<div class="absolute left-1/2 z-10 flex flex-col items-center" style="transform:translateX(-50%);top:8px"><div class="w-0.5 bg-primary" style="height:60px"></div><div class="w-0 h-0" style="border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:10px solid hsl(var(--primary))"></div></div>' +
      '<div class="absolute h-px bg-muted-foreground/50" data-shift style="top:8px;left:50%;' + tx + ";width:" + off.z + 'px"></div>' +
      '<div class="absolute flex items-start" data-shift style="top:8px;left:50%;' + tx + '">' + ticks + "</div>" +
      '<div class="absolute flex items-start" data-shift style="top:28px;left:50%;' + tx + '">' + labels + "</div>" +
      '<div class="absolute h-px bg-muted-foreground/50" data-shift style="top:78px;left:50%;' + tx + ";width:" + off.z + 'px"></div>' +
      '</div><p class="text-center text-xs text-muted-foreground/40 -mt-4">Arraste para ajustar</p></div>' +
      info + btn("Próximo passo", "ruler-next") + "</div></div>" });
  }
  STEPS[16] = function () { return rulerStep(16); };
  STEPS[17] = function () { return rulerStep(17); };
  STEPS[18] = function () { return rulerStep(18); };

  var drag = null;
  function rulerUpdate() {
    var cfg = RULERS[state.step]; if (!cfg) return;
    var r = rulerRange(cfg), off = rulerOffset(state.ui.val, r);
    var v = root.querySelector("[data-ruler-val]"); if (v) v.textContent = state.ui.val;
    root.querySelectorAll("[data-shift]").forEach(function (el) { el.style.transform = "translateX(-" + off.w + "px)"; });
    var b = root.querySelector("[data-bmi]"); if (b) b.innerHTML = bmiBox();
  }
  function dragStart(x) {
    var cfg = RULERS[state.step]; if (!cfg) return;
    drag = { x: x, v: state.ui.val, r: rulerRange(cfg) };
  }
  function dragMove(x) {
    if (!drag) return;
    var nv = Math.max(drag.r.min, Math.min(drag.r.max, drag.v + (drag.x - x) / TICK));
    nv = Math.round(nv);
    if (nv !== state.ui.val) { state.ui.val = nv; rulerUpdate(); }
  }
  root.addEventListener("mousedown", function (e) { if (e.target.closest("[data-ruler]")) { e.preventDefault(); dragStart(e.clientX); } });
  root.addEventListener("touchstart", function (e) { if (e.target.closest("[data-ruler]")) dragStart(e.touches[0].clientX); }, { passive: true });
  window.addEventListener("mousemove", function (e) { if (drag) dragMove(e.clientX); }, { passive: true });
  window.addEventListener("touchmove", function (e) { if (drag) dragMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener("mouseup", function () { drag = null; });
  window.addEventListener("touchend", function () { drag = null; });

  // 19 — Idade exata
  STEPS[19] = function () {
    var a = state.ui.age || "", ok = a !== "" && +a >= 10 && +a <= 120;
    return layout({ step: 19, total: 35, body:
      '<div class="flex-1 px-4 py-4"><div class="max-w-md mx-auto">' + title("Qual é a sua idade?") +
      '<div class="mb-6"><input type="text" inputmode="numeric" pattern="[0-9]*" value="' + esc(a) + '" data-age placeholder="Digite sua idade" class="w-full px-4 py-4 text-lg text-foreground bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"></div>' +
      '<div class="bg-muted/50 rounded-xl p-4 mb-4"><div class="flex items-start gap-2 mb-2"><div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="text-xs text-primary font-bold">i</span></div><span class="text-sm font-medium text-foreground">Perguntamos sua idade para personalizar seu plano</span></div><p class="text-xs text-muted-foreground ml-7">As pessoas mais velhas têm um percentual de gordura corporal mais alto do que as pessoas mais jovens com o mesmo IMC.</p></div>' +
      btn("Próximo passo", "age-next", { disabled: !ok }) + "</div></div>" });
  };

  // 20 — Estilo de vida
  STEPS[20] = function () {
    var a = [["sedentario", "Sedentário", "Eu passo a maior parte do dia sentado", "sedentary-cjyr6e_x.webp"], ["moderado", "Atividade moderada", "Eu faço pausas ativas", "moderate-Bt8G1F_-.webp"], ["ativo", "Eu sou imparável", "Estou de pé o dia todo", "active-Bdp4d3Tt.webp"]];
    return layout({ step: 20, total: 34, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title("Como você descreveria seu dia típico?") + '<div class="space-y-3">' +
      a.map(function (r) { return option({ action: "pick", value: r[0], label: r[1], description: r[2], image: r[3] }).replace('data-action="pick"', 'data-action="pick" data-key="lifestyle"'); }).join("") +
      "</div></div></div>" });
  };

  // 21 — Energia
  STEPS[21] = function () {
    return layout({ step: 21, total: 34, body:
      '<div class="flex-1 px-4 py-6 overflow-y-auto"><div class="max-w-md mx-auto">' + title("Como estão seus níveis de energia durante o dia?") + '<div class="space-y-3">' +
      pickList("energyLevel", [["baixo", "Baixo, sinto-me cansada durante todo o dia"], ["queda", "Queda pós-almoço"], ["arrastando", "Arrastando antes das refeições"], ["alto", "Alto e estável"]]) +
      "</div></div></div>" });
  };

  // 22 — Água
  STEPS[22] = function () {
    return layout({ step: 22, total: 33, body:
      '<div class="flex-1 flex flex-col px-4 py-6"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-6 text-center max-w-md mx-auto">Quanto de água você bebe diariamente?</h1>' +
      '<div class="relative w-full h-[75vh] md:h-[420px]"><div class="absolute right-1/2 top-0 max-w-xs space-y-3 z-10">' +
      pickList("waterIntake", [["cafe", "Eu só tomo café ou chá"], ["2copos", "Cerca de 2 copos (0,5 L)"], ["2a6copos", "2 a 6 copos (0,5–1,5 L)"], ["mais6", "Mais de 6 copos"]]) +
      '</div><img src="' + IMG + 'woman-drinking-water-BLgcZVl1.webp" alt="Mulher bebendo água" class="absolute left-1/2 top-0 h-full md:h-[400px] pointer-events-none -translate-x-[15%] z-0 object-cover object-top"></div></div>' });
  };

  // 23 — Sono
  STEPS[23] = function () {
    var opts = [["menos5", "Menos de 5 horas"], ["5a6", "5-6 horas"], ["7a8", "7-8 horas"], ["mais8", "Mais de 8 horas"]];
    return layout({ step: 23, total: 34, body:
      '<div class="flex-1 flex flex-col px-4 py-4 md:py-6"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-6 text-center max-w-md mx-auto">Quantas horas você costuma dormir?</h1>' +
      '<div class="md:hidden flex flex-col items-center"><div class="w-full mb-4" style="min-height:200px">' + lazyImg("woman-sleeping-mobile-CwFeGCXZ.webp", "Mulher dormindo", "w-full h-auto rounded-lg", { priority: true }) + "</div>" +
      '<div class="grid grid-cols-2 gap-3 w-full max-w-sm">' + pickList("sleepDuration", opts) + "</div></div>" +
      '<div class="hidden md:block relative w-full h-[420px] overflow-hidden"><div class="absolute right-1/2 top-0 max-w-xs space-y-3 z-10">' + pickList("sleepDuration", opts) + "</div>" +
      lazyImg("woman-sleeping-DwdH-tAw.webp", "Mulher dormindo", "absolute left-1/2 top-0 h-[400px] pointer-events-none -translate-x-[15%] z-0", { style: "object-fit:contain;object-position:top;", priority: true }) +
      "</div></div>" });
  };

  // 24 — Preferências de refeição
  STEPS[24] = function () {
    var items = [
      { id: "vegetarian", label: "Eu sou vegetariana", description: "Verduras, grãos, mas sem carne animal", image: "vegetarian-BZpnuIQK.webp" },
      { id: "vegan", label: "Eu sou vegana", description: "Puramente à base de plantas, sem produtos de origem animal", image: "vegan-DkoJywfO.webp" },
      { id: "gluten-free", label: "Não contém glúten", description: "Exclua produtos de grãos que contenham glúten", image: "gluten-free-BrMIw2nS.webp" },
      { id: "lactose-free", label: "Sem lactose", description: "Excluir produtos lácteos", image: "lactose-free-wsMFy0Rx.webp" },
      { id: "no-restrictions", label: "Sem restrições", description: "Aberto a todos os alimentos", image: "no-restrictions-BYq0nylU.webp" }
    ];
    return layout({ step: 23, total: 35, body:
      '<div class="flex-1 flex flex-col px-4 py-4 md:py-6 pb-32 md:pb-48 overflow-y-auto"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6 text-center max-w-md mx-auto">Quais são suas preferências de refeição?</h1>' +
      '<div class="w-full max-w-md mx-auto space-y-3">' + multiList(items) + "</div></div>" +
      '<div class="fixed bottom-0 left-0 right-0 p-4 z-10"><div class="w-full max-w-md mx-auto">' + btn("Continuar", "multi-next", { disabled: !sel().length }) + "</div></div>" });
  };

  // 25 — Hábitos
  STEPS[25] = function () {
    var items = [["procrastinacao", "Procrastinação", "⏰"], ["alimentacao", "Alimentação pouco saudável", "🍔"], ["redes-sociais", "Mídias sociais", "📱"], ["cafe", "Beber muita cafeína", "☕"], ["assistir", "Maratona de séries", "📺"], ["inseguranca", "Dúvida sobre si mesmo", "💭"], ["roer-unhas", "Roer as unhas", "🤚"], ["atrasada", "Estar atrasada", "⏳"], ["fumar", "Fumar", "🚬"], ["alcool", "Beber álcool", "🍷"], ["nenhum", "Nenhum deles", "✨"]]
      .map(function (x) { return { id: x[0], label: x[1], emoji: x[2] }; });
    return layout({ step: 29, total: 35, sticky: btn("Continuar", "multi-next", { disabled: !sel().length }), body:
      '<div class="flex-1 px-4 py-6 overflow-y-auto"><div class="max-w-md mx-auto">' + title("Quais desses hábitos você tem?") + '<div class="space-y-3">' + multiList(items) + "</div></div></div>" });
  };

  // 26 — Eventos de vida
  STEPS[26] = function () {
    var items = [["casamento", "Casamento ou relacionamento", "heart"], ["gravidez", "Gravidez", "calendar"], ["trabalho", "Trabalho agitado ou vida familiar", "briefcase"], ["estresse", "Estresse ou saúde mental", "brain"], ["medicamento", "Medicamento ou distúrbio hormonal", "pill"], ["nenhuma", "Nenhuma das acima", "x"]]
      .map(function (x) { return { id: x[0], label: x[1], icon: x[2] }; });
    return layout({ step: 30, total: 35, sticky: btn("Próximo passo", "multi-next", { disabled: !sel().length }), body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title("Algum dos eventos abaixo te levou a ganhar peso nos últimos anos?") + '<div class="space-y-3">' + multiList(items) + "</div></div></div>" });
  };

  // 27 — Recupere seu corpo
  STEPS[27] = function () {
    return layout({ step: 31, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto text-center"><div class="mb-6 rounded-2xl overflow-hidden quiz-shadow-lg bg-muted"><img src="' + IMG + 'woman-motivation-DOIROZwS.webp" alt="Mulher motivada" class="w-full object-contain" loading="eager" decoding="async" fetchpriority="high"></div>' +
      '<h1 class="text-2xl md:text-3xl font-bold text-foreground mb-4">Recupere Seu Corpo!</h1><p class="text-muted-foreground mb-6 text-sm leading-relaxed">Não sabe por onde começar? Nós já planejamos tudo. Não tem certeza de que pode fazer isso? Estamos prontos para motivá-la e apoiá-la!</p>' +
      btn("Continuar", "next") + "</div></div>" });
  };

  // Elementos animados: estado inicial em style, estado final em data-on
  function anim(off, on) { return 'style="' + off + '" data-on="' + on + '"'; }
  function runAnim() {
    later(function () {
      root.querySelectorAll("[data-on]").forEach(function (el) { el.setAttribute("style", el.getAttribute("data-on")); });
    }, 200);
  }

  // 28 — Gráfico de transformação
  STEPS[28] = function () {
    var L = 320, t3 = "transition:opacity 0.3s ease-out 0.3s";
    var dashT = "stroke-dasharray:" + L + ";transition:stroke-dashoffset 0.4s ease-out;";
    var pop = function (ox, oy, tr) { return anim("opacity:0;transform:scale(0);transform-origin:" + ox + "px " + oy + "px;transition:" + tr, "opacity:1;transform:scale(1);transform-origin:" + ox + "px " + oy + "px;transition:" + tr); };
    var tagL = "transition:opacity 0.2s ease-out, transform 0.2s ease-out";
    var tagR = "transition:opacity 0.15s ease-out 0.4s, transform 0.15s ease-out 0.4s";
    return layout({ step: 32, total: 36, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-2 text-center">É assim que a <span class="text-primary">transformação da sua vida</span> se parece</h1>' +
      '<p class="text-muted-foreground text-center mb-8 text-sm leading-relaxed font-medium">Com base nas suas respostas, prevemos que você está entre as mulheres com mais chances de atingir seus objetivos!</p>' +
      '<div class="relative mb-6"><svg viewBox="0 0 400 200" class="w-full h-auto">' +
      '<polygon points="50,120 350,180 350,200 50,200" fill="hsl(var(--destructive) / 0.2)" ' + anim("opacity:0;" + t3, "opacity:1;" + t3) + "></polygon>" +
      '<polygon points="50,120 350,60 350,180 50,120" fill="hsl(142 76% 36% / 0.15)" ' + anim("opacity:0;" + t3, "opacity:1;" + t3) + "></polygon>" +
      '<line x1="50" y1="120" x2="350" y2="60" stroke="hsl(142 76% 36%)" stroke-width="3" ' + anim(dashT + "stroke-dashoffset:" + L, dashT + "stroke-dashoffset:0") + "></line>" +
      '<line x1="50" y1="120" x2="350" y2="180" stroke="hsl(var(--destructive))" stroke-width="3" ' + anim(dashT + "stroke-dashoffset:" + L, dashT + "stroke-dashoffset:0") + "></line>" +
      '<circle cx="50" cy="120" r="8" fill="hsl(var(--destructive))" ' + pop(50, 120, "opacity 0.2s ease-out, transform 0.2s ease-out") + "></circle>" +
      '<circle cx="350" cy="60" r="8" fill="hsl(142 76% 36%)" ' + pop(350, 60, "opacity 0.15s ease-out 0.35s, transform 0.15s ease-out 0.35s") + "></circle>" +
      '<circle cx="350" cy="180" r="8" fill="hsl(var(--destructive))" ' + pop(350, 180, "opacity 0.15s ease-out 0.35s, transform 0.15s ease-out 0.35s") + "></circle>" +
      '<line x1="50" y1="60" x2="50" y2="120" stroke="hsl(var(--muted-foreground))" stroke-width="1" stroke-dasharray="4,4" ' + anim("opacity:0;transition:opacity 0.3s ease-out", "opacity:1;transition:opacity 0.3s ease-out") + "></line></svg>" +
      '<div class="absolute bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm" ' + anim("left:5%;top:45%;opacity:0;transform:translateX(-10px);" + tagL, "left:5%;top:45%;opacity:1;transform:translateX(0);" + tagL) + ">Você</div>" +
      '<div class="absolute bg-green-500 text-white rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm" ' + anim("right:0%;top:15%;opacity:0;transform:translateX(10px);" + tagR, "right:0%;top:15%;opacity:1;transform:translateX(0);" + tagR) + ">Com Calistenia Asiática</div>" +
      '<div class="absolute bg-red-500 text-white rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm" ' + anim("right:0%;bottom:15%;opacity:0;transform:translateX(10px);" + tagR, "right:0%;bottom:15%;opacity:1;transform:translateX(0);" + tagR) + ">Sem mudanças</div></div>" +
      btn("Continuar", "next") + "</div></div>" });
  };

  // 29 — Carregando plano
  var TRANSF = ["transformation-1-a90ZzNIx.webp", "transformation-2-Cx2QT2zW.webp", "transformation-3-D2ajMZTy.webp"];
  STEPS[29] = function () {
    var p = state.ui.p || 0, i = state.ui.i || 0;
    return layout({ step: 33, total: 35, showProgress: false, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto text-center"><h1 class="text-xl md:text-2xl font-bold text-foreground mb-6">Aguarde, estamos criando seu plano personalizado</h1>' +
      '<div class="mb-2"><div class="w-full h-3 bg-muted rounded-full overflow-hidden"><div class="h-full bg-primary transition-all duration-200 rounded-full" data-load-bar style="width:' + p + '%"></div></div><p class="text-lg font-semibold text-foreground mt-2" data-load-pct>' + p + "%</p></div>" +
      '<div class="mt-6 animate-fade-in rounded-2xl overflow-hidden" data-load-img><img src="' + IMG + TRANSF[i] + '" alt="Transformação" class="w-full max-h-[50vh] object-contain" loading="eager" decoding="async" fetchpriority="high"></div>' +
      '<p class="text-xs text-muted-foreground mt-4">Resultados reais de usuárias do programa.</p></div></div>' });
  };
  function startLoading() {
    state.ui.p = 0; state.ui.i = 0;
    var t1 = every(function () {
      if (state.ui.p >= 100) { clearInterval(t1); later(next, 500); return; }
      state.ui.p++;
      var bar = root.querySelector("[data-load-bar]"), pct = root.querySelector("[data-load-pct]");
      if (bar) bar.style.width = state.ui.p + "%";
      if (pct) pct.textContent = state.ui.p + "%";
    }, 60);
    every(function () {
      state.ui.i = (state.ui.i + 1) % TRANSF.length;
      var box = root.querySelector("[data-load-img]");
      if (box) {
        var n = box.cloneNode(false); // remonta para repetir o fade-in
        n.innerHTML = '<img src="' + IMG + TRANSF[state.ui.i] + '" alt="Transformação" class="w-full max-h-[50vh] object-contain" loading="eager" decoding="async">';
        box.parentNode.replaceChild(n, box);
      }
    }, 2000);
  }

  // 30 — Projeção
  STEPS[30] = function () {
    var a = state.data.currentWeight, r = state.data.targetWeight, L = 400;
    var pop = function (ox, oy, tr) { return anim("opacity:0;transform:scale(0);transform-origin:" + ox + "px " + oy + "px;transition:" + tr, "opacity:1;transform:scale(1);transform-origin:" + ox + "px " + oy + "px;transition:" + tr); };
    var fade = function (d) { return anim("opacity:0;transition:opacity 0.2s ease-out " + d, "opacity:1;transition:opacity 0.2s ease-out " + d); };
    return layout({ step: 32, total: 35, body:
      '<div class="flex-1 flex flex-col px-4 py-4 md:py-6"><div class="max-w-md mx-auto flex flex-col gap-4 md:gap-5"><h1 class="text-lg md:text-2xl font-bold text-foreground text-center">O último plano que você precisará para ficar em forma</h1>' +
      '<div class="text-center"><p class="text-muted-foreground text-sm md:text-base mb-2">Prevemos que você estará com</p><p><span class="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded text-base md:text-lg">' + r + 'kg</span><span class="text-foreground font-bold text-base md:text-lg ml-2">em até 21 dias</span></p></div>' +
      '<div class="relative h-[150px] md:h-[200px]"><svg class="w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"></stop><stop offset="50%" stop-color="#fbbf24" stop-opacity="0.7"></stop><stop offset="100%" stop-color="#22c55e" stop-opacity="0.6"></stop></linearGradient><linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#dc2626"></stop><stop offset="50%" stop-color="#f59e0b"></stop><stop offset="100%" stop-color="#16a34a"></stop></linearGradient></defs>' +
      '<line x1="30" y1="200" x2="380" y2="200" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4"></line><line x1="200" y1="30" x2="200" y2="200" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4"></line>' +
      '<path d="M30,40 Q120,80 200,130 Q280,170 380,190 L380,200 L30,200 Z" fill="url(#areaGradient)" ' + anim("opacity:0;transition:opacity 0.5s ease-out 0.3s", "opacity:1;transition:opacity 0.5s ease-out 0.3s") + "></path>" +
      '<path d="M30,40 Q120,80 200,130 Q280,170 380,190" fill="none" stroke="url(#lineGradient)" stroke-width="4" stroke-linecap="round" ' + anim("stroke-dasharray:" + L + ";stroke-dashoffset:" + L + ";transition:stroke-dashoffset 0.6s ease-out", "stroke-dasharray:" + L + ";stroke-dashoffset:0;transition:stroke-dashoffset 0.6s ease-out") + "></path>" +
      '<circle cx="30" cy="40" r="10" fill="#dc2626" stroke="white" stroke-width="3" ' + pop(30, 40, "opacity 0.2s ease-out, transform 0.2s ease-out") + "></circle>" +
      '<circle cx="200" cy="130" r="8" fill="#f59e0b" stroke="white" stroke-width="2" ' + pop(200, 130, "opacity 0.2s ease-out 0.3s, transform 0.2s ease-out 0.3s") + "></circle>" +
      '<circle cx="380" cy="190" r="10" fill="#16a34a" stroke="white" stroke-width="3" ' + pop(380, 190, "opacity 0.2s ease-out 0.5s, transform 0.2s ease-out 0.5s") + "></circle>" +
      "<g " + fade("0.1s") + '><rect x="40" y="20" width="55" height="26" rx="5" fill="#dc2626"></rect><text x="67" y="39" text-anchor="middle" fill="white" font-size="13" font-weight="bold">' + a + "kg</text></g>" +
      "<g " + fade("0.35s") + '><rect x="155" y="95" width="75" height="24" rx="5" fill="white" stroke="#e5e7eb"></rect><text x="192" y="112" text-anchor="middle" fill="#374151" font-size="11">Semana 2</text></g>' +
      "<g " + fade("0.55s") + '><rect x="330" y="155" width="55" height="26" rx="5" fill="#16a34a"></rect><text x="357" y="174" text-anchor="middle" fill="white" font-size="13" font-weight="bold">' + r + "kg</text></g></svg></div>" +
      '<div class="text-center"><h2 class="text-base md:text-lg font-bold text-primary mb-1">Protocolo de 21 dias quase pronto!</h2><p class="text-muted-foreground text-sm">De acordo com as suas respostas, você está pronta para ter resultados em 21 dias com o nosso programa.</p></div>' +
      btn("Continuar", "next") + "</div></div>" });
  };

  // 31 — Perfil pronto
  STEPS[31] = function () {
    var d = state.data, r = bmiOf(d.currentWeight, d.height), o = r.toFixed(1);
    var pos = (Math.min(Math.max(r, 15), 40) - 15) / 25 * 100;
    var life = { calmo: "Sedentário", familia: "Moderado", ativo: "Ativo", sedentario: "Sedentário", moderado: "Moderado" }[d.lifestyle] || "Sedentário";
    var lvl = { "muito-ativo": "Avançado", "exercicio-passado": "Intermediário", caminhadas: "Iniciante", "sem-exercicio": "Iniciante" }[d.fitnessHistory] || "Iniciante";
    var meta = r < 25 ? "Preguiçoso, tendência à flacidez" : r < 30 ? "Em resistência, difícil queimar gordura" : "Lento, fácil de ganhar peso";
    var c = r < 18.5 ? ["Alerta de Fragilidade Metabólica:", "Embora seu peso seja baixo, seu metabolismo está desequilibrado. A falta de estímulo nas fibras profundas causa perda de tônus e fragilidade interna. O Protocolo Asiático é essencial para fortalecer sua base e garantir um corpo firme, saudável e funcional."]
      : r < 25 ? ["Alerta de Estagnação:", 'Cuidado com o efeito "falsa magra". Seu peso está normal, mas seu metabolismo está estagnado. Sem a ativação das fibras profundas, o corpo acumula gordura visceral e perde a definição. Você precisa destravar sua queima natural agora para evitar a flacidez e o envelhecimento metabólico.']
      : r < 30 ? ["Alerta de Bloqueio:", "Seu metabolismo entrou em modo de resistência. O excesso de peso está sobrecarregando suas articulações e travando sua energia diária. O segredo para voltar a secar é a ativação rítmica das fibras profundas, que derrete a gordura mais difícil sem o esforço exaustivo da academia."]
      : ["Alerta de Risco Urgente:", 'Seu metabolismo está em "modo de sobrevivência", travando a queima e gerando inflamação. Isso causa fadiga crônica e riscos sérios à sua saúde. A Calistenia Asiática é a única via segura para destravar seu sistema e eliminar gordura de forma rápida, sem impacto e sem exaustão.'];
    var b = function (cond) { return cond ? "font-bold text-foreground" : ""; };
    var row = function (ic, lab, val, last) {
      return '<div class="flex items-center gap-2.5' + (last ? "" : " pb-2 border-b border-border") + '">' + icon(ic, "w-4 h-4 text-muted-foreground") + '<div><p class="text-xs text-muted-foreground">' + lab + '</p><p class="text-sm font-semibold text-foreground">' + val + "</p></div></div>";
    };
    return layout({ step: 30, total: 35, body:
      '<div class="flex-1 px-3 py-2 md:px-4 md:py-3"><div class="max-w-md mx-auto"><h1 class="text-lg md:text-xl font-bold text-foreground mb-2.5 md:mb-3 text-center">Seu perfil está pronto</h1>' +
      '<div class="bg-card rounded-xl p-3 mb-2 md:mb-2.5 quiz-shadow"><p class="text-sm font-medium text-foreground mb-6">Índice de Massa Corporal (IMC)</p>' +
      '<div class="relative mb-2"><div class="absolute -top-5 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-0.5 rounded font-semibold whitespace-nowrap" style="left:' + pos + '%">Você - ' + o + '<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div></div></div>' +
      '<div class="flex justify-between text-xs text-muted-foreground mb-1 px-0.5"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div>' +
      '<div class="relative h-3 rounded-full overflow-hidden mb-1"><div class="absolute inset-0" style="background:linear-gradient(to right, #60a5fa 0%, #22c55e 30%, #facc15 50%, #f97316 70%, #ef4444 100%)"></div><div class="absolute top-0 w-3 h-3 bg-white rounded-full border-2 border-foreground shadow-md transform -translate-x-1/2" style="left:' + pos + '%"></div></div>' +
      '<div class="flex justify-between text-[10px] text-muted-foreground mt-0.5"><span class="' + b(r < 18.5) + '">ABAIXO DO PESO</span><span class="' + b(r >= 18.5 && r < 25) + '">NORMAL</span><span class="' + b(r >= 25 && r < 30) + '">SOBREPESO</span><span class="' + b(r >= 30) + '">OBESO</span></div></div>' +
      '<div class="bg-red-50 border border-red-200 rounded-xl p-2.5 md:p-3 mb-2 md:mb-2.5"><div class="flex items-start gap-2">' + icon("triangle-alert", "w-4 h-4 text-red-500 flex-shrink-0 mt-0.5") + '<div><p class="text-sm font-bold text-red-700 mb-0.5">' + c[0] + '</p><p class="text-xs text-red-600 leading-relaxed">' + c[1] + "</p></div></div></div>" +
      '<div class="bg-card rounded-xl p-2.5 md:p-3 mb-2 md:mb-2.5 quiz-shadow"><div class="space-y-2 md:space-y-2.5">' + row("activity", "Estilo de vida", life) + row("user", "Nível de condicionamento", lvl) + row("flame", "Metabolismo", meta, true) + "</div></div>" +
      btn("Continuar", "next") + "</div></div>" });
  };

  // 32 — Motivo
  STEPS[32] = function () {
    return layout({ step: 31, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title("Qual é o seu principal motivo para transformar o seu corpo?") + '<div class="space-y-3">' +
      pickList("motivationReal", [["confiante", "Me sentir mais confiante com o meu corpo.", null, "sparkles", true], ["energia", "Ficar mais saudável e ter mais energia.", null, "zap", true], ["roupas", "Me sentir bem nas minhas roupas.", null, "shirt", true], ["pos-parto", "Recuperar o corpo e a autoestima após o parto.", null, "baby", true], ["outro", "Outro.", null, "ellipsis", true]]) +
      "</div></div></div>" });
  };

  // 33 — Confiança até a data
  STEPS[33] = function () {
    var dt = fmtDayMonth(addDays(new Date(), 21));
    return layout({ step: 32, total: 35, body:
      '<div class="flex-1 px-4 py-6"><div class="max-w-md mx-auto">' + title('Quão confiante você está em entrar em forma até o dia <span class="text-primary">' + dt + "</span>?") + '<div class="space-y-3">' +
      pickList("commitmentLevel", [["decidida", "Eu sei que consigo!", null, "rocket", true], ["disposta", "Estou disposta a tentar algo novo!", null, "sparkles", true], ["insegura", "Ainda sinto insegurança, mas quero mudar!", null, "heart", true]]) +
      "</div></div></div>" });
  };

  // 34 — Resumo do plano
  STEPS[34] = function () {
    var d = state.data, bmi = bmiOf(d.currentWeight, d.height);
    var before = bmi >= 30 ? "obesa-DogS7G7T.webp" : bmi >= 27 ? "sobrepeso-bhmL4RKX.webp" : bmi >= 25 ? "acima-do-peso-CtIe9m6Q.webp" : "magra-C30qJhuO.webp";
    var u = fmtDayMonth(addDays(new Date(), 21));
    var foco = { confiante: "Autoestima e confiança corporal.", energia: "Vitalidade máxima e fim do cansaço metabólico.", roupas: "Redução de medidas e ajuste perfeito das roupas.", "pos-parto": "Recuperação abdominal e tônus pós-gestação.", outro: "Transformação estética e saúde metabólica." }[d.motivationReal] || "Transformação estética e saúde metabólica.";
    var msg = { decidida: "Sua mentalidade forte acelerará a ativação das fibras profundas. Sua primeira grande transformação está prevista para o dia " + u + ".", disposta: "O Protocolo foi ajustado para garantir sua constância. Você atingirá o pico de queima metabólica até o dia " + u + ".", insegura: "Não se preocupe, o método é simples e sem impacto. Sua nova versão começará a ser visível no dia " + u + "." }[d.commitmentLevel] || "Sua transformação está prevista para o dia " + u + ".";
    var bars = function (n) { var h = ""; for (var i = 0; i < 3; i++) h += '<div class="h-1.5 flex-1 rounded-full ' + (i < n ? "bg-primary" : "bg-muted") + '"></div>'; return '<div class="flex gap-1">' + h + "</div>"; };
    var col = function (w, wcls, fat, lvl, n) {
      return '<div class="space-y-3"><div><p class="text-xs text-primary font-medium mb-0.5">' + w[0] + '</p><p class="text-lg font-bold ' + wcls + '">' + w[1] + ' kg</p></div><div><p class="text-xs text-primary font-medium mb-0.5">Gordura corporal</p><p class="text-sm font-bold text-foreground">' + fat + '</p></div><div><p class="text-xs text-primary font-medium mb-0.5">Nível de treino de calistenia</p><p class="text-sm font-bold text-foreground mb-1.5">' + lvl + "</p>" + bars(n) + "</div></div>";
    };
    return '<div class="h-screen bg-background flex flex-col overflow-hidden">' + header(true) +
      '<main class="flex-1 overflow-y-auto px-4 py-6 pb-24"><div class="max-w-md mx-auto"><h1 class="font-bold text-foreground mb-4 text-center md:text-2xl text-xl">Seu plano Hara de Calistenia Asiática está <span class="text-primary">Quase</span> pronto!</h1>' +
      '<div class="bg-card rounded-xl p-4 mb-6 quiz-shadow"><div class="flex items-center justify-between mb-3"><div class="flex-1 text-center"><span class="text-sm text-muted-foreground font-medium">Agora</span></div><div class="w-16"></div><div class="flex-1 text-center"><span class="text-sm text-muted-foreground font-medium">Seu objetivo</span></div></div>' +
      '<div class="flex items-center justify-center gap-2"><div class="flex-1 flex justify-center"><img src="' + IMG + before + '" alt="Antes" class="w-[140px] h-[168px] md:w-48 md:h-56 object-cover object-top rounded-lg"></div>' +
      '<div class="flex items-center justify-center text-4xl text-muted-foreground font-bold"><span class="flex"><span class="animate-[fade-in_0.5s_ease-out_0s_infinite_alternate] opacity-40">›</span><span class="animate-[fade-in_0.5s_ease-out_0.15s_infinite_alternate] opacity-60">›</span><span class="animate-[fade-in_0.5s_ease-out_0.3s_infinite_alternate] opacity-100">›</span></span></div>' +
      '<div class="flex-1 flex justify-center"><img src="' + IMG + 'em-forma-OQmnrtKV.webp" alt="Depois" class="w-[140px] h-[168px] md:w-48 md:h-56 object-cover object-top rounded-lg"></div></div>' +
      '<div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">' + col(["Peso atual", d.currentWeight], "text-foreground", "Acima do normal", "Iniciante", 1) + col(["Peso desejado", d.targetWeight], "text-primary", "Normal", "Avançado", 3) + "</div></div>" +
      '<div class="space-y-3 mb-6"><div class="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5">' + icon("target", "w-5 h-5 text-primary flex-shrink-0 mt-0.5") + '<p class="text-sm text-foreground"><span class="font-bold text-primary">Foco do Protocolo:</span> ' + foco + "</p></div>" +
      '<div class="bg-accent border border-border rounded-xl p-3 flex items-start gap-2.5">' + icon("calendar", "w-5 h-5 text-primary flex-shrink-0 mt-0.5") + '<p class="text-sm text-foreground leading-relaxed">' + msg + "</p></div></div>" +
      '<div class="bg-muted/50 border border-border rounded-xl p-3 mb-6 text-center"><p class="text-sm text-muted-foreground">🧘 Método <span class="font-semibold text-foreground">sem impacto</span> — seguro para qualquer idade e condição física</p></div></div></main>' +
      '<div class="fixed bottom-0 left-0 right-0 p-4 z-50"><div class="max-w-md mx-auto">' + btn("CONTINUAR", "next") + "</div></div></div>";
  };

  /* ---------------- 35 — Oferta (VSL) ---------------- */
  function offerRevealed() { return lsGet("offer_revealed") === "true"; }
  function ctaLink(mb) {
    return '<a href="' + esc(checkoutHref()) + '" data-action="checkout" target="_blank" rel="noopener noreferrer" class="w-full bg-primary text-primary-foreground py-4 px-6 rounded-xl font-bold text-lg ' + mb + ' hover:bg-primary/90 transition-colors block text-center animate-pulse-shadow">Obter meu plano personalizado agora</a>';
  }
  function spots(mb) {
    return '<div class="flex items-center justify-center gap-2 ' + mb + '">' + icon("flame", "w-4 h-4 text-orange-500") + '<span class="text-sm font-semibold text-orange-600">Restam apenas <span data-spots>' + state.ui.spots + "</span> vagas</span></div>";
  }
  function priceBox() {
    return '<div class="bg-card rounded-xl p-5 mb-6 quiz-shadow border-2 border-primary">' + spots("mb-3") +
      '<div class="text-center space-y-1"><p class="text-xl text-muted-foreground">De <span class="line-through">' + money(CFG.priceFrom != null ? CFG.priceFrom : 297) + '</span></p><p class="text-xl text-muted-foreground">por <span class="text-6xl font-black text-primary">' + money(CFG.priceTo != null ? CFG.priceTo : 37.9) + "</span></p>" +
      '<p class="text-sm text-primary font-semibold pt-2">Desconto válido apenas hoje, ' + fmtDate(new Date()) + '</p><p class="text-sm text-muted-foreground pt-1">Pagamento único • Acesso completo ao programa</p><p class="text-sm text-muted-foreground pt-2 font-medium">🔒 Compra 100% Segura • 30 Dias de Garantia Incondicional</p></div></div>';
  }
  function offerBody() {
    var d = state.data, z = bmiOf(d.currentWeight, d.height), p = fmtDayMonth(addDays(new Date(), 21));
    var B = [
      ["Ativação das Fibras Profundas", "o segredo asiático para destravar o metabolismo e queimar gordura de verdade, sem precisar se matar na academia."],
      ['Cronograma "Barriga Chapada" em 21 Dias', "um passo a passo diário e direto ao ponto para você saber exatamente o que fazer até o dia " + p + "."],
      ["Guia de Alimentação Metabólica", "receitas práticas e gostosas para acelerar a queima de gordura enquanto você descansa."],
      (z > 25 || d.limitations.length > 0) ? ["Recuperação e Alívio Articular", "exercícios suaves e sem impacto feitos para fortalecer suas articulações e eliminar dores enquanto você elimina peso."] : ["Protocolo de Tônus e Definição", "foco total em deixar o corpo durinho, aumentar a flexibilidade e conquistar a tão sonhada barriga chapada."],
      (d.energyLevel === "baixo" || d.energyLevel === "queda") ? ["Explosão de Vitalidade", "técnicas de ativação que combatem o cansaço constante e devolvem sua disposição logo nos primeiros dias."] : ["Rotinas de Alta Performance", "treinos rápidos de 10 a 20 minutos que se encaixam na sua correria para manter o metabolismo acelerado o dia todo."]
    ];
    var T = [
      ["beatriz-tonificado-Otd2-Vi6.webp", "Beatriz", "Beatriz: -3kg e Corpo Tonificado em 21 dias", "\"Eu não estava muito acima do peso, mas meu corpo não tinha forma nenhuma e eu me sentia 'mole'. Com a Calistenia Asiática, a ativação das fibras profundas esculpiu meu corpo. Em 21 dias, perdi 3kg de gordura e minha barriga ficou durinha. Meu corpo finalmente ganhou desenho e me sinto muito mais firme e segura.\""],
      ["carla-13kg-BHnYedbO.webp", "Carla", "Carla: -13kg em 21 dias", "\"Eu estava perdida, sem energia e com muita vergonha do meu corpo. Achava que precisaria de horas na academia, mas a Calistenia Asiática mudou tudo. Redescobri minha força treinando no meu próprio quarto. Hoje me sinto empoderada, confiante e 13kg mais leve em apenas 3 semanas. Foi a melhor decisão que tomei!\""],
      ["fernanda-14dias-BugOCibs.webp", "Fernanda", "Fernanda: -4kg em 14 dias", "\"Sempre fui desconfiada com promessas rápidas, mas as fotos não mentem. Em apenas duas semanas, a ativação das fibras profundas 'sugou' minha barriga para dentro de um jeito que abdominal nenhum fez. Perdi 4kg muito rápido e o inchaço sumiu. Se em 14 dias estou assim, imagina no final do protocolo!\""],
      ["juliana-postura-D49AKHtf.webp", "Juliana", "Juliana: -8kg em 21 dias (Mãe de 2 filhos)", "\"Depois da gravidez, essa 'pochete' não saía por nada e minha postura estava horrível. Os movimentos suaves da Calistenia Asiática foram a minha salvação. Recuperei minha postura e eliminei 8kg em 21 dias. Finalmente estou vendo minha barriga ficar retinha de novo, sem precisar de impacto.\""]
    ];
    var FAQ = [
      ["exercicios", "Quais exercícios a Calistenia inclui?", "Os exercícios de Calistenia se concentram em usar o peso do próprio corpo para ganhar força e flexibilidade, incluindo variações de agachamentos, pranchas, flexões adaptadas e movimentos de mobilidade."],
      ["programa", "Como vou descobrir qual programa é ideal para mim?", "Nosso quiz personalizado analisa suas respostas e cria um programa sob medida para suas necessidades, considerando sua idade, objetivos e limitações físicas."],
      ["acesso", "Como posso acessar meu plano?", "Após a compra, você receberá acesso imediato ao seu plano personalizado através do nosso aplicativo ou plataforma web."]
    ];
    var bonus = [["1. Chá Asiático Anticelulite", " - Misture uma planta pouco conhecida com água morna para assistir às celulites sumindo dia após dia."], ["2. Dieta 100% Personalizada", " - Você terá acesso a diversas receitas para preparar e ver a gordura indo embora muito mais rápido."], ["3. Cronograma de Alimentação Inteligente", " - O passo a passo completo para manter seu metabolismo acelerado e sua reeducação alimentar."], ["4. Suporte 24h Todos os Dias", " - Nosso time estará pronto para te ajudar com qualquer dúvida, independente do horário."]];
    return '<div class="animate-fade-in">' + ctaLink("mb-3") + spots("mb-6") +
      '<div class="bg-card rounded-xl p-5 mb-6 quiz-shadow"><h2 class="text-sm font-bold text-foreground mb-4 text-center">O que você vai receber</h2><div class="space-y-3">' +
      B.map(function (x) { return '<div class="flex items-start gap-2"><div class="w-5 h-5 rounded-md bg-quiz-green flex items-center justify-center flex-shrink-0 mt-0.5">' + icon("check", "w-3 h-3 text-white") + '</div><div class="text-sm"><span class="font-bold text-foreground">' + x[0] + ':</span> <span class="text-muted-foreground">' + x[1] + "</span></div></div>"; }).join("") +
      '</div><div class="mt-6"><img src="' + IMG + 'app-mockup-B3X03Zx2.webp" alt="Aplicativo Hara de Calistenia Asiática" class="w-full rounded-2xl" loading="eager" decoding="async"></div></div>' +
      priceBox() + ctaLink("mb-6") +
      '<div class="mb-6"><h2 class="text-xl font-bold text-foreground mb-5 text-center">Resultados que nos deixam orgulhosos</h2><div class="space-y-4">' +
      T.map(function (t) { return '<div class="bg-card rounded-xl overflow-hidden quiz-shadow"><img src="' + IMG + t[0] + '" alt="Transformação de ' + t[1] + '" class="w-full object-contain" loading="lazy"><div class="p-4"><p class="font-bold text-primary mb-2">' + t[2] + '</p><p class="text-sm text-muted-foreground leading-relaxed">' + esc(t[3]) + "</p></div></div>"; }).join("") +
      "</div></div>" + priceBox() + ctaLink("mb-6") +
      '<div class="bg-card rounded-xl p-5 mb-6 quiz-shadow"><h2 class="text-2xl font-bold text-primary mb-3 text-center">+Bônus Exclusivos</h2><p class="text-sm text-muted-foreground text-center mb-6">Além de você ter acesso às aulas e ao seu plano personalizado, separamos diversos bônus para te ajudar a acelerar o seu processo de emagrecimento rápido:</p><div class="space-y-5">' +
      bonus.map(function (b) { return '<div><p class="text-foreground"><span class="font-bold text-primary">' + b[0] + "</span>" + b[1] + "</p></div>"; }).join("") + "</div></div>" +
      '<div class="bg-card rounded-xl p-5 mb-6 quiz-shadow border border-border"><div class="flex justify-center mb-4"><img src="' + IMG + 'garantia-30-dias-CrDEWC_J.webp" alt="Selo de Garantia 30 Dias" class="w-32 h-32 object-contain" loading="lazy"></div><h3 class="text-xl font-bold text-foreground text-center mb-3">30 Dias de Garantia Incondicional</h3><p class="text-sm text-muted-foreground text-center mb-3">Nós confiamos tanto nos resultados do Protocolo de Calistenia Asiática que o risco é todo nosso.</p><p class="text-sm text-muted-foreground text-center mb-3">Você tem 30 dias inteiros para testar o aplicativo e todos os bônus. Se por qualquer motivo você não estiver 100% satisfeita, nós devolveremos todo o seu investimento.</p><p class="text-sm text-foreground text-center font-semibold">Reembolso total e imediato, sem perguntas e sem complicações.</p></div>' +
      '<div class="mb-6"><h2 class="font-bold text-foreground mb-4">Perguntas frequentes</h2><div class="space-y-2">' +
      FAQ.map(function (f) {
        var open = state.ui.faq === f[0];
        return '<div class="bg-card rounded-xl overflow-hidden quiz-shadow"><button data-action="faq" data-value="' + f[0] + '" aria-expanded="' + open + '" class="w-full p-4 flex items-center justify-between text-left"><span class="font-medium text-foreground text-sm">' + f[1] + "</span>" + icon(open ? "chevron-up" : "chevron-down", "w-5 h-5 text-muted-foreground flex-shrink-0") + "</button>" + (open ? '<div class="px-4 pb-4"><p class="text-sm text-muted-foreground">' + f[2] + "</p></div>" : "") + "</div>";
      }).join("") + "</div></div>" + ctaLink("mb-4") +
      '<p class="text-xs text-muted-foreground text-center"><a href="#" class="underline">Termos de Serviço</a> e <a href="#" class="underline">Política de Privacidade</a></p></div>';
  }
  STEPS[35] = function () {
    if (state.ui.spots == null) state.ui.spots = CFG.initialSpots || 7;
    if (state.ui.revealed == null) state.ui.revealed = offerRevealed();
    if (state.ui.cd == null) state.ui.cd = (CFG.countdownMinutes || 10) * 60;
    var j = state.ui.revealed;
    return '<div class="min-h-screen bg-background ' + (j ? "pt-10" : "") + '">' +
      (j ? '<div class="animate-fade-in bg-primary text-primary-foreground py-2 px-4 flex items-center justify-center gap-2 fixed top-0 left-0 right-0 z-50"><span class="text-sm">Oferta expira em:</span><span class="font-bold" data-countdown>' + pad(Math.floor(state.ui.cd / 60)) + ":" + pad(state.ui.cd % 60) + "</span></div>" : "") +
      header(true) +
      '<main class="px-4 py-6"><div class="max-w-md mx-auto"><h1 class="text-2xl md:text-3xl font-bold text-primary mb-2 text-center">Seu plano de Calistenia Asiática está pronto!</h1><p class="text-sm md:text-base text-muted-foreground mb-6 text-center">Assista ao vídeo abaixo para entender como funciona...</p>' +
      '<div class="mb-6 flex justify-center"><div id="vturb-container" class="overflow-hidden rounded-2xl" style="min-height:250px;width:100%;max-width:400px"></div></div>' +
      (j ? offerBody() : "") + "</div></main></div>";
  };

  function mountVideo() {
    var box = document.getElementById("vturb-container");
    if (!box || box.childNodes.length) return;
    var vt = CFG.vturb || {}, url = (CFG.videoUrl || "").trim();
    if (vt.accountId && vt.playerId) {
      var el = document.createElement("vturb-smartplayer");
      el.id = "vid-" + vt.playerId;
      el.style.cssText = "display:block;margin:0 auto;width:100%;max-width:400px;";
      box.appendChild(el);
      var src = "https://scripts.converteai.net/" + vt.accountId + "/players/" + vt.playerId + "/v4/player.js";
      if (!document.querySelector('script[src="' + src + '"]')) {
        var s = document.createElement("script"); s.src = src; s.async = true; document.head.appendChild(s);
      }
      return;
    }
    var yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/);
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    var frame = function (src) { return '<div style="position:relative;width:100%;padding-top:177.78%"><iframe src="' + src + '" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>'; };
    if (yt) box.innerHTML = frame("https://www.youtube.com/embed/" + yt[1] + "?rel=0&playsinline=1");
    else if (vm) box.innerHTML = frame("https://player.vimeo.com/video/" + vm[1]);
    else if (url) vslPlayer(box, url);
    else box.innerHTML = '<div style="position:relative;width:100%;padding-top:177.78%;background:#1f1f1f"><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#fff;text-align:center;padding:24px"><div style="width:64px;height:64px;border-radius:9999px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div><span style="font-size:14px;opacity:.8">Configure o vídeo em config.js</span></div></div>';
  }
  /* Player estilo VSL: autoplay mudo + "clique para ouvir", sem barra de busca, barra de progresso falsa */
  function vslPlayer(box, url) {
    var RED = "#A82D17", BAR = "#C8361C";
    box.innerHTML =
      '<div data-vsl style="position:relative;width:100%;background:#000;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none">' +
      '<video src="' + esc(url) + '" playsinline webkit-playsinline muted autoplay preload="auto" disablepictureinpicture controlslist="nodownload noplaybackrate" style="display:block;width:100%;height:auto;min-height:250px;background:#000"></video>' +
      '<div data-vsl-unmute style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px">' +
        '<div style="background:' + RED + 'e6;color:#fff;border-radius:12px;padding:18px 22px;text-align:center;max-width:260px;box-shadow:0 8px 24px rgba(0,0,0,.35);animation:pulse-shadow 2s ease-in-out infinite">' +
          '<div style="font-weight:700;font-size:16px;line-height:1.25;margin-bottom:10px">Seu vídeo já começou</div>' +
          '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 10px"><path d="M11 5 6 9H2v6h4l5 4V5z" fill="#fff"></path><line x1="22" y1="9" x2="16" y2="15"></line><line x1="16" y1="9" x2="22" y2="15"></line></svg>' +
          '<div style="font-weight:600;font-size:15px">Clique para ouvir</div>' +
        "</div></div>" +
      '<div data-vsl-play style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.35)">' +
        '<div style="width:84px;height:84px;border-radius:9999px;background:' + RED + ';display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.4)"><svg width="38" height="38" viewBox="0 0 24 24" fill="#fff" style="margin-left:4px"><path d="M8 5v14l11-7z"></path></svg></div></div>' +
      '<div style="position:absolute;left:0;right:0;bottom:0;height:10px;background:rgba(255,255,255,.2)"><div data-vsl-bar style="height:100%;width:0;background:' + BAR + ';transition:width .25s linear"></div></div>' +
      "</div>";
    var wrap = box.querySelector("[data-vsl]"), v = wrap.querySelector("video");
    var unmute = wrap.querySelector("[data-vsl-unmute]"), playBtn = wrap.querySelector("[data-vsl-play]"), bar = wrap.querySelector("[data-vsl-bar]");
    var started = false; // true depois que a pessoa ativou o som
    v.muted = true;
    function show(el, on) { el.style.display = on ? "flex" : "none"; }
    function tryPlay() {
      var p = v.play();
      if (p && p.catch) p.catch(function () { if (started) show(playBtn, true); });
    }
    tryPlay();
    v.addEventListener("timeupdate", function () {
      if (!v.duration) return;
      var r = Math.min(v.currentTime / v.duration, 1);
      bar.style.width = (Math.sqrt(r) * 100).toFixed(2) + "%"; // avança rápido no começo e devagar no fim
    });
    v.addEventListener("pause", function () { if (started) show(playBtn, true); });
    v.addEventListener("play", function () { if (started) show(playBtn, false); });
    // Fora da tela o navegador pode pausar o autoplay mudo: retoma quando o vídeo volta a aparecer.
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) {
      if (!started && es[0].isIntersecting && v.paused) tryPlay();
    }).observe(wrap);
    document.addEventListener("visibilitychange", function () { if (!started && !document.hidden && v.paused && v.isConnected) tryPlay(); });
    v.addEventListener("ended", function () { show(playBtn, true); });
    wrap.addEventListener("click", function () {
      if (!started) {
        started = true;
        show(unmute, false);
        v.currentTime = 0;
        v.muted = false;
        tryPlay();
        return;
      }
      if (v.paused || v.ended) tryPlay(); else v.pause();
    });
    v.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }

  function startOffer() {
    mountVideo();
    if (!state.ui.revealed) {
      later(function () {
        lsSet("offer_revealed", "true");
        state.ui.revealed = true;
        render();
        startCountdown();
      }, Math.max(0, (CFG.revealDelaySeconds != null ? CFG.revealDelaySeconds : 323)) * 1000);
    } else startCountdown();
    later(function () {
      state.ui.spots = Math.max(state.ui.spots - 1, 6);
      root.querySelectorAll("[data-spots]").forEach(function (e) { e.textContent = state.ui.spots; });
    }, Math.floor(Math.random() * 45001) + 45000);
  }
  function startCountdown() {
    var t = every(function () {
      if (state.ui.cd <= 0) { clearInterval(t); return; }
      state.ui.cd--;
      var el = root.querySelector("[data-countdown]");
      if (el) el.textContent = pad(Math.floor(state.ui.cd / 60)) + ":" + pad(state.ui.cd % 60);
    }, 1000);
  }

  /* ------------------------------------------------------------------ */
  /* Render + eventos                                                    */
  /* ------------------------------------------------------------------ */
  function render() {
    var keepVideo = null;
    if (state.step === 35) {
      var box = document.getElementById("vturb-container");
      if (box && box.childNodes.length) keepVideo = box; // não reinicia o vídeo ao revelar a oferta
    }
    root.innerHTML = (STEPS[state.step] || STEPS[1])();
    if (keepVideo) {
      var nb = document.getElementById("vturb-container");
      if (nb) nb.parentNode.replaceChild(keepVideo, nb);
    }
    if (state.step === 28 || state.step === 30) runAnim();
  }
  function afterEnter() {
    if (state.step === 29) startLoading();
    if (state.step === 35) startOffer();
  }
  var _go = go;
  go = function (n) { _go(n); afterEnter(); };

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-action]");
    if (!t || !root.contains(t)) return;
    var a = t.getAttribute("data-action"), v = t.getAttribute("data-value");
    switch (a) {
      case "back": back(); break;
      case "next": next(); break;
      case "pick":
        setData(t.getAttribute("data-key"), v);
        next();
        break;
      case "toggle": {
        var m = MULTI[state.step], s = sel();
        if (state.step === 7) state.ui.all = false;
        if (m.none && v === m.none) { state.ui.sel = [m.none]; }
        else {
          s = s.filter(function (x) { return x !== m.none; });
          state.ui.sel = s.indexOf(v) !== -1 ? s.filter(function (x) { return x !== v; }) : s.concat(v);
        }
        rerenderKeepScroll();
        break;
      }
      case "toggle-all":
        state.ui.all = !state.ui.all;
        state.ui.sel = state.ui.all ? ZONES7.map(function (z) { return z.id; }) : [];
        rerenderKeepScroll();
        break;
      case "multi-next":
        if (!sel().length) return;
        setData(MULTI[state.step].key, sel().slice());
        next();
        break;
      case "unit": {
        var cfg = RULERS[state.step], cur = state.ui.unit || cfg.units[0][0];
        if (v === cur) return;
        var val = state.ui.val;
        if (state.step === 16) val = Math.round(v === "pol" ? val / 2.54 : val * 2.54);
        else val = Math.round(v === "lb" ? val * 2.205 : val / 2.205);
        state.ui.unit = v; state.ui.val = val;
        render();
        break;
      }
      case "ruler-next": {
        var u = state.ui.unit, x = state.ui.val;
        if (state.step === 16) setData("height", u === "pol" ? Math.round(x * 2.54) : x);
        else setData(state.step === 17 ? "currentWeight" : "targetWeight", u === "lb" ? Math.round(x / 2.205) : x);
        next();
        break;
      }
      case "age-next":
        var ag = parseInt(state.ui.age, 10);
        if (!(ag >= 10 && ag <= 120)) return;
        setData("exactAge", ag);
        next();
        break;
      case "faq":
        state.ui.faq = state.ui.faq === v ? null : v;
        rerenderKeepScroll();
        break;
      case "checkout":
        if (!CFG.checkoutUrl) { e.preventDefault(); console.warn("[Oferta] Defina checkoutUrl em config.js"); }
        break;
    }
  });
  root.addEventListener("input", function (e) {
    if (!e.target.matches("[data-age]")) return;
    var i = e.target.value.replace(/\D/g, "");
    if (i === "" || (+i >= 0 && +i <= 120)) state.ui.age = i;
    e.target.value = state.ui.age || "";
    var ok = state.ui.age && +state.ui.age >= 10 && +state.ui.age <= 120;
    var b = root.querySelector('[data-action="age-next"]');
    if (b) b.disabled = !ok;
  });
  root.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.matches("[data-age]")) {
      var b = root.querySelector('[data-action="age-next"]');
      if (b && !b.disabled) b.click();
    }
  });
  function rerenderKeepScroll() {
    var sc = root.querySelector("main"), top = sc ? sc.scrollTop : 0, wy = window.scrollY;
    render();
    var n = root.querySelector("main"); if (n) n.scrollTop = top;
    window.scrollTo(0, wy);
  }

  /* ------------------------------------------------------------------ */
  /* Pré-carregamento de imagens das próximas etapas                     */
  /* ------------------------------------------------------------------ */
  var PRE = {
    2: ["women-group-new-Dm6Dh7Zz.webp"], 3: ["woman-calisthenics-CxC8mlGX.webp"], 4: ["woman-couch-exercise-DxhhEtty.webp"],
    7: ZONES7.map(function (z) { return z.image; }),
    8: ["barriga-DAcogUxf.webp", "inline-vt.webp", "pernas-DV7nbtv6.webp", "inline-jt.webp", "bracos-BmNkLcku.webp", "inline-Nt.webp"],
    9: ["woman-ok-asian-By6X2nVW.png"], 10: ["slim-BgG68MtM.webp", "mid-sized-C-245tK-.webp", "heavier-side-7tzmsUcd.webp", "overweight-oo35LK1h.webp"],
    11: ["curvy-Dbj8VQuI.webp", "thin-BWWpALK0.webp", "satisfied-DyDvcRJX.webp", "bikini-body-BG5HLQ1-.webp", "inline-Dt.webp"],
    12: ["woman-fitness-abs-loFQOyPd.webp"], 13: ["back-D2DUI9o8.webp", "knees-ankles-WZoJdNID.webp", "hip-E-F3cLZa.webp", "inline-Bt.webp"],
    15: ["woman-thumbsup-asian-BszG4iHy.webp"], 20: ["sedentary-cjyr6e_x.webp", "moderate-Bt8G1F_-.webp", "active-Bdp4d3Tt.webp"],
    22: ["woman-drinking-water-BLgcZVl1.webp"], 23: ["woman-sleeping-mobile-CwFeGCXZ.webp", "woman-sleeping-DwdH-tAw.webp"],
    24: ["vegetarian-BZpnuIQK.webp", "vegan-DkoJywfO.webp", "gluten-free-BrMIw2nS.webp", "lactose-free-wsMFy0Rx.webp", "no-restrictions-BYq0nylU.webp"],
    27: ["woman-motivation-DOIROZwS.webp"], 29: TRANSF,
    34: ["obesa-DogS7G7T.webp", "sobrepeso-bhmL4RKX.webp", "acima-do-peso-CtIe9m6Q.webp", "magra-C30qJhuO.webp", "em-forma-OQmnrtKV.webp"],
    35: ["app-mockup-B3X03Zx2.webp", "beatriz-tonificado-Otd2-Vi6.webp", "carla-13kg-BHnYedbO.webp", "fernanda-14dias-BugOCibs.webp", "juliana-postura-D49AKHtf.webp", "garantia-30-dias-CrDEWC_J.webp"]
  };
  var loaded = {};
  function preload(s) {
    for (var k = s + 1; k <= s + 5; k++) (PRE[k] || []).forEach(function (f) {
      if (loaded[f]) return; loaded[f] = 1; var im = new Image(); im.decoding = "async"; im.src = IMG + f;
    });
  }

  render();
  preload(1);
  setTimeout(function () { [2, 3, 4, 7, 8, 9, 10, 11, 12].forEach(function (k) { (PRE[k] || []).forEach(function (f) { if (!loaded[f]) { loaded[f] = 1; var im = new Image(); im.src = IMG + f; } }); }); }, 500);
})();
