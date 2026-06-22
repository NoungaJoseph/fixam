const fs = require('fs');
const enPath = 'app/src/i18n/en.json';
const frPath = 'app/src/i18n/fr.json';

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

en.legal = {
  title: 'Terms & Privacy Policy',
  lastUpdated: 'Last Updated: June 2026',
  termsTitle: 'Terms of Service',
  privacyTitle: 'Privacy Policy',
  termsSections: [
    { title: '1. Acceptance of Terms', body: 'By downloading, accessing, or using the Fixam platform, you agree to be bound by these Terms of Service. Fixam connects clients needing services with professional providers in Cameroon. If you do not agree to these terms, please do not use our application.' },
    { title: '2. User Accounts and Verification', body: 'You must provide accurate, complete, and current information when registering. Users are responsible for maintaining the confidentiality of their OTPs and passwords. Fixam reserves the right to suspend or terminate accounts that provide false information or violate community guidelines.' },
    { title: '3. Platform Role and Liability', body: 'Fixam acts solely as a technological marketplace connecting independent service providers with clients. We do not employ the providers and are not responsible for the quality, safety, or legality of the services performed. Any disputes regarding the services must be resolved directly between the client and the provider, although Fixam may offer mediation support.' },
    { title: '4. Payments and Fixam Coins', body: 'Booking a provider requires Fixam coins. These coins are non-refundable unless a booking is cancelled under eligible conditions. Providers agree to the rates they set, and clients agree to pay the agreed amount directly to the provider upon completion of the service. Fixam is not responsible for off-platform financial transactions.' },
    { title: '5. Code of Conduct', body: 'All users must treat each other with respect. Harassment, discrimination, fraud, and unprofessional behavior are strictly prohibited and will result in immediate account termination and potential legal action.' }
  ],
  privacySections: [
    { title: '1. Information We Collect', body: 'We collect personal information that you provide directly to us, including your name, phone number, email address, physical location, date of birth, and service preferences. For providers, we also collect professional skills, portfolios, and availability.' },
    { title: '2. How We Use Your Information', body: 'Your information is used to provide, maintain, and improve the Fixam platform. We use your location to connect you with nearby providers or clients. We also use your contact information to send transactional messages, OTPs, and important updates.' },
    { title: '3. Information Sharing', body: 'We share relevant information between clients and providers to facilitate bookings (e.g., location, name, phone number). We do not sell your personal data to third parties. We may share information with legal authorities if required by law.' },
    { title: '4. Data Security', body: 'We implement industry-standard security measures, including encryption and secure socket layers (SSL), to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
    { title: '5. Your Rights', body: 'You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact our support team to request data deletion.' }
  ],
  contact: 'If you have any questions, please contact us at support@fixam.com.'
};

fr.legal = {
  title: 'Conditions et Politique de Confidentialité',
  lastUpdated: 'Dernière mise à jour : Juin 2026',
  termsTitle: 'Conditions de Service',
  privacyTitle: 'Politique de Confidentialité',
  termsSections: [
    { title: '1. Acceptation des Conditions', body: 'En téléchargeant, accédant ou utilisant la plateforme Fixam, vous acceptez d\'être lié par ces Conditions de Service. Fixam met en relation les clients ayant besoin de services avec des prestataires professionnels au Cameroun. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre application.' },
    { title: '2. Comptes Utilisateurs et Vérification', body: 'Vous devez fournir des informations exactes, complètes et à jour lors de votre inscription. Les utilisateurs sont responsables de la confidentialité de leurs mots de passe et OTP. Fixam se réserve le droit de suspendre ou de fermer les comptes fournissant de fausses informations.' },
    { title: '3. Rôle de la Plateforme et Responsabilité', body: 'Fixam agit uniquement en tant que place de marché technologique. Nous n\'employons pas les prestataires et ne sommes pas responsables de la qualité ou de la sécurité des services. Tout litige doit être résolu directement entre le client et le prestataire.' },
    { title: '4. Paiements et Pièces Fixam', body: 'La réservation d\'un prestataire nécessite des pièces Fixam (coins). Ces pièces ne sont pas remboursables, sauf en cas d\'annulation éligible. Les prestataires fixent leurs tarifs et les clients s\'engagent à payer le montant convenu à la fin du service.' },
    { title: '5. Code de Conduite', body: 'Tous les utilisateurs doivent se traiter avec respect. Le harcèlement, la discrimination, la fraude et tout comportement non professionnel sont strictement interdits.' }
  ],
  privacySections: [
    { title: '1. Informations que nous collectons', body: 'Nous collectons les informations personnelles que vous nous fournissez, y compris votre nom, numéro de téléphone, e-mail, emplacement physique et date de naissance.' },
    { title: '2. Comment nous utilisons vos informations', body: 'Vos informations sont utilisées pour fournir, maintenir et améliorer Fixam. Nous utilisons votre position pour vous connecter aux utilisateurs à proximité.' },
    { title: '3. Partage d\'Informations', body: 'Nous partageons les informations pertinentes entre clients et prestataires pour faciliter les réservations. Nous ne vendons pas vos données à des tiers.' },
    { title: '4. Sécurité des Données', body: 'Nous mettons en œuvre des mesures de sécurité conformes aux normes de l\'industrie pour protéger vos informations, bien qu\'aucune transmission sur Internet ne soit sécurisée à 100%.' },
    { title: '5. Vos Droits', body: 'Vous avez le droit d\'accéder, de mettre à jour ou de supprimer vos informations personnelles à tout moment via les paramètres de votre compte.' }
  ],
  contact: 'Pour toute question, veuillez nous contacter à support@fixam.com.'
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2));
console.log('Done');
