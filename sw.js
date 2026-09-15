/* 🐺 幼童軍團集會助手 — Service Worker (offline first，cache齊) */
var CACHE = "cubhub-v37-exam-papers-20260915";
var ASSETS = [
  "./", "./index.html", "./manifest.webmanifest", "./css/app.css",
  "./js/data.js", "./js/guide.js", "./js/flow.js", "./js/app.js", "./js/redesign.js", "./js/content.js", "./js/jungle-data.js", "./js/jungle.js", "./js/practical-data.js", "./js/practical.js", "./js/uniform-ceremony.js", "./js/field-visuals.js", "./js/salute-lab.js", "./js/salute-positions.js", "./js/tracking-kit.js", "./js/material-desk.js", "./js/plain-content.js", "./js/worksheet-guides.js", "./js/exam-papers.js", "./js/skill-art.js", "./js/craft-sheets.js", "./js/songbook.js",
  "./assets/manual/official.avif", "./assets/manual/catalog.avif", "./assets/manual/handbook.avif", "./assets/manual/ceremony.avif", "./assets/manual/games.avif", "./assets/manual/craft.avif", "./assets/manual/songs.avif", "./assets/manual/safety.avif",
  "./assets/manual/details/six-colors.avif", "./assets/manual/details/leader-roles.avif", "./assets/manual/details/sixer-training.avif", "./assets/manual/details/pack-call-hands.avif", "./assets/manual/details/flag-steps.avif", "./assets/manual/details/oath.avif", "./assets/manual/details/knots.avif", "./assets/manual/details/tracking-symbols.avif", "./assets/manual/details/first-aid.avif", "./assets/manual/details/map-compass.avif", "./assets/manual/details/campfire-circle.avif", "./assets/manual/details/cooking.avif", "./assets/manual/details/friendship-bracelet.avif", "./assets/manual/details/ram-checklist.avif", "./assets/manual/details/recycled-paper.avif", "./assets/manual/details/sfh-principles.avif", "./assets/manual/details/sharing-circle.avif", "./assets/manual/details/weather.avif",
  "./assets/skills/backpack-scene.avif",
  "./assets/skills/beanbag-scene.avif",
  "./assets/skills/boundary-scene.avif",
  "./assets/skills/circle-paper-scene.avif",
  "./assets/skills/cup-tower-scene.avif",
  "./assets/skills/handover-scene.avif",
  "./assets/skills/help-call-scene.avif",
  "./assets/skills/help-steps-scene.avif",
  "./assets/skills/knot-choose.avif",
  "./assets/skills/overhand.avif",
  "./assets/skills/reef.avif",
  "./assets/skills/senses-scene.avif",
  "./assets/skills/snack-box-scene.avif",
  "./assets/skills/wound-scene.avif",
  "./assets/skills/nosebleed-scene.avif",
  "./assets/skills/promise-reading-scene.avif",
  "./assets/skills/group-card-scene.avif",
  "./assets/skills/festival-discovery-scene.avif",
  "./assets/skills/next-questions-scene.avif",
  "./assets/skills/ask-leader-scene.avif",
  "./assets/skills/food-check-scene.avif",
  "./assets/skills/snack-tidy-scene.avif",
  "./assets/skills/hike-kit-scene.avif",
  "./assets/skills/exploration-art-scene.avif",
  "./assets/skills/tracking-walk-scene.avif",
  "./assets/skills/help-practice-scene.avif",
  "./assets/skills/gentle-warmup-scene.avif",
  "./assets/skills/helping-review-scene.avif",
  "./assets/skills/community-manners-scene.avif",
  "./assets/skills/model-plan-scene.avif",
  "./assets/skills/waste-choice-scene.avif",
  "./assets/skills/waste-week-scene.avif",
  "./assets/skills/bridge-report-scene.avif",
  "./assets/skills/park-facility-scene.avif",
  "./assets/skills/kit-choice-scene.avif",
  "./assets/skills/card-making-scene.avif",
  "./assets/skills/festival-art-scene.avif",
  "./assets/skills/festival-safety-scene.avif",
  "./assets/skills/departure-check-scene.avif",
  "./assets/skills/return-check-scene.avif",
  "./assets/skills/weather-stop-scene.avif",
  "./assets/skills/activity-clothes-scene.avif",
  "./assets/skills/safe-helping-scene.avif",
  "./assets/skills/help-network-scene.avif",
  "./assets/skills/kindness-scene.avif",
  "./assets/reference/cub-uniform-boy.avif", "./assets/reference/cub-uniform-girl.avif",
  "./assets/reference/cub-badge-map-2025.avif",
  "./assets/reference/rally-flag-party-2025.avif",
  "./assets/jungle/slides/jungle-night-tiger.avif",
  "./assets/jungle/slides/jungle-wolf-carry.avif",
  "./assets/jungle/slides/jungle-tiger-cave.avif",
  "./assets/jungle/slides/jungle-den-family.avif",
  "./assets/jungle/slides/jungle-council.avif",
  "./assets/jungle/slides/jungle-presented.avif",
  "./assets/jungle/slides/jungle-water-snake.avif",
  "./assets/jungle/slides/jungle-monkeys.avif",
  "./assets/jungle/slides/jungle-kite-message.avif",
  "./assets/jungle/slides/jungle-baloo-lesson.avif",
  "./assets/jungle/slides/jungle-bees-bat.avif",
  "./assets/jungle/slides/jungle-hunting-grounds.avif",
  "./assets/jungle/slides/jungle-kaa-rescue.avif",
  "./assets/jungle/slides/jungle-forest-rules.avif",
  "./assets/jungle/slides/jungle-pack-split.avif",
  "./assets/jungle/slides/jungle-red-flower.avif",
  "./assets/jungle/slides/jungle-farewell.avif",
  "./assets/jungle/slides/jungle-village.avif",
  "./assets/jungle/slides/jungle-two-homes.avif",
  "./assets/jungle/slides/jungle-faceoff.avif",
  "./assets/jungle/slides/jungle-fire-branch.avif",
  "./assets/jungle/slides/jungle-tiger-return.avif",
  "./assets/jungle/slides/jungle-herd-plan.avif",
  "./assets/jungle/slides/jungle-carry-on.avif",
  "./assets/teaching/right-hand-salute.avif",
  "./icons/icon-192.png", "./icons/icon-512.png",
  "./assets/jungle/mowgli.avif", "./assets/jungle/raksha.avif", "./assets/jungle/akela.avif", "./assets/jungle/baloo.avif",
  "./assets/jungle/bagheera.avif", "./assets/jungle/sherekhan.avif", "./assets/jungle/kaa.avif", "./assets/jungle/chil.avif", "./assets/jungle/banderlog.avif", "./assets/jungle/hathi.avif", "./assets/jungle/tabaqui.avif"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* 聲音檔（旁白＋環境音）唔預先塞入安裝包（唔想 app 一裝就成 10MB；唔聽聲嘅人完全唔會下載）：
   第一次播／撳「下載離線語音包」時才存落快取，之後冇網都播到。
   媒體請求多數帶 Range header，206 回應唔可以入 cache，所以另外用一個無 Range 嘅請求存檔。 */
var AUDIO_RE = /\/assets\/jungle\/(audio|ambience)\//;
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  /* 外部APP（網上服務）唔cache，直出network */
  if (/cubsbadge\.vercel\.app|scout-circulars\.vercel\.app/.test(e.request.url)) return;
  var isAudio = AUDIO_RE.test(new URL(e.request.url).pathname);
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      if (isAudio) {
        var plain = e.request.headers.has("range") ? new Request(e.request.url, { credentials: "same-origin" }) : e.request;
        return fetch(plain).then(function (res) {
          if (res && res.status === 200 && res.type !== "opaque") {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { try { c.put(plain, copy); } catch (_) {} });
          }
          return res;
        }).catch(function () { return caches.match("./index.html"); });
      }
      return fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { try { c.put(e.request, copy); } catch (_) {} });
        return res;
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
