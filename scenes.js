/* Line scenes for each space of the venue walk — the site's single drawing hand:
   gold line, round caps, no fills. Presentation only; which space exists comes from the data layer. */
(function(){
"use strict";
function f(n){ return Math.round(n * 10) / 10; }
/* standing person: head + shoulders + legs */
function P(x, y, h){
  var r = h * .1, w = h * .17;
  return '<circle cx="' + f(x) + '" cy="' + f(y - h + r) + '" r="' + f(r) + '"/>' +
    '<path d="M' + f(x - w) + ' ' + f(y - h * .42) + ' Q' + f(x - w) + ' ' + f(y - h * .74) + ' ' + f(x) + ' ' + f(y - h * .74) +
    ' Q' + f(x + w) + ' ' + f(y - h * .74) + ' ' + f(x + w) + ' ' + f(y - h * .42) +
    ' M' + f(x - w * .5) + ' ' + f(y - h * .5) + ' V' + f(y) + ' M' + f(x + w * .5) + ' ' + f(y - h * .5) + ' V' + f(y) + '"/>';
}
/* seated person (upper body), seat height y */
function S(x, y, h){
  var r = h * .16, w = h * .26;
  return '<circle cx="' + f(x) + '" cy="' + f(y - h + r) + '" r="' + f(r) + '"/>' +
    '<path d="M' + f(x - w) + ' ' + f(y) + ' Q' + f(x - w) + ' ' + f(y - h * .6) + ' ' + f(x) + ' ' + f(y - h * .6) +
    ' Q' + f(x + w) + ' ' + f(y - h * .6) + ' ' + f(x + w) + ' ' + f(y) + '"/>';
}
function heads(y0, y1, n, x0, x1, r){ /* audience along an arc */
  var s = "";
  for (var i = 0; i < n; i++){ var t = i / (n - 1), x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * 4 * t * (1 - t);
    s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + r + '"/>'; }
  return s;
}
var FLOOR = '<path d="M8 186 H312"/>';

var SC = {
  entry:
    FLOOR + '<path d="M70 186 V92 A90 90 0 0 1 250 92 V186"/><path d="M96 186 V100 A64 64 0 0 1 224 100 V186"/>' +
    '<path d="M118 62 H202 V80 H118 Z M128 71 H192"/>' +
    '<path d="M232 186 V150 H300 V186 M232 150 L240 140 H292 L300 150"/>' +
    P(150, 186, 62) + P(176, 186, 56) + P(122, 186, 50) + P(266, 150, 30),
  foyer:
    FLOOR + '<path d="M18 186 V92 H106 V186 M18 104 H106"/><rect x="34" y="118" width="56" height="34" rx="2"/>' +
    '<path d="M122 186 V84 H210 V186 M122 96 H210"/><rect x="138" y="112" width="56" height="40" rx="2"/>' +
    '<path d="M226 186 V92 H306 V186 M226 104 H306"/><path d="M244 160 H288 V186 M244 160 V186"/>' +
    P(62, 186, 44) + P(110, 186, 58) + P(166, 186, 40) + P(216, 186, 54) + P(266, 186, 38),
  arkno:
    '<rect x="96" y="22" width="128" height="62" rx="2"/><path d="M110 70 C140 40 170 60 210 34"/>' +
    '<path d="M20 112 H300 L310 124 H10 Z"/><path d="M146 112 V96 H166 V112"/>' + P(184, 112, 34) +
    '<path d="M24 150 Q160 138 296 150 M16 170 Q160 156 304 170 M10 190 Q160 174 310 190"/>' +
    heads(146, 140, 15, 34, 286, 3.4) + heads(166, 158, 17, 26, 294, 3.8) + heads(186, 176, 19, 18, 302, 4.2),
  qurina:
    FLOOR + '<path d="M30 140 H290 M44 140 V186 M276 140 V186"/>' +
    '<rect x="56" y="112" width="40" height="22" rx="3"/><circle cx="64" cy="138" r="4"/><circle cx="88" cy="138" r="4"/><path d="M76 112 V100 M70 100 H82"/>' +
    '<path d="M130 140 L138 122 H170 L166 140"/>' + '<rect x="214" y="48" width="84" height="56" rx="2"/><path d="M256 104 V140 M226 92 L246 72 L262 84 L286 60"/>' +
    S(124, 140, 46) + S(184, 140, 50) + P(200, 186, 44),
  mafu:
    '<path d="M20 150 H180 V160 H20 Z"/><rect x="104" y="40" width="88" height="62" rx="2"/>' +
    '<path d="M118 92 V80 M134 92 V70 M150 92 V60 M166 92 V52 M180 92 V46"/>' + P(70, 150, 66) +
    '<path d="M200 168 H312 M210 168 V190 M302 168 V190"/>' + S(224, 168, 34) + S(256, 168, 36) + S(288, 168, 34) +
    '<path d="M8 190 H312"/>',
  kabau:
    FLOOR + '<rect x="20" y="40" width="112" height="70" rx="2"/><path d="M34 60 H96 M34 74 H118 M34 88 H84 M100 92 L116 100"/>' +
    P(150, 186, 70) + '<path d="M176 150 H246 M186 150 V186 M236 150 V186"/>' + S(196, 150, 34) + S(226, 150, 34) +
    '<path d="M262 150 H312"/>' + S(276, 150, 30) + S(302, 150, 30),
  ghaba:
    FLOOR + '<path d="M28 186 L44 120 L60 186 M44 120 V112"/><rect x="30" y="94" width="30" height="20" rx="3"/><path d="M60 100 L72 96 V110 L60 106"/>' +
    '<path d="M270 186 V96 M244 78 L270 96 L296 78 Z"/>' +
    '<path d="M96 186 V146 Q96 132 110 132 H132 Q144 132 144 146 V186 M96 160 H144"/>' + S(120, 156, 40) +
    '<path d="M196 186 V146 Q196 132 210 132 H232 Q244 132 244 146 V186 M196 160 H244"/>' + S(220, 156, 40) +
    '<path d="M150 172 H190 M170 172 V186 M158 186 H182"/><path d="M146 146 V130 M194 146 V130"/>',
  vip:
    FLOOR + '<path d="M40 186 V140 Q40 120 60 120 H200 Q220 120 220 140 V186 M40 156 H220"/>' + S(90, 152, 40) + S(160, 152, 40) +
    '<path d="M236 168 H286 M246 168 V186 M276 168 V186"/>' +
    '<path d="M298 186 V120 M298 140 Q282 130 278 116 M298 132 Q312 124 314 110 M298 152 Q312 146 314 134"/>'
};
window.SCENE = function(id){
  return SC[id] ? '<svg class="draw scene" viewBox="0 0 320 200" aria-hidden="true">' + SC[id] + '</svg>' : "";
};
})();
