import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  MessageSquare,
  ChevronRight,
  Calendar,
  User,
  Bot,
  AlertTriangle,
  Info
} from 'lucide-react';

const DiscussionHistory = () => {
  const { t } = useTranslation();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/discussions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscussions(response.data);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseAnswer = (answerStr) => {
    try {
      return JSON.parse(answerStr);
    } catch (e) {
      return { reasoning: answerStr };
    }
  };

  if (loading) {
    return (
      <div className="discovery-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discovery-container">
      <div className="discovery-header">
        <h1>{t('discussions')}</h1>
        <p>Review your previous conversations with AI Agro Assistant</p>
      </div>

      <div className="discovery-layout">
        <div className="chat-list-sidebar card">
          {discussions.length === 0 ? (
            <div className="empty-chat-list">
              <MessageSquare size={48} opacity={0.3} />
              <p>No discussions found yet.</p>
            </div>
          ) : (
            discussions.map((chat) => (
              <div
                key={chat.id}
                className={`chat-list-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-item-header">
                  <strong>{chat.heading}</strong>
                  <span className="chat-date">{new Date(chat.created_at).toLocaleDateString()}</span>
                </div>
                <p className="chat-preview">{chat.question.substring(0, 60)}...</p>
                <ChevronRight size={16} className="arrow" />
              </div>
            ))
          )}
        </div>

        <div className="chat-detail-view card">
          {selectedChat ? (
            <div className="detail-content">
              <div className="detail-header">
                <h3>{selectedChat.heading}</h3>
                <div className="meta">
                  <Calendar size={14} /> {formatDate(selectedChat.created_at)}
                </div>
              </div>

              <div className="qa-section">
                <div className="qa-bubble user">
                  <div className="avatar"><User size={16} /></div>
                  <div className="bubble-content">
                    <p>{selectedChat.question}</p>
                  </div>
                </div>

                <div className="qa-bubble bot">
                  <div className="avatar"><Bot size={16} /></div>
                  <div className="bubble-content">
                    {(() => {
                      const ans = parseAnswer(selectedChat.answer);
                      return ans.diagnosis ? (
                        <div className="analysis-result">
                          <div className="diagnosis-box">
                            <AlertTriangle size={18} />
                            <strong>{ans.diagnosis}</strong>
                          </div>
                          <p className="reasoning">{ans.reasoning}</p>

                          <div className="advisory-grid">
                            {ans.advisory && Object.entries(ans.advisory).map(([key, val]) => {
                              if (!val) return null;
                              return (
                                <div key={key} className="advisory-item">
                                  <strong>{t(key.replace('_solution', '').replace('_treatment', ''))}:</strong>
                                  <span>{typeof val === 'string' ? val : `${val.name} (${val.dosage})`}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p>{ans.reasoning || selectedChat.answer}</p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-detail-state">
              <Info size={60} opacity={0.1} />
              <h3>Select a discussion</h3>
              <p>Click on a conversation from the list to view the full analysis and advisory.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .discovery-container {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .discovery-header {
          margin-bottom: 30px;
        }

        .discovery-header h1 {
          color: #2e7d32;
          margin-bottom: 10px;
        }

        .discovery-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 25px;
          height: calc(100vh - 250px);
          min-height: 500px;
        }

        .chat-list-sidebar {
          overflow-y: auto;
          padding: 10px;
          background: #fdfdfd;
        }

        .chat-list-item {
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          position: relative;
        }

        .chat-list-item:hover {
          background: #f1f8e9;
        }

        .chat-list-item.active {
          background: #e8f5e9;
          border-color: #c8e6c9;
        }

        .chat-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .chat-item-header strong {
          font-size: 15px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .chat-date {
          font-size: 11px;
          color: #888;
        }

        .chat-preview {
          font-size: 13px;
          color: #666;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #ccc;
          opacity: 0;
          transition: 0.2s;
        }

        .chat-list-item:hover .arrow {
          opacity: 1;
          right: 15px;
        }

        .chat-detail-view {
          overflow-y: auto;
          background: white;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .detail-header {
          padding: 25px;
          border-bottom: 1px solid #eee;
          background: #fcfcfc;
        }

        .detail-header h3 {
          margin: 0 0 10px 0;
          color: #2e7d32;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #888;
        }

        .qa-section {
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .qa-bubble {
          display: flex;
          gap: 15px;
          max-width: 90%;
        }

        .qa-bubble.user {
          align-self: flex-start;
        }

        .qa-bubble.bot {
          align-self: flex-start;
          width: 100%;
          max-width: 100%;
        }

        .avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user .avatar { background: #2e7d32; color: white; }
        .bot .avatar { background: #f0f0f0; color: #2e7d32; }

        .bubble-content {
          padding: 15px 20px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.6;
        }

        .user .bubble-content {
          background: #e8f5e9;
          color: #1b5e20;
          border-top-left-radius: 2px;
        }

        .bot .bubble-content {
          background: #f9f9f9;
          color: #333;
          border-top-left-radius: 2px;
          width: 100%;
        }

        .analysis-result {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .diagnosis-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff8e1;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #ffe082;
          color: #f57c00;
        }

        .reasoning {
          font-size: 14px;
          color: #555;
          font-style: italic;
        }

        .advisory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }

        .advisory-item {
          background: white;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .advisory-item strong {
          color: #2e7d32;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .advisory-item span {
          font-size: 14px;
        }

        .empty-detail-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #bbb;
          padding: 50px;
          text-align: center;
        }

        .empty-detail-state h3 { margin-top: 20px; color: #999; }

        @media (max-width: 900px) {
          .discovery-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          .chat-list-sidebar {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default DiscussionHistory;
