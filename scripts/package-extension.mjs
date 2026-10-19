import { spawnSync } from 'node:child_process';
import { resolveSiteUrl } from '../lib/site-url.mjs';
const studioUrl = new URL('/studio', resolveSiteUrl()).href;
const r=spawnSync('python3',['-c',`import sys,json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path('extension')
studio_url=sys.argv[1]
with ZipFile('public/downloads/undertone-extension.zip','w',ZIP_DEFLATED) as z:
 for file in sorted(root.rglob('*')):
  if file.is_file() and file.name!='config.js':z.write(file,file.relative_to(root))
 z.writestr('config.js','const UNDERTONE_DEFAULT_STUDIO = '+json.dumps(studio_url)+';\\n')
print('Packaged Undertone browser extension for '+studio_url)`,studioUrl],{stdio:'inherit'});
process.exit(r.status??1);
