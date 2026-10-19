import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
if (!/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(version)) throw new Error('Invalid release version');
const manifest = JSON.parse(await readFile('extension/manifest.json', 'utf8'));
if ((manifest.version_name || manifest.version) !== version) throw new Error('Application and extension release versions must agree');
if (process.env.GITHUB_REF_TYPE === 'tag' && process.env.GITHUB_REF_NAME !== `v${version}`) throw new Error('Tag must match package.json');
const destination = 'work/releases';
await mkdir(destination, { recursive: true });
const name = `undertone-extension-v${version}.zip`;
const file = await readFile('public/downloads/undertone-extension.zip');
await copyFile('public/downloads/undertone-extension.zip', `${destination}/${name}`);
await writeFile(`${destination}/SHA256SUMS.txt`, `${createHash('sha256').update(file).digest('hex')}  ${name}\n`);
console.log(`Prepared ${destination}/${name} and SHA256SUMS.txt`);
