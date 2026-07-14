import './Reviews.css';
import { Icon } from '../../App';
import { useTranslation } from 'react-i18next';

export default function Reviews() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const reviewsList = [
    {
      reviewer: 'Jeff Thomson',
      specialty: isFr ? 'Service de Plomberie' : 'Plumbing Service',
      rating: '5.0',
      stars: 5,
      comment: isFr 
        ? '"Excellent travail! Jeff était très professionnel et a réparé la fuite de ma cuisine rapidement. Hautement recommandé!"' 
        : '"Excellent work! Jeff was very professional and fixed the leak in my kitchen pipe quickly. Highly recommended!"',
      date: isFr ? '10 Mai 2026' : 'May 10, 2026'
    },
    {
      reviewer: 'Mary Clean',
      specialty: isFr ? 'Expert en Nettoyage' : 'Cleaning Expert',
      rating: '4.8',
      stars: 5,
      comment: isFr 
        ? '"Mary et son équipe ont fait un travail fantastique de nettoyage en profondeur. C\'était impeccable. Seul petit bémol, ils sont arrivés 10 minutes en retard, mais dans l\'ensemble super."' 
        : '"Mary and her team did a fantastic job deep cleaning my house. It was spotless. Only small issue was they arrived 10 mins late, but overall great."',
      date: isFr ? '28 Avril 2026' : 'April 28, 2026'
    }
  ];

  return (
    <div className="reviews-page-flat animate-fade-in">
      <h1 className="reviews-flat-title">
        {isFr ? 'Mes Avis de Service' : 'My Service Reviews'}
      </h1>
      
      <div className="reviews-flat-list">
        {reviewsList.map((rev, index) => (
          <div className="review-flat-item" key={index}>
            <div className="review-flat-row-1">
              <h4 className="reviewer-name">{rev.reviewer}</h4>
              <div className="reviewer-rating">
                <span className="star-icon">★</span>
                <strong className="rating-number">{rev.rating}</strong>
              </div>
            </div>
            
            <div className="review-flat-row-2">
              {rev.specialty}
            </div>
            
            <p className="review-flat-comment">
              {rev.comment}
            </p>
            
            <div className="review-flat-row-4">
              {rev.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
