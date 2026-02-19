import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
    Send,
    Image as ImageIcon,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    Zap,
    Droplet,
    Sunrise,
    X
} from 'lucide-react';

const FarmerChatbot = () => {
    const { t, i18n } = useTranslation();
    const [images, setImages] = useState([]);
    const [cropType, setCropType] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0 || !cropType) {
            setError('Please provide at least one image and crop type.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        formData.append('crop_type', cropType);
        formData.append('language', i18n.language === 'en' ? 'English' : 'Hindi');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/chat/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to analyze images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <Zap className="header-icon" />
                <h1>{t('chatbot')}</h1>
                <p>Your personal AI Agronomist</p>
            </div>

            <div className="chatbot-layout">
                <div className="chat-input-section card">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>{t('crop_type')}</label>
                            <input
                                type="text"
                                value={cropType}
                                onChange={(e) => setCropType(e.target.value)}
                                placeholder="e.g. Tomato, Rice, Wheat..."
                                required
                            />
                        </div>

                        <div className="image-upload-section">
                            <label>{t('upload_leaf')}</label>
                            <div
                                className="upload-dropzone"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <ImageIcon className="upload-icon" />
                                <p>{t('select_files')}</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {images.length > 0 && (
                                <div className="image-preview-grid">
                                    {images.map((img, index) => (
                                        <div key={index} className="preview-item">
                                            <img src={URL.createObjectURL(img)} alt="preview" />
                                            <button type="button" onClick={() => removeImage(index)} className="remove-btn">
                                                <X />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`analyze-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner"></span> {t('analyzing')}</>
                            ) : (
                                <><Send /> {t('analyze')}</>
                            )}
                        </button>
                        {error && <p className="error-text">{error}</p>}
                    </form>
                </div>

                <div className="chat-result-section">
                    {!result && !loading && (
                        <div className="empty-state pulse">
                            <Sunrise className="empty-icon" />
                            <h3>{t('ask_question')}</h3>
                            <p>Upload a photo of your crop's leaf to get started.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="loading-state">
                            <div className="dna-loader"></div>
                            <h3>Analyzing your crop...</h3>
                            <p>Our AI is examining the leaves for diseases.</p>
                        </div>
                    )}

                    {result && (
                        <div className="analysis-result fade-in">
                            <div className="result-header">
                                <div className="diagnosis-badge">
                                    <AlertTriangle /> {result.diagnosis}
                                </div>
                                <div className="confidence-score">
                                    Confidence: {(result.confidence_score * 100).toFixed(0)}%
                                </div>
                            </div>

                            <div className="stats-cards">
                                <div className={`stat-card ${result.severity.toLowerCase()}`}>
                                    <TrendingUp />
                                    <span>{t('severity')}</span>
                                    <strong>{result.severity}</strong>
                                </div>
                                <div className={`stat-card ${result.spread_risk.toLowerCase()}`}>
                                    <Zap />
                                    <span>{t('spread_risk')}</span>
                                    <strong>{result.spread_risk}</strong>
                                </div>
                            </div>

                            <div className="reasoning-card card">
                                <h3><ShieldCheck /> {t('diagnosis')} Details</h3>
                                <p>{result.reasoning}</p>
                                <div className="disease-tags">
                                    {result.diseases.map((d, i) => (
                                        <span key={i} className="disease-tag">{d}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="advisory-section">
                                <h3><Droplet /> {t('advisory')}</h3>
                                <div className="advisory-grid">
                                    <div className="advisory-card chemical">
                                        <h4>{t('chemical')}</h4>
                                        <p><strong>{result.advisory.chemical_solution.name}</strong></p>
                                        <small>{t('dosage')}: {result.advisory.chemical_solution.dosage}</small>
                                    </div>
                                    <div className="advisory-card bio">
                                        <h4>{t('bio_organic')}</h4>
                                        <p>{result.advisory.bio_organic_solution}</p>
                                    </div>
                                    <div className="advisory-card organic">
                                        <h4>{t('organic')}</h4>
                                        <p>{result.advisory.organic_treatment}</p>
                                    </div>
                                    <div className="advisory-card fertilizer">
                                        <h4>{t('fertilizer')}</h4>
                                        <p>{result.advisory.fertilizer_support}</p>
                                    </div>
                                    <div className="advisory-card preventive">
                                        <h4>{t('preventive')}</h4>
                                        <p>{result.advisory.preventive_care}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx="true">{`
        .chatbot-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          color: #333;
        }

        .chatbot-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header-icon {
          font-size: 3rem;
          color: #2e7d32;
        }

        .chatbot-header h1 {
          font-size: 2.5rem;
          margin: 0.5rem 0;
          background: linear-gradient(45deg, #2e7d32, #4caf50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .chatbot-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .chatbot-layout {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .input-group input {
          width: 100%;
          padding: 0.8rem;
          border-radius: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
        }

        .upload-dropzone {
          border: 2px dashed #9ccc65;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: background 0.3s;
          margin-bottom: 1rem;
        }

        .upload-dropzone:hover {
          background: #f1f8e9;
        }

        .upload-icon {
          font-size: 2rem;
          color: #2e7d32;
          margin-bottom: 0.5rem;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .preview-item {
          position: relative;
          aspect-ratio: 1;
        }

        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .remove-btn {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff5252;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .analyze-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          background: #2e7d32;
          color: white;
          font-weight: bold;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          transition: transform 0.2s, background 0.3s;
        }

        .analyze-btn:hover:not(:disabled) {
          background: #1b5e20;
          transform: translateY(-2px);
        }

        .analyze-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .chat-result-section {
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #888;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .loading-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .dna-loader {
          width: 100px;
          height: 100px;
          border: 10px solid #f3f3f3;
          border-top: 10px solid #2e7d32;
          border-radius: 50%;
          animation: spin 2s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .analysis-result {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .diagnosis-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 0.5rem 1.5rem;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 2px solid #2e7d32;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-card.high { background: #ffebee; color: #c62828; }
        .stat-card.medium { background: #fff3e0; color: #ef6c00; }
        .stat-card.low { background: #e8f5e9; color: #2e7d32; }

        .disease-tags {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .disease-tag {
          background: #eceff1;
          padding: 0.3rem 0.8rem;
          border-radius: 5px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .advisory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .advisory-card {
          padding: 1.5rem;
          border-radius: 15px;
          border-left: 5px solid transparent;
          background: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .advisory-card.chemical { border-left-color: #f44336; }
        .advisory-card.bio { border-left-color: #8bc34a; }
        .advisory-card.organic { border-left-color: #4caf50; }
        .advisory-card.fertilizer { border-left-color: #ffc107; }
        .advisory-card.preventive { border-left-color: #2196f3; }

        .advisory-card h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .error-text {
          color: #f44336;
          margin-top: 1rem;
          text-align: center;
          font-weight: 500;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default FarmerChatbot;
