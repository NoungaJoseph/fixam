import './MyTasks.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import PostTaskFlow from '../../components/PostTaskFlow';
import { useTranslation } from 'react-i18next';

interface MyTasksProps {
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
}

export default function MyTasks({ clientTasks, setClientTasks, setActiveTab }: MyTasksProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [isPostTaskOpen, setIsPostTaskOpen] = useState(false);

  const handlePostTaskSubmit = (taskData: any) => {
    const newT = {
      id: Date.now(),
      title: taskData.title,
      tag: taskData.category,
      price: taskData.budget + (taskData.budgetType === 'fixed' ? ' XAF' : ''),
      status: 'Pending Offers',
      bids: 0
    };
    setClientTasks([newT, ...clientTasks]);
    setIsPostTaskOpen(false);
    alert("Task published successfully!");
  };

  return (
    <div className="my-tasks-tab-wrapper animate-fade-in">
      {/* Stats Cards Section - 3 up, 2 down with space */}
      <div className="dash-metrics-grid">
        <div className="metric-card-premium m-bookings" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Bookings</span>
            <div className="metric-icon-box"><Icon name="calendar" /></div>
          </div>
          <strong className="metric-big-num">12</strong>
          <span className="metric-card-desc">Total Bookings</span>
          <span className="metric-trend trend-up">↑ 20% this month</span>
        </div>

        <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Tasks')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Active Tasks</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">4</strong>
          <span className="metric-card-desc">In Progress</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>

        <div className="metric-card-premium m-completed">
          <div className="metric-card-header">
            <span>Completed</span>
            <div className="metric-icon-box"><Icon name="check" /></div>
          </div>
          <strong className="metric-big-num">8</strong>
          <span className="metric-card-desc">Jobs Completed</span>
          <span className="metric-trend trend-up">↑ 15% this month</span>
        </div>

        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Coins Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">1,250</strong>
          <span className="metric-card-desc">Available Coins</span>
          <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>+</button>
        </div>

        <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Saved Providers')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Saved Providers</span>
            <div className="metric-icon-box"><Icon name="star" /></div>
          </div>
          <strong className="metric-big-num">18</strong>
          <span className="metric-card-desc">Saved</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>
      </div>

      <div className="tasks-container-flat">
        <h1 className="tasks-flat-title">
          {isFr ? 'Mes Tâches Publiées' : 'My Posted Tasks'}
        </h1>
        
        <div className="posted-tasks-list">
          {clientTasks.map((tk) => {
            const isPending = tk.status.toLowerCase().includes('pending');
            const isInProgress = tk.status.toLowerCase().includes('progress') || tk.status.toLowerCase().includes('active');
            const isCompleted = tk.status.toLowerCase().includes('complete');
            const isCancelled = tk.status.toLowerCase().includes('cancel');

            let statusClass = 'pending';
            let statusText = isFr ? 'Offres en attente' : 'Pending Offers';
            if (isInProgress) {
              statusClass = 'in-progress';
              statusText = isFr ? 'En cours' : 'In Progress';
            } else if (isCompleted) {
              statusClass = 'completed';
              statusText = isFr ? 'Terminé' : 'Completed';
            } else if (isCancelled) {
              statusClass = 'cancelled';
              statusText = isFr ? 'Annulé' : 'Cancelled';
            }

            return (
              <div className="task-card" key={tk.id}>
                {/* Row 1 — Category + Price */}
                <div className="task-card-row-1">
                  <span className="task-category-pill">{tk.tag}</span>
                  <span className="task-card-price">{tk.price}</span>
                </div>

                {/* Row 2 — Task title */}
                <h3 className="task-card-title">{tk.title}</h3>

                {/* Row 3 — Status + Offers */}
                <div className="task-card-row-3">
                  <span className={`task-status-badge ${statusClass}`}>
                    {statusText}
                  </span>
                  <span className="task-offers-count">
                    {tk.bids} {isFr ? 'offres reçues' : 'offers received'}
                  </span>
                </div>

                {/* Row 4 — Action buttons */}
                <div className="task-card-row-4">
                  <button className="btn-view-offers-flat" onClick={() => alert(isFr ? `Affichage de ${tk.bids} offres des professionnels.` : `Viewing ${tk.bids} offers from local professionals.`)}>
                    {isFr ? 'Voir les Offres' : 'View Offers'}
                  </button>
                  <button className="btn-cancel-task-flat" onClick={() => {
                    if (confirm(isFr ? "Êtes-vous sûr de vouloir annuler cette tâche ?" : "Are you sure you want to remove this task?")) {
                      setClientTasks(clientTasks.filter(t => t.id !== tk.id));
                    }
                  }}>{isFr ? 'Annuler la Tâche' : 'Cancel Task'}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE TASK FLOATING BUTTON */}
      <button className="create-task-fab" onClick={() => setIsPostTaskOpen(true)}>
        <span className="fab-plus-icon">+</span>
        <span className="fab-label">{isFr ? 'Créer une Tâche' : 'Create Task'}</span>
      </button>

      <PostTaskFlow 
        isOpen={isPostTaskOpen} 
        onClose={() => setIsPostTaskOpen(false)} 
        onSubmit={handlePostTaskSubmit} 
      />
    </div>
  );
}
