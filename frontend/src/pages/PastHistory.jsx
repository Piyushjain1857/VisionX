import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const PastHistory = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [lands, setLands] = useState([]);
    const [newHistory, setNewHistory] = useState({ land_id: '', crop: '', year: new Date().getFullYear(), yield_amount: '', disease_record: '', treatment_record: '', notes: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [histRes, landRes] = await Promise.all([
                axios.get('http://localhost:8000/farmer/history', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:8000/farmer/land', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setHistory(histRes.data);
            setLands(landRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewHistory({ ...newHistory, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/farmer/history', newHistory, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewHistory({ land_id: '', crop: '', year: new Date().getFullYear(), yield_amount: '', disease_record: '', treatment_record: '', notes: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('past_history')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>{t('land_details')} <span style={{ color: 'red' }}>*</span></label>
                            <select name="land_id" value={newHistory.land_id} onChange={handleChange} required>
                                <option value="">Select Field</option>
                                {lands.map(l => <option key={l.id} value={l.id}>{l.land_name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('crop_name')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="crop" value={newHistory.crop} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Year <span style={{ color: 'red' }}>*</span></label>
                            <input type="number" name="year" value={newHistory.year} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('yield_amount')} <span style={{ color: 'red' }}>*</span></label>
                            <input type="number" name="yield_amount" value={newHistory.yield_amount} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('disease_record')}</label>
                            <textarea name="disease_record" value={newHistory.disease_record} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>{t('treatment_record')}</label>
                            <textarea name="treatment_record" value={newHistory.treatment_record} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>{t('notes')}</label>
                            <textarea name="notes" value={newHistory.notes} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">{t('submit')}</button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>{t('past_history')}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>{t('crop_name')}</th>
                            <th>{t('yield_amount')}</th>
                            <th>{t('disease_record')}</th>
                            <th>{t('treatment_record')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((h) => (
                            <tr key={h.id}>
                                <td>{h.year}</td>
                                <td>{h.crop}</td>
                                <td>{h.yield_amount}</td>
                                <td>{h.disease_record}</td>
                                <td>{h.treatment_record}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PastHistory;
