import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
    Edit,
    Eye,
    UserPlus,
    UserMinus,
    UserCheck,
    Search,
    X
} from 'lucide-react';
import { STATES_AND_CITIES } from '../constants';

const AdminFarmers = () => {
    const { t } = useTranslation();
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        full_name: '',
        mobile: '',
        email: '',
        city: '',
        state: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [editFarmer, setEditFarmer] = useState(null);
    const [viewFarmer, setViewFarmer] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        mobile: '',
        city: '',
        state: '',
        location: ''
    });

    const states = Object.keys(STATES_AND_CITIES);
    const filterCities = filters.state ? STATES_AND_CITIES[filters.state] : [];
    const modalCities = formData.state ? STATES_AND_CITIES[formData.state] : [];

    const API_URL = 'http://localhost:8000/admin/farmers';

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const response = await axios.get(`${API_URL}?${params.toString()}`);
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFarmers();
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            await axios.patch(`${API_URL}/${id}/status?is_active=${!currentStatus}`);
            fetchFarmers();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };


    const openEditModal = (farmer) => {
        setEditFarmer(farmer);
        setFormData({
            username: farmer.username,
            password: '',
            full_name: farmer.full_name || '',
            mobile: farmer.mobile || '',
            city: farmer.city || '',
            state: farmer.state || '',
            location: farmer.location || ''
        });
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditFarmer(null);
        setFormData({
            username: '',
            password: '',
            full_name: '',
            mobile: '',
            city: '',
            state: '',
            location: ''
        });
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editFarmer) {
                await axios.put(`${API_URL}/${editFarmer.id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setShowModal(false);
            fetchFarmers();
        } catch (error) {
            alert(error.response?.data?.detail || 'Error saving farmer');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>{t('farmers_list')}</h1>
                <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={20} />
                </button>
            </div>

            {/* Search Filters */}
            <form className="search-box glass" onSubmit={handleSearch}>
                <div className="search-grid">
                    <div className="form-group">
                        <label>{t('full_name')}</label>
                        <input
                            name="full_name"
                            value={filters.full_name}
                            onChange={handleFilterChange}
                            placeholder={t('full_name')}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('mobile')}</label>
                        <input
                            name="mobile"
                            value={filters.mobile}
                            onChange={handleFilterChange}
                            placeholder={t('mobile')}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('email')}</label>
                        <input
                            name="email"
                            value={filters.email}
                            onChange={handleFilterChange}
                            placeholder={t('email')}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('state')}</label>
                        <select
                            name="state"
                            value={filters.state}
                            onChange={(e) => setFilters({ ...filters, state: e.target.value, city: '' })}
                        >
                            <option value="">{t('all') || 'All States'}</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('city')}</label>
                        <select
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            disabled={!filters.state}
                        >
                            <option value="">{t('all') || 'All Cities'}</option>
                            {filterCities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn-search">
                    <Search size={18} /> {t('search')}
                </button>
            </form>

            {/* Farmers Table */}
            <div className="table-responsive glass" style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('full_name')}</th>
                            <th>{t('username')}</th>
                            <th>{t('mobile')}</th>
                            <th>{t('city')}, {t('state')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                        ) : farmers.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No farmers found</td></tr>
                        ) : (
                            farmers.map(farmer => (
                                <tr key={farmer.id}>
                                    <td>{farmer.full_name || '-'}</td>
                                    <td>{farmer.username}</td>
                                    <td>{farmer.mobile || '-'}</td>
                                    <td>{farmer.city || '-'}, {farmer.state || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${farmer.is_active ? 'active' : 'blocked'}`}>
                                            {farmer.is_active ? t('active') : t('blocked')}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="icon-btn view" title={t('view')} onClick={() => setViewFarmer(farmer)}>
                                            <Eye size={18} />
                                        </button>
                                        <button className="icon-btn edit" title={t('edit')} onClick={() => openEditModal(farmer)}>
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className={`icon-btn status ${farmer.is_active ? 'block' : 'unblock'}`}
                                            title={farmer.is_active ? t('block') : t('unblock')}
                                            onClick={() => handleStatusToggle(farmer.id, farmer.is_active)}
                                        >
                                            {farmer.is_active ? <UserMinus size={18} /> : <UserCheck size={18} />}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>{editFarmer ? t('edit') + ' ' : ''}{t('farmer')}</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                                <div className="form-group">
                                    <label>{t('username')} <span className="required">*</span></label>
                                    <input
                                        required
                                        disabled={!!editFarmer}
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                {!editFarmer && (
                                    <div className="form-group">
                                        <label>{t('password')} <span className="required">*</span></label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>{t('full_name')} <span className="required">*</span></label>
                                    <input
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('mobile')}</label>
                                    <input
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('state')}</label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                                    >
                                        <option value="">{t('select_state') || 'Select State'}</option>
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('city')}</label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        disabled={!formData.state}
                                    >
                                        <option value="">{t('select_city') || 'Select City'}</option>
                                        {modalCities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{t('cancel') || 'Cancel'}</button>
                                <button type="submit" className="btn-primary">{t('save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Farmer Details Modal */}
            {viewFarmer && (
                <div className="modal-overlay">
                    <div className="modal-content glass detail-modal">
                        <div className="modal-header">
                            <h2>{t('personal_details')}</h2>
                            <button className="close-btn" onClick={() => setViewFarmer(null)}><X size={24} /></button>
                        </div>
                        <div className="details-grid">
                            <div className="detail-item">
                                <label>{t('full_name')}:</label>
                                <span>{viewFarmer.full_name || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('username')}:</label>
                                <span>{viewFarmer.username}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('mobile')}:</label>
                                <span>{viewFarmer.mobile || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('city')}:</label>
                                <span>{viewFarmer.city || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('state')}:</label>
                                <span>{viewFarmer.state || '-'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <label>{t('location')}:</label>
                                <span>{viewFarmer.location || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFarmers;
