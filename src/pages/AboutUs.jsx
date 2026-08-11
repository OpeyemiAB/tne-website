import React from 'react';
import { Sparkles, Heart, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Our Story</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>"Elegance in Every Surprise" — Redefining luxury gifting in Nigeria.</p>
      </div>

      <div style={{ lineHeight: '1.8', fontSize: '0.98rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
        <p>
          <strong>The Nifemi Experience (TNE)</strong> was inspired by a childhood filled with thoughtful surprises. Growing up, our founder’s father always brought home gifts, no matter how small—a gesture that taught us that true gifting is <em>love made visible</em>.
        </p>
        <p>
          Built on that core belief, TNE is a luxury gifting and personalization brand that helps people express deep love and appreciation through beautifully curated surprise packages. From the simplicity of our Starter Box to the executive prestige of our Signature Collections, every package is designed to create lasting, unforgettable memories.
        </p>
      </div>

      {/* Brand Values row */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--primary-green)' }}>TNE Core Pillars</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'center' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <Sparkles size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Bespoke Curation</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Each item is selected and structured to fit the exact feelings of the occasion.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <Award size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Exquisite Detail</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From custom nameplate engravings to satin silk ribbons, precision is our standard.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <Heart size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Emotional Impact</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>We believe a gift is more than an object; it is an experience that connects hearts.</p>
        </div>
      </div>
    </div>
  );
}
