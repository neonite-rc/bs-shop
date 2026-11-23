/* ============================================================
   Brothers & Sisters Gift Shop — collection, filtering, bag & interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Category metadata (soft gift-box palette) ---------- */
  const CATS = {
    collectables:  { label: "Collectables",         t1: "#a9b8c9", t2: "#6d8296" },
    decor:         { label: "Home Decor",           t1: "#a9c7b4", t2: "#6f9a80" },
    hampers:       { label: "Gift Hampers",         t1: "#e2b9b2", t2: "#c98b86" },
    personalised:  { label: "Personalised Gifts",   t1: "#e0cba3", t2: "#b9955f" },
    plush:         { label: "Soft Toys & Plush",    t1: "#d9c3d6", t2: "#a98aa6" },
    keepsakes:     { label: "Keepsakes",            t1: "#b8c9c2", t2: "#7e9b8f" }
  };

  /* ---------- Illustration helpers (self-contained inline SVG) ---------- */
  const A = {
    sage: "#7a9c8a", sageD: "#5f8372", sageL: "#b9cfc0",
    blush: "#dda9a2", blushD: "#c98b86", blushL: "#f2d5cf",
    champ: "#e6cfa4", champD: "#a98857", champL: "#f8edd8",
    cream: "#fbf8f2", white: "#ffffff", bear: "#cfa87e", bearD: "#a9855e",
    ink: "#34423b"
  };
  const SHADOW = '<ellipse cx="100" cy="177" rx="54" ry="8" fill="rgba(38,58,52,.15)"/>';
  const svg = function (inner) {
    return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + inner + '</svg>';
  };
  const flower = function (x, y, r, c) {
    let p = "";
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180;
      const px = (x + Math.cos(a) * r).toFixed(1), py = (y + Math.sin(a) * r).toFixed(1);
      p += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + (r * .62).toFixed(1) + '" ry="' + (r * .42).toFixed(1) + '" transform="rotate(' + (i * 72) + ' ' + px + ' ' + py + ')" fill="' + c + '"/>';
    }
    return p + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .42).toFixed(1) + '" fill="' + A.champL + '"/>';
  };

  const clockTicks = (function () {
    let t = "";
    for (let i = 0; i < 12; i++) {
      const a = i * 30 * Math.PI / 180;
      const x1 = (100 + Math.sin(a) * 34).toFixed(1), y1 = (98 - Math.cos(a) * 34).toFixed(1);
      const x2 = (100 + Math.sin(a) * 41).toFixed(1), y2 = (98 - Math.cos(a) * 41).toFixed(1);
      t += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + A.champD + '" stroke-width="' + (i % 3 === 0 ? 3 : 1.5) + '"/>';
    }
    return t;
  })();

  const webLines = (function () {
    let w = "";
    for (let i = 0; i < 12; i++) {
      const a = i * 30 * Math.PI / 180;
      const x1 = (100 + Math.cos(a) * 36).toFixed(1), y1 = (90 + Math.sin(a) * 36).toFixed(1);
      const x2 = (100 + Math.cos(a + .26) * 12).toFixed(1), y2 = (90 + Math.sin(a + .26) * 12).toFixed(1);
      w += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + A.champD + '" stroke-width="1.2" opacity=".85"/>';
    }
    return w;
  })();

  const leaves = (function () {
    let l = "";
    for (let i = 0; i < 10; i++) {
      l += '<ellipse cx="100" cy="92" rx="9" ry="24" transform="rotate(' + (i * 36) + ' 100 118)" fill="' + (i % 2 ? A.sageL : A.sage) + '" stroke="' + A.sageD + '" stroke-width="1.5"/>';
    }
    return l;
  })();

  /* ---------- Product illustrations ---------- */
  const ART = {
    bell: svg(SHADOW +
      '<circle cx="100" cy="58" r="7" fill="none" stroke="' + A.champD + '" stroke-width="4"/>' +
      '<path d="M100 65v6c-19 6-31 23-31 45 0 8-4 14-10 18h82c-6-4-10-10-10-18 0-22-12-39-31-45z" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="3"/>' +
      '<path d="M69 116h62M76 100h48" stroke="' + A.champD + '" stroke-width="2" opacity=".6"/>' +
      '<circle cx="100" cy="134" r="8" fill="' + A.champD + '"/>' +
      '<circle cx="100" cy="96" r="5" fill="' + A.champD + '"/>'),

    elephant: svg(SHADOW +
      '<path d="M78 146v20M100 148v18M122 146v20M136 140v24" stroke="' + A.sageD + '" stroke-width="11" stroke-linecap="round"/>' +
      '<ellipse cx="106" cy="124" rx="42" ry="30" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<circle cx="70" cy="110" r="23" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<ellipse cx="80" cy="104" rx="12" ry="16" fill="' + A.sage + '" stroke="' + A.sageD + '" stroke-width="2"/>' +
      '<path d="M56 120c-7 8-7 21 1 25 6 3 12-3 9-9" fill="none" stroke="' + A.sageD + '" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="65" cy="104" r="2.6" fill="' + A.ink + '"/>' +
      '<path d="M92 98c18-10 34-8 44 2l-4 10c-14-6-28-6-40 2z" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="2"/>' +
      '<circle cx="108" cy="100" r="2.5" fill="' + A.blushD + '"/><circle cx="122" cy="100" r="2.5" fill="' + A.blushD + '"/>'),

    clock: svg(SHADOW +
      '<circle cx="100" cy="98" r="56" fill="' + A.champL + '" stroke="' + A.champD + '" stroke-width="4"/>' +
      '<circle cx="100" cy="98" r="46" fill="' + A.cream + '" stroke="' + A.sage + '" stroke-width="2"/>' +
      clockTicks +
      '<path d="M100 98V68M100 98l24 14" stroke="' + A.sageD + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="100" cy="98" r="5" fill="' + A.champD + '"/>'),

    vase: svg(SHADOW +
      '<path d="M80 96c-3 20-14 34-14 50 0 17 15 27 34 27s34-10 34-27c0-16-11-30-14-50z" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<path d="M85 105c0 24-9 36-9 46 0 9 11 16 24 16s24-7 24-16c0-10-9-22-9-46z" fill="' + A.sage + '" opacity=".45"/>' +
      '<ellipse cx="100" cy="96" rx="20" ry="6" fill="' + A.sage + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<path d="M100 94C96 72 86 62 73 52M100 94c5-20 16-30 29-38" fill="none" stroke="' + A.sageD + '" stroke-width="3" stroke-linecap="round"/>' +
      flower(72, 50, 10, A.blush) + flower(130, 54, 9, A.champ)),

    candle: svg(SHADOW +
      '<rect x="72" y="82" width="56" height="74" rx="10" fill="' + A.champL + '" stroke="' + A.champD + '" stroke-width="3"/>' +
      '<rect x="78" y="88" width="44" height="62" rx="6" fill="' + A.cream + '"/>' +
      '<path d="M78 126c10-6 18 6 28 0s16-2 16-2v26H78z" fill="' + A.blushL + '"/>' +
      '<ellipse cx="100" cy="82" rx="28" ry="6" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="2"/>' +
      '<rect x="97" y="70" width="6" height="12" rx="2" fill="' + A.ink + '"/>' +
      '<path d="M100 68c-8-9-3-20 0-25 3 5 8 16 0 25z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="2"/>' +
      '<path d="M100 63c-3-4-1-9 0-12 1 3 3 8 0 12z" fill="' + A.champL + '"/>' +
      '<path d="M100 118c-9-6-14-10-14-15a7 7 0 0 1 14-4 7 7 0 0 1 14 4c0 5-5 9-14 15z" fill="' + A.blushL + '" stroke="' + A.blushD + '" stroke-width="1.8"/>'),

    dreamcatcher: svg(
      '<path d="M100 134v12M84 136v10M116 136v10" stroke="' + A.champD + '" stroke-width="2"/>' +
      '<circle cx="100" cy="90" r="44" fill="none" stroke="' + A.champD + '" stroke-width="5"/>' +
      '<circle cx="100" cy="90" r="36" fill="none" stroke="' + A.champD + '" stroke-width="1.5" opacity=".8"/>' +
      webLines +
      '<circle cx="100" cy="90" r="11" fill="none" stroke="' + A.champD + '" stroke-width="1.5"/>' +
      '<circle cx="100" cy="90" r="4" fill="' + A.blush + '"/>' +
      '<path d="M100 148c-9 10-9 22 0 30 9-8 9-20 0-30z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="2"/>' +
      '<path d="M82 146c-9 8-11 18-4 26 8-6 11-16 4-26z" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="2"/>' +
      '<path d="M118 146c9 8 11 18 4 26-8-6-11-16-4-26z" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="2"/>'),

    succulent: svg(SHADOW + leaves +
      '<path d="M70 126h60l-8 44H78z" fill="' + A.blushL + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<path d="M78 142h44" stroke="' + A.blushD + '" stroke-width="1.5" opacity=".5"/>' +
      '<rect x="66" y="118" width="68" height="12" rx="4" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<circle cx="100" cy="114" r="6" fill="' + A.sageD + '"/>'),

    hamper: svg(SHADOW +
      '<path d="M64 106c0-34 72-34 72 0" fill="none" stroke="' + A.champD + '" stroke-width="6"/>' +
      '<rect x="70" y="84" width="24" height="26" rx="3" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="2"/>' +
      '<rect x="106" y="80" width="26" height="30" rx="3" fill="' + A.blushL + '" stroke="' + A.blushD + '" stroke-width="2"/>' +
      '<path d="M56 106h88l-8 60H64z" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="3"/>' +
      '<path d="M60 122h80M61 138h78M63 154h74" stroke="' + A.champD + '" stroke-width="1.5" opacity=".5"/>' +
      '<path d="M82 108v58M118 108v58" stroke="' + A.champD + '" stroke-width="2" opacity=".45"/>' +
      '<path d="M100 108c-16-2-22-14-12-18 8-3 12 8 12 18 0-10 4-21 12-18 10 4 4 16-12 18z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="2"/>' +
      '<circle cx="100" cy="108" r="5" fill="' + A.blushD + '"/>'),

    giftbox: svg(SHADOW +
      '<rect x="56" y="100" width="88" height="64" rx="8" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<rect x="62" y="108" width="76" height="56" rx="5" fill="none" stroke="' + A.white + '" stroke-width="2" opacity=".55"/>' +
      '<rect x="50" y="84" width="100" height="22" rx="6" fill="' + A.sage + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<rect x="94" y="84" width="12" height="80" fill="' + A.champ + '"/>' +
      '<rect x="50" y="92" width="100" height="9" fill="' + A.champL + '" opacity=".9"/>' +
      '<path d="M100 84c-20-2-28-19-16-23 9-3 15 9 16 23 1-14 7-26 16-23 12 4 4 21-16 23z" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="2"/>' +
      '<circle cx="100" cy="84" r="5" fill="' + A.champL + '" stroke="' + A.champD + '" stroke-width="2"/>'),

    frame: svg(SHADOW +
      '<rect x="58" y="46" width="84" height="106" rx="8" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="3"/>' +
      '<rect x="66" y="54" width="68" height="84" rx="4" fill="' + A.cream + '"/>' +
      '<rect x="72" y="60" width="56" height="64" fill="' + A.sageL + '"/>' +
      '<circle cx="120" cy="74" r="7" fill="' + A.champ + '"/>' +
      '<path d="M72 114l16-20 12 14 10-10 18 22z" fill="' + A.sage + '"/>' +
      '<rect x="72" y="128" width="56" height="4" rx="2" fill="' + A.blushL + '"/>' +
      '<path d="M86 140h28" stroke="' + A.champD + '" stroke-width="4" stroke-linecap="round"/>'),

    mug: svg(SHADOW +
      '<path d="M62 80h66v60c0 12-10 20-22 20H84c-12 0-22-8-22-20z" fill="' + A.cream + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<path d="M128 94h8c12 0 12 26 0 26h-8" fill="none" stroke="' + A.sageD + '" stroke-width="6"/>' +
      '<ellipse cx="95" cy="80" rx="33" ry="8" fill="' + A.sageL + '" stroke="' + A.sageD + '" stroke-width="3"/>' +
      '<path d="M95 140c-13-9-21-15-21-24a11 11 0 0 1 21-6 11 11 0 0 1 21 6c0 9-8 15-21 24z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="2"/>'),

    keychain: svg(SHADOW +
      '<circle cx="100" cy="62" r="19" fill="none" stroke="' + A.champD + '" stroke-width="5"/>' +
      '<path d="M100 81v14" stroke="' + A.champD + '" stroke-width="4"/>' +
      '<path d="M100 148c-20-13-30-22-30-33a16 16 0 0 1 30-8 16 16 0 0 1 30 8c0 11-10 20-30 33z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<path d="M92 106c-4-5-12-2-9 4 2 4 9 9 17 15" fill="none" stroke="' + A.champL + '" stroke-width="3" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M100 148v12M94 157v10M106 157v10" stroke="' + A.champD + '" stroke-width="2" stroke-linecap="round"/>'),

    teddy: svg(SHADOW +
      '<circle cx="72" cy="66" r="15" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2.5"/>' +
      '<circle cx="128" cy="66" r="15" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2.5"/>' +
      '<circle cx="72" cy="66" r="8" fill="' + A.blushL + '"/><circle cx="128" cy="66" r="8" fill="' + A.blushL + '"/>' +
      '<ellipse cx="66" cy="128" rx="12" ry="20" transform="rotate(24 66 128)" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2"/>' +
      '<ellipse cx="134" cy="128" rx="12" ry="20" transform="rotate(-24 134 128)" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2"/>' +
      '<ellipse cx="100" cy="136" rx="34" ry="32" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2.5"/>' +
      '<ellipse cx="80" cy="160" rx="13" ry="10" transform="rotate(18 80 160)" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2"/>' +
      '<ellipse cx="120" cy="160" rx="13" ry="10" transform="rotate(-18 120 160)" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2"/>' +
      '<circle cx="100" cy="94" r="29" fill="' + A.bear + '" stroke="' + A.bearD + '" stroke-width="2.5"/>' +
      '<ellipse cx="100" cy="103" rx="13" ry="10" fill="' + A.cream + '"/>' +
      '<ellipse cx="100" cy="99" rx="4.5" ry="3" fill="' + A.ink + '"/>' +
      '<path d="M100 102v5M100 107c-4 4-8 2-8 0M100 107c4 4 8 2 8 0" stroke="' + A.ink + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="89" cy="86" r="2.6" fill="' + A.ink + '"/><circle cx="111" cy="86" r="2.6" fill="' + A.ink + '"/>' +
      '<path d="M86 121c8 6 20 6 28 0" fill="none" stroke="' + A.blushD + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M100 123c-6 0-10-5-6-8 3-2 6 3 6 8 0-5 3-10 6-8 4 3 0 8-6 8z" fill="' + A.blush + '"/>'),

    cushion: svg(SHADOW +
      '<path d="M60 92q40-12 80 0 12 40 0 80-40 12-80 0-12-40 0-80z" fill="' + A.blushL + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<path d="M68 100q32-9 64 0 9 32 0 64-32 9-64 0-9-32 0-64z" fill="none" stroke="' + A.blush + '" stroke-width="2" stroke-dasharray="3 6"/>' +
      '<path d="M100 150c-18-12-28-20-28-31a12 12 0 0 1 28-7 12 12 0 0 1 28 7c0 11-10 19-28 31z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="2"/>' +
      '<path d="M64 174v10M136 174v10M100 174v10" stroke="' + A.champD + '" stroke-width="2" stroke-linecap="round"/>'),

    musicbox: svg(SHADOW +
      '<rect x="58" y="100" width="84" height="58" rx="10" fill="' + A.blushL + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<path d="M58 104q42-48 84 0z" fill="' + A.blush + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<rect x="58" y="116" width="84" height="7" fill="' + A.blushD + '" opacity=".3"/>' +
      '<rect x="94" y="100" width="12" height="58" fill="' + A.champ + '"/>' +
      '<circle cx="100" cy="104" r="7" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="2"/>' +
      '<path d="M100 92V76" stroke="' + A.champD + '" stroke-width="3"/>' +
      '<path d="M100 70l4 6-4 6-4-6z" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="1.5"/>' +
      '<circle cx="76" cy="132" r="3" fill="' + A.champD + '"/><circle cx="124" cy="132" r="3" fill="' + A.champD + '"/>'),

    perfume: svg(SHADOW +
      '<rect x="84" y="72" width="32" height="10" rx="3" fill="' + A.champD + '"/>' +
      '<rect x="88" y="80" width="24" height="18" rx="3" fill="' + A.champ + '" stroke="' + A.champD + '" stroke-width="2"/>' +
      '<rect x="76" y="98" width="48" height="62" rx="12" fill="' + A.blushL + '" stroke="' + A.blushD + '" stroke-width="3"/>' +
      '<path d="M84 106h32" stroke="' + A.blushD + '" stroke-width="2" opacity=".5"/>' +
      '<rect x="82" y="116" width="36" height="30" rx="4" fill="' + A.cream + '" stroke="' + A.champD + '" stroke-width="1.5"/>' +
      '<path d="M100 140c-9-6-14-10-14-15a7 7 0 0 1 14-4 7 7 0 0 1 14 4c0 5-5 9-14 15z" fill="' + A.blush + '"/>')
  };

  /* ---------- Collection (16 demo items) ---------- */
  const MENU = [
    // — Collectables —
    { id: "brass-bell",       name: "Vintage Brass Bell",        cat: "collectables", price: 890,  best: true,  tag: "Handpicked", art: "bell",      desc: "A warm, ringing accent for shelves and desks, polished to a soft shine." },
    { id: "ceramic-elephant", name: "Ceramic Elephant",          cat: "collectables", price: 1190, best: false, tag: "Handpicked", art: "elephant",  desc: "A gently smiling showpiece, said to bring good luck and steady strength." },
    { id: "wall-clock",       name: "Vintage Wall Clock",        cat: "collectables", price: 1390, best: false, tag: "",          art: "clock",     desc: "A quiet, classic clock that feels right at home in any room." },
    // — Home Decor —
    { id: "bud-vase",         name: "Ceramic Bud Vase",          cat: "decor",        price: 649,  best: true,  tag: "Handmade",   art: "vase",      desc: "A little stoneware vase for a single stem or a small bunch of blooms." },
    { id: "candle-jar",       name: "Scented Candle Jar",        cat: "decor",        price: 450,  best: true,  tag: "Handmade",   art: "candle",    desc: "Soft rose and sandalwood in a reusable glass jar. Burns for hours." },
    { id: "dreamcatcher",     name: "Woven Dreamcatcher",        cat: "decor",        price: 599,  best: false, tag: "Handmade",   art: "dreamcatcher", desc: "Delicate threads and soft feathers for a little calm above the bed." },
    { id: "succulent",        name: "Little Succulent Pot",      cat: "decor",        price: 399,  best: false, tag: "",          art: "succulent", desc: "An easy-care green friend in a blush ceramic pot — no green thumb needed." },
    // — Gift Hampers —
    { id: "celebration-hamper", name: "Celebration Gift Hamper", cat: "hampers",      price: 1990, best: true,  tag: "Bestseller", art: "hamper",   desc: "A generous basket of little delights for birthdays, weddings and festivals." },
    { id: "little-joys",      name: "Little Joys Gift Box",      cat: "hampers",      price: 899,  best: false, tag: "",          art: "giftbox",   desc: "A small box of big smiles — thoughtfully picked and beautifully wrapped." },
    // — Personalised Gifts —
    { id: "photo-frame",      name: "Personalised Photo Frame",  cat: "personalised", price: 549,  best: true,  tag: "Personalise", art: "frame",   desc: "Add a name or a short message — a favourite memory, framed just for them." },
    { id: "printed-mug",      name: "Printed Mug",               cat: "personalised", price: 349,  best: false, tag: "Personalise", art: "mug",     desc: "A cosy ceramic mug with a design (and a name) that's theirs alone." },
    { id: "name-keychain",    name: "Name Keychain",             cat: "personalised", price: 299,  best: false, tag: "Personalise", art: "keychain", desc: "A tiny keepsake with a big personal touch — great as a little extra gift." },
    // — Soft Toys & Plush —
    { id: "teddy-bear",       name: "Classic Teddy Bear",        cat: "plush",        price: 799,  best: true,  tag: "Soft & cuddly", art: "teddy",   desc: "Soft, huggable and ever so patient — a favourite for all ages." },
    { id: "heart-cushion",    name: "Plush Heart Cushion",       cat: "plush",        price: 699,  best: false, tag: "Soft & cuddly", art: "cushion", desc: "A squishy heart-shaped cushion that says it without saying a word." },
    // — Keepsakes —
    { id: "music-box",        name: "Rose Gold Music Box",      cat: "keepsakes",    price: 1150, best: false, tag: "Handpicked", art: "musicbox", desc: "Lift the lid for a familiar little tune — a keepsake they'll keep forever." },
    { id: "perfume-set",      name: "Eau de Parfum Gift Set",    cat: "keepsakes",    price: 1690, best: false, tag: "",          art: "perfume",  desc: "A gentle, long-lasting fragrance in a pretty bottle, ready to be gifted." }
  ];

  /* ---------- State & helpers ---------- */
  const state = { cat: "all", q: "" };
  const cart = new Map();

  const store = {
    get() { try { return JSON.parse(localStorage.getItem("bs-gift-bag") || "[]"); } catch (e) { return []; } },
    set(v) { try { localStorage.setItem("bs-gift-bag", JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  store.get().forEach(function (pair) {
    if (MENU.some(function (m) { return m.id === pair[0]; })) cart.set(pair[0], pair[1]);
  });

  const $ = function (s, el) { return (el || document).querySelector(s); };
  const grid = $("#menuGrid"), countEl = $("#resultCount"), emptyEl = $("#emptyState");
  const tabsEl = $("#tabs"), searchInput = $("#searchInput");

  /* ---------- Tabs ---------- */
  const tabDefs = [{ key: "all", label: "All" }].concat(
    Object.keys(CATS).map(function (k) { return { key: k, label: CATS[k].label }; })
  );
  tabsEl.innerHTML = tabDefs.map(function (t) {
    const active = t.key === "all";
    return '<button class="tab' + (active ? " active" : "") + '" data-cat="' + t.key + '" aria-pressed="' + active + '">' + t.label + "</button>";
  }).join("");

  /* ---------- Collection rendering ---------- */
  function stepperHTML(id) {
    const qty = cart.get(id) || 0;
    if (qty === 0) return '<button class="add-btn" data-add="' + id + '">Add&nbsp;+</button>';
    return '<div class="qty-stepper" role="group" aria-label="Quantity for this item">' +
      '<button class="qty-btn" data-dec="' + id + '" aria-label="Decrease quantity">−</button>' +
      '<span class="qty-num">' + qty + '</span>' +
      '<button class="qty-btn" data-inc="' + id + '" aria-label="Increase quantity">+</button>' +
      '</div>';
  }

  function syncCardSteppers() {
    grid.querySelectorAll("[data-stepper]").forEach(function (el) {
      el.innerHTML = stepperHTML(el.dataset.stepper);
    });
  }

  function cardHTML(item) {
    const c = CATS[item.cat];
    return (
      '<article class="card reveal">' +
        '<div class="card-top" style="--t1:' + c.t1 + ";--t2:" + c.t2 + '">' +
          '<div class="card-art">' + (ART[item.art] || "") + '</div>' +
          (item.best ? '<span class="badge-best">★ Bestseller</span>' : "") +
          (item.tag ? '<span class="card-tag">' + item.tag + "</span>" : "") +
        "</div>" +
        '<div class="card-body">' +
          '<div class="card-title-row"><h3>' + item.name + '</h3><span class="price">₹' + item.price + "</span></div>" +
          '<p class="card-desc">' + item.desc + "</p>" +
          '<div class="card-foot">' +
            '<span class="card-cat">' + c.label + "</span>" +
            '<span class="card-step" data-stepper="' + item.id + '">' + stepperHTML(item.id) + '</span>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  let revealObs = null;
  function observeReveals() {
    if (!revealObs) {
      revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("visible"); revealObs.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
    }
    document.querySelectorAll(".reveal:not(.visible)").forEach(function (el) { revealObs.observe(el); });
  }

  function render(animate) {
    if (animate === undefined) animate = true;
    const q = state.q.trim().toLowerCase();
    const items = MENU.filter(function (m) {
      const inCat = state.cat === "all" || m.cat === state.cat;
      const hay = (m.name + " " + m.desc + " " + CATS[m.cat].label).toLowerCase();
      return inCat && (!q || hay.indexOf(q) !== -1);
    });
    grid.innerHTML = items.map(cardHTML).join("");
    emptyEl.hidden = items.length > 0;
    countEl.textContent = "Showing " + items.length + " of " + MENU.length + " gifts";
    if (animate) observeReveals();
    else grid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  tabsEl.addEventListener("click", function (e) {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    tabsEl.querySelectorAll(".tab").forEach(function (t) {
      const on = t === btn;
      t.classList.toggle("active", on);
      t.setAttribute("aria-pressed", on);
    });
    state.cat = btn.dataset.cat;
    render(true);
  });

  searchInput.addEventListener("input", function () {
    state.q = searchInput.value;
    render(false);
  });

  /* ---------- Gift bag (cart) ---------- */
  const drawer = $("#cartDrawer"), overlay = $("#overlay"), drawerItems = $("#drawerItems");
  const cartCount = $("#cartCount"), cartTotal = $("#cartTotal"), deliveryNote = $("#deliveryNote");
  const drawerEmpty = $("#drawerEmpty"), drawerFoot = $("#drawerFoot");
  const drawerCount = $("#drawerCount");
  const cartBar = $("#cartBar"), cartBarCount = $("#cartBarCount"), cartBarTotal = $("#cartBarTotal");
  const FREE_DELIVERY = 999;

  function saveCart() { store.set(Array.from(cart.entries())); }

  function openDrawer() { drawer.classList.add("open"); overlay.classList.add("show"); document.body.classList.add("tray-open"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { drawer.classList.remove("open"); overlay.classList.remove("show"); document.body.classList.remove("tray-open"); document.body.style.overflow = ""; }

  $("#cartOpenBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#cartBarView").addEventListener("click", openDrawer);
  overlay.addEventListener("click", closeDrawer);

  function updateCartUI(pulse) {
    const count = Array.from(cart.values()).reduce(function (a, b) { return a + b; }, 0);
    let total = 0;
    cart.forEach(function (qty, id) {
      const m = MENU.find(function (x) { return x.id === id; });
      if (m) total += m.price * qty;
    });

    cartCount.hidden = count === 0;
    cartCount.textContent = count;
    if (pulse && count > 0) {
      cartCount.classList.remove("pulse");
      void cartCount.offsetWidth;
      cartCount.classList.add("pulse");
    }

    drawerCount.hidden = count === 0;
    drawerCount.textContent = count + (count === 1 ? " item" : " items");

    cartBarCount.textContent = count + (count === 1 ? " item" : " items");
    cartBarTotal.textContent = "₹" + total;
    cartBar.hidden = count === 0;
    document.body.classList.toggle("cart-bar-visible", count > 0);
    syncCardSteppers();

    if (cart.size === 0) {
      drawerItems.querySelectorAll(".drawer-item").forEach(function (el) { el.remove(); });
      drawerEmpty.hidden = false;
      drawerFoot.hidden = true;
      return;
    }
    drawerEmpty.hidden = true;
    drawerFoot.hidden = false;

    const rows = Array.from(cart.entries()).map(function (pair) {
      const m = MENU.find(function (x) { return x.id === pair[0]; });
      const qty = pair[1];
      const c = CATS[m.cat];
      return (
        '<div class="drawer-item" data-id="' + m.id + '">' +
          '<span class="di-dot" style="background:linear-gradient(135deg,' + c.t1 + "," + c.t2 + ')"></span>' +
          '<div class="di-info"><strong>' + m.name + "</strong><span>₹" + m.price + " each</span></div>" +
          '<div class="di-qty">' +
            '<button data-act="dec" aria-label="Decrease quantity">−</button>' +
            "<span>" + qty + "</span>" +
            '<button data-act="inc" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<span class="di-price">₹' + (m.price * qty) + "</span>" +
        "</div>"
      );
    });
    drawerItems.querySelectorAll(".drawer-item").forEach(function (el) { el.remove(); });
    drawerItems.insertAdjacentHTML("beforeend", rows.join(""));

    cartTotal.textContent = "₹" + total;
    if (total >= FREE_DELIVERY) {
      deliveryNote.textContent = "🎁 You've unlocked free delivery!";
      deliveryNote.classList.add("free");
    } else {
      deliveryNote.textContent = "Add ₹" + (FREE_DELIVERY - total) + " more for free delivery";
      deliveryNote.classList.remove("free");
    }
  }

  function changeQty(id, delta) {
    const cur = cart.get(id) || 0;
    const next = cur + delta;
    if (next <= 0) cart.delete(id); else cart.set(id, next);
    saveCart();
    updateCartUI(delta > 0);
    if (delta > 0 && cur === 0) {
      const item = MENU.find(function (m) { return m.id === id; });
      toast(item.name.split("·")[0].trim() + " added to your bag");
    }
  }

  grid.addEventListener("click", function (e) {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) { changeQty(addBtn.dataset.add, 1); return; }
    const incBtn = e.target.closest("[data-inc]");
    if (incBtn) { changeQty(incBtn.dataset.inc, 1); return; }
    const decBtn = e.target.closest("[data-dec]");
    if (decBtn) { changeQty(decBtn.dataset.dec, -1); return; }
  });

  drawerItems.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.closest(".drawer-item").dataset.id;
    if (btn.dataset.act === "inc") cart.set(id, cart.get(id) + 1);
    else {
      const q = cart.get(id) - 1;
      if (q <= 0) cart.delete(id); else cart.set(id, q);
    }
    saveCart();
    updateCartUI(false);
  });

  $("#checkoutBtn").addEventListener("click", function () {
    if (cart.size === 0) return;
    const items = Array.from(cart.entries()).map(function (pair) {
      const m = MENU.find(function (x) { return x.id === pair[0]; });
      return { name: m.name, qty: pair[1], price: m.price, cat: m.cat };
    });
    const total = items.reduce(function (a, i) { return a + i.price * i.qty; }, 0);
    const orderId = "BS-" + Math.floor(1000 + Math.random() * 9000);
    closeDrawer();
    cart.clear();
    saveCart();
    updateCartUI(false);
    startOrderFlow(items, total, orderId);
  });

  /* ---------- Toast ---------- */
  const toastWrap = $("#toastWrap");
  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="tick">✓</span><span></span>';
    el.lastElementChild.textContent = msg;
    toastWrap.appendChild(el);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  }

  /* ---------- Header, scroll-spy, back-to-top ---------- */
  const header = $("#siteHeader"), toTop = $("#toTop");
  const navLinkEls = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  const sections = navLinkEls
    .map(function (a) { return $(a.getAttribute("href")); })
    .filter(Boolean);

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        navLinkEls.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { spy.observe(s); });

  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 10);
    toTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });

  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#navToggle"), navLinksEl = $("#navLinks");
  function closeMobileNav() {
    navLinksEl.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", function () {
    const open = navLinksEl.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinksEl.addEventListener("click", function (e) { if (e.target.closest("a")) closeMobileNav(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeDrawer(); closeMobileNav(); if (!orderFlow.hidden) closeOrderFlow(); }
  });

  /* ---------- Contact form ---------- */
  $("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    toast("Thank you! We'll get back to you soon.");
    form.reset();
  });

  /* ---------- Connect & shop placeholders ---------- */
  document.querySelectorAll(".connect-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      toast(card.dataset.name + " link to be added — demo storefront");
    });
  });

  /* ============================================================
     Order flow — gift wrapping animation + live tracking + chat
     ============================================================ */

  /* Packing-scene SVGs */
  const BOX_SVG = '<svg viewBox="0 0 360 280" aria-hidden="true">' +
    '<g class="box-lid"><rect x="126" y="150" width="108" height="28" rx="4" fill="#b9cfc0" stroke="#5f8372" stroke-width="2"/><rect x="172" y="150" width="16" height="28" fill="#e6cfa4"/></g>' +
    '<rect x="128" y="176" width="104" height="76" rx="6" fill="#a9c7b4" stroke="#5f8372" stroke-width="2"/>' +
    '<rect x="174" y="176" width="12" height="76" fill="#e6cfa4"/>' +
    '<line x1="131" y1="198" x2="229" y2="198" stroke="#5f8372" stroke-width="1.4" opacity=".45"/>' +
    '<g class="box-sticker"><circle cx="180" cy="218" r="15" fill="#e6cfa4" stroke="#a98857" stroke-width="2"/><text x="180" y="224" text-anchor="middle" font-size="12" font-family="Georgia,serif" font-weight="700" fill="#355044">B&amp;S</text></g>' +
    '</svg>';

  const BAGBACK_SVG = '<svg viewBox="0 0 360 280" aria-hidden="true">' +
    '<ellipse cx="180" cy="277" rx="86" ry="7" fill="rgba(38,58,52,.22)"/>' +
    '<path d="M148 154c0-26 64-26 64 0" fill="none" stroke="#e6cfa4" stroke-width="6" stroke-linecap="round"/>' +
    '<rect x="124" y="150" width="112" height="128" rx="8" fill="#7a9c8a" stroke="#5f8372" stroke-width="2"/>' +
    '<line x1="126" y1="178" x2="234" y2="178" stroke="#5f8372" stroke-width="2" opacity=".55"/>' +
    '</svg>';

  const BAGFRONT_SVG = '<svg viewBox="0 0 360 280" aria-hidden="true">' +
    '<rect x="120" y="206" width="120" height="74" rx="8" fill="#4a685a"/>' +
    '<rect x="120" y="206" width="120" height="9" fill="#355044"/>' +
    '<path d="M180 220l5.5 5.5-5.5 5.5-5.5-5.5z" fill="#e6cfa4"/>' +
    '<text x="180" y="246" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1.6" fill="#e6cfa4">BROTHERS &amp; SISTERS</text>' +
    '<text x="180" y="262" text-anchor="middle" font-size="7.5" letter-spacing="3.5" fill="#f8edd8">GIFT SHOP</text>' +
    '</svg>';

  const SCOOTER_SVG = '<svg viewBox="0 0 360 280" aria-hidden="true"><g class="scooter">' +
    '<rect x="304" y="192" width="42" height="36" rx="5" fill="#4a685a" stroke="#e6cfa4" stroke-width="2"/>' +
    '<text x="325" y="215" font-size="11" font-family="Georgia,serif" font-weight="700" fill="#e6cfa4" text-anchor="middle">B&amp;S</text>' +
    '<path d="M246 252c8-24 32-34 58-32l32 5c15 2 24 11 24 22l-5 7H252z" fill="#7a9c8a"/>' +
    '<rect x="250" y="214" width="42" height="9" rx="4.5" fill="#355044"/>' +
    '<path d="M262 216c-3-20 7-33 23-35l15 3c11 2 15 11 12 22l-5 12z" fill="#e6cfa4"/>' +
    '<circle cx="286" cy="177" r="12" fill="#f8edd8" stroke="#a98857" stroke-width="2"/>' +
    '<path d="M294 199l-24 15" stroke="#e6cfa4" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M262 216l-14-6" stroke="#355044" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="266" cy="257" r="15" fill="#263a34" stroke="#e6cfa4" stroke-width="3"/><circle cx="266" cy="257" r="5" fill="#e6cfa4"/>' +
    '<circle cx="330" cy="257" r="15" fill="#263a34" stroke="#e6cfa4" stroke-width="3"/><circle cx="330" cy="257" r="5" fill="#e6cfa4"/>' +
    '</g></svg>';

  const BAG_SVG = '<svg viewBox="0 0 120 132" aria-hidden="true">' +
    '<path d="M40 36c0-18 40-18 40 0" fill="none" stroke="#e6cfa4" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M22 36h76l-6 92H28z" fill="#7a9c8a" stroke="#5f8372" stroke-width="2"/>' +
    '<path d="M22 36h76l-1.6 12H23.6z" fill="#5f8372"/>' +
    '<circle cx="60" cy="62" r="7" fill="none" stroke="#e6cfa4" stroke-width="2.5"/><circle cx="60" cy="62" r="2" fill="#e6cfa4"/>' +
    '<text x="60" y="92" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1" fill="#e6cfa4">B&amp;S</text>' +
    '<text x="60" y="106" text-anchor="middle" font-size="6.5" letter-spacing="2.6" fill="#f8edd8">GIFT SHOP</text>' +
    '</svg>';

  const STEPS = [
    { title: "Order placed",        sub: "We've received your order" },
    { title: "Packing your gifts",  sub: "Choosing the finest wrapping" },
    { title: "Wrapped & ribboned",  sub: "A little note tucked in, too" },
    { title: "Ready for handover",  sub: "Handed to our delivery partner" },
    { title: "Out for delivery",    sub: "On its way to your doorstep" },
    { title: "Delivered",           sub: "Hope it brings a smile!" }
  ];

  const CHAT_LINES = [
    "Psst… where are we going?",
    "I hope they love us!",
    "Is it someone's birthday?",
    "Can't wait to be unwrapped!"
  ];

  const orderFlow = $("#orderFlow"), ofSceneWrap = $("#ofSceneWrap"), ofScene = $("#ofScene");
  const ofTrack = $("#ofTrack"), ofCaption = $("#ofCaption");
  const pBagGroup = $("#pBagGroup"), pBox = $("#pBox"), pBagBack = $("#pBagBack"), pBagFront = $("#pBagFront"), pScooter = $("#pScooter");
  const ofSteps = $("#ofSteps"), ofOrderId = $("#ofOrderId"), ofStatusTitle = $("#ofStatusTitle"), ofStatusSub = $("#ofStatusSub");
  const ofEtaChip = $("#ofEtaChip"), ofCountdown = $("#ofCountdown"), ofCountChip = $("#ofCountChip");
  const ofBagWrap = $("#ofBagWrap"), ofBubble = $("#ofBubble"), ofBubbleText = $("#ofBubbleText"), ofTyping = $("#ofTyping"), ofChatHint = $("#ofChatHint");
  const ofSummary = $("#ofSummary");

  const orderTimers = { timeouts: [], intervals: [] };
  let orderSpeakers = [];
  let etaSecs = 35 * 60;
  let cdInterval = null;

  function clearOrderTimers() {
    orderTimers.timeouts.forEach(clearTimeout);
    orderTimers.intervals.forEach(clearInterval);
    orderTimers.timeouts = [];
    orderTimers.intervals = [];
    if (cdInterval) { clearInterval(cdInterval); cdInterval = null; }
  }

  function openOrderFlow() { orderFlow.hidden = false; document.body.classList.add("order-open"); }
  function closeOrderFlow() {
    clearOrderTimers();
    orderFlow.hidden = true;
    document.body.classList.remove("order-open");
  }

  function setCaption(t) {
    ofCaption.style.opacity = "0";
    orderTimers.timeouts.push(setTimeout(function () {
      ofCaption.textContent = t;
      ofCaption.style.opacity = "1";
    }, 220));
  }

  function markStep(doneCount) {
    ofSteps.querySelectorAll(".of-step").forEach(function (li, idx) {
      li.classList.toggle("done", idx < doneCount);
      li.classList.toggle("active", idx === doneCount && doneCount < STEPS.length);
      li.classList.toggle("todo", idx > doneCount);
    });
  }

  function setStatus(i) {
    ofStatusTitle.textContent = STEPS[i].title;
    ofStatusSub.textContent = STEPS[i].sub;
  }

  function buildSceneItems(items) {
    ofScene.querySelectorAll(".p-item").forEach(function (el) { el.remove(); });
    const sxs = [-128, -86, -43, 0, 43, 86, 128];
    items.slice(0, 7).forEach(function (it, i) {
      const d = document.createElement("div");
      d.className = "p-item";
      d.style.setProperty("--sx", sxs[i] + "px");
      d.style.animationDelay = (0.15 + i * 0.2) + "s";
      d.innerHTML = ART[it.art] || "";
      ofScene.appendChild(d);
    });
    if (items.length > 7) {
      const more = document.createElement("div");
      more.className = "p-item p-more";
      more.style.setProperty("--sx", "0px");
      more.style.animationDelay = (0.15 + 7 * 0.2) + "s";
      more.textContent = "+" + (items.length - 7) + " more";
      ofScene.appendChild(more);
    }
  }

  function buildTracking(items, total, orderId) {
    ofOrderId.textContent = "#" + orderId;
    ofEtaChip.textContent = "~35 min";
    etaSecs = 35 * 60;
    ofCountdown.textContent = "35:00";
    ofSteps.innerHTML = STEPS.map(function (s) {
      return '<li class="of-step todo"><span class="of-dot"></span><div><strong>' + s.title + '</strong><span>' + s.sub + '</span></div></li>';
    }).join("");
    ofBagWrap.querySelectorAll("svg").forEach(function (el) { el.remove(); });
    ofBagWrap.insertAdjacentHTML("beforeend", BAG_SVG);
    ofBubble.hidden = true;
    ofBubbleText.textContent = "";
    ofTyping.style.display = "none";
    ofChatHint.textContent = "💬 Your gifts start chatting in about 2 minutes…";
    ofChatHint.classList.remove("live");
    ofBagWrap.classList.remove("chatting");
    const count = items.reduce(function (a, i) { return a + i.qty; }, 0);
    ofCountChip.textContent = count + (count === 1 ? " item" : " items");
    ofCountChip.hidden = false;
    ofSummary.innerHTML =
      '<p class="of-sum-head">' + count + (count === 1 ? " item" : " items") + " · ₹" + total + "</p>" +
      items.map(function (i) {
        return '<div class="of-row"><span class="di-dot"></span><span class="of-row-name">' + i.name + '</span><span class="of-row-qty">× ' + i.qty + '</span><span class="of-row-price">₹' + (i.price * i.qty) + "</span></div>";
      }).join("") +
      '<div class="of-row of-row-total"><span class="of-row-name">Total</span><span class="of-row-price">₹' + total + "</span></div>";
  }

  function startCountdown() {
    if (cdInterval) clearInterval(cdInterval);
    cdInterval = setInterval(function () {
      etaSecs = Math.max(0, etaSecs - 1);
      const m = String(Math.floor(etaSecs / 60)).padStart(2, "0");
      const s = String(etaSecs % 60).padStart(2, "0");
      ofCountdown.textContent = m + ":" + s;
    }, 1000);
    orderTimers.intervals.push(cdInterval);
  }

  function sayLine(idx) {
    const speaker = orderSpeakers.length ? orderSpeakers[Math.floor(Math.random() * orderSpeakers.length)] : "A little gift";
    ofBubbleText.innerHTML = "";
    const b = document.createElement("strong");
    b.textContent = speaker + ": ";
    ofBubbleText.appendChild(b);
    ofBubbleText.appendChild(document.createTextNode(CHAT_LINES[idx % CHAT_LINES.length]));
    ofBubble.classList.remove("pop");
    void ofBubble.offsetWidth;
    ofBubble.classList.add("pop");
  }

  function startChat() {
    ofChatHint.textContent = "Shh… the gifts inside are chatting…";
    ofChatHint.classList.add("live");
    ofBagWrap.classList.add("chatting");
    ofBubble.hidden = false;
    ofTyping.style.display = "inline-flex";
    ofBubbleText.textContent = "";
    orderTimers.timeouts.push(setTimeout(function () {
      ofTyping.style.display = "none";
      sayLine(0);
      let idx = 0;
      const iv = setInterval(function () {
        idx = (idx + 1) % CHAT_LINES.length;
        sayLine(idx);
      }, 4500);
      orderTimers.intervals.push(iv);
    }, 1400));
  }

  function showTracking() {
    ofSceneWrap.hidden = true;
    ofTrack.hidden = false;
    markStep(4);
    setStatus(4);
    startCountdown();
    orderTimers.timeouts.push(setTimeout(startChat, 120000));
    orderTimers.timeouts.push(setTimeout(function () {
      markStep(STEPS.length);
      setStatus(STEPS.length - 1);
      ofEtaChip.textContent = "Delivered ✓";
      if (cdInterval) { clearInterval(cdInterval); cdInterval = null; }
      ofCountdown.textContent = "00:00";
      ofChatHint.textContent = "Your gifts made it. Hope they bring a smile! 🎉";
      ofBubbleText.innerHTML = "";
      const b = document.createElement("strong");
      b.textContent = "The gifts: ";
      ofBubbleText.appendChild(b);
      ofBubbleText.appendChild(document.createTextNode("We made it! Enjoy!"));
      ofBubble.classList.remove("pop");
      void ofBubble.offsetWidth;
      ofBubble.classList.add("pop");
    }, 200000));
  }

  function startOrderFlow(items, total, orderId) {
    orderSpeakers = [];
    items.forEach(function (i) {
      const n = i.name.split("·")[0].trim();
      if (orderSpeakers.indexOf(n) === -1 && orderSpeakers.length < 4) orderSpeakers.push(n);
    });
    buildTracking(items, total, orderId);
    buildSceneItems(items);
    pBox.classList.remove("sealed");
    pBagGroup.classList.remove("bagged", "handover", "exit");
    pScooter.classList.remove("in", "exit");
    ofSceneWrap.hidden = false;
    ofTrack.hidden = true;
    const itemCount = items.reduce(function (a, i) { return a + i.qty; }, 0);
    ofCaption.textContent = "Wrapping your " + itemCount + (itemCount === 1 ? " gift" : " gifts") + "…";
    ofCaption.style.opacity = "1";
    openOrderFlow();
    markStep(1);
    setStatus(1);

    orderTimers.timeouts.push(setTimeout(function () {
      pBox.classList.add("sealed");
      setCaption("Tying the ribbon…");
      markStep(2);
    }, 2200));
    orderTimers.timeouts.push(setTimeout(function () {
      pBagGroup.classList.add("bagged");
      setCaption("Adding a little note…");
      markStep(3);
    }, 3000));
    orderTimers.timeouts.push(setTimeout(function () {
      pScooter.classList.add("in");
      setCaption("Our delivery partner is arriving…");
    }, 3600));
    orderTimers.timeouts.push(setTimeout(function () {
      pBagGroup.classList.add("handover");
      setCaption("Handing over your gifts…");
      markStep(4);
    }, 4300));
    orderTimers.timeouts.push(setTimeout(function () {
      pScooter.classList.add("exit");
      pBagGroup.classList.add("exit");
      setCaption("On the way to you!");
    }, 5200));
    orderTimers.timeouts.push(setTimeout(showTracking, 6200));
  }

  $("#ofDone").addEventListener("click", function () {
    closeOrderFlow();
    toast("Order placed — hope you love your gifts!");
  });

  $("#ofContact").addEventListener("click", function () {
    closeOrderFlow();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Init ---------- */
  pBox.innerHTML = BOX_SVG;
  pBagBack.innerHTML = BAGBACK_SVG;
  pBagFront.innerHTML = BAGFRONT_SVG;
  pScooter.innerHTML = SCOOTER_SVG;
  render(true);
  updateCartUI(false);
})();
