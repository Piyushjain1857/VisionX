import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { CloudRain, AlertTriangle, Send, MapPin, Search, Languages } from 'lucide-react';
import { STATES_AND_CITIES, LANGUAGES } from '../constants';

const AdminBroadcast = () => {
    const { t } = useTranslation();
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [language, setLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleBroadcast = async (type) => {
        if (!state || !city) {
            setError('Please provide both State and City');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await axios.post(`http://localhost:8000/admin/broadcast?state=${state}&city=${city}&type=${type}&language=${language}`);
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to broadcast alert');
        } finally {
            setLoading(false);
        }
    };

    const states = Object.keys(STATES_AND_CITIES);
    const cities = state ? STATES_AND_CITIES[state] : [];

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>{t('broadcast_alerts') || 'Broadcast Agriculture Alerts'}</h1>
                <p className="subtitle">Send real-time alerts to farmers based on location and current news.</p>
            </div>

            <div className="broadcast-card glass">
                <div className="form-grid">
                    <div className="form-group">
                        <label>
                            <MapPin size={16} className="label-icon" /> {t('state')} <span className="required">*</span>
                        </label>
                        <select
                            value={state}
                            onChange={(e) => {
                                setState(e.target.value);
                                setCity(''); // Reset city when state changes
                            }}
                            required
                        >
                            <option value="">{t('select_state') || 'Select State'}</option>
                            {states.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            <MapPin size={16} className="label-icon" /> {t('city')} <span className="required">*</span>
                        </label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            disabled={!state}
                        >
                            <option value="">{t('select_city') || 'Select City'}</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            <Languages size={16} className="label-icon" /> {t('broadcast_language') || 'Broadcast Language'} <span className="required">*</span>
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            required
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="broadcast-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-primary weather-btn"
                        disabled={loading}
                        onClick={() => handleBroadcast('Weather')}
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <CloudRain size={20} /> Broadcast Weather Alert
                    </button>
                    <button
                        className="btn-primary disease-btn"
                        disabled={loading}
                        onClick={() => handleBroadcast('Disease')}
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <AlertTriangle size={20} /> Broadcast Disease Alert
                    </button>
                </div>

                {loading && (
                    <div className="loading-spinner" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <div className="spinner"></div>
                        <p>Generating alert using AI and broadcasting to farmers...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message" style={{ marginTop: '2rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '1rem', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                {result && (
                    <div className="broadcast-success glass" style={{ marginTop: '2rem', border: '1px solid #10b981' }}>
                        <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Send size={20} /> {result.message}
                        </div>
                        <div className="alert-preview">
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{result.content.title}</h3>
                            <p style={{ margin: 0, opacity: 0.8 }}>{result.content.message}</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .broadcast-card {
                    padding: 2rem;
                    margin-top: 2rem;
                }
                .label-icon {
                    margin-right: 4px;
                    vertical-align: text-bottom;
                }
                .weather-btn:hover {
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                }
                .disease-btn:hover {
                    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
                }
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #09d;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .alert-preview {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

export default AdminBroadcast;
