import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Leaf, Mail, Lock, Check } from 'lucide-react';
import '../Login.css';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const successMessage = location.state?.successMessage;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/auth/login', formData);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            setTimeout(() => {
                if (response.data.role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 800);
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
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

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-box">
                        <Mail className="field-icon" size={20} />
                        <input
                            type="text"
                            placeholder={t('username') || "Username"}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-box">
                        <Lock className="field-icon" size={20} />
                        <input
                            type="password"
                            placeholder={t('password') || "Password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-footer">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span className="checkmark">
                                <Check size={12} />
                            </span>
                            {t('Remember me') || "Remember me"}
                        </label>
                        <a href="#" className="forgot-pass" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>{t('Forgot Password') || "Forgot Password?"}</a>
                    </div>

                    <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                        {loading ? 'Logging In...' : t('Login') || 'Login'}
                    </button>


                    <div className="form-footer-center">
                        <p>
                            {t("Don't have an account?")} <span onClick={() => navigate('/signup')}>{t("Sign up")}</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
