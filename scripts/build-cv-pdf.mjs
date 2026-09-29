import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'cv.html');
const outputDir = path.join(root, 'output', 'pdf');
const output = path.join(outputDir, 'Yixin-Chen-CV.pdf');
const profileDir = path.join(root, 'tmp', 'pdfs', 'chrome-profile');

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

if (!fs.existsSync(source)) throw new Error('Run node scripts/build.mjs before building the CV PDF.');
fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(profileDir, { recursive: true, force: true });
fs.mkdirSync(profileDir, { recursive: true });

const chrome = findChrome();
fs.rmSync(output, { force: true });
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
  `--user-data-dir=${profileDir}`,
  `--print-to-pdf=${output}`,
  pathToFileURL(source).href,
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
    if (!fs.existsSync(output)) return;
    const size = fs.statSync(output).size;
    stableChecks = size === lastSize && size > 10000 ? stableChecks + 1 : 0;
    lastSize = size;
    if (stableChecks >= 2) finish();
  }, 250);
  const deadline = setTimeout(() => finish(new Error(errorOutput || 'Chrome timed out while creating the CV PDF.')), 15000);
  child.on('error', finish);
  child.on('exit', () => {
    if (fs.existsSync(output) && fs.statSync(output).size > 10000) finish();
    else finish(new Error(errorOutput || 'Chrome did not create the CV PDF.'));
  });
});

fs.rmSync(profileDir, { recursive: true, force: true });
console.log(`Built ${path.relative(root, output)}.`);
