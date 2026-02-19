import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Leaf, Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import '../Login.css';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ username: '', new_password: '', confirm_password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStep1 = (e) => {
        e.preventDefault();
        // In a real app, we would verify the username here
        if (formData.username.trim() === '') {
            setError(t('Please enter your username'));
            return;
        }
        setStep(2);
        setError('');
    };

    const handleStep2 = async (e) => {
        e.preventDefault();

        if (formData.new_password !== formData.confirm_password) {
            setError(t('Passwords do not match'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8000/auth/reset-password', {
                username: formData.username,
                new_password: formData.new_password
            });

            setSuccess(t('Password reset successful! Redirecting to login...'));
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || t('Failed to reset password. Please check username.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass-panel">
                <div className="leaf-header">
                    <div className="leaf-glow">
                        <Leaf size={48} className="leaf-icon" />
                        <div className="tech-dots">
                            {[...Array(6)].map((_, i) => <span key={i} className={`dot dot-${i}`}></span>)}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2>{step === 1 ? t('Reset Password') : t('New Password')}</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {step === 1 ? t('Enter your registered username/mobile') : t('Create a secure new password')}
                    </p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {step === 1 ? (
                    <form onSubmit={handleStep1} className="login-form">
                        <div className="input-box">
                            <Mail className="field-icon" size={20} />
                            <input
                                type="text"
                                placeholder={t('Username / Mobile')}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            {t('Verify User')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleStep2} className="login-form">
                        <div className="input-box">
                            <Lock className="field-icon" size={20} />
                            <input
                                type="password"
                                placeholder={t('New Password')}
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <ShieldCheck className="field-icon" size={20} />
                            <input
                                type="password"
                                placeholder={t('Confirm Password')}
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? t('Resetting...') : t('Reset Password')}
                        </button>
                    </form>
                )}

                <div className="form-footer-center" style={{ marginTop: '1.5rem' }}>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                        <ArrowLeft size={16} /> {t('Back to Login')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
