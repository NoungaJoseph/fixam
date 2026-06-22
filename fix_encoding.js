const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/src/services/email.service.js');
let data = fs.readFileSync(filePath, 'utf8');

data = data.replace(/l/g, 'là')
           .replace(/marchǸ/g, 'marché')
           .replace(/crǸditǸ/g, 'crédité')
           .replace(/pice/g, 'pièce')
           .replace(/hǸsitez/g, 'hésitez')
           .replace(/Ǹquipe/g, 'équipe')
           .replace(/sǸcuritǸ/g, 'sécurité')
           .replace(/dǸtectǸe/g, 'détectée')
           .replace(/remarquǸ/g, 'remarqué')
           .replace(/DǸtails/g, 'Détails')
           .replace(//g, 'à')
           .replace(/YZ%/g, '🎉');

fs.writeFileSync(filePath, data, 'utf8');
console.log('Fixed encoding');
