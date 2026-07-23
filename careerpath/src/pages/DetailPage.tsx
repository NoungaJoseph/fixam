import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { careerpathApi } from '../services/api';
import DashboardNav from '../components/dashboard/DashboardNav';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Zap, Droplets, Hammer, Sparkles, Scissors, Paintbrush,
  Wrench, Leaf, Shirt, Utensils, GraduationCap, Construction,
  Clock, Award, HelpCircle, Users, Play, Star, ChevronLeft, ChevronRight,
  Flag
} from 'lucide-react';

type TaskItem = {
  num: number;
  titleEn: string;
  titleFr: string;
  duration: string;
  difficultyEn: string;
  difficultyFr: string;
  descEn: string;
  descFr: string;
  learnEn: string[];
  learnFr: string[];
  doEn: string[];
  doFr: string[];
};

type PathDetail = {
  categoryKey: string;
  titleKey: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate';
  hours: number;
  image: string;
  skills: string[];
  tasks: TaskItem[];
};

export default function DetailPage() {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const currentLang = i18n.language || 'en';

  // No auto-redirect here. We want this page to be public.

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'about' | 'tasks' | 'reviews'>('overview');

  // Sticky Header state
  const [showSticky, setShowSticky] = useState(false);

  // Video Playing state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Tasks Tab: Selected Task index state
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

  // Reviews Carousel state
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Monitor Scroll for Sticky Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Static Reviews List
  const reviewsList = [
    {
      name: 'Arnaud K.',
      contextEn: 'Certified Electrician',
      contextFr: 'Électricien Certifié',
      textEn: 'Completing this path helped me understand client safety expectations. My booking rates increased significantly.',
      textFr: 'Ce parcours m\'a aidé à comprendre les attentes de sécurité des clients. Mon taux de réservation a beaucoup augmenté.'
    },
    {
      name: 'Marie-Claire N.',
      contextEn: 'Wellness Expert',
      contextFr: 'Experte Bien-être',
      textEn: 'Highly recommended! The step-by-step videos and model answers are very practical.',
      textFr: 'Hautement recommandé ! Les vidéos étape par étape et les réponses modèles sont très pratiques.'
    },
    {
      name: 'Jean-Pierre T.',
      contextEn: 'Plumbing Specialist',
      contextFr: 'Spécialiste Plomberie',
      textEn: 'The leak diagnosis tasks were extremely realistic. It felt like I was solving a real client issue on site.',
      textFr: 'Les tâches de diagnostic de fuite étaient extrêmement réalistes. C\'était comme si je résolvais un vrai problème client sur place.'
    }
  ];

  // Next/Prev reviews
  const nextReview = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % reviewsList.length);
  };
  const prevReview = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  // Career Path Database with Dynamic Tasks List
  const detailsMap: Record<string, PathDetail> = {
    electrical: {
      categoryKey: 'electrical',
      titleKey: 'dashboard.recommended.card1.title',
      icon: Zap,
      difficulty: 'intermediate',
      hours: 6,
      image: '/images/electrical.jpg',
      skills: ['Circuit Safety', 'Panel Installation', 'Client Communication', 'Basic Wiring', 'Tool Handling', 'Safety Codes'],
      tasks: [
        {
          num: 1,
          titleEn: 'Safety & Workspace Setup',
          titleFr: 'Sécurité et Installation',
          duration: '30-45 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Learn how to secure your work area, set up warning signs, and select appropriate protective equipment.',
          descFr: 'Apprenez à sécuriser votre zone de travail, à installer les panneaux d\'avertissement et à choisir les équipements.',
          learnEn: ['How to wear PPE correctly', 'Recognizing live wire hazards', 'Securing a household circuit breaker panel'],
          learnFr: ['Comment porter l\'EPI correctement', 'Reconnaître les risques de fils nus', 'Sécuriser un disjoncteur domestique'],
          doEn: ['Assess residential safety risks with a supervisor', 'Complete a virtual safety checklist', 'Position safety cones and warning indicators'],
          doFr: ['Évaluer les risques de sécurité avec un superviseur', 'Remplir une liste de contrôle virtuelle', 'Placer les cônes et indicateurs de danger']
        },
        {
          num: 2,
          titleEn: 'Diagnostic & Preparation',
          titleFr: 'Diagnostic et Préparation',
          duration: '45-60 mins',
          difficultyEn: 'Intermediate',
          difficultyFr: 'Intermédiaire',
          descEn: 'Identify customer electrical issues, read blueprint drafts, and prep electrical tools.',
          descFr: 'Identifiez les besoins du client, lisez des plans de câblage et préparez les outils appropriés.',
          learnEn: ['Reading basic wiring diagrams', 'Selecting correct gauge wire and wire-strippers', 'Using a multimeter to check voltage'],
          learnFr: ['Lire des plans de câblage de base', 'Choisir le bon calibre de fil', 'Utiliser un multimètre pour vérifier la tension'],
          doEn: ['Meet customer Madame Njoki and record her complaints', 'Map the outlets in the kitchen floor plan', 'Measure wire voltage at the main socket'],
          doFr: ['Rencontrer Mme Njoki et noter ses plaintes', 'Cartographier les prises de la cuisine', 'Mesurer la tension du fil sur la prise principale']
        },
        {
          num: 3,
          titleEn: 'Residential Wiring Execution',
          titleFr: 'Installation de Câbles Résidentiels',
          duration: '60-90 mins',
          difficultyEn: 'Advanced',
          difficultyFr: 'Avancé',
          descEn: 'Install copper cables, wire switches and sockets, and connect to a breaker.',
          descFr: 'Installez des câbles en cuivre, raccordez des interrupteurs et connectez-les au disjoncteur.',
          learnEn: ['Connecting hot, neutral, and ground wires', 'Crimping and sealing connections', 'Configuring double-pole switches'],
          learnFr: ['Raccorder les fils de phase, neutre et terre', 'Sertir et sceller les connexions', 'Configurer des interrupteurs bipolaires'],
          doEn: ['Run copper cables through conduits', 'Wire three kitchen sockets securely', 'Conduct a grounding test using the diagnostic box'],
          doFr: ['Passer les câbles en cuivre dans les conduits', 'Câbler trois prises de cuisine en sécurité', 'Effectuer un test de mise à la terre']
        }
      ]
    },
    plumbing: {
      categoryKey: 'plumbing',
      titleKey: 'dashboard.recommended.card2.title',
      icon: Droplets,
      difficulty: 'intermediate',
      hours: 5,
      image: '/images/plumbing.jpg',
      skills: ['Pipe Fitting', 'Water Systems', 'Leak Diagnostics', 'Valve Replacement', 'Safety Standards', 'Tidy Cleanup'],
      tasks: [
        {
          num: 1,
          titleEn: 'Leak Diagnostics & Mapping',
          titleFr: 'Diagnostic de Fuites et Cartographie',
          duration: '30-40 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Pinpoint plumbing leaks under sinks and through partition walls using pressure tests.',
          descFr: 'Identifiez précisément les fuites sous les éviers et dans les cloisons à l\'aide de tests de pression.',
          learnEn: ['Recognizing pipeline friction points', 'Pressure testing safety thresholds', 'Water meter inspection'],
          learnFr: ['Identifier les points de friction dans les canalisations', 'Seuils de sécurité pour les tests de pression', 'Inspection du compteur d\'eau'],
          doEn: ['Trace water paths in a residential bathroom', 'Locate micro-fissures in copper joints', 'Document structural damage reports for clients'],
          doFr: ['Tracer le chemin de l\'eau dans une salle de bain', 'Localiser les micro-fissures dans les joints en cuivre', 'Rédiger le rapport de dommages structurels pour le client']
        },
        {
          num: 2,
          titleEn: 'Pipe Replacement Execution',
          titleFr: 'Remplacement de Canalisation',
          duration: '50-75 mins',
          difficultyEn: 'Intermediate',
          difficultyFr: 'Intermédiaire',
          descEn: 'Cut, deburr, and join PPR or PVC pipes correctly using thermal fusing or solvent cement.',
          descFr: 'Coupez, ébavurez et raccordez des tuyaux en PPR ou PVC par fusion thermique ou collage solvant.',
          learnEn: ['Selecting correct pipe materials', 'Safe heating temperatures for PPR fusion', 'Proper curing times for adhesives'],
          learnFr: ['Choisir les bons matériaux de tuyauterie', 'Températures de chauffe pour fusion PPR', 'Temps de séchage des colles solvants'],
          doEn: ['Measure and slice a damaged pipe segment', 'Fuse a new elbow connection joint', 'Install securing wall mounts'],
          doFr: ['Mesurer et découper un segment de tuyau endommagé', 'Souder un nouveau raccord coudé', 'Installer des colliers de fixation murale']
        }
      ]
    },
    carpentry: {
      categoryKey: 'carpentry',
      titleKey: 'trades.carpentry',
      icon: Hammer,
      difficulty: 'intermediate',
      hours: 7,
      image: '/images/carpentry.jpg',
      skills: ['Wood Joinery', 'Furniture Assembly', 'Measure & Cut', 'Sanding & Finish', 'Safety Protocol', 'Tool Maintenance'],
      tasks: [
        {
          num: 1,
          titleEn: 'Wood Selection & Measuring',
          titleFr: 'Sélection et Mesure du Bois',
          duration: '30 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Select appropriate wood species and measure dimensions precisely using calipers and tape measures.',
          descFr: 'Sélectionnez les essences de bois appropriées et mesurez les dimensions avec précision.',
          learnEn: ['Hardwood vs softwood classification', 'Accounting for moisture content expansion', 'Precise marking tools usage'],
          learnFr: ['Classification des bois feuillus vs résineux', 'Prendre en compte le taux d\'humidité', 'Utilisation des outils de marquage de précision'],
          doEn: ['Inspect wood planks for knots and cracks', 'Mark cut lines on a mahogany sheet', 'Prepare cutting blueprint templates'],
          doFr: ['Inspecter les planches de bois', 'Tracer les lignes de coupe sur une plaque d\'acajou', 'Préparer les gabarits de coupe']
        }
      ]
    },
    cleaning: {
      categoryKey: 'cleaning',
      titleKey: 'trades.cleaning',
      icon: Sparkles,
      difficulty: 'beginner',
      hours: 3,
      image: '/images/cleaning.jpg',
      skills: ['Home Sanitization', 'Chemical Safety', 'Efficiency Layout', 'Equipment Operation', 'Customer Care', 'Tidy Setup'],
      tasks: [
        {
          num: 1,
          titleEn: 'Chemical Safety & Dilutions',
          titleFr: 'Sécurité Chimique et Dilutions',
          duration: '20 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Understand cleaning product hazard warning labels and prepare correct water-to-chemical dilutions.',
          descFr: 'Comprenez les étiquettes de danger des produits et préparez les dilutions correctes.',
          learnEn: ['Reading safety data sheets (SDS)', 'Choosing correct spray nozzle settings', 'Ventilation best practices'],
          learnFr: ['Lire les fiches de données de sécurité', 'Choisir le bon réglage de buse', 'Bonnes pratiques d\'aération'],
          doEn: ['Dilute cleaning concentrate inside a measuring beaker', 'Label custom spray bottles correctly', 'Wear chemical-resistant gloves and protective eyewear'],
          doFr: ['Diluer le concentré dans un bécher doseur', 'Étiqueter les flacons de pulvérisation', 'Porter des gants et des lunettes de protection']
        }
      ]
    },
    beauty: {
      categoryKey: 'beauty',
      titleKey: 'trades.beauty',
      icon: Scissors,
      difficulty: 'beginner',
      hours: 4,
      image: '/images/beauty.jpg',
      skills: ['Nail Care', 'Sanitization Standard', 'Client Consultation', 'Premium Setup', 'Product Safety', 'Time Management'],
      tasks: [
        {
          num: 1,
          titleEn: 'Tool Sanitization Standards',
          titleFr: 'Normes de Désinfection des Outils',
          duration: '30 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Perform medical-grade sanitization on metal implements like clippers and pushers.',
          descFr: 'Effectuez une désinfection de niveau médical pour les outils métalliques.',
          learnEn: ['Difference between cleaning, disinfecting, and sterilizing', 'Proper usage of barbicide solutions', 'Storage in sterile pouches'],
          learnFr: ['Différence entre nettoyage, désinfection et stérilisation', 'Utilisation correcte des solutions désinfectantes', 'Stockage dans des sachets stériles'],
          doEn: ['Wash tools in warm soapy water', 'Immerse tools in disinfectant solution for required duration', 'Seal tools inside UV sterilization boxes'],
          doFr: ['Laver les outils à l\'eau tiède savonneuse', 'Immerser les outils dans la solution désinfectante', 'Sceller les outils dans les boîtes de stérilisation UV']
        }
      ]
    },
    painting: {
      categoryKey: 'painting',
      titleKey: 'trades.painting',
      icon: Paintbrush,
      difficulty: 'beginner',
      hours: 4,
      image: '/images/painting.jpg',
      skills: ['Surface Preparation', 'Sanding & Masking', 'Paint Application', 'Trim Painting', 'Clean Cleanup', 'Client Alignment'],
      tasks: [
        {
          num: 1,
          titleEn: 'Surface Sanding & Masking',
          titleFr: 'Ponçage et Masquage de Surfaces',
          duration: '35 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Prep drywalls by sanding cracks, filling holes, and sealing outlets with masking tape.',
          descFr: 'Préparez les cloisons en ponçant les fissures, en rebouchant les trous et en masquant les prises.',
          learnEn: ['Selecting correct grit sandpaper (120 vs 220)', 'How to apply spackling paste', 'Preventing paint bleed with painter\'s tape'],
          learnFr: ['Sélectionner le bon grain de papier abrasif', 'Comment appliquer l\'enduit de rebouchage', 'Éviter les bavures avec le ruban de masquage'],
          doEn: ['Sand down uneven wall patches', 'Apply tape straight along baseboards', 'Cover flooring with clean drop cloths'],
          doFr: ['Poncer les raccords muraux irréguliers', 'Poser le ruban de masquage le long des plinthes', 'Recouvrir le sol avec des bâches de protection']
        }
      ]
    },
    appliance: {
      categoryKey: 'appliance',
      titleKey: 'trades.appliance',
      icon: Wrench,
      difficulty: 'intermediate',
      hours: 6,
      image: '/images/appliance.jpg',
      skills: ['Troubleshooting', 'Electrical Safety', 'Part Replacement', 'Tool Usage', 'Diagnostic Report', 'Service Protocol'],
      tasks: [
        {
          num: 1,
          titleEn: 'Refrigerator Thermostat Testing',
          titleFr: 'Test de Thermostat de Réfrigérateur',
          duration: '40 mins',
          difficultyEn: 'Intermediate',
          difficultyFr: 'Intermédiaire',
          descEn: 'Locate refrigerator thermostats and verify continuity using multimeters.',
          descFr: 'Localisez le thermostat du réfrigérateur et vérifiez la continuité avec un multimètre.',
          learnEn: ['Testing closed vs open circuits', 'Accessing internal control housings', 'Handling wire harness clips safely'],
          learnFr: ['Tester des circuits ouverts vs fermés', 'Accéder aux boîtiers de commande internes', 'Manipuler les clips de faisceaux de fils en sécurité'],
          doEn: ['Unplug the appliance power source safely', 'Extract thermostat terminal wires', 'Configure multimeter to continuity mode and measure'],
          doFr: ['Débrancher l\'appareil en toute sécurité', 'Extraire les fils des bornes du thermostat', 'Régler le multimètre en mode continuité et mesurer']
        }
      ]
    },
    gardening: {
      categoryKey: 'gardening',
      titleKey: 'trades.gardening',
      icon: Leaf,
      difficulty: 'beginner',
      hours: 3,
      image: '/images/gardening.jpg',
      skills: ['Lawn Care', 'Weeding & Trimming', 'Tool Handling', 'Safety Standards', 'Soil Preparation', 'Landscape Layout'],
      tasks: [
        {
          num: 1,
          titleEn: 'Mower Blade Maintenance',
          titleFr: 'Entretien des Lames de Tondeuse',
          duration: '30 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Inspect and clean mower decks, and detach blades for sharpening.',
          descFr: 'Inspectez et nettoyez les carters de tondeuse, et démontez les lames pour affûtage.',
          learnEn: ['Preventing accidental engine starts', 'Wrench selection for arbor bolts', 'Blade balancing checks'],
          learnFr: ['Éviter le démarrage accidentel du moteur', 'Choix des clés pour les boulons d\'arbre', 'Vérification de l\'équilibrage de la lame'],
          doEn: ['Disconnect spark plug wires', 'Scrape off caked grass under the deck', 'Remove the center lock bolt using a socket wrench'],
          doFr: ['Débrancher le fil de bougie d\'allumage', 'Gratter l\'herbe accumulée sous le carter', 'Retirer le boulon central avec une clé à douille']
        }
      ]
    },
    tailoring: {
      categoryKey: 'tailoring',
      titleKey: 'trades.tailoring',
      icon: Shirt,
      difficulty: 'intermediate',
      hours: 8,
      image: '/images/tailoring.jpg',
      skills: ['Garment Measurement', 'Sewing & Stitching', 'Fabric Sourcing', 'Pattern Cutting', 'Finishing & Pressing', 'Communication'],
      tasks: [
        {
          num: 1,
          titleEn: 'Body Dimension Mapping',
          titleFr: 'Mesure des Dimensions Corporelles',
          duration: '45 mins',
          difficultyEn: 'Intermediate',
          difficultyFr: 'Intermédiaire',
          descEn: 'Take accurate measurements of client bust, waist, hips, and sleeve length.',
          descFr: 'Prenez les mesures précises du buste, de la taille, des hanches et de la longueur des manches.',
          learnEn: ['Placing the measuring tape snugly', 'Allowing ease of movement tolerances', 'Standard recording formats'],
          learnFr: ['Placer le ruban à mesurer sans trop serrer', 'Ajouter des tolérances pour l\'aisance de mouvement', 'Formats d\'enregistrement standard'],
          doEn: ['Instruct client Madame Fanta on correct standing posture', 'Measure shoulder-to-wrist sleeve lengths', 'Log dimensions inside the client profile book'],
          doFr: ['Conseiller Mme Fanta sur la bonne posture debout', 'Mesurer la manche de l\'épaule au poignet', 'Enregistrer les dimensions sur la fiche client']
        }
      ]
    },
    catering: {
      categoryKey: 'catering',
      titleKey: 'trades.catering',
      icon: Utensils,
      difficulty: 'intermediate',
      hours: 5,
      image: '/images/catering.jpg',
      skills: ['Baking Basics', 'Food Sanitization', 'Event Planning', 'Menu Preparation', 'Safe Transport', 'Presentation'],
      tasks: [
        {
          num: 1,
          titleEn: 'Kitchen Sanitation & Cross-contamination',
          titleFr: 'Hygiène de Cuisine et Contamination Croisée',
          duration: '30 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Enforce strict guidelines regarding cutting board allocation and sanitizing countertops.',
          descFr: 'Appliquez des directives strictes concernant les planches à découper et la désinfection.',
          learnEn: ['Coloured board systems (Red for raw meat)', 'Correct wash-rinse-sanitize steps', 'Safe storage temperature tracking'],
          learnFr: ['Système de planches de couleur (Rouge pour viande crue)', 'Étapes correctes lavage-rinçage-désinfection', 'Suivi des températures de stockage de sécurité'],
          doEn: ['Clean cooking counters with food-safe sanitizing sprays', 'Isolate raw poultry away from prepared salads', 'Test dishwasher heat settings'],
          doFr: ['Nettoyer les comptoirs de cuisine', 'Isoler la volaille crue des salades préparées', 'Tester le niveau de chaleur du lave-vaisselle']
        }
      ]
    },
    tutoring: {
      categoryKey: 'tutoring',
      titleKey: 'trades.tutoring',
      icon: GraduationCap,
      difficulty: 'beginner',
      hours: 3,
      image: '/images/tutoring.jpg',
      skills: ['Primary Education', 'Classroom Setup', 'Interactive Learning', 'Progress Tracking', 'Communication', 'Empathy'],
      tasks: [
        {
          num: 1,
          titleEn: 'Interactive Lesson Plan Creation',
          titleFr: 'Création de Plan de Leçon Interactif',
          duration: '40 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Design active learning sessions containing warm-up questions and practical math puzzles.',
          descFr: 'Concevez des sessions d\'apprentissage actif contenant des questions d\'échauffement.',
          learnEn: ['Matching lessons to national curriculum targets', 'Time budgeting inside a 45-minute lesson block', 'Creating visual aid materials'],
          learnFr: ['Adapter les leçons aux objectifs du programme national', 'Gérer le temps sur un bloc de 45 minutes', 'Créer des supports visuels d\'aide'],
          doEn: ['Outline a fractions teaching slide presentation', 'Create a printed worksheet template', 'Draft three interactive learning games'],
          doFr: ['Rédiger une présentation pour enseigner les fractions', 'Créer une fiche d\'exercice imprimable', 'Concevoir trois jeux éducatifs interactifs']
        }
      ]
    },
    handyman: {
      categoryKey: 'handyman',
      titleKey: 'trades.handyman',
      icon: Construction,
      difficulty: 'beginner',
      hours: 4,
      image: '/images/handyman.jpg',
      skills: ['Drywall Patching', 'Safety Standards', 'Hardware Mounting', 'Multi-tool Handling', 'Cleanup Protocol', 'Customer Care'],
      tasks: [
        {
          num: 1,
          titleEn: 'Wall Anchor Loading Tests',
          titleFr: 'Test de Charge des Chevilles Murales',
          duration: '30 mins',
          difficultyEn: 'Beginner',
          difficultyFr: 'Débutant',
          descEn: 'Install drywall anchors and load test brackets for TV and heavy shelving mounts.',
          descFr: 'Installez des chevilles pour cloison sèche et testez la charge pour fixations murales.',
          learnEn: ['Anchor types: plastic vs toggle bolt', 'Calculating shear vs tension loads', 'Checking wall stud placement'],
          learnFr: ['Types de chevilles : plastique vs boulon à bascule', 'Calculer les charges de cisaillement vs tension', 'Repérer les montants muraux'],
          doEn: ['Locate studs using a magnetic stud finder', 'Drill pilot holes into partition drywalls', 'Secure a heavy bracket mounting plate'],
          doFr: ['Localiser les montants avec un détecteur magnétique', 'Percer des trous pilotes dans la cloison', 'Fixer solidement une plaque de support lourde']
        }
      ]
    }
  };

  const currentPath = detailsMap[categoryKey || 'electrical'] || detailsMap.electrical;
  const Icon = currentPath.icon;

  const currentTask = currentPath.tasks[selectedTaskIdx] || currentPath.tasks[0];

  const handleStartPath = async () => {
    if (isLoggedIn) {
      try {
        await careerpathApi.enroll({ categoryKey: categoryKey || 'electrical' });
        navigate(`/career-paths/${categoryKey || 'electrical'}/flow`);
      } catch (err) {
        console.error("Failed to enroll", err);
        // Navigate anyway for robustness if already enrolled
        navigate(`/career-paths/${categoryKey || 'electrical'}/flow`);
      }
    } else {
      navigate(`/login?redirect=/career-paths/${categoryKey || 'electrical'}/flow`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-gray-800">
      {isLoggedIn ? <DashboardNav /> : <Navbar />}

      {/* Sticky Compact Header (Charcoal top bar + sub tabs) */}
      <div
        className={`fixed top-14 left-0 right-0 z-40 bg-gray-800 border-b border-gray-700 transition-transform duration-300 ${
          showSticky ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <span className="text-sm sm:text-base font-bold text-white truncate mr-4">
            {t(currentPath.titleKey)}
          </span>
          <button 
            onClick={handleStartPath}
            className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-1.5 px-4 rounded-full transition-colors flex-shrink-0"
          >
            {t('detail.stickyHeader.startBtn')}
          </button>
        </div>
        {/* Sticky tabs copy */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
            {(['overview', 'about', 'tasks', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs py-3 border-b-2 font-bold transition-all ${
                  activeTab === tab ? 'text-gray-850 border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {t(`detail.tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Area */}
      <section className="relative w-full bg-gray-900 overflow-hidden">
        {/* Full-width photo with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentPath.image}
            alt={t(currentPath.titleKey)}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
        </div>

        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-white">
            {/* Category badge */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                {t(`trades.${currentPath.categoryKey}`)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {t(currentPath.titleKey)}
            </h1>

            {/* Description subtext */}
            <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
              Explore hands-on tasks structured by professional industry trainers to launch your trade career.
            </p>
          </div>
        </div>

        {/* Gray Meta Bar bottom */}
        <div className="relative z-10 bg-gray-800/90 backdrop-blur-sm py-4 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm text-gray-300 font-semibold uppercase tracking-wider">
              {t('detail.hero.meta', { category: t(`trades.${currentPath.categoryKey}`) })}
            </span>
          </div>
        </div>
      </section>



      {/* Main Sub-nav tab row (underneath hero before scroll) */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {(['overview', 'about', 'tasks', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm py-4 border-b-2 font-bold transition-all flex items-center gap-0.5 ${
                activeTab === tab ? 'text-gray-850 border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <span>{t(`detail.tabs.${tab}`)}</span>
              {activeTab === tab && <span className="text-[10px]">▼</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {activeTab === 'overview' && (
          /* OVERVIEW TAB CONTENT */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left column (why complete / how works) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Why Complete section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-850">
                  {t('detail.overview.whyTitle')}
                </h2>
                <p className="text-sm sm:text-base text-gray-550 leading-relaxed max-w-3xl">
                  {t('detail.overview.whyBody')}
                </p>
                <div className="text-xs text-gray-400 font-semibold">
                  {t('detail.overview.metaLine', {
                    hours: currentPath.hours,
                    level: currentPath.difficulty === 'beginner' ? t('carousel.difficulty.beginner') : t('carousel.difficulty.intermediate')
                  })}
                </div>
                <div className="border-t border-gray-150 pt-5 text-sm text-gray-550 leading-relaxed">
                  <p>
                    By completing this Fixam simulated job training, you prove your dedication to excellence and on-the-job safety. This program walks you through the step-by-step diagnostic workflow, materials configuration, and safety guidelines required on residential and commercial project sites globally.
                  </p>
                  <a href="#" className="text-xs font-bold text-primary mt-3 block hover:underline">
                    {t('detail.overview.viewAll')}
                  </a>
                </div>
              </div>

              {/* How it works section */}
              <div className="space-y-6 pt-6 border-t border-gray-150">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-850">
                    {t('detail.howWorks.title')}
                  </h2>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">
                    {t('detail.howWorks.viewAll')}
                  </a>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: HelpCircle, text: t('detail.howWorks.step1') },
                    { icon: Award, text: t('detail.howWorks.step2') },
                    { icon: Users, text: t('detail.howWorks.step3') }
                  ].map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg p-5 flex gap-4 bg-white items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
                          <StepIcon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-gray-650 leading-relaxed mt-1">
                          {step.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right column (sidebar cards) */}
            <div className="lg:col-span-4 space-y-6 lg:pl-4 lg:-mt-36 relative z-25">
              
              {/* Floating CTA Card (inside right column so they stack naturally and never overlap!) */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 space-y-5">
                <span className="bg-primary-soft text-primary text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase block w-max">
                  {t('detail.ctaCard.badge')}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-850">
                    {t('detail.ctaCard.title')}
                  </h3>
                </div>
                <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t('detail.ctaCard.bullet1')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t('detail.ctaCard.bullet2')}</span>
                  </li>
                </ul>
                <button 
                  onClick={handleStartPath}
                  className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {t('detail.ctaCard.startBtn')}
                </button>
              </div>
              
              {/* Callout Card */}
              <div className="bg-white border border-gray-250 rounded-lg p-5 relative">
                <span className="absolute -top-3 left-4 bg-primary-soft text-primary text-[9px] font-bold px-2 py-0.5 rounded border border-primary/20 uppercase">
                  {t('detail.overview.sidebar.calloutBadge')}
                </span>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider block mt-2 mb-2">
                  {t('detail.overview.sidebar.calloutTitle')}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t('detail.overview.sidebar.calloutDesc')}
                </p>
              </div>

              {/* Skills Card */}
              <div className="bg-white border border-gray-250 rounded-lg p-5">
                <h4 className="text-xs font-bold text-gray-850 uppercase tracking-wider mb-4">
                  {t('detail.overview.sidebar.skillsTitle')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentPath.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-semibold text-gray-650 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'about' && (
          /* ABOUT THE PATH TAB CONTENT (Introduction video & partner info) */
          <div className="space-y-12">
            
            {/* Curve divider visual */}
            <div className="w-full relative py-2">
              <svg width="100%" height="40" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <path d="M0 40c300-30 600-30 1440 0V0H0v40z" fill="#f8fafc" />
              </svg>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center bg-slate-50/50 rounded-xl p-8 border border-gray-200">
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Fixam Academy
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-850 leading-snug">
                  {t('detail.about.introTitle')}
                </h2>
                <p className="text-sm text-gray-550 leading-relaxed max-w-lg">
                  Watch this introductory video from our lead technical formateur. We will explain how the diagnostic task modules are built, how to structure your safety toolbox, and how to verify your project output.
                </p>
                <div className="pt-2">
                  <Link
                    to="/catalog"
                    className="inline-block border border-gray-300 hover:border-primary text-gray-700 hover:text-primary text-xs font-bold py-2.5 px-5 rounded-full transition-colors bg-white"
                  >
                    {t('detail.about.exploreBtn')}
                  </Link>
                </div>
              </div>

              {/* Video Player Block UI */}
              <div className="lg:col-span-6">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-350 shadow-md bg-gray-900 group">
                  {isVideoPlaying ? (
                    /* Mock Playing state */
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center">
                      <p className="font-bold text-sm mb-2">Playing Introduction Video...</p>
                      <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                        This is a simulated video player component in the Fixam authenticated view.
                      </p>
                      <button
                        onClick={() => setIsVideoPlaying(false)}
                        className="mt-4 text-xs font-bold text-primary hover:underline"
                      >
                        Stop playback
                      </button>
                    </div>
                  ) : (
                    /* Poster frame */
                    <>
                      <img
                        src={currentPath.image}
                        alt="Video poster"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-300"
                      />
                      {/* Play button overlay */}
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg hover:scale-108 transition-all hover:bg-primary-hover focus:outline-none"
                      >
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          /* TASKS TAB CONTENT - TWO COLUMN PANEL WITH ACCENT CIRCLES */
          <div className="space-y-6">
            
            {/* Header with decorative circles */}
            <div className="relative pb-2 flex items-center gap-3">
              {/* Decorative circles */}
              <div className="absolute -top-3 left-48 w-3 h-3 bg-teal-200/50 rounded-full" />
              <div className="absolute top-1 left-56 w-4.5 h-4.5 bg-gray-200/40 rounded-full" />
              <div className="absolute -top-1 left-[270px] w-2 h-2 bg-primary/30 rounded-full" />
              
              <h2 className="text-2xl font-bold text-gray-850">
                {t('detail.tasksSection.title')}
              </h2>
            </div>

            {/* Split layout: left tasks list, right task details */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Tasks List */}
              <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg lg:h-[460px] lg:overflow-y-auto flex flex-col pr-1 scrollbar-thin">
                <div className="divide-y divide-dashed divide-gray-200">
                  {currentPath.tasks.map((task, idx) => (
                    <button
                      key={task.num}
                      onClick={() => setSelectedTaskIdx(idx)}
                      className={`w-full text-left p-4 transition-colors flex items-center gap-3.5 focus:outline-none ${
                        selectedTaskIdx === idx ? 'bg-gray-100 font-bold' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Numbered circle */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        selectedTaskIdx === idx ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-500 bg-white'
                      }`}>
                        {task.num}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-800 line-clamp-2">
                        {currentLang === 'en' ? task.titleEn : task.titleFr}
                      </span>
                    </button>
                  ))}

                  {/* Finish Line */}
                  <div className="p-4 flex items-center gap-3.5 text-gray-400 select-none">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-250 flex items-center justify-center bg-white text-gray-400">
                      <Flag className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">
                      {t('detail.tasksSection.finishLine')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Task details panel */}
              <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-6 lg:h-[460px] lg:overflow-y-auto pr-3 scrollbar-thin space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Task {currentTask.num}: {currentLang === 'en' ? currentTask.titleEn : currentTask.titleFr}
                  </h3>
                  <div className="text-xs font-semibold text-primary/90 flex items-center gap-1.5">
                    <span>{currentTask.duration}</span>
                    <span>·</span>
                    <span>{currentLang === 'en' ? currentTask.difficultyEn : currentTask.difficultyFr}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentLang === 'en' ? currentTask.descEn : currentTask.descFr}
                </p>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Learn card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
                      <GraduationCap className="w-4.5 h-4.5" />
                      <span>{t('detail.tasksSection.learnTitle')}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-500 list-disc pl-4 leading-relaxed font-medium">
                      {(currentLang === 'en' ? currentTask.learnEn : currentTask.learnFr).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Do card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
                      <Wrench className="w-4.5 h-4.5" />
                      <span>{t('detail.tasksSection.doTitle')}</span>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-500 list-disc pl-4 leading-relaxed font-medium">
                      {(currentLang === 'en' ? currentTask.doEn : currentTask.doFr).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          /* REVIEWS TAB CONTENT - SPLIT LAYOUT + MINIMAL CAROUSEL */
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-white py-6">
            
            {/* Left Block: Summary ratings */}
            <div className="lg:col-span-4 space-y-2 text-center lg:text-left pr-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                {t('detail.reviewsSection.overRating')}
              </span>
              <h2 className="text-3xl font-extrabold text-gray-850">
                {t('detail.reviewsSection.title')}
              </h2>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
                <span className="text-xs font-bold text-gray-500 ml-1">
                  {t('detail.reviewsSection.starsLabel')}
                </span>
              </div>
            </div>

            {/* Middle Divider bar (hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1 h-20 w-px bg-gray-200 justify-self-center" />

            {/* Right Block: Quotes Carousel */}
            <div className="lg:col-span-7 flex items-center justify-between gap-4">
              <button
                onClick={prevReview}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-all flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 text-center px-4 space-y-3.5 min-h-[90px] flex flex-col justify-center">
                <p className="text-sm sm:text-base text-gray-650 italic leading-relaxed">
                  "{currentLang === 'en' ? reviewsList[currentReviewIdx].textEn : reviewsList[currentReviewIdx].textFr}"
                </p>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block text-right">
                  – {reviewsList[currentReviewIdx].name}, {currentLang === 'en' ? reviewsList[currentReviewIdx].contextEn : reviewsList[currentReviewIdx].contextFr}
                </span>
              </div>

              <button
                onClick={nextReview}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-all flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </main>

      {/* Closing Banner accent line */}
      <div className="w-full h-1 bg-primary mt-8" />

      {/* Closing Banner block */}
      <section className="bg-teal-50/20 py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {t('detail.closingBanner.title')}
            </h2>
          </div>
          <Link
            to="/catalog"
            className="border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all flex-shrink-0"
          >
            {t('detail.closingBanner.btn')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
