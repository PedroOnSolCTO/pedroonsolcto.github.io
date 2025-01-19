import { rename, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsDir = join(__dirname, '..', 'docs');
const oldPath = join(docsDir, 'index.html');
const newPath = join(docsDir, 'memes.html');

// Rename index.html to memes.html
if (existsSync(oldPath)) {
    rename(oldPath, newPath, (err) => {
        if (err) throw err;
        console.log('Successfully renamed index.html to memes.html');
    });
}
