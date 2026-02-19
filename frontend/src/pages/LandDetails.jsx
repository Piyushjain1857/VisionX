import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { STATES_AND_CITIES } from '../constants';

const LandDetails = () => {
    const { t } = useTranslation();
    const [lands, setLands] = useState([]);
    const [newLand, setNewLand] = useState({ land_name: '', area_size: '', location: '', state: '', city: '' });
    const [loading, setLoading] = useState(true);

    const states = Object.keys(STATES_AND_CITIES);
    const cities = newLand.state ? STATES_AND_CITIES[newLand.state] : [];

    useEffect(() => {
        fetchLands();
    }, []);

    const fetchLands = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/farmer/land', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLands(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewLand({ ...newLand, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/farmer/land', newLand, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewLand({ land_name: '', area_size: '', location: '', state: '', city: '' });
            fetchLands();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('land_details')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>{t('land_name')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="land_name" value={newLand.land_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('area_size')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="number" name="area_size" value={newLand.area_size} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('state')}</label>
                            <select name="state" value={newLand.state || ''} onChange={(e) => {
                                setNewLand({ ...newLand, state: e.target.value, city: '' });
                            }}>
                                <option value="">{t('select_state') || 'Select State'}</option>
                                {states.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('city')}</label>
                            <select name="city" value={newLand.city || ''} onChange={handleChange} disabled={!newLand.state}>
                                <option value="">{t('select_city') || 'Select City'}</option>
                                {cities.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('location')}</label>
                            <input type="text" name="location" value={newLand.location} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">{t('submit')}</button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>{t('land_details')}</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('land_name')}</th>
                                <th>{t('area_size')}</th>
                                <th>{t('city')}, {t('state')}</th>
                                <th>{t('location')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lands.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No field details found</td></tr>
                            ) : (
                                lands.map((land) => (
                                    <tr key={land.id}>
                                        <td>{land.land_name}</td>
                                        <td>{land.area_size}</td>
                                        <td>{land.city}, {land.state}</td>
                                        <td>{land.location}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LandDetails;
