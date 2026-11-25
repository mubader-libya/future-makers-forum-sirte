/* ملتقى صنّاع المستقبل — presentation deck: data layer, slides, navigation. */
(function(){
"use strict";
var Y = window.Y = {};
var root = document.documentElement;
var RM = root.classList.contains("rm");

/* ---------- data layer: one registry, local fallback ---------- */
Y.ENDPOINTS = {
  forum: {
    route: "/api/forum",
    local: function(){ return window.FORUM_LOCAL; },
    map: function(json){ return (json && json.data) ? json.data : null; }
  }
};
Y.load = function(type){
  var ep = Y.ENDPOINTS[type], cms = (window.SITE_CONFIG || {}).cms;
  if (!cms) return Promise.resolve(ep.local());
  return fetch(cms.replace(/\/$/, "") + ep.route + "?populate=*")
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(j){ var d = ep.map(j); if(!d) throw new Error("empty"); return d; })
    .catch(function(e){ console.warn("[Y.load] " + type + " → local fallback", e); return ep.local(); });
};

function $(s, r){ return (r || document).querySelector(s); }
function $$(s, r){ return [].slice.call((r || document).querySelectorAll(s)); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

/* ---------- drawings (one gold line, same hand) ---------- */
var ARCH = "M20 206 V92 A70 70 0 0 1 180 92 V206";
var MOTIF = {
  tech:  "M100 206 V170 H70 V140 H120 V110 H90 V84 M84 84 h12 v-12 h-12 z",
  biz:   "M40 196 H70 V170 H100 V144 H130 V112 C140 96 150 86 160 80 M148 78 L160 80 L158 92",
  media: "M30 140 C45 110 55 110 70 140 S95 170 110 140 S135 100 150 140 S165 165 172 150"
};
function gateSVG(id){ return '<svg class="draw gate-arch" viewBox="0 0 200 212" aria-hidden="true"><path d="' + ARCH + '"/><path d="' + MOTIF[id] + '"/></svg>'; }
var SEAT = '<svg class="draw" viewBox="0 0 100 110" aria-hidden="true"><path d="M30 12 C26 36 26 56 32 70 H82 M34 70 L28 104 M78 70 L84 104 M32 70 C40 62 70 62 82 70"/><path d="M50 40 H76 V56 H50 Z M54 47 H72"/></svg>';
function cross(withRoads){
  return '<svg class="draw cross' + (withRoads ? " faded" : "") + '" viewBox="0 0 400 420" role="img" aria-label="' + (withRoads ? "رسم: من بين طرق كثيرة تتضح ثلاثة طرق: التكنولوجيا، ريادة الأعمال، الإعلام والإبداع" : "رسم: شاب عند مفترق طرق كثيرة تتلاشى في الضباب") + '">' +
    '<path class="fog" d="M200 370 C190 320 120 300 70 250"/><path class="fog" d="M200 370 C210 330 300 320 345 280"/>' +
    '<path class="fog" d="M200 370 C180 330 60 330 30 320"/><path class="fog" d="M200 370 C220 340 350 350 380 345"/>' +
    '<path class="fog" d="M200 370 C170 300 150 230 120 190"/><path class="fog" d="M200 370 C230 300 260 240 285 200"/>' +
    (withRoads ? '<g class="roads b">' +
      '<path class="road" d="M200 370 C200 290 90 230 80 86"/><path class="road" d="M200 370 C200 280 200 180 200 66"/><path class="road" d="M200 370 C200 290 310 230 320 86"/>' +
      '<path class="road" d="M62 86 V64 a18 18 0 0 1 36 0 V86"/><path class="road" d="M182 66 V44 a18 18 0 0 1 36 0 V66"/><path class="road" d="M302 86 V64 a18 18 0 0 1 36 0 V86"/>' +
      '<text x="80" y="32" text-anchor="middle">التكنولوجيا</text><text x="200" y="16" text-anchor="middle">ريادة الأعمال</text><text x="320" y="32" text-anchor="middle">الإعلام والإبداع</text></g>' : "") +
    '<circle class="you" cx="200" cy="378" r="7"/><text x="200" y="408" text-anchor="middle">أنت هنا</text></svg>';
}
var FAN = '<svg class="draw fan" viewBox="0 0 520 300" role="img" aria-label="رسم: خط واحد يتفرع إلى خطوط كثيرة، صوت واحد يصل إلى كثيرين"><path d="M500 150 H340"/><path d="M340 150 C280 150 230 40 20 30"/><path d="M340 150 C280 150 230 80 20 80"/><path d="M340 150 C280 150 230 120 20 125"/><path d="M340 150 H20"/><path d="M340 150 C280 150 230 180 20 175"/><path d="M340 150 C280 150 230 220 20 220"/><path d="M340 150 C280 150 230 260 20 270"/><circle cx="500" cy="150" r="6" style="fill:var(--gold);stroke:none"/></svg>';

function planSVG(R){
  var sizes = { entry:[34,10], foyer:[40,14], arkno:[46,22], qurina:[26,24], mafu:[26,24], kabau:[26,14], ghaba:[26,14], vip:[20,10] };
  return '<svg class="plan" viewBox="0 0 100 100" role="img" aria-label="مخطط مقترح لتوزيع مناطق الملتقى"><rect class="outline" x="2" y="2" width="96" height="96" rx="2"/>' +
    R.map(function(r){ var s = sizes[r.id] || [20,10];
      return '<g class="room" data-room="' + r.id + '"><rect x="' + (r.x - s[0]/2) + '" y="' + (r.y - s[1]/2) + '" width="' + s[0] + '" height="' + s[1] + '" rx="1"/><text x="' + r.x + '" y="' + (r.y + 1) + '">' + esc(r.short || r.zone) + '</text></g>';
    }).join("") + '</svg>';
}

/* ---------- images: generated files, drawn placeholder until they exist ---------- */
var PH_SCENE = { cover:"arkno", robotics:"qurina", team:"qurina", pitch:"mafu", founders:"arkno", clinic:"kabau", creators:"ghaba", studio:"ghaba", expo:"foyer", workshop:"kabau", awards:"arkno", entry:"entry" };
function pic(D, key, eager, label){
  var m = D.images[key];
  return '<img src="' + m.f + '" alt="' + esc(m.alt) + '"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') +
    ' onerror="this.hidden=true;this.nextElementSibling.hidden=false">' +
    '<div class="ph" hidden>' + window.SCENE(PH_SCENE[key] || "foyer") + '<span>' + esc(m.alt) + ' · الصورة قيد التوليد</span></div>' +
    (label === false ? "" : '<span class="stamp">تصوّر فني</span>');
}

/* ---------- slides, in story order ---------- */
function slides(D){
  var S = [];
  function add(chapter, cls, html, extra){ S.push(Object.assign({ chapter: chapter, cls: cls, html: html }, extra || {})); }
  function kick(t){ return '<p class="kicker">' + esc(t) + '</p>'; }

  /* 1 cover */
  add("ملتقى صنّاع المستقبل", "split cover",
    '<div class="split-in"><div class="txt"><p class="kick-hero">' + esc(D.meta.kicker) + '</p><h1>ملتقى<br>صنّاع المستقبل</h1><p class="tag">' + esc(D.meta.tagline) + '</p>' +
    '<div class="facts">' + D.meta.facts.map(function(f){ return '<div class="fact"><b>' + esc(f.k) + '</b><span>' + esc(f.v) + '</span></div>'; }).join("") + '</div></div>' +
    '<figure class="bleed"><div class="frame">' + pic(D, "cover", true) + '</div></figure></div>');

  /* 2 question */
  add("الفصل الأول · السؤال", "grid-bg",
    '<div class="cols w46"><div>' + kick("الفصل الأول · السؤال") + '<div class="lines">' +
    D.problem.question.map(function(t, i){ return '<p class="line b' + (i === 1 ? " big" : "") + '">' + esc(t) + '</p>'; }).join("") + '</div></div>' + cross(false) + '</div>');

  /* 3 cause */
  add("الفصل الأول · السبب", "grid-bg",
    '<div class="cols w46"><div>' + kick("الفصل الأول · السبب") + '<div class="lines">' +
    D.problem.cause.map(function(t, i){ return '<p class="line b' + (i === 1 ? " big" : "") + '">' + esc(t) + '</p>'; }).join("") + '</div></div>' + cross(true) + '</div>');

  /* 4 idea */
  add("الفصل الثاني · الفكرة", "sheet",
    '<div>' + kick("الفصل الثاني · الفكرة") + '<h2 class="h">نافذة واحدة على سوق العمل</h2><p class="answer">' + esc(D.problem.answer) + '</p>' +
    '<div class="idea-p">' + D.idea.p.map(function(p){ return "<p>" + esc(p) + "</p>"; }).join("") + '</div></div>');

  /* 5 goals */
  add("الفصل الثاني · الأهداف", "sheet",
    '<div>' + kick("الفصل الثاني · الأهداف الاستراتيجية") + '<h2 class="h">خمسة أهداف</h2><ul class="list dash" style="margin-top:calc(var(--u)*2)">' +
    D.idea.goals.map(function(g){ return '<li class="b">' + esc(g) + '</li>'; }).join("") + '</ul></div>');

  /* 6–8 gates: flagship first, then the five activities */
  D.zones.forEach(function(z, i){
    add("الفصل الثالث · " + z.t, "split gate" + (i % 2 ? " sheet" : ""),
      '<div class="split-in"><div class="txt">' + kick("الفصل الثالث · البوابات الثلاث") +
      '<div class="gate-head">' + gateSVG(z.id) + '<div><p class="gate-n">' + esc(z.n) + '</p><h2 class="h">' + esc(z.t) + '</h2></div></div>' +
      '<div class="flag"><small>الفعالية الرئيسية</small><b>' + esc(z.flag.t) + '</b><p>' + esc(z.flag.d) + '</p></div>' +
      '<ul class="list acts">' + z.acts.map(function(a){ return '<li class="b"><b>' + esc(a.t) + '</b><span>' + esc(a.d) + '</span></li>'; }).join("") + '</ul></div>' +
      '<figure class="bleed"><div class="frame">' + pic(D, z.img) + '</div><figcaption class="over">' + esc(z.sees) + '</figcaption></figure></div>');
  });

  /* 9 main stage + shared */
  add("الفصل الرابع · القلب المشترك", "split sheet",
    '<div class="split-in"><div class="txt">' + kick("الفصل الرابع · القلب المشترك") + '<h2 class="h">المسرح الرئيسي والمناطق المشتركة</h2>' +
    '<p class="sub">مساحات موحّدة تجمع المشاركين من كل القطاعات.</p>' +
    '<ul class="list">' + D.shared.map(function(s){ return '<li class="b"><b>' + esc(s.t) + '</b><span>' + esc(s.d) + '</span></li>'; }).join("") + '</ul></div>' +
    '<figure class="bleed"><div class="frame">' + pic(D, "founders") + '</div><figcaption class="over">جلسة "من هنا بدأوا" على المسرح الرئيسي.</figcaption></figure></div>');

  /* 10 the four days (indicative arc) */
  add("الفصل الخامس · الأيام الأربعة", "grid-bg",
    '<div>' + kick("الفصل الخامس · الأيام الأربعة") + '<h2 class="h">من الافتتاح إلى منصة التتويج</h2>' +
    '<p class="sub">ثلاث فعاليات رئيسية تشدّ الأيام الأربعة إلى نهاية واحدة: حفل الختام.</p>' +
    '<ol class="arc">' + D.arc.map(function(a, i){ return '<li class="b"><small>المرحلة ' + (i + 1) + ' من ' + D.arc.length + '</small><b>' + esc(a.t) + '</b><p>' + esc(a.d) + '</p></li>'; }).join("") + '</ol>' +
    '<p class="indic">مسار مقترح للتوضيح. الجدول التفصيلي يُعدّ مع البرنامج.</p></div>');

  /* 11 youth in action */
  var shots = [["robotics", "بطولة الروبوتات"], ["pitch", "عرض مشروع أمام لجنة"], ["creators", "تحدّي تغطية الافتتاح"], ["team", "فريق يجهّز روبوته"], ["workshop", "ورشة تطبيقية"]];
  add("الفصل الخامس · الشباب في الميدان", "fill",
    '<div class="fill-in">' + kick("الفصل الخامس · الشباب في الميدان") + '<h2 class="h">هكذا سيبدو الملتقى</h2>' +
    '<div class="collage">' + shots.map(function(s){ return '<figure class="frame b">' + pic(D, s[0], false, false) + '<figcaption>' + esc(s[1]) + ' · تصوّر فني</figcaption></figure>'; }).join("") + '</div></div>');

  /* 12 venue walk */
  var R = D.venue.rooms;
  add("الفصل السادس · جولة في المكان", "grid-bg venue",
    '<div class="cols w46"><div>' + kick("الفصل السادس · جولة في المكان") + '<h2 class="h">سرت: توزيع مقترح للمساحات</h2>' +
    '<p class="sub">مشيٌ افتراضي من بوابة الملتقى إلى المسرح. اضغط السهم للانتقال إلى الجناح التالي.</p>' +
    '<div class="room-card" id="roomCard"></div><p class="note">' + esc(D.venue.note) + " " + esc(D.venue.capacity) + '</p></div>' +
    '<div class="vis"><div class="scene-box" id="sceneBox"></div>' + planSVG(R) + '</div></div>',
    { steps: R.length - 1, onStep: function(slide, k){
        var r = R[k];
        $("#roomCard", slide).innerHTML = '<span class="room-cap"><bdi dir="ltr">' + esc(r.room) + '</bdi>' + (r.cap ? " · " + esc(r.cap) : "") + '</span><h3>' + esc(r.zone) + '</h3><p>' + esc(r.d) + '</p><p class="room-n">الجناح ' + (k + 1) + ' من ' + R.length + '</p>';
        $("#sceneBox", slide).innerHTML = window.SCENE(r.id);
        $$(".room", slide).forEach(function(g){ g.classList.toggle("on", g.dataset.room === r.id); });
        draw($("#sceneBox", slide));
      } });

  /* 13 buzz — built around the coverage challenge */
  add("الفصل السابع · الضجة الإعلامية", "sheet",
    '<div><div class="cols"><div>' + kick("الفصل السابع · الضجة الإعلامية") + '<h2 class="h">حدثٌ صُمِّم ليُرى</h2><p class="sub">' + esc(D.buzz.lead) + '</p>' +
    '<p class="engine"><b>المحرّك:</b> ' + esc(D.buzz.engine) + '</p></div>' + FAN + '</div>' +
    '<div class="phases">' + D.buzz.phases.map(function(p){ return '<div class="phase b"><h3>' + esc(p.t) + '</h3><p>' + esc(p.d) + '</p></div>'; }).join("") + '</div></div>');

  /* 14 headline moments */
  add("الفصل السابع · لحظات تصنع الخبر", "grid-bg",
    '<div>' + kick("الفصل السابع · لحظات تصنع الخبر") + '<h2 class="h">ستة عناوين ننتظرها في الأخبار</h2>' +
    '<div class="heads">' + D.buzz.moments.map(function(m){ return '<div class="headline b"><small>خبر من الملتقى</small><b>' + esc(m) + '</b></div>'; }).join("") + '</div></div>');

  /* 15 guests */
  add("الفصل الثامن · الضيوف", "sheet",
    '<div>' + kick("الفصل الثامن · الضيوف") + '<h2 class="h">مقاعد محجوزة لأصحابها</h2><p class="sub">رواد أعمال ليبيون بارزون، وخبرات إقليمية ودولية. الأسماء تُعلن مع اعتماد البرنامج، وهذه أمثلة على الفئات.</p>' +
    '<div class="seats">' + D.guests.map(function(g){ return '<div class="seat b">' + SEAT + '<b>' + esc(g.t) + '</b><p>' + esc(g.d) + '</p><span class="pill">يُعلن لاحقاً</span></div>'; }).join("") + '</div></div>');

  /* 16 audience */
  add("الفصل التاسع · من يحضر", "grid-bg",
    '<div>' + kick("الفصل التاسع · من يحضر") + '<h2 class="h">5,000 زائر مستهدف على مدى أربعة أيام</h2>' +
    '<ul class="list two">' + D.groups.map(function(g){ return '<li><b>' + esc(g.t) + '</b><span>' + esc(g.d) + '</span></li>'; }).join("") + '</ul>' +
    '<p class="scope"><b>النطاق الجغرافي:</b> ' + esc(D.scope) + '</p></div>');

  /* 17 partners */
  add("الفصل العاشر · الشراكات", "sheet",
    '<div>' + kick("الفصل العاشر · الشراكات") + '<h2 class="h">كل شريك له دورٌ يُقاس</h2><p class="sub">' + esc(D.partners.lead) + '</p>' +
    '<div class="tracks">' + D.partners.tracks.map(function(t, i){ return '<div class="track b"><i>' + (i + 1) + '</i><b>' + esc(t.t) + '</b><p>' + esc(t.d) + '</p></div>'; }).join("") + '</div>' +
    '<p class="naming">فرصة للرعاة: لكل فعالية رئيسية شريك يحمل اسمها، مثل "بطولة الروبوتات بالشراكة مع…".</p></div>');

  /* 18 after the four days: winners continue in the annual programme */
  var prog = D.initiatives[0];
  add("الفصل الحادي عشر · ما بعد الأيام الأربعة", "split after",
    '<div class="split-in"><div class="txt">' + kick("الفصل الحادي عشر · ما بعد الأيام الأربعة") + '<h2 class="h">الفائزون لا يعودون إلى بيوتهم فقط</h2>' +
    '<ul class="loop">' + D.loop.map(function(l){ return '<li class="b"><b>' + esc(l.t) + '</b><span>' + esc(l.d) + '</span></li>'; }).join("") + '</ul>' +
    '<div class="prog-box b"><small>' + esc(prog.t) + '</small><h3>مسار عام كامل حتى النسخة القادمة</h3><p>' + esc(prog.d) + ' ' + esc(prog.goal) + '</p></div></div>' +
    '<figure class="bleed"><div class="frame">' + pic(D, "awards") + '</div><figcaption class="over">لحظة التكريم في حفل الختام.</figcaption></figure></div>');

  /* 19 outputs */
  add("الخاتمة · المخرجات", "sheet",
    '<div>' + kick("الخاتمة · ما سيبقى") + '<h2 class="h">المخرجات المتوقعة</h2>' +
    '<ul class="list dash two">' + D.outputs.map(function(o){ return '<li class="b">' + esc(o) + '</li>'; }).join("") + '</ul>' +
    '<p class="gold" style="margin-top:calc(var(--u)*2);font-size:var(--t-small)">اللجان التي تحمل التنفيذ</p><div class="committees">' + D.committees.map(function(c){ return "<span>" + esc(c) + "</span>"; }).join("") + '</div></div>');

  /* 20 the ask */
  add("الخاتمة · الخطوة التالية", "grid-bg",
    '<div class="cols"><div>' + kick("الخاتمة · الخطوة التالية") + '<p class="end-line">من الفكرة<br>إلى يناير 2027</p></div>' +
    '<ol class="steps-cta">' +
    '<li class="b">الموافقة المبدئية على إقامة الملتقى في سرت لمدة أربعة أيام.</li>' +
    '<li class="b">اعتماد موعد الانعقاد في يناير 2027.</li>' +
    '<li class="b">تشكيل اللجان التحضيرية والمختصة.</li>' +
    '<li class="b">التفويض ببدء التواصل مع الشركاء المحتملين.</li></ol></div>');
  return S;
}

/* ---------- drawing on entry ---------- */
function draw(scope){
  if (RM) return;
  $$("svg.draw path, svg.draw rect, svg.draw circle", scope).forEach(function(p){
    if (p.closest(".roads") && !p.closest(".roads.in")) return;
    if (p.closest(".ph")) return; /* placeholders stay drawn; they may be hidden when measured */
    if (p.classList.contains("fog") || p.classList.contains("you")) { if (p.classList.contains("you")) return; }
    var L; try { L = p.getTotalLength(); } catch(e){ return; }
    if (!L) return;
    p.style.strokeDasharray = p.classList.contains("fog") ? "" : L;
    if (p.classList.contains("fog")) { p.animate([{ opacity: 0 }, { opacity: getComputedStyle(p).opacity }], { duration: 1400, easing: "ease-out" }); return; }
    p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1300, easing: "cubic-bezier(.65,0,.35,1)", fill: "backwards" });
  });
}

/* ---------- deck engine ---------- */
function deck(S){
  var stage = $("#stage"), cur = -1, step = 0;
  stage.innerHTML = S.map(function(s, i){
    return '<section class="slide ' + s.cls + '" id="s-' + (i + 1) + '" aria-roledescription="شريحة" aria-label="' + (i + 1) + ' من ' + S.length + '" aria-hidden="true">' + s.html + '</section>';
  }).join("");
  var els = $$(".slide", stage);
  S.forEach(function(s, i){ s.el = els[i]; s.builds = $$(".b", els[i]); s.total = s.steps != null ? s.steps : s.builds.length; });
  root.classList.add("js");

  $("#indexList").innerHTML = S.map(function(s, i){ return '<li><a href="#s-' + (i + 1) + '" data-i="' + i + '"><small>' + (i + 1) + '</small>' + esc(s.chapter) + '</a></li>'; }).join("");

  function setStep(s, k){
    step = k;
    if (s.steps != null){ s.onStep(s.el, k); return; }
    s.builds.forEach(function(b, j){ b.classList.toggle("in", j < k); });
    var r = s.el.querySelector(".roads.in"); if (r && !r._drawn){ r._drawn = 1; draw(r); }
    $$(".roads", s.el).forEach(function(g){ if (!g.classList.contains("in")) g._drawn = 0; });
  }
  function go(i, atEnd){
    if (i < 0 || i >= S.length) return;
    var prev = cur; cur = i;
    S.forEach(function(s, j){
      s.el.classList.toggle("on", j === i); s.el.classList.toggle("past", j < i);
      s.el.setAttribute("aria-hidden", j === i ? "false" : "true");
      if (j === i) s.el.removeAttribute("inert"); else s.el.setAttribute("inert", "");
    });
    var s = S[i];
    s.el.scrollTop = 0;
    setStep(s, atEnd ? s.total : 0);
    if (prev !== i) draw(s.el);
    $("#chapter").textContent = s.chapter;
    $("#count").textContent = (i + 1) + " من " + S.length;
    $("#prog").style.width = ((i + 1) / S.length * 100) + "%";
    $("#prevBtn").disabled = i === 0 && step === 0;
    $("#nextBtn").disabled = i === S.length - 1 && step >= s.total;
    $$("#indexList a").forEach(function(a){ a.classList.toggle("cur", +a.dataset.i === i); });
    try { history.replaceState(null, "", "#s-" + (i + 1)); } catch(e){}
  }
  function next(){
    var s = S[cur];
    if (step < s.total){ setStep(s, step + 1); go2(); }
    else go(cur + 1, false);
  }
  function prev(){
    var s = S[cur];
    if (step > 0){ setStep(s, step - 1); go2(); }
    else go(cur - 1, true);
  }
  function go2(){
    var s = S[cur];
    $("#prevBtn").disabled = cur === 0 && step === 0;
    $("#nextBtn").disabled = cur === S.length - 1 && step >= s.total;
  }

  /* keys: Arabic reading order — the next sheet lies to the left */
  document.addEventListener("keydown", function(e){
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var idx = $("#index");
    if (!idx.hidden){ if (e.key === "Escape") toggleIndex(false); return; }
    if (["ArrowLeft", "PageDown", " ", "Enter"].indexOf(e.key) > -1){ if (e.key === "Enter" && e.target.tagName === "BUTTON") return; e.preventDefault(); next(); }
    else if (["ArrowRight", "PageUp", "Backspace"].indexOf(e.key) > -1){ e.preventDefault(); prev(); }
    else if (e.key === "ArrowDown"){ e.preventDefault(); next(); }
    else if (e.key === "ArrowUp"){ e.preventDefault(); prev(); }
    else if (e.key === "Home"){ e.preventDefault(); go(0); }
    else if (e.key === "End"){ e.preventDefault(); go(S.length - 1, true); }
    else if (e.key === "f" || e.key === "F"){ fullscreen(); }
  });
  $("#nextBtn").addEventListener("click", next);
  $("#prevBtn").addEventListener("click", prev);

  /* swipe: finger moving left→right shows the next sheet (RTL), right→left goes back */
  var x0 = null, y0 = null;
  stage.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", function(e){
    if (x0 == null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4){ if (dx > 0) next(); else prev(); }
  }, { passive: true });

  /* index */
  function toggleIndex(open){
    var idx = $("#index"), btn = $("#indexBtn");
    idx.hidden = !open; btn.setAttribute("aria-expanded", open); btn.textContent = open ? "إغلاق" : "الفهرس";
    if (open){ var a = idx.querySelector("a.cur") || idx.querySelector("a"); a && a.focus(); } else btn.focus();
  }
  $("#indexBtn").addEventListener("click", function(){ toggleIndex($("#index").hidden); });
  $("#indexList").addEventListener("click", function(e){ var a = e.target.closest("a"); if(!a) return; e.preventDefault(); toggleIndex(false); go(+a.dataset.i); });

  /* fullscreen (optional: some views refuse it) */
  function fullscreen(){
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else { var p = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(function(){ $("#fsBtn").hidden = true; }); }
    } catch(e){ $("#fsBtn").hidden = true; }
  }
  if (!document.documentElement.requestFullscreen) $("#fsBtn").hidden = true;
  $("#fsBtn").addEventListener("click", fullscreen);
  document.addEventListener("fullscreenchange", function(){ $("#fsBtn").textContent = document.fullscreenElement ? "خروج من ملء الشاشة" : "ملء الشاشة"; });

  /* start from the hash, if any */
  function fromHash(){ var m = /^#s-(\d+)$/.exec(location.hash); return m ? Math.min(S.length, Math.max(1, +m[1])) - 1 : 0; }
  addEventListener("hashchange", function(){ var i = fromHash(); if (i !== cur) go(i); });
  go(fromHash());
}

document.addEventListener("DOMContentLoaded", function(){
  Y.load("forum").then(function(D){ deck(slides(D)); });
});
})();
