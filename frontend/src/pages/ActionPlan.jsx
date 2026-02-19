import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Upload, Calendar, ArrowRight, Mic, CheckCircle, AlertTriangle, Leaf, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './ActionPlan.css';

const ActionPlan = () => {
    const { t, i18n } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState(null);
    const [speakingDay, setSpeakingDay] = useState(null);

    const speakText = (text, dayIndex) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            if (speakingDay === dayIndex) {
                setSpeakingDay(null);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setSpeakingDay(null);

            // Attempt to change voice tone
            const voices = window.speechSynthesis.getVoices();
            let preferredVoice;

            if (i18n.language === 'hi') {
                preferredVoice = voices.find(voice =>
                    voice.lang.includes('hi') || voice.name.includes('Hindi')
                );
            }

            if (!preferredVoice) {
                // Try to find a female voice or a more natural sounding one if available (e.g., Google US English, Samantha)
                preferredVoice = voices.find(voice =>
                    voice.name.includes('Google US English') ||
                    voice.name.includes('Samantha') ||
                    voice.name.includes('Female')
                );
            }

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.pitch = 1.1; // Slightly higher pitch for a different tone
            utterance.rate = 0.95; // Slightly slower rate for clarity

            setSpeakingDay(dayIndex);
            window.speechSynthesis.speak(utterance);

        } else {
            alert(t('tts_not_supported'));
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError(t('select_files'));
            return;
        }


        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('lang', i18n.language);

        try {
            const response = await axios.post('/diagnosis/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setPlan(response.data);
        } catch (err) {
            console.error("Error analyzing crop:", err);
            setError(t('error_analyzing') || "Failed to analyze crop. Please try again.");
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        if (plan && selectedFile && !loading) {
            handleSubmit();
        }
    }, [i18n.language]);

    if (plan) {
        return (
            <div className="action-plan-container">
                {/* Header Section */}
                <div className="card disease-header">
                    <div className="disease-info">
                        <h2>
                            <AlertTriangle size={24} />
                            {t('Disease Detected')}: {plan.disease_name}
                        </h2>
                        <div className="disease-meta">
                            <span>
                                <Droplets size={18} />
                                {t('weather')}: <b>{plan.weather}</b>
                            </span>

                        </div>
                    </div>
                    {preview && (
                        <img src={preview} alt="Crop" className="disease-thumb" />
                    )}
                </div>

                {/* Action Plan Timeline */}
                <div className="timeline-section">
                    <h3>
                        <Calendar size={24} />
                        {t('day_plan_title')}
                    </h3>


                    <div className="timeline">
                        {plan.plan.map((day, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-dot"></div>

                                <div className="card timeline-content">
                                    <div className="day-header">
                                        <div>
                                            <span className="day-label">{day.day}</span>
                                            <h4 className="day-title">{day.title}</h4>
                                        </div>
                                        <button
                                            className={`btn-voice ${speakingDay === index ? 'active' : ''}`}
                                            onClick={() => {
                                                const textToSpeak = `${day.day}. ${day.title}. ${day.tasks.join('. ')}. ${day.reminder ? t('reminder') + ': ' + day.reminder : ''}`;
                                                speakText(textToSpeak, index);
                                            }}
                                        >
                                            <Mic size={16} />
                                            <span>{speakingDay === index ? t('stop') : t('listen')}</span>
                                        </button>


                                    </div>

                                    <ul className="task-list">
                                        {day.tasks.map((task, idx) => (
                                            <li key={idx} className="task-item">
                                                <CheckCircle size={16} className="task-icon" />
                                                <span>{task}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {day.reminder && (
                                        <div className="reminder-box">
                                            <AlertTriangle size={16} />
                                            <span>{t('reminder')}: {day.reminder}</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setPlan(null)}
                        className="btn-reset"
                    >
                        {t('upload_new')}
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="action-plan-container">
            <div className="action-plan-header">
                <h1>{t('action_plan_title')}</h1>
                <p>{t('action_plan_subtitle')}</p>
            </div>


            <div
                className={`upload-area ${selectedFile ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="preview-image" />
                        <p className="text-sm text-gray-500">{selectedFile.name}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreview(null); }}
                            className="btn-remove"
                        >
                            {t('remove')}
                        </button>
                    </div>
                ) : (
                    <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                        <div className="upload-icon-wrapper">
                            <Upload size={32} />
                        </div>
                        <h3>{t('click_upload')}</h3>
                        <p style={{ color: '#888', marginTop: '0.5rem' }}>{t('file_type_hint')}</p>
                    </label>

                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!selectedFile || loading}
                className="btn btn-primary btn-submit"
            >
                {loading ? (
                    <>
                        <div className="spinner" style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <span>{t('analyzing_spinner')}</span>
                    </>
                ) : (
                    <>
                        <span>{t('get_plan')}</span>
                        <ArrowRight size={20} />
                    </>
                )}

            </button>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default ActionPlan;
