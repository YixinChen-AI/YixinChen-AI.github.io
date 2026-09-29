import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'output', 'pdf');
const documents = [
  { source: path.join(root, 'cv.html'), output: path.join(outputDir, 'Yixin-Chen-CV.pdf'), profile: path.join(root, 'tmp', 'pdfs', 'chrome-profile-en') },
  { source: path.join(root, 'cv.zh.html'), output: path.join(outputDir, 'Yixin-Chen-CV-ZH.pdf'), profile: path.join(root, 'tmp', 'pdfs', 'chrome-profile-zh') },
];

const candidates = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  'google-chrome',
  'google-chrome-stable',
  'chromium',
].filter(Boolean);

function findChrome() {
  for (const candidate of candidates) {
    if (candidate.includes('/') && !fs.existsSync(candidate)) continue;
    const result = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
    if (!result.error && result.status === 0) return candidate;
  }
  throw new Error('Google Chrome or Chromium is required to build the CV PDF.');
}

for (const document of documents) {
  if (!fs.existsSync(document.source)) throw new Error('Run node scripts/build.mjs before building the CV PDFs.');
}
fs.mkdirSync(outputDir, { recursive: true });
const chrome = findChrome();

async function buildPdf(document) {
  fs.rmSync(document.profile, { recursive: true, force: true });
  fs.mkdirSync(document.profile, { recursive: true });
  fs.rmSync(document.output, { force: true });
  const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--no-first-run',
    '--allow-file-access-from-files',
    '--no-pdf-header-footer',
    `--user-data-dir=${document.profile}`,
    `--print-to-pdf=${document.output}`,
    pathToFileURL(document.source).href,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  let errorOutput = '';
  child.stderr.on('data', chunk => { errorOutput += chunk; });
  await new Promise((resolve, reject) => {
    let settled = false;
    let lastSize = -1;
    let stableChecks = 0;
    const finish = error => {
      if (settled) return;
      settled = true;
      clearInterval(checker);
      clearTimeout(deadline);
      if (child.exitCode === null) child.kill('SIGTERM');
      error ? reject(error) : resolve();
    };
    const checker = setInterval(() => {
      if (!fs.existsSync(document.output)) return;
      const size = fs.statSync(document.output).size;
      stableChecks = size === lastSize && size > 10000 ? stableChecks + 1 : 0;
      lastSize = size;
      if (stableChecks >= 2) finish();
    }, 250);
    const deadline = setTimeout(() => finish(new Error(errorOutput || 'Chrome timed out while creating a CV PDF.')), 15000);
    child.on('error', finish);
    child.on('exit', () => {
      if (fs.existsSync(document.output) && fs.statSync(document.output).size > 10000) finish();
      else finish(new Error(errorOutput || 'Chrome did not create a CV PDF.'));
    });
  });
  fs.rmSync(document.profile, { recursive: true, force: true });
  console.log(`Built ${path.relative(root, document.output)}.`);
}

for (const document of documents) await buildPdf(document);
