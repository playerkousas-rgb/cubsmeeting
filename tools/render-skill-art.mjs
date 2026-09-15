// Optional asset authoring: npm install --no-save sharp @fontsource/noto-sans-tc
// BASE_URL must serve the app. Uses Playwright's browser or CHROMIUM_EXECUTABLE/CHROMIUM_ARGS.
// No generation/build step is required to run the PWA.
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
import sharp from 'sharp';
const fontDir = 'node_modules/@fontsource/noto-sans-tc';
let fonts = await fs.readFile(`${fontDir}/index.css`, 'utf8');
for (const match of [...fonts.matchAll(/url\(\.\/files\/([^)]*)\)/g)]) {
  const bytes = await fs.readFile(`${fontDir}/files/${match[1]}`);
  fonts = fonts.replace(match[0], `url(data:font/woff2;base64,${bytes.toString('base64')})`);
}
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,args:JSON.parse(process.env.CHROMIUM_ARGS || '[]')});
try {
  const page = await browser.newPage({viewport:{width:640,height:400},deviceScaleFactor:2});
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8090');
  const drawings = await page.evaluate(() => Object.entries(SkillArt.art).filter(([id]) => SkillArt.media(id).kind === 'legacy-diagram').map(([id,draw]) => [id,draw()]));
  await fs.mkdir('assets/skills',{recursive:true});
  let total = 0;
  for (const [id, svg] of drawings) {
    if (process.env.ART_IDS && !process.env.ART_IDS.split(',').includes(id)) continue;
    await page.setContent(`<style>${fonts}body{margin:0}svg{display:block;font-family:'Noto Sans TC',sans-serif}</style>${svg}`);
    await page.evaluate(()=>document.fonts.ready);
    const png = await page.locator('svg').screenshot();
    const avif = await sharp(png).avif({quality:60,effort:6,chromaSubsampling:'4:4:4'}).toBuffer();
    await fs.writeFile(`assets/skills/${id}.avif`,avif);
    total += avif.length;
    console.log(id, avif.length);
  }
  console.log('Total AVIF bytes:',total);
} finally { await browser.close(); }
