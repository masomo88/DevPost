import { cp, mkdir, rm, stat, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const source = fileURLToPath(new URL('../public/', import.meta.url));
const destination = fileURLToPath(new URL('../../docs/repair-relay/', import.meta.url));
const video = fileURLToPath(new URL('../assets/repair-relay-demo.webm', import.meta.url));
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
try {
  await stat(video);
  await copyFile(video, fileURLToPath(new URL('../../docs/repair-relay/demo.webm', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
console.log('Built public demo in root docs/repair-relay/');
