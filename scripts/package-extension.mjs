import { spawnSync } from 'node:child_process';
const r=spawnSync('python3',['-c',`from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path('extension')
with ZipFile('public/downloads/undertone-extension.zip','w',ZIP_DEFLATED) as z:
 for file in sorted(root.rglob('*')):
  if file.is_file():z.write(file,file.relative_to(root))
print('Packaged Undertone browser extension.')`],{stdio:'inherit'});
process.exit(r.status??1);
