import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

function copy404() {
  const source = path.join(__dirname, 'public', '404.html');
  const dist = path.join(__dirname, 'dist');
  const target = path.join(dist, '404.html');

  // Criar pasta dist se não existir
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
  }

  // Copiar arquivo 404.html
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.log('✅ 404.html copiado para dist/');
  } else {
    console.warn('⚠️ 404.html não encontrado em public/');
  }
}

copy404();