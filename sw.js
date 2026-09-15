/* 🐺 幼童軍團集會助手 — Service Worker (offline first，cache齊) */
var CACHE = "cubhub-v32-scene-audio-ambience-20260915";
var ASSETS = [
  "./", "./index.html", "./manifest.webmanifest", "./css/app.css",
  "./js/data.js", "./js/guide.js", "./js/flow.js", "./js/app.js", "./js/redesign.js", "./js/content.js", "./js/jungle-data.js", "./js/jungle.js", "./js/practical-data.js", "./js/practical.js", "./js/uniform-ceremony.js", "./js/field-visuals.js", "./js/salute-lab.js", "./js/salute-positions.js", "./js/tracking-kit.js", "./js/material-desk.js", "./js/plain-content.js", "./js/worksheet-guides.js", "./js/skill-art.js", "./js/craft-sheets.js", "./js/songbook.js",
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
  "./assets/jungle/audio/welcome-zh.mp3",
  "./assets/jungle/audio/help-zh.mp3",
  "./assets/jungle/audio/rules-zh.mp3",
  "./assets/jungle/audio/fire-zh.mp3",
  "./assets/jungle/audio/rules-en.mp3",
  "./assets/jungle/audio/welcome-en-1.mp3",
  "./assets/jungle/audio/welcome-en-2.mp3",
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
  "./assets/jungle/audio/village-zh-1.mp3",
  "./assets/jungle/audio/village-zh-2.mp3",
  "./assets/jungle/audio/help-en-1.mp3",
  "./assets/jungle/audio/help-en-2.mp3",
  "./assets/jungle/audio/fire-en-1.mp3",
  "./assets/jungle/audio/fire-en-2.mp3",
  "./assets/jungle/audio/village-en-1.mp3",
  "./assets/jungle/audio/village-en-2.mp3",
  "./assets/jungle/audio/welcome-yue.mp3",
  "./assets/jungle/audio/help-yue-1.mp3",
  "./assets/jungle/audio/help-yue-2.mp3",
  "./assets/jungle/audio/rules-yue.mp3",
  "./assets/jungle/audio/fire-yue-1.mp3",
  "./assets/jungle/audio/fire-yue-2.mp3",
  "./assets/jungle/audio/village-yue-1.mp3",
  "./assets/jungle/audio/village-yue-2.mp3",
  "./assets/jungle/ambience/jungle-night.mp3",
  "./assets/jungle/ambience/jungle-day.mp3",
  "./assets/jungle/ambience/leaves.mp3",
  "./assets/jungle/ambience/fire-crackle.mp3",
  "./assets/jungle/audio/scene/welcome-1-yue.mp3",
  "./assets/jungle/audio/scene/welcome-2-yue.mp3",
  "./assets/jungle/audio/scene/welcome-3-yue.mp3",
  "./assets/jungle/audio/scene/welcome-4-yue.mp3",
  "./assets/jungle/audio/scene/welcome-5-yue.mp3",
  "./assets/jungle/audio/scene/welcome-6-yue.mp3",
  "./assets/jungle/audio/scene/help-1-yue.mp3",
  "./assets/jungle/audio/scene/help-2-yue.mp3",
  "./assets/jungle/audio/scene/help-3-yue.mp3",
  "./assets/jungle/audio/scene/help-4-yue.mp3",
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
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  /* 外部APP（網上服務）唔cache，直出network */
  if (/cubsbadge\.vercel\.app|scout-circulars\.vercel\.app/.test(e.request.url)) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { try { c.put(e.request, copy); } catch (_) {} });
        return res;
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
