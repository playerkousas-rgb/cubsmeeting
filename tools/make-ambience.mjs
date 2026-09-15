/* 生成森林故事用嘅環境音（原創程序合成，唔使用任何現成音效素材）。
 *
 * 用法：npm i --no-save @breezystack/lamejs && node tools/make-ambience.mjs
 * 輸出：assets/jungle/ambience/{jungle-night,jungle-day,leaves,fire-crackle}.mp3
 *
 * 設計：
 *  - 24kHz 單聲道、32kbps，每段約 22–24 秒，方便無縫 loop（頭尾 1 秒交叉淡化）。
 *  - 音量刻意收細（峰值 ~0.45、RMS ~0.06–0.1），因為播放器會再壓到 0.02–0.40 之間做墊底，
 *    唔會蓋過旁白。
 *  - 全部用數學合成：白噪聲濾波（風、樹葉、火）、正弦掃頻（鳥、蟋蟀、貓頭鷹）、
 *    指數衰減噪音（腳步、火噼啪）。每次執行結果一樣（用固定種子 PRNG），方便重製。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as lamejs from '@breezystack/lamejs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets/jungle/ambience');
const SR = 24000;

/* ---------- 基本工具 ---------- */
const rnd = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const buf = (sec) => new Float32Array(Math.round(sec * SR));
const noise = (sec, seed) => { const r = rnd(seed), b = buf(sec); for (let i = 0; i < b.length; i++) b[i] = r() * 2 - 1; return b; };
const add = (dst, src, gain = 1) => { for (let i = 0; i < dst.length; i++) dst[i] += (src[i] || 0) * gain; return dst; };

function lowpass(b, hz) { const a = Math.exp(-2 * Math.PI * hz / SR), o = new Float32Array(b.length); let y = 0; for (let i = 0; i < b.length; i++) { y = (1 - a) * b[i] + a * y; o[i] = y; } return o; }
function highpass(b, hz) { const lp = lowpass(b, hz), o = new Float32Array(b.length); for (let i = 0; i < b.length; i++) o[i] = b[i] - lp[i]; return o; }
function bandpass(b, lo, hi) { return highpass(lowpass(b, hi), lo); }
/* 慢速起伏（風聲用）：用另一個低頻噪音調變振幅 */
function swell(b, sec, rate, seed, depth = 0.55) {
  const r = rnd(seed), o = new Float32Array(b.length);
  let v = 0.5, target = 0.5, next = 0;
  for (let i = 0; i < b.length; i++) {
    if (i >= next) { target = 0.35 + r() * 0.65; next = i + Math.round((sec / rate) * SR * (0.6 + r() * 0.8)); }
    v += (target - v) * (2 * Math.PI * 0.6 / SR);
    o[i] = b[i] * (1 - depth + depth * v * 2);
  }
  return o;
}
function tone(dst, { at, hz, dur, gain = 0.2, vib = 0, vHz = 5, attack = 0.01, decay = 0.06, sweep = 0 }) {
  const s = Math.round(at * SR), n = Math.round(dur * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR, k = s + i; if (k >= dst.length) break;
    const f = (hz + sweep * t) * (1 + vib * Math.sin(2 * Math.PI * vHz * t));
    dst[k] += gain * Math.min(1, t / attack) * Math.exp(-t / decay) * Math.sin(2 * Math.PI * f * t);
  }
  return dst;
}
function burst(dst, { at, dur, gain = 0.3, decay = 0.05, lo = 300, hi = 6000 }) {
  const s = Math.round(at * SR), n = Math.round(dur * SR), r = rnd(Math.round(at * 7919) + 13);
  const tmp = new Float32Array(n);
  for (let i = 0; i < n; i++) tmp[i] = (r() * 2 - 1) * Math.exp(-(i / SR) / decay);
  const soft = bandpass(tmp, lo, hi);
  for (let i = 0; i < n; i++) { const k = s + i; if (k >= dst.length) break; dst[k] += soft[i] * gain; }
  return dst;
}
/* 頭尾交叉淡化 → 可以無縫 loop */
function seamless(b, sec = 1) {
  const n = Math.round(sec * SR), L = b.length - n, o = new Float32Array(L);
  for (let i = 0; i < L; i++) {
    const x = i < n ? b[i + L] * (1 - i / n) + b[i] * (i / n) : b[i];
    o[i] = x;
  }
  return o;
}
function normalize(b, peak = 0.45) {
  let m = 0; for (let i = 0; i < b.length; i++) m = Math.max(m, Math.abs(b[i]));
  if (!m) return b;
  const g = peak / m; for (let i = 0; i < b.length; i++) b[i] *= g;
  return b;
}
function encodeMp3(samples, kbps = 32) {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
  const enc = new lamejs.Mp3Encoder(1, SR, kbps);
  const blocks = [];
  for (let i = 0; i < pcm.length; i += 1152) {
    const c = enc.encodeBuffer(pcm.subarray(i, Math.min(pcm.length, i + 1152)));
    if (c.length) blocks.push(Buffer.from(c));
  }
  const last = enc.flush(); if (last.length) blocks.push(Buffer.from(last));
  return Buffer.concat(blocks);
}

/* ---------- 1. 森林夜聲：遠風 + 樹葉 + 蟋蟀合唱 + 偶然貓頭鷹 ---------- */
function jungleNight() {
  const sec = 24, b = buf(sec);
  add(b, swell(lowpass(noise(sec, 101), 300), sec, 3, 102, 0.6), 2.4);          // 遠處風
  add(b, swell(bandpass(noise(sec, 103), 900, 5200), sec, 5, 104, 0.5), 0.34);   // 樹葉沙沙
  const r = rnd(105);
  /* 蟋蟀合唱：三組錯開節奏，短促 4.1–4.6kHz 脈衝 */
  for (const [off, gap, hz] of [[0.4, 0.42, 4200], [0.12, 0.31, 4450], [0.7, 0.55, 4050]]) {
    for (let t = off; t < sec - 0.5; t += gap * (0.75 + r() * 0.6)) {
      const n = 2 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) tone(b, { at: t + k * 0.055, hz: hz + r() * 200, dur: 0.05, gain: 0.075 * (0.7 + r() * 0.6), decay: 0.018 });
    }
  }
  /* 偶然嘅貓頭鷹：低沉、慢起慢落 */
  for (const at of [3.4, 11.8, 19.6]) {
    tone(b, { at, hz: 392, dur: 0.85, gain: 0.09, vib: 0.02, vHz: 4.5, attack: 0.18, decay: 0.42 });
    tone(b, { at: at + 1.05, hz: 330, dur: 1.15, gain: 0.085, vib: 0.02, vHz: 4.2, attack: 0.22, decay: 0.5 });
  }
  /* 遠處動物郁動 */
  for (let i = 0; i < 5; i++) burst(b, { at: 2 + r() * (sec - 4), dur: 0.7, gain: 0.05, decay: 0.22, lo: 200, hi: 1200 });
  return normalize(seamless(b), 0.4);
}

/* ---------- 2. 日間森林：柔和風聲 + 雀鳥 + 蟲鳴 ---------- */
function jungleDay() {
  const sec = 24, b = buf(sec);
  add(b, swell(lowpass(noise(sec, 201), 700), sec, 4, 202, 0.5), 1.7);
  add(b, swell(bandpass(noise(sec, 203), 1500, 7000), sec, 6, 204, 0.45), 0.28);
  const r = rnd(205);
  /* 雀鳥：短促上滑音，幾隻錯開 */
  for (let t = 1.2; t < sec - 1.5; t += 1.1 + r() * 2.4) {
    const base = 2200 + r() * 1500, n = 1 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      tone(b, { at: t + k * 0.17, hz: base, sweep: 900 + r() * 1500, dur: 0.09, gain: 0.07, attack: 0.006, decay: 0.03 });
    }
  }
  /* 蟲鳴：低音量連續細碎聲 */
  for (let t = 0.5; t < sec - 1; t += 0.9 + r() * 1.6) {
    tone(b, { at: t, hz: 3100 + r() * 700, dur: 0.35, gain: 0.02, vib: 0.06, vHz: 22, attack: 0.05, decay: 0.2 });
  }
  for (let i = 0; i < 6; i++) burst(b, { at: 1 + r() * (sec - 2), dur: 0.8, gain: 0.045, decay: 0.25, lo: 400, hi: 3000 });
  return normalize(seamless(b), 0.36);
}

/* ---------- 3. 腳踏落葉：稀疏腳步 + 樹葉沙沙 ---------- */
function leaves() {
  const sec = 18, b = buf(sec);
  add(b, bandpass(noise(sec, 301), 1200, 6000), 0.22);
  const r = rnd(302);
  let t = 0.6;
  while (t < sec - 1) {
    /* 一重一輕嘅兩步 */
    burst(b, { at: t, dur: 0.5, gain: 0.42, decay: 0.07, lo: 600, hi: 6500 });
    burst(b, { at: t + 0.36, dur: 0.35, gain: 0.24, decay: 0.05, lo: 500, hi: 5000 });
    if (r() > 0.55) burst(b, { at: t + 0.72, dur: 0.3, gain: 0.16, decay: 0.045, lo: 700, hi: 5200 });
    t += 1.25 + r() * 1.1;
  }
  for (let i = 0; i < 10; i++) burst(b, { at: r() * sec, dur: 1.1, gain: 0.1, decay: 0.3, lo: 1500, hi: 6500 });
  return normalize(seamless(b), 0.36);
}

/* ---------- 4. 營火：低沉火聲 + 噼啪 ---------- */
function fire() {
  const sec = 20, b = buf(sec);
  add(b, swell(lowpass(noise(sec, 401), 420), sec, 5, 402, 0.5), 2.1);
  const r = rnd(403);
  for (let t = 0.15; t < sec - 0.2; t += 0.045 + r() * 0.2) {
    const big = r() > 0.86;
    burst(b, { at: t, dur: big ? 0.3 : 0.14, gain: (big ? 0.3 : 0.12) + r() * 0.2, decay: big ? 0.05 : 0.011 + r() * 0.022, lo: 800, hi: 7000 });
  }
  /* 輕微「呼」一聲：低頻帶通噪音 */
  for (let i = 0; i < 4; i++) {
    const at = r() * (sec - 2), len = 1.2 + r();
    const n = Math.round(len * SR), tmp = new Float32Array(n), rr = rnd(Math.round(at * 1000) + 7);
    for (let k = 0; k < n; k++) tmp[k] = (rr() * 2 - 1) * Math.sin((k / n) * Math.PI);
    add(b.subarray(Math.round(at * SR), Math.round(at * SR) + n), bandpass(tmp, 120, 900), 0.35);
  }
  return normalize(seamless(b), 0.42);
}

/* ---------- 輸出 ---------- */
const files = [
  ['jungle-night.mp3', jungleNight()],
  ['jungle-day.mp3', jungleDay()],
  ['leaves.mp3', leaves()],
  ['fire-crackle.mp3', fire()],
];
fs.mkdirSync(outDir, { recursive: true });
for (const [name, samples] of files) {
  const mp3 = encodeMp3(samples);
  fs.writeFileSync(path.join(outDir, name), mp3);
  let peak = 0, sum = 0;
  for (let i = 0; i < samples.length; i++) { peak = Math.max(peak, Math.abs(samples[i])); sum += samples[i] * samples[i]; }
  console.log(name.padEnd(18), (mp3.length / 1024).toFixed(0) + 'KB',
    (samples.length / SR).toFixed(1) + 's', 'peak', peak.toFixed(2), 'rms', Math.sqrt(sum / samples.length).toFixed(3));
}
