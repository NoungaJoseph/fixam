const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'app/src/i18n/en.json');
const frPath = path.join(__dirname, 'app/src/i18n/fr.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));

enData.legal = {
  "title": "Terms & Privacy Policy",
  "lastUpdated": "Last Updated: June 2026",
  "termsTitle": "Terms of Service",
  "privacyTitle": "Privacy Policy",
  "termsSections": [
    {
      "title": "1. Introduction and Acceptance of Terms",
      "body": "Welcome to Fixam. By downloading, installing, accessing, or using the Fixam mobile application and related services (collectively, the 'Platform'), you agree to be bound by these Terms of Service. Fixam connects clients needing diverse services with professional, vetted service providers in Cameroon. If you do not agree to all of these terms and conditions, you must not use our Platform."
    },
    {
      "title": "2. Eligibility and Account Registration",
      "body": "To use Fixam, you must be at least 18 years of age and capable of forming a binding contract. When registering, whether as a Client or a Provider, you must provide accurate, complete, and current information. You are solely responsible for safeguarding your login credentials (including OTPs) and for all activities that occur under your account. Fixam reserves the right to suspend or terminate accounts that provide false information or violate our community guidelines."
    },
    {
      "title": "3. The Role of the Fixam Platform",
      "body": "Fixam acts exclusively as a technological marketplace connecting independent service providers with clients. We do not directly employ the providers, nor do we act as an agent for either party. While we strive to verify providers and maintain high standards, we do not guarantee the quality, safety, or legality of the services performed. Any disputes arising from the provision of services must be resolved directly between the client and the provider, although Fixam may, at its discretion, offer mediation support."
    },
    {
      "title": "4. Booking, Payments, and Fixam Coins",
      "body": "Booking a provider on Fixam requires the use of Fixam coins, our in-app currency. Coins are purchased through the application and are non-refundable unless a booking is cancelled under conditions explicitly outlined in our Cancellation Policy. Providers independently set their service rates, and clients agree to pay the agreed-upon amount directly to the provider upon satisfactory completion of the service. Fixam is not responsible for off-platform financial transactions or disputes over payment amounts between users."
    },
    {
      "title": "5. Code of Conduct and Prohibited Activities",
      "body": "All users must treat each other with utmost respect and professionalism. Harassment, discrimination, fraud, sharing inappropriate content, and any unprofessional behavior are strictly prohibited. You may not use the Platform for any illegal activities or to solicit services that violate local laws. Violations will result in immediate account termination and potential legal action."
    },
    {
      "title": "6. Intellectual Property Rights",
      "body": "All content on the Fixam Platform, including but not limited to text, graphics, logos, images, and software, is the property of Fixam or its licensors and is protected by intellectual property laws. You may not modify, copy, distribute, or reverse engineer any part of the Platform without our explicit written consent."
    },
    {
      "title": "7. Limitation of Liability and Indemnification",
      "body": "To the maximum extent permitted by law, Fixam shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the Platform. You agree to indemnify and hold Fixam harmless from any claims, losses, or damages arising out of your breach of these Terms or your interactions with other users."
    },
    {
      "title": "8. Modifications to Terms",
      "body": "We reserve the right to modify these Terms at any time. We will notify you of any significant changes by updating the 'Last Updated' date or through direct communication. Continued use of the Platform after such changes constitutes your acceptance of the new Terms."
    }
  ],
  "privacySections": [
    {
      "title": "1. Information We Collect",
      "body": "We collect personal information that you provide directly to us when you register and use the Platform. This includes your full name, phone number, email address, physical location, date of birth, profile picture, and service preferences. For providers, we also collect professional skills, portfolios, identification documents, and availability data. We also collect usage data and device information automatically as you interact with the app."
    },
    {
      "title": "2. How We Use Your Information",
      "body": "Your information is primarily used to provide, maintain, and improve the Fixam platform. Specifically, we use your location to connect you with nearby providers or clients, your contact information to send transactional messages (like OTPs and booking updates), and your profile data to personalize your experience. We also use aggregated data for analytics and to improve our service offerings."
    },
    {
      "title": "3. Information Sharing and Disclosure",
      "body": "To facilitate service bookings, we share relevant information between clients and providers (e.g., location, name, phone number, and service details). We do not sell, rent, or trade your personal data to third parties for marketing purposes. We may share information with trusted third-party service providers who assist us in operating the app, or with legal authorities if required by law or to protect our rights and the safety of our users."
    },
    {
      "title": "4. Data Security and Retention",
      "body": "We implement industry-standard security measures, including encryption and secure socket layers (SSL), to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure. We retain your data only for as long as your account is active or as needed to provide you services, comply with legal obligations, and resolve disputes."
    },
    {
      "title": "5. Your Privacy Rights and Choices",
      "body": "You have the right to access, update, correct, or delete your personal information at any time through your account settings. You may also opt-out of promotional communications, although you will continue to receive essential transactional messages. If you wish to completely delete your account and associated data, you may do so within the app or by contacting our support team."
    },
    {
      "title": "6. Changes to This Privacy Policy",
      "body": "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes via the app or email. We encourage you to review this policy periodically to stay informed about how we protect your privacy."
    }
  ],
  "contact": "If you have any questions, concerns, or feedback regarding these terms or our privacy practices, please contact us at support@fixam.com."
};

frData.legal = {
  "title": "Conditions & Politique de Confidentialité",
  "lastUpdated": "Dernière mise à jour : Juin 2026",
  "termsTitle": "Conditions de Service",
  "privacyTitle": "Politique de Confidentialité",
  "termsSections": [
    {
      "title": "1. Introduction et Acceptation des Conditions",
      "body": "Bienvenue sur Fixam. En téléchargeant, installant, accédant ou utilisant l'application mobile Fixam et les services associés (collectivement, la « Plateforme »), vous acceptez d'être lié par ces Conditions de Service. Fixam met en relation des clients ayant besoin de divers services avec des prestataires professionnels et vérifiés au Cameroun. Si vous n'acceptez pas l'intégralité de ces conditions, vous ne devez pas utiliser notre Plateforme."
    },
    {
      "title": "2. Éligibilité et Inscription au Compte",
      "body": "Pour utiliser Fixam, vous devez être âgé d'au moins 18 ans et être capable de conclure un contrat contraignant. Lors de votre inscription, que ce soit en tant que Client ou Prestataire, vous devez fournir des informations exactes, complètes et à jour. Vous êtes seul responsable de la protection de vos identifiants de connexion (y compris les OTP) et de toutes les activités qui se produisent sous votre compte. Fixam se réserve le droit de suspendre ou de fermer les comptes qui fournissent de fausses informations ou qui violent nos directives communautaires."
    },
    {
      "title": "3. Le Rôle de la Plateforme Fixam",
      "body": "Fixam agit exclusivement en tant que place de marché technologique connectant les prestataires de services indépendants avec les clients. Nous n'employons pas directement les prestataires et n'agissons pas en tant qu'agent pour l'une ou l'autre des parties. Bien que nous nous efforcions de vérifier les prestataires et de maintenir des normes élevées, nous ne garantissons pas la qualité, la sécurité ou la légalité des services fournis. Tout litige découlant de la prestation de services doit être résolu directement entre le client et le prestataire, bien que Fixam puisse, à sa discrétion, offrir un soutien à la médiation."
    },
    {
      "title": "4. Réservation, Paiements et Pièces Fixam",
      "body": "La réservation d'un prestataire sur Fixam nécessite l'utilisation de pièces Fixam (coins), notre monnaie intégrée. Les pièces sont achetées via l'application et ne sont pas remboursables, sauf si une réservation est annulée dans les conditions explicitement décrites dans notre Politique d'Annulation. Les prestataires fixent indépendamment leurs tarifs de service, et les clients acceptent de payer le montant convenu directement au prestataire après l'achèvement satisfaisant du service. Fixam n'est pas responsable des transactions financières hors plateforme ou des litiges sur les montants de paiement entre utilisateurs."
    },
    {
      "title": "5. Code de Conduite et Activités Interdites",
      "body": "Tous les utilisateurs doivent se traiter avec le plus grand respect et professionnalisme. Le harcèlement, la discrimination, la fraude, le partage de contenu inapproprié et tout comportement non professionnel sont strictement interdits. Vous ne pouvez pas utiliser la Plateforme pour des activités illégales ou pour solliciter des services qui violent les lois locales. Les violations entraîneront la résiliation immédiate du compte et d'éventuelles poursuites judiciaires."
    },
    {
      "title": "6. Droits de Propriété Intellectuelle",
      "body": "Tout le contenu de la Plateforme Fixam, y compris, mais sans s'y limiter, les textes, graphiques, logos, images et logiciels, est la propriété de Fixam ou de ses concédants de licence et est protégé par les lois sur la propriété intellectuelle. Vous ne pouvez pas modifier, copier, distribuer ou faire de l'ingénierie inverse sur une quelconque partie de la Plateforme sans notre consentement écrit explicite."
    },
    {
      "title": "7. Limitation de Responsabilité et Indemnisation",
      "body": "Dans toute la mesure permise par la loi, Fixam ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ou de toute perte de profits ou de revenus, qu'elle soit subie directement ou indirectement, découlant de votre utilisation de la Plateforme. Vous acceptez d'indemniser et de dégager Fixam de toute responsabilité pour toute réclamation, perte ou dommage découlant de votre violation de ces Conditions ou de vos interactions avec d'autres utilisateurs."
    },
    {
      "title": "8. Modifications des Conditions",
      "body": "Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous vous informerons de tout changement important en mettant à jour la date de « Dernière mise à jour » ou par communication directe. L'utilisation continue de la Plateforme après de tels changements constitue votre acceptation des nouvelles Conditions."
    }
  ],
  "privacySections": [
    {
      "title": "1. Informations que Nous Collectons",
      "body": "Nous collectons les informations personnelles que vous nous fournissez directement lorsque vous vous inscrivez et utilisez la Plateforme. Cela inclut votre nom complet, numéro de téléphone, adresse e-mail, emplacement physique, date de naissance, photo de profil et préférences de service. Pour les prestataires, nous collectons également les compétences professionnelles, les portfolios, les documents d'identification et les données de disponibilité. Nous collectons également automatiquement des données d'utilisation et des informations sur l'appareil lorsque vous interagissez avec l'application."
    },
    {
      "title": "2. Comment Nous Utilisons Vos Informations",
      "body": "Vos informations sont principalement utilisées pour fournir, maintenir et améliorer la plateforme Fixam. Plus précisément, nous utilisons votre position pour vous connecter avec des prestataires ou des clients à proximité, vos coordonnées pour envoyer des messages transactionnels (comme les OTP et les mises à jour de réservation), et les données de votre profil pour personnaliser votre expérience. Nous utilisons également des données agrégées pour l'analyse et pour améliorer nos offres de services."
    },
    {
      "title": "3. Partage et Divulgation d'Informations",
      "body": "Pour faciliter les réservations de services, nous partageons des informations pertinentes entre clients et prestataires (par exemple, emplacement, nom, numéro de téléphone et détails du service). Nous ne vendons, ne louons ni n'échangeons vos données personnelles à des tiers à des fins de marketing. Nous pouvons partager des informations avec des prestataires de services tiers de confiance qui nous aident à exploiter l'application, ou avec les autorités légales si la loi l'exige ou pour protéger nos droits et la sécurité de nos utilisateurs."
    },
    {
      "title": "4. Sécurité et Conservation des Données",
      "body": "Nous mettons en œuvre des mesures de sécurité conformes aux normes de l'industrie, y compris le cryptage et les protocoles SSL, pour protéger vos informations personnelles contre tout accès, altération ou divulgation non autorisés. Cependant, aucune méthode de transmission sur Internet n'est sécurisée à 100 %. Nous ne conservons vos données que le temps nécessaire pour fournir nos services, nous conformer aux obligations légales et résoudre les litiges."
    },
    {
      "title": "5. Vos Droits et Choix en Matière de Confidentialité",
      "body": "Vous avez le droit d'accéder, de mettre à jour, de corriger ou de supprimer vos informations personnelles à tout moment via les paramètres de votre compte. Vous pouvez également vous désinscrire des communications promotionnelles, bien que vous continuiez à recevoir des messages transactionnels essentiels. Si vous souhaitez supprimer complètement votre compte et les données associées, vous pouvez le faire dans l'application ou en contactant notre équipe d'assistance."
    },
    {
      "title": "6. Modifications de Cette Politique de Confidentialité",
      "body": "Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre pour refléter les changements dans nos pratiques ou les exigences légales. Nous vous informerons de tout changement important via l'application ou par e-mail. Nous vous encourageons à revoir cette politique périodiquement pour rester informé de la manière dont nous protégeons votre vie privée."
    }
  ],
  "contact": "Si vous avez des questions, des préoccupations ou des commentaires concernant ces conditions ou nos pratiques de confidentialité, veuillez nous contacter à support@fixam.com."
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(frData, null, 2), 'utf8');
console.log('Update complete.');
