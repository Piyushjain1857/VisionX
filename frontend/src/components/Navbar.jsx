import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, Languages, Map as MapIcon, Sprout, Bell, User, Menu, X } from 'lucide-react';
import useNavItems from '../useNavItems';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { farmerMenuItems, adminMenuItems } = useNavItems();
    const role = localStorage.getItem('role');

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sprout size={24} />
                {t('app_name')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={toggleLanguage} className="btn-nav-icon language-btn" title={t('switch_language')}>
                    <Languages size={20} />
                    <span className="nav-btn-text">{t('switch_language')}</span>
                </button>

                {isLoggedIn && (
                    <>
                        <button onClick={() => navigate('/notifications')} className="btn-nav-icon desktop-only" title={t('notifications')}>
                            <Bell size={20} />
                        </button>
                        <button onClick={() => navigate('/profile')} className="btn-nav-icon avatar desktop-only" title={t('profile')}>
                            <User size={20} />
                        </button>
                        <button onClick={logout} className="btn-nav-icon logout desktop-only" title={t('logout')}>
                            <LogOut size={20} />
                            <span className="nav-btn-text">{t('logout')}</span>
                        </button>

                        <button className="btn-nav-icon mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </>
                )}
            </div>

            {isLoggedIn && isMenuOpen && (
                <div className="mobile-menu">
                    {role === 'Admin' && (
                        <div className="mobile-menu-group">
                            <div className="mobile-menu-header">{t('admin_panel')}</div>
                            {adminMenuItems.map((item) => (
                                <div key={item.id} className="mobile-menu-item" onClick={() => { navigate(item.path); setIsMenuOpen(false); }}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mobile-menu-group">
                        <div className="mobile-menu-header">{t('menu')}</div>
                        {farmerMenuItems.map((item) => (
                            <div key={item.id} className="mobile-menu-item" onClick={() => { navigate(item.path); setIsMenuOpen(false); }}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mobile-menu-divider"></div>
                    <div className="mobile-menu-item" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                        <User size={20} />
                        <span>{t('profile')}</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { navigate('/notifications'); setIsMenuOpen(false); }}>
                        <Bell size={20} />
                        <span>{t('notifications')}</span>
                    </div>
                    <div className="mobile-menu-item logout" onClick={logout}>
                        <LogOut size={20} />
                        <span>{t('logout')}</span>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
