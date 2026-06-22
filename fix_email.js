const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/src/services/email.service.js');
let data = fs.readFileSync(filePath, 'utf8');

// The replacement should be exact for the function strings to avoid corrupting anything else.
data = data.replace(/Bienvenue sur Fixam ! YZ%/g, 'Bienvenue sur Fixam ! 🎉');
data = data.replace(/Welcome to Fixam! YZ%/g, 'Welcome to Fixam! 🎉');
data = data.replace(/l/g, 'là');
data = data.replace(/marchǸ/g, 'marché');
data = data.replace(/crǸditǸ/g, 'crédité');
data = data.replace(/pice/g, 'pièce');
data = data.replace(/n\\'hǸsitez pas  contacter/g, "n'hésitez pas à contacter");
data = data.replace(/n\\'hǸsitez/g, "n'hésitez");
data = data.replace(/ contacter/g, 'à contacter');
data = data.replace(/Ǹquipe/g, 'équipe');
data = data.replace(/sǸcuritǸ/g, 'sécurité');
data = data.replace(/dǸtectǸe/g, 'détectée');
data = data.replace(/remarquǸ/g, 'remarqué');
data = data.replace(/connexion  votre/g, 'connexion à votre');
data = data.replace(/DǸtails/g, 'Détails');

fs.writeFileSync(filePath, data, 'utf8');
console.log('Fixed email service encoding');
