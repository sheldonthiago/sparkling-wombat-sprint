import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

function copy404() {
  const dist = path.join(__dirname, 'dist');
  const indexSource = path.join(dist, 'index.html');
  const target = path.join(dist, '404.html');

  // Criar pasta dist se não existir
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
  }

  // Copiar index.html para 404.html
  if (fs.existsSync(indexSource)) {
    fs.copyFileSync(indexSource, target);
    console.log('✅ index.html copiado para 404.html');
  } else {
    console.warn('⚠️ index.html não encontrado em dist/');
  }
}

copy404();