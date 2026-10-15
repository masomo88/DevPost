import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const project = fileURLToPath(new URL('../', import.meta.url));
const source = resolve(project, 'public');
const target = resolve(project, 'docs');
const files = ['index.html', 'app.js', 'planner.js', 'styles.css', 'journal.css'];

await mkdir(target, { recursive: true });
for (const file of files) await copyFile(resolve(source, file), resolve(target, file));
console.log(`GitHub Pages demo ready in ${target}`);
