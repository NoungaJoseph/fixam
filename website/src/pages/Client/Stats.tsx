import './Stats.css';
import { Icon, IconName } from '../../App';
import { useTranslation } from 'react-i18next';

export default function Stats() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const statItems = [
    { icon: 'calendar' as IconName, val: '12', label: isFr ? 'Réservations' : 'Bookings', color: '#14B8A6' },
    { icon: 'briefcase' as IconName, val: '4', label: isFr ? 'Actives' : 'Active', color: '#3B82F6' },
    { icon: 'check' as IconName, val: '8', label: isFr ? 'Terminées' : 'Done', color: '#22C55E' },
    { icon: 'wallet' as IconName, val: '25', label: isFr ? 'Pièces utilisées' : 'Coins Used', color: '#F59E0B' },
  ];

  const legendItems = [
    { color: '#14B8A6', name: isFr ? 'Paiements de réservation' : 'Booking Payments', val: isFr ? '12 pièces (48%)' : '12 coins (48%)' },
    { color: '#3B82F6', name: isFr ? 'Réservations urgentes' : 'Urgent Bookings', val: isFr ? '6 pièces (24%)' : '6 coins (24%)' },
    { color: '#F59E0B', name: isFr ? 'Options de service' : 'Service Add-ons', val: isFr ? '4 pièces (16%)' : '4 coins (16%)' },
    { color: '#A855F7', name: isFr ? 'Autre' : 'Other', val: isFr ? '3 pièces (12%)' : '3 coins (12%)' },
  ];

  return (
    <div className="stats-page-layout animate-fade-in">
      <h1 className="page-title-dash">{isFr ? 'Statistiques & Aperçu' : 'Stats & Overview'}</h1>
      
      <div className="stats-grid">
        {statItems.map((s, i) => (
          <div className="stat-cell" key={i}>
            <div className="stat-cell-icon" style={{ color: s.color }}><Icon name={s.icon} /></div>
            <strong className="stat-cell-val">{s.val}</strong>
            <span className="stat-cell-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="spending-overview-section">
        <div className="spending-section-header">
          <h2>{isFr ? 'Aperçu des Dépenses' : 'Spending Overview'}</h2>
          <select className="select-month-flat">
            <option>{isFr ? 'Ce Mois' : 'This Month'}</option>
            <option>{isFr ? 'Mois Dernier' : 'Last Month'}</option>
          </select>
        </div>
        
        <div className="chart-content-flat">
          <div className="chart-svg-wrapper-flat">
            <svg width="180" height="180" viewBox="0 0 38 38" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="19" cy="19" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle cx="19" cy="19" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="48 52" strokeDashoffset="100" />
              <circle cx="19" cy="19" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="24 76" strokeDashoffset="52" />
              <circle cx="19" cy="19" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="16 84" strokeDashoffset="28" />
              <circle cx="19" cy="19" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="12" />
            </svg>
            <div className="chart-inner-text-flat">
              <span className="chart-num-flat">25</span>
              <span className="chart-lbl-flat">{isFr ? 'Total Pièces' : 'Total Coins'}<br/>{isFr ? 'Utilisées' : 'Used'}</span>
            </div>
          </div>
          <div className="chart-legend-list-flat">
            {legendItems.map((l, i) => (
              <div className="legend-item-flat" key={i}>
                <span className="legend-color-dot" style={{ backgroundColor: l.color }}></span>
                <span className="legend-name">{l.name}</span>
                <span className="legend-val">{l.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="monthly-trend-section">
        <h2 className="trend-section-title">{isFr ? 'Tendance Mensuelle' : 'Monthly Trend'}</h2>
        <div className="stats-bars-wrapper-flat">
          {['Jan', isFr ? 'Fév' : 'Feb', 'Mar', isFr ? 'Avr' : 'Apr', 'May', isFr ? 'Jun' : 'Jun'].map((m, i) => (
            <div className={`stats-bar-col-flat ${i === 5 ? 'active' : ''}`} key={m}>
              <div className="stats-bar-track-flat">
                <div className="stats-bar-fill-flat" style={{ height: `${[40, 55, 35, 70, 85, 65][i]}%` }}></div>
              </div>
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
