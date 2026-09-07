import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
        <div style={{ backgroundColor: '#c084fc', padding: '0.25rem', borderRadius: '50%', color: '#fff' }}>
          <Sparkles size={24} />
        </div>
        Intellect
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
        <a href="#features" className="hover:text-white">Fonctionnalités</a>
        <a href="#tarifs" className="hover:text-white">Tarifs</a>
        <a href="#faq" className="hover:text-white">FAQ</a>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/login" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Connexion</Link>
        <Link to="/dashboard">
          <Button variant="primary" style={{ padding: '0.5rem 1rem', borderRadius: '9999px' }}>Commencer</Button>
        </Link>
      </div>
    </nav>
  );
}
