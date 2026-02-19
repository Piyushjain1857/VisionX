import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CropDetails = () => {
    const { t } = useTranslation();
    const [crops, setCrops] = useState([]);
    const [lands, setLands] = useState([]);
    const [newCrop, setNewCrop] = useState({ land_id: '', crop_name: '', variety: '', planted_date: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [cropRes, landRes] = await Promise.all([
                axios.get('http://localhost:8000/farmer/crops', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:8000/farmer/land', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setCrops(cropRes.data);
            setLands(landRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewCrop({ ...newCrop, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/farmer/crops', newCrop, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewCrop({ land_id: '', crop_name: '', variety: '', planted_date: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('crop_details')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>{t('land_details')} <span style={{ color: 'red' }}>*</span></label>
                            <select name="land_id" value={newCrop.land_id} onChange={handleChange} required>
                                <option value="">Select Field</option>
                                {lands.map(l => <option key={l.id} value={l.id}>{l.land_name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('crop_name')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="crop_name" value={newCrop.crop_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('variety')}</label>
                            <input type="text" name="variety" value={newCrop.variety} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>{t('planted_date')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="date" name="planted_date" value={newCrop.planted_date} onChange={handleChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">{t('submit')}</button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>{t('crop_details')}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>{t('crop_name')}</th>
                            <th>{t('variety')}</th>
                            <th>{t('planted_date')}</th>
                            <th>{t('land_name')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crops.map((crop) => (
                            <tr key={crop.id}>
                                <td>{crop.crop_name}</td>
                                <td>{crop.variety}</td>
                                <td>{crop.planted_date}</td>
                                <td>{lands.find(l => l.id === crop.land_id)?.land_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CropDetails;
