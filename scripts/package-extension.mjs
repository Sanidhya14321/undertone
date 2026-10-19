import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolveSiteUrl } from '../lib/site-url.mjs';
const studioUrl = new URL('/studio', resolveSiteUrl()).href;
mkdirSync('public/downloads', { recursive: true });
const r=spawnSync('python3',['-c',`import sys,json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root=Path('extension')
studio_url=sys.argv[1]
with ZipFile('public/downloads/undertone-extension.zip','w',ZIP_DEFLATED) as z:
 def add(name,data):
  info=ZipInfo(str(name),(1980,1,1,0,0,0))
  info.external_attr=0o644 << 16
  z.writestr(info,data,compress_type=ZIP_DEFLATED)
 for file in sorted(root.rglob('*')):
  if file.is_file() and file.name!='config.js':add(file.relative_to(root),file.read_bytes())
 add('config.js','const UNDERTONE_DEFAULT_STUDIO = '+json.dumps(studio_url)+';\\n')
 for name in ['LICENSE','NOTICE']:add(name,Path(name).read_bytes())
print('Packaged Undertone browser extension for '+studio_url)`,studioUrl],{stdio:'inherit'});
process.exit(r.status??1);
