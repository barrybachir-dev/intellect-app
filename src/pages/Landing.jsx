import React from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FileText, Brain, FolderOpen, Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>●</span> Nouvelle génération · Plus simple, plus rapide
        </div>
        
        <h1 className="text-5xl font-bold" style={{ marginBottom: '1.5rem', maxWidth: '800px', lineHeight: '1.2' }}>
          Étudie plus <span className="text-gradient">intelligemment</span>, pas plus durement.
        </h1>
        
        <p className="text-xl text-secondary" style={{ maxWidth: '600px', marginBottom: '3rem' }}>
          Intellect transforme tes PDF en résumés, quiz et fiches de révision. La plateforme tout-en-un pour les étudiants ambitieux.
        </p>
        
        <div className="flex gap-4 items-center">
          <Link to="/login">
            <Button variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Commencer gratuitement <span style={{ marginLeft: '0.5rem' }}>→</span>
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Voir la démo
          </Button>
        </div>
        
        <p className="text-sm text-muted" style={{ marginTop: '1.5rem' }}>
          Aucune carte bancaire requise · Commence gratuitement
        </p>
      </main>

      {/* Features Section */}
      <section id="features" className="container" style={{ padding: '6rem 1.5rem' }}>
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 className="text-4xl font-bold" style={{ marginBottom: '1rem' }}>
            Tout ce dont tu as besoin pour <span className="text-gradient">cartonner</span>
          </h2>
          <p className="text-xl text-secondary">Une suite complète pensée pour la vie étudiante moderne.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <div className="btn-icon" style={{ marginBottom: '1.5rem' }}>
              <FileText size={20} color="var(--accent-cyan)" />
            </div>
            <h3 className="text-xl font-bold" style={{ marginBottom: '0.75rem' }}>Résumés PDF instantanés</h3>
            <p className="text-secondary">Upload un cours, obtiens un résumé structuré en quelques secondes. Concepts clés, définitions, plan.</p>
          </Card>
          
          <Card>
            <div className="btn-icon" style={{ marginBottom: '1.5rem' }}>
              <Brain size={20} color="var(--accent-purple)" />
            </div>
            <h3 className="text-xl font-bold" style={{ marginBottom: '0.75rem' }}>Quiz personnalisés</h3>
            <p className="text-secondary">Transforme n'importe quel document en quiz adaptatif. Mémorise mieux, plus vite.</p>
          </Card>

          <Card>
            <div className="btn-icon" style={{ marginBottom: '1.5rem' }}>
              <FolderOpen size={20} color="var(--accent-cyan)" />
            </div>
            <h3 className="text-xl font-bold" style={{ marginBottom: '0.75rem' }}>Notes organisées</h3>
            <p className="text-secondary">Tags, dossiers, recherche sémantique. Retrouve l'information en un clic.</p>
          </Card>
          
          <Card>
            <div className="btn-icon" style={{ marginBottom: '1.5rem' }}>
              <Zap size={20} color="var(--accent-cyan)" />
            </div>
            <h3 className="text-xl font-bold" style={{ marginBottom: '0.75rem' }}>Vitesse extrême</h3>
            <p className="text-secondary">Un espace clair pour retrouver tes contenus et reprendre tes révisions.</p>
          </Card>
          
          <Card>
            <div className="btn-icon" style={{ marginBottom: '1.5rem' }}>
              <Shield size={20} color="var(--accent-cyan)" />
            </div>
            <h3 className="text-xl font-bold" style={{ marginBottom: '0.75rem' }}>100% privé</h3>
            <p className="text-secondary">Tes documents sont conservés dans un espace privé associé à ton compte.</p>
          </Card>
          
          <Card>
            <div className="btn-icon" style={{ marginBottom: '1.5rem' }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
            </div>
            <h3 className="text-xl font-bold" style={{ marginBottom: '0.75rem' }}>Made for students</h3>
            <p className="text-secondary">Conçu pour les universitaires, prépas et lycéens. Modèles pédagogiques inclus.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--accent-cyan)" /> Intellect © 2026
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#tarifs">Tarifs</a>
          <Link to="/login">Connexion</Link>
        </div>
      </footer>
    </div>
  );
}
