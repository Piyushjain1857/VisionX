import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  MessageCircle,
  X,
  Send,
  Image as ImageIcon,
  Bot,
  AlertTriangle,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';

const ChatFloatingWidget = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI Agro Assistant. How can I help with your crops today?', type: 'text' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Update recognition language when i18n language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    }
  }, [i18n.language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text, lang) => {
    if (!autoRead) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'Hindi' ? 'hi-IN' : 'en-US';

    // Attempt to select a preferred voice (e.g., Google Hindi/English or a female voice)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      (lang === 'Hindi' ? v.lang.includes('hi') : v.lang.includes('en')) &&
      (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Samantha'))
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Adjust pitch and rate for a more natural feel
    utterance.pitch = 1.1;
    utterance.rate = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '' && images.length === 0) return;

    const userMessage = {
      role: 'user',
      text: inputValue,
      images: images.map(img => URL.createObjectURL(img)),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    const currentImages = [...images];

    setInputValue('');
    setImages([]);
    setLoading(true);

    const formData = new FormData();
    currentImages.forEach(img => formData.append('images', img));
    formData.append('message', currentInput);
    formData.append('crop_type', 'Detect Automatically');
    formData.append('language', i18n.language === 'en' ? 'English' : 'Hindi');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/chat/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      const botResponse = {
        role: 'bot',
        data: response.data,
        type: 'analysis'
      };
      setMessages(prev => [...prev, botResponse]);

      // Handle Voice Response
      if (autoRead) {
        if (response.data.diagnosis) {
          const diagnosis = response.data.diagnosis || "";
          const reasoning = response.data.reasoning || "";
          const advisory = response.data.advisory?.chemical_solution?.name || "";
          const speechText = `${diagnosis}. ${reasoning}. ${advisory}`;
          speak(speechText, i18n.language === 'en' ? 'English' : 'Hindi');
        } else if (response.data.text) {
          speak(response.data.text, i18n.language === 'en' ? 'English' : 'Hindi');
        }
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        type: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-chat-widget">
      {/* Floating Toggle Button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && <span className="notification-badge">AI</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window fade-in">
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={20} color="white" />
              </div>
              <div>
                <h4>AgroGuard AI</h4>
                <div className="status-online">
                  <span className="dot"></span> Online
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={() => {
                  if (autoRead) window.speechSynthesis.cancel();
                  setAutoRead(!autoRead);
                }}
                title={autoRead ? "Mute AI" : "Unmute AI"}
                className={`voice-toggle ${autoRead ? 'active' : ''}`}
              >
                {autoRead ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                <div className="message-content">
                  {msg.images && msg.images.length > 0 && (
                    <div className="message-images">
                      {msg.images.map((img, i) => (
                        <img key={i} src={img} alt="upload" className="msg-img" />
                      ))}
                    </div>
                  )}

                  {msg.type === 'analysis' ? (
                    <div className="analysis-card">
                      <div className="diagnosis-line">
                        <AlertTriangle size={14} /> <strong>{msg.data.diagnosis}</strong>
                      </div>
                      <p className="reasoning-text">{msg.data.reasoning}</p>
                      {msg.data.advisory?.chemical_solution?.name && (
                        <div className="advisory-mini">
                          <strong>Advisory:</strong> {msg.data.advisory.chemical_solution.name} ({msg.data.advisory.chemical_solution.dosage})
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-wrapper bot">
                <div className="message-content loading">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="chat-image-previews">
              {images.map((img, index) => (
                <div key={index} className="chat-preview-item">
                  <img src={URL.createObjectURL(img)} alt="p" />
                  <button onClick={() => removeImage(index)}><X size={10} /></button>
                </div>
              ))}
            </div>
          )}

          <form className="chat-input-area" onSubmit={handleSend}>
            <button
              type="button"
              className="icon-btn"
              onClick={() => fileInputRef.current.click()}
            >
              <ImageIcon size={20} />
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {/* Mic Button */}
            <button
              type="button"
              className={`icon-btn mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
            >
              {isListening ? <MicOff size={20} color="#ff5252" /> : <Mic size={20} />}
            </button>
            <input
              type="text"
              placeholder={isListening ? (i18n.language === 'hi' ? "सुन रहा हूँ..." : "Listening...") : (i18n.language === 'hi' ? "हिंदी में सवाल पूछें..." : "Ask your question...")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={isListening ? 'input-listening' : ''}
            />
            <button type="submit" className="send-btn" disabled={loading}>
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      <style jsx="true">{`
        .floating-chat-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }

        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #2e7d32;
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .chat-toggle-btn:hover {
          transform: scale(1.1);
          background: #1b5e20;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff5252;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 3px 6px;
          border-radius: 10px;
          border: 2px solid white;
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 550px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .chat-header {
          background: #2e7d32;
          padding: 15px 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .header-actions button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .header-actions button:hover, .header-actions button.active {
          opacity: 1;
        }

        .bot-avatar {
          width: 35px;
          height: 35px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-header h4 {
          margin: 0;
          font-size: 16px;
        }

        .status-online {
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0.8;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #4caf50;
          border-radius: 50%;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message-wrapper {
          max-width: 85%;
          display: flex;
        }

        .message-wrapper.user {
          align-self: flex-end;
        }

        .message-wrapper.bot {
          align-self: flex-start;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 15px;
          font-size: 14px;
          line-height: 1.5;
        }

        .user .message-content {
          background: #2e7d32;
          color: white;
          border-bottom-right-radius: 2px;
        }

        .bot .message-content {
          background: white;
          color: #333;
          border-bottom-left-radius: 2px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .message-images {
          display: flex;
          gap: 5px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .msg-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .analysis-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .diagnosis-line {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #c62828;
        }

        .reasoning-text {
          font-size: 13px;
          color: #555;
        }

        .advisory-mini {
          font-size: 12px;
          background: #e8f5e9;
          padding: 8px;
          border-radius: 8px;
          border-left: 3px solid #4caf50;
        }

        .chat-image-previews {
          padding: 10px 20px;
          display: flex;
          gap: 10px;
          background: white;
          border-top: 1px solid #eee;
        }

        .chat-preview-item {
          position: relative;
        }

        .chat-preview-item img {
          width: 40px;
          height: 40px;
          border-radius: 5px;
        }

        .chat-preview-item button {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff5252;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .chat-input-area {
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border-top: 1px solid #eee;
        }

        .chat-input-area input {
          flex: 1;
          border: none;
          padding: 10px;
          outline: none;
          font-size: 14px;
        }

        .input-listening {
          color: #ff5252;
          font-style: italic;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          color: #2e7d32;
        }

        .mic-btn.listening {
          animation: pulse-red 1.5s infinite;
        }

        @keyframes pulse-red {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .send-btn {
          background: #2e7d32;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .send-btn:disabled {
          opacity: 0.5;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .chat-window {
            width: 300px;
            height: 450px;
            right: -20px; /* Offset parent padding */
          }
          
          .floating-chat-widget {
             right: 20px;
             bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatFloatingWidget;
