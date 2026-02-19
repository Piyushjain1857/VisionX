import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle, Calendar, MapPin, Tag } from 'lucide-react';

const Notifications = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:8000/farmer/notifications';

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:8000/farmer/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>{t('notifications') || 'Alerts & Notifications'}</h1>
                <p className="subtitle">Important agricultural alerts based on your location and crops.</p>
            </div>

            <div className="notifications-list">
                {loading ? (
                    <div className="glass p-4 text-center">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="glass p-8 text-center">
                        <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No notifications found.</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className={`notification-card glass ${notif.is_read ? 'read' : 'unread'}`}>
                            <div className="notif-header">
                                <span className={`notif-type-badge ${notif.type.toLowerCase()}`}>
                                    {notif.type}
                                </span>
                                <span className="notif-date">
                                    <Calendar size={14} /> {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="notif-title">{notif.title}</h3>
                            <p className="notif-message">{notif.message}</p>
                            <div className="notif-footer">
                                <div className="notif-meta">
                                    {notif.city && (
                                        <span className="meta-item">
                                            <MapPin size={14} /> {notif.city}, {notif.state}
                                        </span>
                                    )}
                                    {notif.crop && (
                                        <span className="meta-item">
                                            <Tag size={14} /> {notif.crop}
                                        </span>
                                    )}
                                </div>
                                {!notif.is_read && (
                                    <button className="mark-read-btn" onClick={() => markAsRead(notif.id)}>
                                        <CheckCircle size={16} /> Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .notifications-list {
                    display: flex',
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-top: 2rem;
                }
                .notification-card {
                    padding: 1.5rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    border-left: 4px solid transparent;
                }
                .notification-card.unread {
                    border-left-color: var(--primary-color);
                    background: rgba(255, 255, 255, 0.08);
                }
                .notification-card.read {
                    opacity: 0.8;
                }
                .notif-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                .notif-type-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .notif-type-badge.weather {
                    background: rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                }
                .notif-type-badge.disease {
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }
                .notif-type-badge.general {
                    background: rgba(16, 185, 129, 0.2);
                    color: #34d399;
                }
                .notif-date {
                    font-size: 0.8rem;
                    opacity: 0.6;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .notif-title {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.25rem;
                }
                .notif-message {
                    margin: 0 0 1rem 0;
                    line-height: 1.6;
                    opacity: 0.9;
                }
                .notif-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 1rem;
                }
                .notif-meta {
                    display: flex;
                    gap: 1rem;
                }
                .meta-item {
                    font-size: 0.8rem;
                    opacity: 0.7;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .mark-read-btn {
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                .mark-read-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </div>
    );
};

export default Notifications;
