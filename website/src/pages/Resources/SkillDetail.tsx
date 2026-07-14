import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer, getApiUrl } from '../../App';
import './SkillDetail.css';

interface SkillDetailProps {
  onNavigate: (page: Page) => void;
  skillName: string;
  onSelectSkill: (skill: string) => void;
  livePros: any[];
}

const getSkillHeaderImage = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('clean') || n.includes('ménage') || n.includes('nettoyage')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('electr') || n.includes('wiring') || n.includes('électric')) {
    return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('plumb') || n.includes('pipe') || n.includes('plomb')) {
    return 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('secur') || n.includes('cctv') || n.includes('sécurit')) {
    return 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('mov') || n.includes('deliver') || n.includes('déménag') || n.includes('livrais')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('paint') || n.includes('peint') || n.includes('decor')) {
    return 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('carpentr') || n.includes('wood') || n.includes('menuis')) {
    return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('beaut') || n.includes('makeup') || n.includes('hair') || n.includes('nail') || n.includes('coiff') || n.includes('maquill')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('tutor') || n.includes('school') || n.includes('cours')) {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('garden') || n.includes('pool') || n.includes('jardin')) {
    return 'https://images.unsplash.com/photo-1558904541-efa8c1a68f6f?w=1600&auto=format&fit=crop&q=80';
  }
  if (n.includes('catering') || n.includes('cook') || n.includes('traiteur')) {
    return 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&auto=format&fit=crop&q=80';
};

const getSkillStory = (name: string, isFr: boolean) => {
  const n = name.toLowerCase();
  
  if (n.includes('clean') || n.includes('ménage') || n.includes('nettoyage')) {
    return {
      challenge: isFr 
        ? "Trouver une femme de ménage honnête et méticuleuse à Douala ou Yaoundé relevait du parcours du combattant. De nombreux foyers devaient faire face à des retards constants, à une tarification obscure ou à des soucis de sécurité."
        : "Finding a trustworthy, detailed house cleaner in Douala or Yaoundé has historically been a stressful gamble. Clients faced unpredictable pricing, late arrivals, and constant safety concerns when inviting strangers in.",
      solution: isFr
        ? "Fixam a changé la donne en vérifiant minutieusement l'identité de chaque femme de ménage. Les clients réservent en toute sécurité et les prestataires accèdent à un flux régulier de clients, triplant ainsi leurs revenus mensuels."
        : "Fixam solved this by introducing verified, pre-screened cleaners. Clients can book with total peace of mind, while professional cleaners gain a consistent client pipeline, doubling or tripling their monthly income.",
    };
  }
  
  if (n.includes('electr') || n.includes('wiring') || n.includes('électric')) {
    return {
      challenge: isFr 
        ? "Les pannes électriques et les courts-circuits présentent des risques majeurs d'incendie. Pourtant, recruter un électricien qualifié sans se faire surfacturer était auparavant presque impossible."
        : "Electrical failures and faulty wiring present serious fire hazards. Previously, finding a qualified electrician who wouldn't overcharge or leave tasks half-finished was incredibly difficult for local homeowners.",
      solution: isFr
        ? "Grâce à notre plateforme, les clients ont accès à des électriciens certifiés avec des avis transparents. Nos électriciens partenaires ont pu développer leur entreprise en s'équipant de matériel professionnel grâce à leurs gains réguliers."
        : "With Fixam, homeowners easily connect with certified local electricians backed by authentic reviews. Our partner electricians have grown their businesses, using steady earnings to buy advanced diagnostic tools.",
    };
  }

  if (n.includes('plumb') || n.includes('pipe') || n.includes('plomb')) {
    return {
      challenge: isFr 
        ? "Une fuite d'eau non traitée peut détruire les fondations d'une maison en quelques heures. Trouver un plombier disponible immédiatement sans tarification abusive était une source d'angoisse constante."
        : "A plumbing emergency like a burst pipe can ruin a home in hours. Finding a plumber who is available immediately and won't charge exorbitant rates was a major source of stress.",
      solution: isFr
        ? "Fixam met instantanément les clients en relation avec des plombiers de proximité qualifiés. Les plombiers obtiennent des contrats récurrents et les clients évitent des sinistres coûteux grâce à des interventions rapides."
        : "Fixam connects clients instantly to nearby plumbing professionals. Local plumbers secure steady bookings without marketing costs, while homeowners prevent expensive damage with rapid responses.",
    };
  }

  if (n.includes('secur') || n.includes('cctv') || n.includes('sécurit')) {
    return {
      challenge: isFr 
        ? "Sécuriser son domicile ou son commerce est primordial, mais le marché des installateurs de caméras regorge d'amateurs non qualifiés mettant en péril la confidentialité de vos réseaux."
        : "Securing your home or shop is a priority, but the local installer market has been filled with uncertified handymen, leading to poorly positioned cameras and compromised network security.",
      solution: isFr
        ? "Fixam propose des techniciens en sécurité certifiés. Les clients obtiennent des installations professionnelles conformes, tandis que les experts en sécurité construisent une réputation solide grâce à des avis vérifiés."
        : "Fixam filters for certified security technicians. Clients get professional security setups they can trust, while skilled security pros build reliable local reputations through verified customer feedback.",
    };
  }

  if (n.includes('mov') || n.includes('deliver') || n.includes('déménag') || n.includes('livrais')) {
    return {
      challenge: isFr 
        ? "Déménager ou faire livrer des marchandises précieuses s'accompagnait souvent de casse, de pertes ou de hausses de prix inattendues au moment du déchargement."
        : "Moving homes or delivering valuable goods was frequently plagued by broken items, hidden transport fees sprung on clients during unloading, and unreliable transport schedules.",
      solution: isFr
        ? "Fixam met en relation les clients avec des transporteurs professionnels ayant des véhicules adaptés. Les prix sont convenus à l'avance et le suivi rassure les clients tout en assurant des livraisons régulières aux chauffeurs."
        : "Fixam matches clients with verified moving teams with proper trucks. Rates are locked in upfront via chat, protecting clients, while truck owners enjoy consistent cargo and furniture moving gigs.",
    };
  }

  if (n.includes('beaut') || n.includes('makeup') || n.includes('hair') || n.includes('nail') || n.includes('coiff') || n.includes('maquill')) {
    return {
      challenge: isFr 
        ? "Pour des événements importants, trouver une maquilleuse ou un coiffeur à domicile qualifié et ponctuel impliquait des heures de recherche fastidieuse sur les réseaux sociaux."
        : "For special events or weddings, finding a skilled hairstylist or makeup artist who will actually arrive at your home on time required hours of scrolling through unverified social media profiles.",
      solution: isFr
        ? "Les professionnels de la beauté sur Fixam présentent leur portfolio et sont réservés d'un simple clic. Les salons à domicile prospèrent et les clients rayonnent sans le stress des déplacements."
        : "Beauty professionals on Fixam showcase their portfolios and get booked in one click. Clients get professional styling in the comfort of their homes, while beauty specialists scale their private client list.",
    };
  }

  return {
    challenge: isFr 
      ? "Le plus grand défi des services locaux au Cameroun a toujours été le manque de confiance et de transparence. Les clients craignaient le travail bâclé, tandis que les professionnels qualifiés peinaient à trouver des clients."
      : "The biggest challenge in local services across Cameroon has been the lack of trust and transparency. Clients struggled with sub-par handymen, while highly skilled pros remained invisible to those searching for help.",
    solution: isFr
      ? "Fixam sert de pont de confiance. Grâce aux profils vérifiés et aux évaluations réelles, les clients embauchent en toute sérénité et les professionnels locaux accèdent à une indépendance financière durable."
      : "Fixam serves as the bridge of trust. Through verified identities and transparent user reviews, clients hire with confidence, while honest Cameroonian professionals secure sustainable financial independence.",
  };
};

const detailedFallbackPros = [
  { 
    name: 'Jeff Thomson', 
    role: 'Plumbing Specialist', 
    rating: '4.8', 
    distance: '4.2 km away', 
    image: '/assets/pro-jeff-thomson.jpg',
    achievementsEn: 'Completed 64 piping and drainage repair tasks in Douala. Expert in leak detection and emergency pipe replacement.',
    achievementsFr: 'A complété 64 réparations de tuyauterie et drainage à Douala. Expert en détection de fuites et remplacement de tuyaux.',
    review: {
      stars: 5,
      author: 'Sandrine K.',
      textEn: 'Jeff arrived within 30 minutes for my burst pipe emergency. He fixed it quickly and charged exactly what we agreed on. Highly professional!',
      textFr: 'Jeff est arrivé en 30 minutes pour ma fuite d\'eau urgente. Il l\'a réparée rapidement et a facturé exactement le prix convenu. Très professionnel !'
    }
  },
  { 
    name: 'Samuel Bright', 
    role: 'Electrician', 
    rating: '4.7', 
    distance: '3.6 km away', 
    image: '/assets/pro-samuel-bright.jpg',
    achievementsEn: 'Installed smart meters and completed full rewiring projects for 40+ homes in Yaoundé. Perfect safety record.',
    achievementsFr: 'A installé des compteurs intelligents et refait le câblage de plus de 40 maisons à Yaoundé. Bilan de sécurité parfait.',
    review: {
      stars: 5,
      author: 'Paul B.',
      textEn: 'Very knowledgeable electrician. He identified the short circuit in my kitchen wiring in 10 minutes and completed the repairs safely.',
      textFr: 'Électricien très compétent. Il a identifié le court-circuit dans ma cuisine en 10 minutes et a terminé les réparations en toute sécurité.'
    }
  },
  { 
    name: 'Mary Clean', 
    role: 'Cleaning Expert', 
    rating: '4.9', 
    distance: '2.1 km away', 
    image: '/assets/pro-mary-clean.jpg',
    achievementsEn: 'Provided deep sanitization, home cleaning, and office cleaning for over 120 recurring clients. Exceptional attention to detail.',
    achievementsFr: 'A fourni des nettoyages en profondeur pour plus de 120 clients récurrents. Attention exceptionnelle aux détails.',
    review: {
      stars: 5,
      author: 'Marie N.',
      textEn: 'Mary does an incredible job. My house is absolutely sparkling. She is punctual, polite, and brings all her own supplies.',
      textFr: 'Mary fait un travail incroyable. Ma maison est absolument étincelante. Elle est ponctuelle, polie et apporte tout son matériel.'
    }
  },
  { 
    name: 'Peter Wood', 
    role: 'Carpenter', 
    rating: '4.6', 
    distance: '5.3 km away', 
    image: '/assets/pro-peter-wood.jpg',
    achievementsEn: 'Handcrafted custom wood furniture and completed cabinet repairs for 35+ local households. Wood finishing specialist.',
    achievementsFr: 'A fabriqué des meubles sur mesure et réparé des placards pour plus de 35 foyers. Spécialiste des finitions bois.',
    review: {
      stars: 4,
      author: 'Alain T.',
      textEn: 'Excellent carpenter. He repaired my broken dining table doors. The finish is beautiful and looks brand new.',
      textFr: 'Excellent menuisier. Il a réparé les portes de ma table à manger. La finition est magnifique et a l\'air neuve.'
    }
  },
];

export default function SkillDetail({ onNavigate, skillName, onSelectSkill, livePros }: SkillDetailProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const displaySkill = skillName || (isFr ? 'Service Professionnel' : 'Professional Service');
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map skill name to review category
  const getReviewCategory = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('clean') || n.includes('ménage') || n.includes('nettoyage')) return 'Cleaning';
    if (n.includes('electr') || n.includes('wiring') || n.includes('électric')) return 'Electrical';
    if (n.includes('plumb') || n.includes('pipe') || n.includes('plomb')) return 'Plumbing';
    if (n.includes('secur') || n.includes('cctv') || n.includes('sécurit')) return 'Security';
    if (n.includes('mov') || n.includes('deliver') || n.includes('déménag') || n.includes('livrais')) return 'Moving & Delivery';
    if (n.includes('repair') || n.includes('carpentr') || n.includes('generator') || n.includes('ac ') || n.includes('weld') || n.includes('roof')) return 'Repairs';
    if (n.includes('beaut') || n.includes('makeup') || n.includes('hair') || n.includes('nail') || n.includes('coiff')) return 'Beauty & Wellness';
    return 'Home Services';
  };

  const reviewCategory = getReviewCategory(displaySkill);
  const story = getSkillStory(displaySkill, isFr);
  const headerBgImage = getSkillHeaderImage(displaySkill);

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/reviews`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((r: any) => {
            const category = r.job?.category || r.booking?.task?.category || 'Home Services';
            const reviewerName = r.reviewer?.fullName || 'Verified User';
            return {
              title: r.comment ? (r.comment.length > 30 ? `${r.comment.slice(0, 30)}...` : r.comment) : 'Service Review',
              rating: r.rating,
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'May 2026',
              category: category,
              text: r.comment || 'Excellent service provider! Highly recommended.',
              reviewer: reviewerName
            };
          });
          const filtered = mapped.filter((r: any) => r.category === reviewCategory);
          setReviews(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch skill reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [reviewCategory]);

  // Filter providers matching this skill
  const getMatchingProviders = () => {
    // We map custom achievements and reviews to live database pros dynamically
    const list = livePros.length > 0 ? livePros : [];
    
    const enrichedLive = list.map((p, idx) => {
      const fallbackTemplate = detailedFallbackPros[idx % detailedFallbackPros.length];
      return {
        ...p,
        achievementsEn: `Highly experienced in ${displaySkill}. Completed multiple verified contracts on Fixam.`,
        achievementsFr: `Grandement expérimenté en ${displaySkill}. A complété de nombreuses prestations sur Fixam.`,
        review: {
          stars: 5,
          author: isFr ? 'Client Vérifié' : 'Verified Client',
          textEn: 'Excellent service provider! Arrived on time and was very helpful.',
          textFr: 'Excellent prestataire ! Arrivé à l\'heure et a été d\'une grande aide.'
        }
      };
    });

    const combinedList = [...enrichedLive, ...detailedFallbackPros];
    const n = displaySkill.toLowerCase();
    
    let filtered = combinedList.filter(p => {
      const role = p.role.toLowerCase();
      return role.includes(n) || 
             (n.includes('clean') && role.includes('clean')) ||
             (n.includes('electr') && role.includes('electr')) ||
             (n.includes('plumb') && role.includes('plumb')) ||
             (n.includes('carpentr') && role.includes('carpenter')) ||
             (n.includes('repair') && (role.includes('repair') || role.includes('specialist')));
    });

    return filtered.length > 0 ? filtered.slice(0, 3) : combinedList.slice(0, 3);
  };

  const matchingPros = getMatchingProviders();

  // Multi-language UI texts
  const t = {
    back: isFr ? '← Retour aux avis' : '← Back to Reviews',
    heroSub: isFr 
      ? `Trouvez les meilleurs experts vérifiés en ${displaySkill} à Douala et Yaoundé.`
      : `Hire the best verified ${displaySkill} professionals in Douala & Yaoundé.`,
    
    storyTitle: isFr ? 'Le Défi & La Solution Fixam' : 'The Challenge & The Fixam Solution',
    storyChallengeLabel: isFr ? 'Le Problème :' : 'The Challenge:',
    storySolutionLabel: isFr ? 'La Solution Fixam :' : 'The Fixam Solution:',
    
    providersTitle: isFr ? `Meilleurs Prestataires en ${displaySkill}` : `Top Providers in ${displaySkill}`,
    providersSub: isFr 
      ? 'Découvrez ce qu\'ils ont accompli et lisez les avis de leurs clients.' 
      : 'Learn what they have accomplished and read direct client reviews.',
    bookBtn: isFr ? 'Réserver' : 'Book Now',
    reviewsTitle: isFr ? 'Derniers Avis Clientèle' : 'Recent Client Reviews',
    noReviews: isFr ? 'Aucun avis disponible pour cette catégorie pour le moment.' : 'No reviews available for this category yet.',
    
    guideTitle: isFr ? `Guide d'Embauche : ${displaySkill}` : `Hiring Guide: ${displaySkill}`,
    guideSub: isFr 
      ? 'Processus simple, sécurisé, et paiement en espèces uniquement.' 
      : 'Simple, secure process, and cash-only payments.',
    
    step1Title: isFr ? '1. Décrivez votre besoin' : '1. Explain What You Need',
    step1Desc: isFr 
      ? `Publiez votre tâche gratuitement. Pour les travaux en ${displaySkill}, spécifiez les détails précis (taille de la pièce, type de panne, urgence).`
      : `Post your task for free. For ${displaySkill} jobs, detail the exact requirements (room size, appliance model, urgency level).`,
    
    step2Title: isFr ? '2. Choisissez et liez sur l\'appli' : '2. Connect on the App',
    step2Desc: isFr 
      ? 'Consultez les profils et réservez le prestataire idéal avec vos pièces Fixam (1 pièce). Les pièces servent uniquement à vous mettre en relation.'
      : 'Browse verified profiles and lock in your provider on the app using 1-3 Fixam coins. Coins are strictly used to connect you.',
    
    step3Title: isFr ? '3. Paiement en espèces uniquement' : '3. Cash-Only Payment',
    step3Desc: isFr 
      ? 'TRÈS IMPORTANT : Le paiement du travail se fait uniquement en espèces (cash) directement au prestataire une fois le service inspecté et complété.'
      : 'VERY IMPORTANT: You pay the provider directly in cash only upon job completion and inspect. No money transfers happen in the app.',
  };

  return (
    <div className="skill-detail-page">
      {/* HERO SECTION */}
      <section className="skill-hero" style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7)), url(${headerBgImage})` }}>
        <div className="skill-container">
          <button className="skill-back-btn" onClick={() => onNavigate('reviews')}>
            {t.back}
          </button>
          <div className="skill-hero-content">
            <h1>{displaySkill}</h1>
            <p className="skill-hero-subtext">{t.heroSub}</p>
            <button className="btn-teal-pill" onClick={() => onNavigate('register')}>
              {isFr ? 'Trouver un prestataire' : 'Find a Provider'}
            </button>
          </div>
        </div>
      </section>

      {/* CHALLENGE & IMPACT SECTION */}
      <section className="skill-section story-section">
        <div className="skill-container">
          <div className="story-box">
            <h2 className="story-title">{t.storyTitle}</h2>
            <div className="story-grid-two">
              <div className="story-challenge-card">
                <h3>{t.storyChallengeLabel}</h3>
                <p>{story.challenge}</p>
              </div>
              <div className="story-solution-card">
                <h3>{t.storySolutionLabel}</h3>
                <p>{story.solution}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP PROVIDERS SECTION */}
      <section className="skill-section skill-section-alt">
        <div className="skill-container">
          <h2 className="skill-section-title" style={{ textAlign: 'center' }}>{t.providersTitle}</h2>
          <p className="skill-section-subtitle" style={{ textAlign: 'center', marginBottom: '48px' }}>{t.providersSub}</p>

          <div className="skill-providers-grid">
            {matchingPros.map((pro, i) => (
              <div className="skill-pro-card" key={i}>
                <div>
                  <div className="pro-card-header">
                    <img src={pro.image} alt={pro.name} className="pro-card-avatar" />
                    <div className="pro-card-meta">
                      <h3 className="pro-card-name">{pro.name}</h3>
                      <p className="pro-card-role">{pro.role}</p>
                    </div>
                  </div>
                  <div className="pro-card-body">
                    <div className="pro-rating" style={{ marginBottom: '16px' }}>
                      <span className="pro-stars">★</span>
                      <span className="pro-rating-num">{pro.rating}</span>
                      <span className="pro-distance">• {pro.distance}</span>
                    </div>
                    <div className="pro-achievements">
                      <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#6B7280', margin: '0 0 4px 0', letterSpacing: '0.05em' }}>
                        {isFr ? 'Réalisations' : 'Accomplishments'}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#4B5563', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                        {isFr ? pro.achievementsFr : pro.achievementsEn}
                      </p>
                    </div>
                    
                    {/* Featured Review */}
                    <div className="pro-featured-review">
                      <div className="review-quote-mark">“</div>
                      <p className="review-quote-text">
                        {isFr ? pro.review.textFr : pro.review.textEn}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span className="review-quote-author">— {pro.review.author}</span>
                        <span className="review-quote-stars">
                          {"★".repeat(pro.review.stars)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pro-card-footer" style={{ marginTop: '20px' }}>
                  <button className="btn-teal-pill pro-book-btn" onClick={() => onNavigate('register')}>
                    {t.bookBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="skill-section">
        <div className="skill-container">
          <h2 className="skill-section-title">{t.reviewsTitle}</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              {isFr ? 'Chargement des avis...' : 'Loading reviews...'}
            </div>
          ) : reviews.length === 0 ? (
            <div className="skill-no-reviews">
              <p>{t.noReviews}</p>
              <div className="skill-reviews-list" style={{ marginTop: '24px' }}>
                <div className="skill-review-item">
                  <div className="review-item-header">
                    <h4>{isFr ? 'Prestation impeccable' : 'Excellent work'}</h4>
                    <span className="review-stars">★★★★★</span>
                  </div>
                  <p className="review-text">
                    {isFr 
                      ? 'Prestataire ponctuel et très professionnel. Le travail a été fait rapidement.' 
                      : 'Very punctual and professional provider. The task was done correctly and clean.'}
                  </p>
                  <span className="review-author">— Franck T.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="skill-reviews-list">
              {reviews.map((r, i) => (
                <div className="skill-review-item" key={i}>
                  <div className="review-item-header">
                    <h4>"{r.title}"</h4>
                    <span className="review-stars">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="review-text">{r.text}</p>
                  <span className="review-author">— {r.reviewer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HIRING GUIDE SECTION */}
      <section className="skill-section skill-section-alt">
        <div className="skill-container">
          <h2 className="skill-section-title" style={{ textAlign: 'center' }}>{t.guideTitle}</h2>
          <p className="skill-section-subtitle" style={{ textAlign: 'center', marginBottom: '48px' }}>{t.guideSub}</p>
          
          <div className="skill-guide-grid">
            <div className="guide-card">
              <h3>{t.step1Title}</h3>
              <p>{t.step1Desc}</p>
            </div>
            <div className="guide-card">
              <h3>{t.step2Title}</h3>
              <p>{t.step2Desc}</p>
            </div>
            <div className="guide-card cash-highlight">
              <h3>{t.step3Title}</h3>
              <p>{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
