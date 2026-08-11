import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! Welcome to The Nifemi Experience. How can we help you create a beautiful surprise today?' }
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const whatsappNumber = "2348133231667";
  const defaultMessage = "Hello TNE! I am visiting your website and would like to make an inquiry.";

  const quickPrompts = [
    "📦 Gifting Packages",
    "🚚 Delivery Info",
    "✏ Personalization",
    "📱 Contact Us"
  ];

  const [isOptionsCollapsed, setIsOptionsCollapsed] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate instant AI-like luxury support assistant response
    setTimeout(() => {
      let botResponse = "";
      const q = chatInput.toLowerCase().trim();

      if (q.includes('track') || q.includes('status') || q.includes('where is my order')) {
        botResponse = "You can track your order using the 'Track Order' option in the navbar by entering your unique Order ID (e.g., TNE-123456).";
      } else if (q.includes('custom') || q.includes('box') || q.includes('build') || q.includes('curate')) {
        botResponse = "You can build your own bespoke gift box in the 'Customize' tab! Select a box scale (Starter, Classic, Premium, Signature), add fillers like candles or perfumes, choose a ribbon color, write a custom note, and checkout directly.";
      } else if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
        botResponse = "Our main packages: Starter Box (₦10,000), Classic Box (₦25,000), Premium Box (₦55,000), and Signature Box (₦120,000). Customized Watch is ₦27,000, Customized Necklace is ₦17,500, and Engraved Bracelet is ₦13,000.";
      } else if (q.includes('delivery') || q.includes('shipping') || q.includes('location') || q.includes('fee')) {
        botResponse = "We ship across Nigeria! Delivery is flat ₦2,500 within Lagos, and ₦5,000 for Abuja, Rivers, Oyo, and other states. We offer Free Delivery for orders above ₦50,000.";
      } else if (q.includes('personal') || q.includes('engrav') || q.includes('photo') || q.includes('logo')) {
        botResponse = "We offer personalized engravings for Necklaces, Bracelets, Watches, Wallets, and Keyholders! You can upload names, custom dates, or photos/logos on their respective product details pages.";
      } else if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('whatsapp')) {
        botResponse = "You can contact TNE Support directly via WhatsApp at +234 813 323 1667, or call our inquiry line at +234 815 449 3101.";
      } else if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
        botResponse = "Hello! Welcome to The Nifemi Experience. How can I help you pick the perfect surprise package today?";
      } else if (q === 'ok' || q === 'okay' || q === 'cool' || q === 'fine' || q === 'yes') {
        botResponse = "Wonderful! Let me know if you would like to explore our custom box curations or if you have specific product questions.";
      } else if (q.includes('thank') || q === 'thanks') {
        botResponse = "You're very welcome! We are always here to make your luxury gifting experience smooth and memorable.";
      } else if (q.includes('want you') || q.includes('who are you') || q.includes('what are you')) {
        botResponse = "I am the TNE Gifting Concierge Bot. I can answer inquiries about our packages, delivery, and tracking. For human assistance, you can click the WhatsApp button at any time!";
      } else {
        botResponse = "I couldn't quite find info on that. I can assist with gifting packages, shipping rates, customizations, or order tracking. Feel free to use the quick questions below, or tap 'Chat on WhatsApp' for a live support agent.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  const triggerQuickPrompt = (promptText) => {
    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: promptText };
    setMessages(prev => [...prev, userMsg]);
    
    // Auto-collapse options menu so user can see message history immediately
    setIsOptionsCollapsed(true);

    // Bot responds
    setTimeout(() => {
      let botResponse = "";
      if (promptText.includes("Gifting Packages")) {
        botResponse = "We offer 4 curated box sizes: Starter Box (₦10,000), Classic Box (₦25,000), Premium Box (₦55,000), and Signature Box (₦120,000). You can also add custom engraved items like watches and perfume!";
      } else if (promptText.includes("Delivery Info")) {
        botResponse = "Standard Lagos delivery is flat ₦2,500. Deliveries to other Nigerian states (Abuja, PH, Ibadan, etc.) is ₦5,000. Orders above ₦50,000 receive free shipping!";
      } else if (promptText.includes("Personalization")) {
        botResponse = "We engrave names and logos on Watches (₦27,000), Necklaces (₦17,500), and Bracelets (₦13,000). Just fill the custom field on the product details page.";
      } else if (promptText.includes("Contact Us")) {
        botResponse = "Call/WhatsApp us at +234 815 449 3101, or email thenifemiexperience@gmail.com. We are online 24/7!";
      } else {
        botResponse = "How else can I assist you with your gift curation today?";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div style={{ zIndex: 1000, fontFamily: 'var(--font-sans)' }}>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-green)',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,75,73,0.3)',
            border: '1px solid var(--accent-gold)'
          }}
          title="Chat with TNE Support"
          aria-label="Open support chat widget"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '320px',
          height: '500px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: '1.5px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'var(--primary-green)',
            color: '#fff',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--accent-gold)',
            width: '100%'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>TNE Support</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Elegance in Every Surprise</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#fff' }} aria-label="Close support chat window">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary-green)' : '#f1f5f9',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-dark)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  maxWidth: '85%',
                  fontSize: '0.85rem'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct WhatsApp Prompt */}
          <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#25D366',
                color: '#fff',
                padding: '0.45rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textAlign: 'center',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Chat on WhatsApp Directly
            </a>
          </div>

          {/* Quick Prompts Bar (Vertical Stack with Collapse Toggle) */}
          <div style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
            <div 
              onClick={() => setIsOptionsCollapsed(!isOptionsCollapsed)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                backgroundColor: '#f1f5f9',
                borderBottom: isOptionsCollapsed ? 'none' : '1px solid var(--border-color)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            >
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-green)', fontWeight: '800' }}>
                💡 Quick Inquiries
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', fontWeight: 'bold' }}>
                {isOptionsCollapsed ? '▲ Show Questions' : '▼ Hide Questions'}
              </span>
            </div>
            
            {!isOptionsCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.75rem 1rem', overflowY: 'auto', maxHeight: '130px' }} className="custom-scroll">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerQuickPrompt(prompt)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem 0.75rem',
                      backgroundColor: 'var(--background-ivory)',
                      border: '1.5px solid var(--accent-gold)',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      color: 'var(--primary-green)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-green)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--background-ivory)';
                      e.currentTarget.style.color = 'var(--primary-green)';
                    }}
                  >
                    <span>{prompt}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>➔</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--primary-green)',
                color: '#fff',
                padding: '0.5rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
