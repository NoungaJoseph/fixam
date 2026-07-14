import './FindServices.css';
import { useState } from 'react';
import { Icon, IconName, images } from '../../App';
import { useTranslation } from 'react-i18next';

interface FindServicesProps {
  setSelectedProvider: (pro: any) => void;
  setActiveTab: (tab: string) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveChatUser: (user: string) => void;
}

export default function FindServices({
  setSelectedProvider,
  setActiveTab,
  clientBookings,
  setClientBookings,
  setActiveChatUser
}: FindServicesProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  // Find Services interactive states (relocated locally)
  const [findServicesSearch, setFindServicesSearch] = useState('');
  const [findServicesLoc, setFindServicesLoc] = useState('Douala, Cameroon');
  const [findServicesRating, setFindServicesRating] = useState('All');
  const [findServicesCat, setFindServicesCat] = useState('All Categories');
  const [findServicesPrice, setFindServicesPrice] = useState(5);
  const [availNow, setAvailNow] = useState(false);
  const [availToday, setAvailToday] = useState(false);
  const [serviceTypeInPerson, setServiceTypeInPerson] = useState(true);
  const [serviceTypeRemote, setServiceTypeRemote] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Mock providers list matching original inline code
  const providersList = [
    {
      name: 'CleanMaster',
      role: 'Cleaning Service',
      rating: '4.8',
      reviews: 124,
      location: 'Douala, Cameroon',
      badge: 'Top Rated',
      desc: 'Professional cleaning services for homes, offices and commercial spaces.',
      tags: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
      price: '1 coin',
      image: images.proMary,
      verified: true
    },
    {
      name: 'ElectroFix',
      role: 'Electrical Service',
      rating: '4.9',
      reviews: 98,
      location: 'Douala, Cameroon',
      badge: 'Top Rated',
      desc: 'All electrical installation, repair and maintenance services.',
      tags: ['Installation', 'Wiring', 'Repair'],
      price: '1 coin',
      image: images.proSamuel,
      verified: true
    },
    {
      name: 'Plumber Pro',
      role: 'Plumbing Service',
      rating: '4.7',
      reviews: 86,
      location: 'Douala, Cameroon',
      badge: 'Popular',
      desc: 'Expert plumbing services for residential and commercial needs.',
      tags: ['Pipe Repair', 'Installation', 'Leak Fix'],
      price: '1 coin',
      image: images.proJeff,
      verified: true
    },
    {
      name: 'PaintPro',
      role: 'Painting Service',
      rating: '4.6',
      reviews: 72,
      location: 'Douala, Cameroon',
      badge: 'Rising Star',
      desc: 'Professional painting services with quality finishing.',
      tags: ['Interior Painting', 'Exterior Painting', 'Wall Painting'],
      price: '1 coin',
      image: images.proPeter,
      verified: true
    }
  ];

  // Filter logic simulation
  const filteredProviders = providersList.filter(p => {
    if (findServicesSearch && !p.name.toLowerCase().includes(findServicesSearch.toLowerCase()) && !p.role.toLowerCase().includes(findServicesSearch.toLowerCase())) {
      return false;
    }
    if (findServicesCat !== 'All Categories' && p.role.toLowerCase() !== findServicesCat.toLowerCase()) {
      return false;
    }
    if (findServicesRating === '4.5 & up' && Number(p.rating) < 4.5) return false;
    if (findServicesRating === '4.0 & up' && Number(p.rating) < 4.0) return false;
    
    return true;
  });

  return (
    <div className="find-services-page animate-fade-in">
      <div className="find-services-header">
        <h2>Find Services</h2>
        <p>Find verified professionals for any service you need.</p>
      </div>

      <div className="search-bar-row-fs">
        <div className="input-wrapper-fs query-input">
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="What service do you need?" 
            value={findServicesSearch}
            onChange={(e) => setFindServicesSearch(e.target.value)}
          />
        </div>
        <div className="input-wrapper-fs location-input">
          <Icon name="location" />
          <input 
            type="text" 
            placeholder="Location" 
            value={findServicesLoc}
            onChange={(e) => setFindServicesLoc(e.target.value)}
          />
        </div>
        <button className="btn-search-fs" onClick={() => alert('Search initiated!')}>Search</button>
      </div>

      <div className="popular-searches-row-fs">
        <span>Popular Searches:</span>
        {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'AC Repair', 'Carpentry'].map(keyword => (
          <button 
            type="button" 
            key={keyword}
            onClick={() => setFindServicesSearch(keyword)}
            className="popular-search-tag-fs"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div className="categories-scroll-row-fs">
        <div className="categories-scroll-wrapper-fs">
          {[
            { name: 'Cleaning', icon: 'cleaning' as IconName },
            { name: 'Plumbing', icon: 'plumbing' as IconName },
            { name: 'Electrical', icon: 'electrical' as IconName },
            { name: 'Painting', icon: 'painting' as IconName },
            { name: 'Carpentry', icon: 'wrench' as IconName },
            { name: 'AC Repair', icon: 'appliance' as IconName },
            { name: 'Pest Control', icon: 'shield' as IconName }
          ].map((c) => (
            <button 
              type="button" 
              key={c.name}
              onClick={() => setFindServicesCat(c.name + ' Service')}
              className={`category-scroll-item-fs ${findServicesCat === c.name + ' Service' ? 'active' : ''}`}
            >
              <div className="cat-icon-fs"><Icon name={c.icon} /></div>
              <div className="cat-details-fs">
                <strong>{c.name}</strong>
              </div>
            </button>
          ))}
          <button type="button" className="category-scroll-item-fs more-btn" onClick={() => setFindServicesCat('All Categories')}>
            <div className="cat-icon-fs"><Icon name="menu" /></div>
            <div className="cat-details-fs">
              <strong>More</strong>
            </div>
          </button>
        </div>
      </div>

      <div className="fs-directory-layout">
        <div className="fs-directory-left">
          <div className="fs-results-header">
            <span>{isFr ? 'Affichage de' : 'Showing'} {filteredProviders.length} {isFr ? 'prestataires' : 'providers'}</span>
            <div className="fs-results-actions">
              <button type="button" className="btn-mobile-filters-trigger" onClick={() => setIsFiltersOpen(true)}>
                <Icon name="menu" /> {isFr ? 'Filtres' : 'Filters'}
              </button>
              <div className="fs-sort-dropdown">
                <span>{isFr ? 'Trier par: ' : 'Sort by: '}</span>
                <select>
                  <option>{isFr ? 'Recommandé' : 'Recommended'}</option>
                  <option>{isFr ? 'Note: du plus élevé au plus bas' : 'Rating: High to Low'}</option>
                  <option>{isFr ? 'Prix: du plus bas au plus élevé' : 'Price: Low to High'}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="fs-providers-list">
            {filteredProviders.map((p, idx) => (
              <div className="provider-card" key={idx}>
                {/* ROW 1: Avatar + Name + badge */}
                <div className="provider-card-row-1">
                  <img src={p.image} alt={p.name} className="provider-avatar" />
                  <div className="provider-info-col">
                    <h3 className="provider-name">
                      {p.name} 
                      {p.verified && <span className="verified-badge-inline">✓</span>}
                    </h3>
                    <span className="provider-category">{p.role}</span>
                    <span className="provider-location"><Icon name="location" /> {p.location}</span>
                  </div>
                  {p.badge && (
                    <span className="provider-top-rated-badge">
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* ROW 2: Rating + Price */}
                <div className="provider-card-row-2">
                  <div className="provider-rating">
                    <span className="star-icon">★</span>
                    <strong>{p.rating}</strong>
                    <span className="reviews-count">({p.reviews} {isFr ? 'avis' : 'reviews'})</span>
                  </div>
                  <div className="provider-price">
                    {isFr ? `À partir de ${p.price.split(' ')[0]} pièce / h` : `From ${p.price} / hr`}
                  </div>
                </div>

                {/* ROW 3: Action buttons */}
                <div className="provider-card-row-3">
                  <button type="button" className="btn-view-profile-flat" onClick={() => setSelectedProvider(p)}>
                    {isFr ? 'Voir le Profil' : 'View Profile'}
                  </button>
                  <button type="button" className="btn-chat-icon-flat" onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(p.name);
                  }} aria-label="Chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chat-svg-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="fs-pagination-row">
            <button className="page-arrow" disabled>&lt;</button>
            <button className="page-num active">1</button>
            <button className="page-num" onClick={() => alert('Go to page 2')}>2</button>
            <button className="page-num" onClick={() => alert('Go to page 3')}>3</button>
            <button className="page-num" onClick={() => alert('Go to page 4')}>4</button>
            <button className="page-num" onClick={() => alert('Go to page 5')}>5</button>
            <span className="page-dots">...</span>
            <button className="page-num" onClick={() => alert('Go to last page')}>27</button>
            <button className="page-arrow" onClick={() => alert('Next page')}>&gt;</button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Filter Overlay */}
      <div className={`filter-overlay ${isFiltersOpen ? 'active' : ''}`} onClick={() => setIsFiltersOpen(false)}></div>
      <div className={`filter-sheet ${isFiltersOpen ? 'open' : ''}`}>
        <div className="filter-handle" onClick={() => setIsFiltersOpen(false)}></div>
        
        <div className="filter-sheet-header">
          <h3>{isFr ? 'Filtres' : 'Filters'}</h3>
          <button type="button" className="btn-clear-filters-flat" onClick={() => {
            setFindServicesSearch('');
            setFindServicesCat('All Categories');
            setFindServicesRating('All');
            setFindServicesPrice(5);
            setAvailNow(false);
            setAvailToday(false);
            setServiceTypeInPerson(true);
            setServiceTypeRemote(false);
          }}>{isFr ? 'Effacer tout' : 'Clear all'}</button>
        </div>

        <div className="filter-group-flat">
          <label className="filter-lbl-flat-name">{isFr ? 'Emplacement' : 'Location'}</label>
          <select className="filter-select-flat-input" value={findServicesLoc} onChange={(e) => setFindServicesLoc(e.target.value)}>
            <option value="Douala, Cameroon">Douala, Cameroon</option>
            <option value="Yaoundé, Cameroon">Yaoundé, Cameroon</option>
          </select>
        </div>

        <div className="filter-group-flat">
          <label className="filter-lbl-flat-name">Category</label>
          <select className="filter-select-flat-input" value={findServicesCat} onChange={(e) => setFindServicesCat(e.target.value)}>
            <option value="All Categories">{isFr ? 'Toutes Catégories' : 'All Categories'}</option>
            <option value="Cleaning Service">{isFr ? 'Service de Nettoyage' : 'Cleaning Service'}</option>
            <option value="Plumbing Service">{isFr ? 'Service de Plomberie' : 'Plumbing Service'}</option>
            <option value="Electrical Service">{isFr ? 'Service Électrique' : 'Electrical Service'}</option>
            <option value="Painting Service">{isFr ? 'Service de Peinture' : 'Painting Service'}</option>
            <option value="Carpentry Service">{isFr ? 'Service de Menuiserie' : 'Carpentry Service'}</option>
          </select>
        </div>

        <div className="filter-group-flat">
          <label className="filter-lbl-flat-name">{isFr ? 'Prix (par heure)' : 'Price (per hour)'}</label>
          <div className="price-slider-flat-box">
            <input 
              type="range" 
              min="0" 
              max="5" 
              value={findServicesPrice}
              onChange={(e) => setFindServicesPrice(Number(e.target.value))}
              className="price-slider-flat-range"
            />
            <div className="price-slider-flat-labels">
              <span>0 coin</span>
              <span>{findServicesPrice === 5 ? '5+ coins' : `${findServicesPrice} coins`}</span>
            </div>
          </div>
        </div>

        <div className="filter-group-flat">
          <label className="filter-lbl-flat-name">{isFr ? 'Note du Prestataire' : 'Provider Rating'}</label>
          <div className="filter-rating-flat-options">
            {['All', '4.0 & up', '4.5 & up'].map((ratingOpt) => (
              <button 
                type="button" 
                key={ratingOpt}
                className={`rating-pill-flat-btn ${findServicesRating === ratingOpt ? 'active' : ''}`}
                onClick={() => setFindServicesRating(ratingOpt)}
              >
                {ratingOpt === 'All' ? (isFr ? 'Tous' : 'All') : `${ratingOpt.split(' ')[0]}★ & up`}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group-flat">
          <label className="filter-lbl-flat-name">{isFr ? 'Disponibilité' : 'Availability'}</label>
          <label className="checkbox-flat-row">
            <input type="checkbox" checked={availNow} onChange={(e) => setAvailNow(e.target.checked)} />
            <span>{isFr ? 'Disponible Immédiatement' : 'Available Now'}</span>
          </label>
          <label className="checkbox-flat-row">
            <input type="checkbox" checked={availToday} onChange={(e) => setAvailToday(e.target.checked)} />
            <span>{isFr ? 'Disponible Aujourd\'hui' : 'Available Today'}</span>
          </label>
        </div>

        <div className="filter-group-flat">
          <label className="filter-lbl-flat-name">{isFr ? 'Type de Service' : 'Service Type'}</label>
          <label className="checkbox-flat-row">
            <input type="checkbox" checked={serviceTypeInPerson} onChange={(e) => setServiceTypeInPerson(e.target.checked)} />
            <span>{isFr ? 'En Personne' : 'In Person'}</span>
          </label>
          <label className="checkbox-flat-row">
            <input type="checkbox" checked={serviceTypeRemote} onChange={(e) => setServiceTypeRemote(e.target.checked)} />
            <span>{isFr ? 'À Distance' : 'Remote'}</span>
          </label>
        </div>

        <button type="button" className="btn-apply-flat-filters" onClick={() => { setIsFiltersOpen(false); alert(isFr ? 'Filtres appliqués !' : 'Filters applied!'); }}>
          {isFr ? 'Appliquer les Filtres' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
}
