/* 生成森林故事用嘅環境音（原創程序合成，無版權素材）。
   用法：node tools/make-ambience.mjs
   需要 ad hoc 安裝嘅 Pure JS MP3 encoder：npm i --no-save @breezystack/lamejs
   輸出：assets/jungle/ambience/{jungle-night,jungle-day,leaves,fire-crackle}.mp3
   設計：單聲道 22.05kHz、32kbps，音量刻意壓低（播放器再用細音量墊底），
        頭尾做 0.6 秒交叉淡化，所以可以無縫 loop。 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as lamePkg from '@breezystack/lamejs';
const lamejs = lamePkg.default && lamePkg.default.Mp3Encoder ? lamePkg.default : lamePkg;

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets/jungle/ambience');
const SR = 22050;

const rnd = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

function buffer(sec) { return new Float32Array(Math.round(sec * SR)); }

/* 一階低通／高通（簡單濾波，用嚟塑造風聲、樹葉聲） */
function lowpass(buf, cutoff) { const a = Math.exp(-2 * Math.PI * cutoff / SR), out = new Float32Array(buf.length); let y = 0; for (let i = 0; i < buf.length; i++) { y = (1 - a) * buf[i] + a * y; out[i] = y; } return out; }
function highpass(buf, cutoff) { const lp = lowpass(buf, cutoff), out = new Float32Array(buf.length); for (let i = 0; i < buf.length; i++) out[i] = buf[i] - lp[i]; return out; }
function noise(sec, seed) { const r = rnd(seed), b = buffer(sec); for (let i = 0; i < b.length; i++) b[i] = r() * 2 - 1; return b; }
function add(buf, other, gain = 1) { for (let i = 0; i < buf.length && i < other.length; i++) buf[i] += other[i] * gain; return buf; }
function tone(buf, { at, hz, dur, gain = 0.2, vib = 0, vHz = 5, attack = 0.01, decay = 0.06 }) {
  const start = Math.round(at * SR), n = Math.round(dur * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR, idx = start + i; if (idx >= buf.length) break;
    const f = hz * (1 + vib * Math.sin(2 * Math.PI * vHz * t));
    const env = Math.min(1, t / attack) * Math.exp(-t / decay);
    buf[idx] += gain * env * Math.sin(2 * Math.PI * f * t);
  }
  return buf;
}
function burst(buf, { at, dur, gain = 0.3, decay = 0.05, cutoff = 3000 }) {
  const start = Math.round(at * SR), n = Math.round(dur * SR), r = rnd(Math.round(at * 1000) + 7);
  for (let i = 0; i < n; i++) {
    const t = i / SR, idx = start + i; if (idx >= buf.length) break;
    const env = Math.exp(-t / decay);
    buf[idx] += gain * env * (r() * 2 - 1);
  }
  // 輕輕濾走尖刺感
  const slice = buf.slice(start, Math.min(buf.length, start + n));
  const soft = lowpass(slice, cutoff);
  for (let i = 0; i < soft.length; i++) buf[start + i] = buf[start + i] * 0.35 + soft[i] * 0.65;
  return buf;
}
function fadeEnds(buf, sec = 0.6) {
  const n = Math.round(sec * SR), L = buf.length;
  for (let i = 0; i < n && i < L; i++) { const g = i / n; buf[i] *= g; buf[L - 1 - i] *= g; }
  return buf;
}
/* 無縫 loop：把尾段同頭段交叉淡化，交疊部分用頭段接返去 */
function seamless(buf, sec = 0.6) {
  const n = Math.round(sec * SR), L = buf.length, out = new Float32Array(L);
  out.set(buf);
  for (let i = 0; i < n; i++) {
    const g = i / n, tail = L - n + i;
    out[i] = buf[tail] * (1 - g) + buf[i] * g;
  }
  return out.subarray(0, L - n);
}
function normalize(buf, peak = 0.35) {
  let m = 0; for (let i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i]));
  if (!m) return buf;
  const g = peak / m;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
  return buf;
}
function encodeMp3(samples, kbps = 32) {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
  const enc = new lamejs.Mp3Encoder(1, SR, kbps);
  const blocks = [];
  const step = 1152;
  for (let i = 0; i < pcm.length; i += step) {
    const chunk = enc.encodeBuffer(pcm.subarray(i, Math.min(pcm.length, i + step)));
    if (chunk.length) blocks.push(Buffer.from(chunk));
  }
  const last = enc.flush(); if (last.length) blocks.push(Buffer.from(last));
  return Buffer.concat(blocks);
}

/* ---- 1. 森林夜聲：遠風、蟋蟀、偶爾貓頭鷹 ---- */
function jungleNight() {
  const sec = 15, b = buffer(sec);
  add(b, lowpass(noise(sec, 11), 380), 1.5);          // 遠處風聲
  add(b, highpass(lowpass(noise(sec, 12), 5200), 1800), 0.28); // 樹葉細碎聲
  const r = rnd(21);
  for (let t = 0; t < sec - 0.4; t += 0.26 + r() * 0.3) {         // 蟋蟀：短促 4kHz 脈衝
    const n = 2 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) tone(b, { at: t + k * 0.055, hz: 4100 + r() * 250, dur: 0.05, gain: 0.1, decay: 0.02 });
  }
  for (const at of [2.4, 7.6, 12.4]) tone(b, { at, hz: 360, dur: 1.1, gain: 0.14, vib: 0.03, vHz: 4, attack: 0.25, decay: 0.5 }); // 貓頭鷹
  for (let i = 0; i < 4; i++) burst(b, { at: 1 + r() * (sec - 2), dur: 0.5, gain: 0.06, decay: 0.18, cutoff: 900 });
  return normalize(seamless(b), 0.4);
}
/* ---- 2. 日間森林：柔和樹聲、雀鳥、偶爾樹枝聲 ---- */
function jungleDay() {
  const sec = 15, b = buffer(sec);
  add(b, lowpass(noise(sec, 31), 900), 0.9);
  add(b, highpass(lowpass(noise(sec, 32), 6000), 2200), 0.2);
  const r = rnd(41);
  for (let t = 1; t < sec - 1; t += 1.4 + r() * 2.2) {            // 雀鳥：短促上滑音
    const n = 1 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const base = 2300 + r() * 1400;
      for (let j = 0; j < 4; j++) tone(b, { at: t + k * 0.16 + j * 0.045, hz: base * (1 + j * 0.06), dur: 0.06, gain: 0.09, decay: 0.02 });
    }
  }
  for (let i = 0; i < 8; i++) burst(b, { at: 1 + r() * (sec - 2), dur: 0.6, gain: 0.05, decay: 0.2, cutoff: 1500 });
  return normalize(seamless(b), 0.36);
}
/* ---- 3. 腳踏落葉：稀疏腳步同樹葉沙沙 ---- */
function leaves() {
  const sec = 12, b = buffer(sec);
  add(b, highpass(lowpass(noise(sec, 51), 4800), 900), 0.22);
  const r = rnd(61);
  let t = 0.5;
  while (t < sec - 0.6) {                                        // 腳步：一重一輕
    burst(b, { at: t, dur: 0.42, gain: 0.5, decay: 0.06, cutoff: 3800 });
    burst(b, { at: t + 0.34, dur: 0.3, gain: 0.26, decay: 0.045, cutoff: 3000 });
    t += 1.1 + r() * 0.9;
  }
  for (let i = 0; i < 10; i++) burst(b, { at: r() * sec, dur: 0.9, gain: 0.12, decay: 0.25, cutoff: 5200 });
  return normalize(seamless(b), 0.34);
}
/* ---- 4. 營火：低頻火聲加噼啪 ---- */
function fire() {
  const sec = 12, b = buffer(sec);
  add(b, lowpass(noise(sec, 71), 500), 1.2);
  const r = rnd(81);
  for (let t = 0.2; t < sec - 0.2; t += 0.05 + r() * 0.22) burst(b, { at: t, dur: 0.16, gain: 0.14 + r() * 0.3, decay: 0.012 + r() * 0.03, cutoff: 6500 });
  return normalize(seamless(b), 0.38);
}

const files = [
  ['jungle-night.mp3', jungleNight()],
  ['jungle-day.mp3', jungleDay()],
  ['leaves.mp3', leaves()],
  ['fire-crackle.mp3', fire()],
];
fs.mkdirSync(outDir, { recursive: true });
for (const [name, samples] of files) {
  const buf = encodeMp3(samples);
  fs.writeFileSync(path.join(outDir, name), buf);
  let peak = 0, sum = 0;
  for (let i = 0; i < samples.length; i++) { peak = Math.max(peak, Math.abs(samples[i])); sum += samples[i] * samples[i]; }
  console.log(name, (buf.length / 1024).toFixed(0) + 'KB', (samples.length / SR).toFixed(1) + 's',
    'peak', peak.toFixed(2), 'rms', Math.sqrt(sum / samples.length).toFixed(3));
}
