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

// Fallback providers in case livePros is empty or none match
const fallbackPros = [
  { name: 'Jeff Thomson', role: 'Plumbing Specialist', rating: '4.8', distance: '4.2 km away', image: '/assets/pro-jeff-thomson.jpg' },
  { name: 'Samuel Bright', role: 'Electrician', rating: '4.7', distance: '3.6 km away', image: '/assets/pro-samuel-bright.jpg' },
  { name: 'Mary Clean', role: 'Cleaning Expert', rating: '4.9', distance: '2.1 km away', image: '/assets/pro-mary-clean.jpg' },
  { name: 'Peter Wood', role: 'Carpenter', rating: '4.6', distance: '5.3 km away', image: '/assets/pro-peter-wood.jpg' },
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
          // Filter by category matching this skill
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
    const list = livePros.length > 0 ? livePros : fallbackPros;
    const n = displaySkill.toLowerCase();
    
    // Attempt keywords match
    let filtered = list.filter(p => {
      const role = p.role.toLowerCase();
      return role.includes(n) || 
             (n.includes('clean') && role.includes('clean')) ||
             (n.includes('electr') && role.includes('electr')) ||
             (n.includes('plumb') && role.includes('plumb')) ||
             (n.includes('carpentr') && role.includes('carpenter')) ||
             (n.includes('repair') && (role.includes('repair') || role.includes('specialist')));
    });

    // If none match, return all providers as recommended
    return filtered.length > 0 ? filtered : list.slice(0, 3);
  };

  const matchingPros = getMatchingProviders();

  // Multi-language UI texts
  const t = {
    back: isFr ? '← Retour aux avis' : '← Back to Reviews',
    heroSub: isFr 
      ? `Trouvez les meilleurs experts vérifiés en ${displaySkill} à Douala et Yaoundé.`
      : `Hire the best verified ${displaySkill} professionals in Douala & Yaoundé.`,
    providersTitle: isFr ? `Meilleurs Prestataires en ${displaySkill}` : `Top Providers in ${displaySkill}`,
    providersSub: isFr 
      ? 'Prestataires vérifiés avec d\'excellentes évaluations clients.' 
      : 'Verified professionals with high client satisfaction ratings.',
    bookBtn: isFr ? 'Réserver' : 'Book Now',
    reviewsTitle: isFr ? 'Avis Clientèle' : 'Client Reviews',
    noReviews: isFr ? 'Aucun avis disponible pour cette catégorie pour le moment.' : 'No reviews available for this category yet.',
    verified: isFr ? 'Utilisateur vérifié' : 'Verified User',
    hireGuideTitle: isFr ? 'Conseils pour recruter' : 'Hiring Guide & Tips',
    guide1Title: isFr ? '1. Comparez les profils' : '1. Compare Profiles',
    guide1Desc: isFr ? 'Regardez les évaluations et badges de vérification des prestataires avant de réserver.' : 'Review ratings, history, and verification badges before booking.',
    guide2Title: isFr ? '2. Utilisez le chat' : '2. Chat First',
    guide2Desc: isFr ? 'Discutez des détails des travaux et du budget directement dans l\'application Fixam.' : 'Discuss job details, scope, and budget parameters in the Fixam chat.',
    guide3Title: isFr ? '3. Payez en pièces' : '3. Simple Booking',
    guide3Desc: isFr ? 'Réservez à l\'aide de pièces Fixam. Aucun transfert d\'argent liquide n\'est effectué en ligne.' : 'Confirm booking with Fixam coins. Safe and transparent.',
  };

  return (
    <div className="skill-detail-page">
      {/* HERO SECTION */}
      <section className="skill-hero">
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

      {/* TOP PROVIDERS SECTION */}
      <section className="skill-section">
        <div className="skill-container">
          <h2 className="skill-section-title">{t.providersTitle}</h2>
          <p className="skill-section-subtitle">{t.providersSub}</p>

          <div className="skill-providers-grid">
            {matchingPros.map((pro, i) => (
              <div className="skill-pro-card" key={i}>
                <div className="pro-card-header">
                  <img src={pro.image} alt={pro.name} className="pro-card-avatar" />
                  <div className="pro-card-meta">
                    <h3 className="pro-card-name">{pro.name}</h3>
                    <p className="pro-card-role">{pro.role}</p>
                  </div>
                </div>
                <div className="pro-card-body">
                  <div className="pro-rating">
                    <span className="pro-stars">★</span>
                    <span className="pro-rating-num">{pro.rating}</span>
                    <span className="pro-distance">• {pro.distance}</span>
                  </div>
                </div>
                <div className="pro-card-footer">
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
      <section className="skill-section skill-section-alt">
        <div className="skill-container">
          <h2 className="skill-section-title">{t.reviewsTitle}</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              {isFr ? 'Chargement des avis...' : 'Loading reviews...'}
            </div>
          ) : reviews.length === 0 ? (
            <div className="skill-no-reviews">
              <p>{t.noReviews}</p>
              {/* Default fallback reviews to prevent blank page */}
              <div className="skill-reviews-list" style={{ marginTop: '32px' }}>
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
      <section className="skill-section">
        <div className="skill-container">
          <h2 className="skill-section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>{t.hireGuideTitle}</h2>
          
          <div className="skill-guide-grid">
            <div className="guide-card">
              <h3>{t.guide1Title}</h3>
              <p>{t.guide1Desc}</p>
            </div>
            <div className="guide-card">
              <h3>{t.guide2Title}</h3>
              <p>{t.guide2Desc}</p>
            </div>
            <div className="guide-card">
              <h3>{t.guide3Title}</h3>
              <p>{t.guide3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
