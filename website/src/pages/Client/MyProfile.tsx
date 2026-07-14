import './MyProfile.css';
import { useState } from 'react';
import { Icon, images } from '../../App';
import { useTranslation } from 'react-i18next';

interface MyProfileProps {
  setActiveTab: (tab: string) => void;
}

export default function MyProfile({ setActiveTab }: MyProfileProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [profileActiveSubTab, setProfileActiveSubTab] = useState('Overview');

  return (
    <div className="profile-tab-container animate-fade-in">
      
      {/* PROFILE HEADER (no card, sits on page) */}
      <div className="profile-flat-header">
        <button className="btn-edit-profile-flat-link" onClick={() => alert(isFr ? 'Modification du profil à venir !' : 'Edit Profile modal coming soon!')}>
          ✏️ {isFr ? 'Modifier le Profil' : 'Edit Profile'}
        </button>

        <div className="profile-flat-avatar-section">
          <div className="profile-flat-avatar-big">
            <img src={images.proJeff} alt="Nounga" />
          </div>
          <h2 className="profile-flat-username">Nounga</h2>
          
          <div className="profile-flat-verified-badge">
            ✓ {isFr ? 'Vérifié' : 'Verified'}
          </div>

          <div className="profile-flat-contact-info">
            <div className="contact-info-row">
              <span className="contact-icon">📧</span> nounga@gmail.com
            </div>
            <div className="contact-info-row">
              <span className="contact-icon">📞</span> +237 6 98 76 54 32
            </div>
            <div className="contact-info-row">
              <span className="contact-icon">📍</span> Douala, Cameroon
            </div>
          </div>

          <div className="profile-flat-role-badge">
            {isFr ? 'Compte Client' : 'Client Account'}
          </div>
        </div>

        <div className="profile-flat-meta-columns">
          <div className="meta-col">
            <span className="meta-lbl">{isFr ? 'MEMBRE DEPUIS' : 'MEMBER SINCE'}</span>
            <strong className="meta-val">May 15, 2024</strong>
          </div>
          <div className="meta-col">
            <span className="meta-lbl">{isFr ? 'STATUT DU COMPTE' : 'ACCOUNT STATUS'}</span>
            <strong className="meta-val status-green">{isFr ? 'Actif' : 'Active'}</strong>
          </div>
        </div>
      </div>

      {/* TABS (Overview / Bookings / Reviews) */}
      <div className="profile-flat-tabs">
        {['Overview', 'Bookings', 'Reviews', 'Payments', 'Saved Providers', 'Preferences', 'Settings'].map((subTab) => {
          let label = subTab;
          if (isFr) {
            if (subTab === 'Overview') label = 'Aperçu';
            else if (subTab === 'Bookings') label = 'Réservations';
            else if (subTab === 'Reviews') label = 'Avis';
            else if (subTab === 'Payments') label = 'Paiements';
            else if (subTab === 'Saved Providers') label = 'Favoris';
            else if (subTab === 'Preferences') label = 'Préférences';
            else if (subTab === 'Settings') label = 'Paramètres';
          }
          return (
            <button 
              key={subTab} 
              className={`profile-flat-tab-btn ${profileActiveSubTab === subTab ? 'active' : ''}`}
              onClick={() => setProfileActiveSubTab(subTab)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {profileActiveSubTab === 'Overview' && (
        <div className="profile-overview-layout">
          <div className="profile-overview-left">
            <div className="profile-flat-about-section">
              <h3 className="section-flat-heading">{isFr ? 'À Propos de Moi' : 'About Me'}</h3>
              <p className="about-text">
                {isFr 
                  ? "Je suis un propriétaire d'entreprise basé à Douala. J'utilise Fixam pour trouver des professionnels fiables et vérifiés pour tous mes besoins à domicile et au bureau. Le service de qualité et la confiance sont mes priorités absolues."
                  : "I'm a business owner based in Douala. I use Fixam to find reliable and verified professionals for all my home and office needs. Quality service and trust are my top priorities."}
              </p>
            </div>

            <div className="profile-flat-info-section">
              <h3 className="section-flat-heading">{isFr ? 'Informations Personnelles' : 'Personal Information'}</h3>
              <div className="flat-info-list">
                <div className="flat-info-row">
                  <span className="flat-info-icon">👤</span>
                  <div className="flat-info-content">
                    <span className="flat-info-lbl">{isFr ? 'Nom Complet' : 'Full Name'}</span>
                    <strong className="flat-info-val">Nounga</strong>
                  </div>
                </div>

                <div className="flat-info-row">
                  <span className="flat-info-icon">📧</span>
                  <div className="flat-info-content">
                    <span className="flat-info-lbl">{isFr ? 'Adresse E-mail' : 'Email Address'}</span>
                    <strong className="flat-info-val">
                      nounga@gmail.com 
                      <span className="verified-badge-small">✓ {isFr ? 'Vérifié' : 'Verified'}</span>
                    </strong>
                  </div>
                </div>

                <div className="flat-info-row">
                  <span className="flat-info-icon">📞</span>
                  <div className="flat-info-content">
                    <span className="flat-info-lbl">{isFr ? 'Numéro de Téléphone' : 'Phone Number'}</span>
                    <strong className="flat-info-val">
                      +237 6 98 76 54 32 
                      <span className="verified-badge-small">✓ {isFr ? 'Vérifié' : 'Verified'}</span>
                    </strong>
                  </div>
                </div>

                <div className="flat-info-row">
                  <span className="flat-info-icon">📍</span>
                  <div className="flat-info-content">
                    <span className="flat-info-lbl">Location</span>
                    <strong className="flat-info-val">Douala, Littoral, Cameroon</strong>
                  </div>
                </div>

                <div className="flat-info-row">
                  <span className="flat-info-icon">🌐</span>
                  <div className="flat-info-content">
                    <span className="flat-info-lbl">{isFr ? 'Langue' : 'Language'}</span>
                    <strong className="flat-info-val">English, Français</strong>
                  </div>
                </div>

                <div className="flat-info-row">
                  <span className="flat-info-icon">⏰</span>
                  <div className="flat-info-content">
                    <span className="flat-info-lbl">{isFr ? 'Fuseau Horaire' : 'Timezone'}</span>
                    <strong className="flat-info-val">GMT+1 (West Africa Time)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-flat-section">
              <div className="panel-title-row-flat">
                <h3>{isFr ? 'Activité Récente' : 'Recent Activity'}</h3>
                <button className="link-view-all-flat" onClick={() => setActiveTab('Notifications')}>{isFr ? 'Voir Tout' : 'View All'}</button>
              </div>
              <div className="activity-items-flat">
                <div className="activity-item-flat">
                  <div className="activity-icon-flat a-confirmed"><Icon name="calendar" /></div>
                  <div className="activity-details-flat">
                    <h4>{isFr ? 'Vous avez réservé Plumber Pro' : 'You booked Plumber Pro'}</h4>
                    <p>{isFr ? 'Réservation confirmée' : 'Booking confirmed'}</p>
                  </div>
                  <span className="activity-time-flat">{isFr ? 'Il y a 2 min' : '2 min ago'}</span>
                </div>

                <div className="activity-item-flat">
                  <div className="activity-icon-flat a-accepted"><Icon name="check" /></div>
                  <div className="activity-details-flat">
                    <h4>{isFr ? 'John Doe a accepté votre demande' : 'John Doe accepted your request'}</h4>
                    <p>{isFr ? 'Installation Électrique' : 'Electrical Installation'}</p>
                  </div>
                  <span className="activity-time-flat">{isFr ? 'Il y a 15 min' : '15 min ago'}</span>
                </div>

                <div className="activity-item-flat">
                  <div className="activity-icon-flat a-payment"><Icon name="wallet" /></div>
                  <div className="activity-details-flat">
                    <h4>{isFr ? 'Paiement en pièces complété' : 'Payment with coins completed'}</h4>
                    <p>{isFr ? '3 pièces utilisées' : '3 coins used'}</p>
                  </div>
                  <span className="activity-time-flat">{isFr ? 'Il y a 1 h' : '1 hour ago'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-overview-right">
            <div className="summary-flat-section">
              <h3>{isFr ? 'Aperçu du Compte' : 'Account Summary'}</h3>
              <div className="stats-grid">
                <div className="stat-cell">
                  <div className="stat-cell-icon" style={{ color: '#14B8A6' }}><Icon name="calendar" /></div>
                  <strong className="stat-cell-val">12</strong>
                  <span className="stat-cell-label">{isFr ? 'Réservations' : 'Total Bookings'}</span>
                </div>
                <div className="stat-cell">
                  <div className="stat-cell-icon" style={{ color: '#3B82F6' }}><Icon name="briefcase" /></div>
                  <strong className="stat-cell-val">4</strong>
                  <span className="stat-cell-label">{isFr ? 'Actives' : 'Active Bookings'}</span>
                </div>
                <div className="stat-cell">
                  <div className="stat-cell-icon" style={{ color: '#22C55E' }}><Icon name="check" /></div>
                  <strong className="stat-cell-val">8</strong>
                  <span className="stat-cell-label">{isFr ? 'Terminées' : 'Completed Jobs'}</span>
                </div>
                <div className="stat-cell">
                  <div className="stat-cell-icon" style={{ color: '#F59E0B' }}><Icon name="star" /></div>
                  <strong className="stat-cell-val">4.8</strong>
                  <span className="stat-cell-label">{isFr ? 'Note Moyenne' : 'Average Rating'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {profileActiveSubTab !== 'Overview' && (
        <div className="dash-panel-premium" style={{marginTop: '2rem'}}>
          <h3>{profileActiveSubTab}</h3>
          <p>Content for {profileActiveSubTab} will be displayed here.</p>
        </div>
      )}
    </div>
  );
}
