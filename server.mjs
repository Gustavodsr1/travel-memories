import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;
const MEMORIES_DIR = "C:\\Users\\gugu_\\OneDrive\\Imagens\\memories";
const EU_DIR = "C:\\Users\\gugu_\\OneDrive\\Imagens\\eu";

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Rota para foto de perfil do usuário (pasta "eu")
  if (reqPath.startsWith('/eu/') || reqPath === '/profile.jpg') {
    const filename = reqPath.startsWith('/eu/') ? path.basename(reqPath) : 'IMG-20260821-WA0004.jpg';
    const onedrivePath = path.join(EU_DIR, filename);
    const localPath = path.join(__dirname, 'assets', 'gustavo.jpg');
    const targetPath = fs.existsSync(onedrivePath) ? onedrivePath : localPath;

    fs.readFile(targetPath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Foto de perfil não encontrada');
      } else {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400'
        });
        res.end(content);
      }
    });
    return;
  }

  // Rota de fotos: tenta ler primeiro diretamente do OneDrive do usuário!
  if (reqPath.startsWith('/photos/')) {
    const filename = path.basename(reqPath);
    const onedrivePath = path.join(MEMORIES_DIR, filename);
    const localPath = path.join(__dirname, 'photos', filename);

    const targetPath = fs.existsSync(onedrivePath) ? onedrivePath : localPath;

    fs.readFile(targetPath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Foto não encontrada');
      } else {
        const ext = path.extname(targetPath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': mimeTypes[ext] || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400'
        });
        res.end(content);
      }
    });
    return;
  }

  // Rota API: lista fotos dinamicamente do OneDrive
  if (reqPath === '/api/photos') {
    const targetDir = fs.existsSync(MEMORIES_DIR) ? MEMORIES_DIR : path.join(__dirname, 'photos');
    fs.readdir(targetDir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        const images = files.filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count: images.length, photos: images }));
      }
    });
    return;
  }

  // Arquivos estáticos
  let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(__dirname, 'index.html'), (err2, fallback) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(fallback);
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html; charset=utf-8' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Travel Memories Gallery running at http://localhost:${PORT}/`);
  console.log(`Live OneDrive folder linked: ${MEMORIES_DIR}`);
});
