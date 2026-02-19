import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { STATES_AND_CITIES } from '../constants';

const FarmerProfile = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState({
        full_name: '',
        location: '',
        state: '',
        city: '',
        mobile: '',
        photo_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const states = Object.keys(STATES_AND_CITIES);
    const cities = profile.state ? STATES_AND_CITIES[profile.state] : [];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/farmer/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8000/farmer/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>{t('personal_details')}</h2>
            {message && <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: '10px' }}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>{t('full_name')} <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="full_name" value={profile.full_name || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('mobile')} <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="mobile" value={profile.mobile || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>{t('state')}</label>
                        <select name="state" value={profile.state || ''} onChange={(e) => {
                            setProfile({ ...profile, state: e.target.value, city: '' });
                        }}>
                            <option value="">{t('select_state') || 'Select State'}</option>
                            {states.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('city')}</label>
                        <select name="city" value={profile.city || ''} onChange={handleChange} disabled={!profile.state}>
                            <option value="">{t('select_city') || 'Select City'}</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('location')}</label>
                        <input type="text" name="location" value={profile.location || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>{t('photo')}</label>
                        <input type="text" name="photo_url" placeholder="Photo URL" value={profile.photo_url || ''} onChange={handleChange} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">{t('save')}</button>
            </form>
        </div>
    );
};

export default FarmerProfile;
