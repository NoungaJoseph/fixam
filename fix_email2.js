const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/src/services/email.service.js');
let data = fs.readFileSync(filePath, 'utf8');

// Replace the two corrupted functions exactly:
const newData = data.replace(
  /const sendWelcomeEmail = async \([\s\S]*?const sendSuspiciousLoginAlert = async \([\s\S]*?\}\;/g,
  `const sendWelcomeEmail = async (email, fullName, language = 'en') => {
  const isFr = language === 'fr';
  const subject = isFr ? 'Bienvenue sur Fixam ! 🎉' : 'Welcome to Fixam! 🎉';
  const html = \`
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
      <h2 style="color: #1E67D1;">\${subject}</h2>
      <p>\${isFr ? 'Bonjour' : 'Hello'} \${fullName || (isFr ? 'là' : 'there')},</p>
      <p>\${isFr ? 'Nous sommes ravis de vous compter parmi nous sur Fixam, le meilleur marché pour les services. Nous avons crédité votre portefeuille de 1 pièce de bienvenue pour bien commencer !' : 'We are thrilled to have you join Fixam, the best marketplace for services. We have credited your wallet with 1 welcome coin to get you started!'}</p>
      <p>\${isFr ? 'Si vous avez des questions, n\\'hésitez pas à contacter notre équipe de support.' : 'If you have any questions, feel free to reach out to our support team.'}</p>
      <p>\${isFr ? 'Cordialement,' : 'Best regards,'}<br>\${isFr ? 'L\\'équipe Fixam' : 'The Fixam Team'}</p>
    </div>
  \`;
  await sendEmail({ email, subject, html });
};

const sendSuspiciousLoginAlert = async (email, details, language = 'en') => {
  const isFr = language === 'fr';
  const subject = isFr ? 'Alerte de sécurité : Nouvelle connexion détectée' : 'Security Alert: New Login Detected';
  const html = \`
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ff4d4f; border-radius: 10px; max-width: 500px;">
      <h2 style="color: #ff4d4f;">\${subject}</h2>
      <p>\${isFr ? 'Bonjour,' : 'Hello,'}</p>
      <p>\${isFr ? 'Nous avons remarqué une nouvelle connexion à votre compte Fixam depuis un lieu ou un appareil non reconnu.' : 'We noticed a new login to your Fixam account from an unrecognized location or device.'}</p>
      <div style="background: #fff1f0; padding: 15px; border-radius: 8px; color: #cf1322;">
        <strong>\${isFr ? 'Détails:' : 'Details:'}</strong><br/>
        \${isFr ? 'Lieu' : 'Location'}: \${details.location}<br/>
        \${isFr ? 'Appareil' : 'Device'}: \${details.device}<br/>
        \${isFr ? 'Heure' : 'Time'}: \${details.time}
      </div>
      <p>\${isFr ? 'Si ce n\\'était pas vous, veuillez changer votre mot de passe immédiatement.' : 'If this wasn\\'t you, please change your password immediately.'}</p>
    </div>
  \`;
  await sendEmail({ email, subject, html });
};`
);

fs.writeFileSync(filePath, newData, 'utf8');
console.log('Fixed email service encoding');
