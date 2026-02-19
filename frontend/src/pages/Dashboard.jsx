import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  CloudSun,
  Map,
  Sprout,
  Bell,
  MessageSquare,
  ChevronRight,
  Droplets,
  Wind,
  Plus
} from 'lucide-react';
import { API_BASE_URL } from '../constants';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/farmer/dashboard-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>{t('dashboard_view.welcome')}, {summary?.farmer_name || 'Farmer'}! 👋</h1>
        </div>
      </header>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon land">
            <Map size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary?.total_lands || 0}</h3>
            <p>{t('dashboard_view.total_lands')}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon area">
            <Map size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary?.total_area || 0} {t('dashboard_view.acres')}</h3>
            <p>{t('dashboard_view.total_area')}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon crop">
            <Sprout size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary?.active_crops || 0}</h3>
            <p>{t('dashboard_view.active_crops')}</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon notification">
            <Bell size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary?.unread_notifications || 0}</h3>
            <p>{t('dashboard_view.new_alerts')}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Weather Card */}
        <section className="dashboard-section weather-section glass">
          <div className="section-header">
            <h2>{t('dashboard_view.weather_today')}</h2>
            <CloudSun className="text-primary" />
          </div>
          <div className="weather-display">
            <div className="temp-main">
              <span>{summary?.weather?.temp || '--'}°C</span>
              <p>{summary?.weather?.condition || 'Clear Sky'}</p>
            </div>
            <div className="weather-details">
              <div className="weather-item">
                <Droplets size={16} />
                <span>{summary?.weather?.humidity || '--'}% Humid</span>
              </div>
              <div className="weather-item">
                <Wind size={16} />
                <span>{summary?.weather?.wind_speed || '--'} km/h Wind</span>
              </div>
            </div>
          </div>
          <div className="weather-tip">
            <p><strong>Tip:</strong> Good day for sowing! Low wind and optimal humidity expected.</p>
          </div>
        </section>

        {/* Recent Notifications */}
        <section className="dashboard-section notifications-section glass">
          <div className="section-header">
            <h2>{t('dashboard_view.recent_alerts')}</h2>
            <button className="btn-link" onClick={() => navigate('/notifications')}>
              {t('common.view_all')} <ChevronRight size={16} />
            </button>
          </div>
          <div className="notification-list">
            {summary?.recent_notifications?.length > 0 ? (
              summary.recent_notifications.map((n) => (
                <div key={n.id} className={`notification-item ${n.is_read ? 'read' : 'unread'}`}>
                  <div className="dot"></div>
                  <div className="content">
                    <h4>{n.title}</h4>
                    <p>{n.message.substring(0, 60)}...</p>
                    <span className="time">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-msg">{t('dashboard_view.no_alerts')}</p>
            )}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>{t('dashboard_view.quick_tasks')}</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/land')}>
            <Map size={20} />
            <span>{t('dashboard_view.manage_land')}</span>
          </div>
          <div className="action-card" onClick={() => navigate('/crops')}>
            <Sprout size={20} />
            <span>{t('dashboard_view.add_crop')}</span>
          </div>
          <div className="action-card" onClick={() => navigate('/chatbot')}>
            <MessageSquare size={20} />
            <span>{t('dashboard_view.ask_ai_chat')}</span>
          </div>
          <div className="action-card" onClick={() => navigate('/history')}>
            <ChevronRight size={20} />
            <span>{t('dashboard_view.view_history')}</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
