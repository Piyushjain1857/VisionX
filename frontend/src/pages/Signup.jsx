import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Leaf, User, Lock, ArrowRight } from 'lucide-react';
import '../Login.css';

const Signup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/auth/signup', formData);
            // Simulate a short delay for animation
            setTimeout(() => {
                navigate('/login', { state: { successMessage: 'Signup successful! Please login to continue.' } });
            }, 800);
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed');
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

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-box">
                        <User className="field-icon" size={20} />
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

                    <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <div className="form-footer-center">
                        <p>
                            {"Already have an account?"} <span onClick={() => navigate('/login')}>{"Login"}</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
