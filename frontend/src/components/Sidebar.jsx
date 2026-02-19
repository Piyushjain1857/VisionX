import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    User,
    Map,
    Sprout,
    History,
    LayoutDashboard,
    ChevronDown,
    ChevronRight,
    Users,
    Bell,
    Bot,
    MessageSquare
} from 'lucide-react';

import useNavItems from '../useNavItems';

const Sidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdminOpen, setIsAdminOpen] = useState(true);
    const role = localStorage.getItem('role');
    const { farmerMenuItems, adminMenuItems } = useNavItems();

    return (
        <div className="sidebar">
            <div className="sidebar-menu">
                {role === 'Admin' && (
                    <div className="admin-section">
                        <div
                            className={`sidebar-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                            onClick={() => setIsAdminOpen(!isAdminOpen)}
                        >
                            <LayoutDashboard size={20} />
                            <span>{t('admin_panel')}</span>
                            {isAdminOpen ? <ChevronDown size={16} style={{ marginLeft: 'auto' }} /> : <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                        </div>
                        {isAdminOpen && (
                            <div className="sidebar-submenu">
                                {adminMenuItems.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className={`sidebar-subitem ${location.pathname === subItem.path ? 'active' : ''}`}
                                        onClick={() => navigate(subItem.path)}
                                    >
                                        {subItem.icon}
                                        <span>{subItem.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {farmerMenuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
