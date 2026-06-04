const fs = require('fs');
const path = require('path');

function processarDiretorio(dir) {
  fs.readdirSync(dir).forEach(file => {
    const caminhoCompleto = path.join(dir, file);
    if (fs.lstatSync(caminhoCompleto).isDirectory()) {
      if (file !== 'node_modules') processarDiretorio(caminhoCompleto);
    } else if (file.endsWith('.js')) {
      let conteudo = fs.readFileSync(caminhoCompleto, 'utf8');
      
      
      const novoConteudo = conteudo.replace(/([^:])\/\/.*/g, '$1');
      
      fs.writeFileSync(caminhoCompleto, novoConteudo);
      console.log(`Processado: ${caminhoCompleto}`);
    }
  });
}

processarDiretorio('./');
