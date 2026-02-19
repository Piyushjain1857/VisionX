import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    User,
    Map,
    Sprout,
    History,
    LayoutDashboard,
    Users,
    Bell,
    Bot,
    MessageSquare,
    ClipboardCheck
} from 'lucide-react';


const useNavItems = () => {
    const { t } = useTranslation();

    const farmerMenuItems = [
        { id: 'dashboard', label: t('dashboard'), path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'profile', label: t('personal_details'), path: '/profile', icon: <User size={20} /> },
        { id: 'land', label: t('land_details'), path: '/land', icon: <Map size={20} /> },
        { id: 'crops', label: t('crop_details'), path: '/crops', icon: <Sprout size={20} /> },
        { id: 'history', label: t('past_history'), path: '/history', icon: <History size={20} /> },
        { id: 'chatbot', label: t('chatbot'), path: '/chatbot', icon: <Bot size={20} /> },
        { id: 'discussions', label: t('discussions'), path: '/discussions', icon: <MessageSquare size={20} /> },
        { id: 'action-plan', label: t('Action Plan'), path: '/action-plan', icon: <ClipboardCheck size={20} /> },
    ];


    const adminMenuItems = [
        { id: 'farmers', label: t('farmers_list') || 'Farmers', path: '/admin/farmers', icon: <Users size={18} /> },
        { id: 'broadcast', label: 'Broadcast Alerts', path: '/admin/broadcast', icon: <Bell size={18} /> },
    ];

    return { farmerMenuItems, adminMenuItems };
};

export default useNavItems;
