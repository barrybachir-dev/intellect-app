import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';

export function Resumes() {
  const { resumes } = useAppContext();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem 0' }}>Mes <span className="text-gradient">résumés</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>{resumes.length} documents synthétisés.</p>
        </div>
        <Link to="/dashboard/upload">
          <Button variant="primary">
            <Sparkles size={18} /> Nouveau document
          </Button>
        </Link>
      </header>

      {resumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <FileText size={48} color="var(--border-color)" />
          <h2 className="text-2xl font-bold">Aucun résumé</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>Uploadez votre premier cours au format PDF pour générer un résumé détaillé.</p>
          <Link to="/dashboard/upload" style={{ marginTop: '1rem' }}>
            <Button variant="primary">Commencer</Button>
          </Link>
        </div>
      ) : (
        <div className="grid-responsive-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {resumes.map(resume => (
            <Link key={resume.id} to={`/dashboard/resumes/${resume.id}`}>
              <Card className="hover-lift" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div className="btn-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <FileText size={20} color="var(--accent-cyan)" />
                  </div>
                  <span className="badge">{resume.subject}</span>
                </div>
                <h3 className="text-xl font-bold" style={{ marginBottom: 'auto' }}>{resume.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>{resume.pages} pages</span>
                  <span>{resume.time}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 229, 255, 0.1); border-color: rgba(0, 229, 255, 0.3); }
      `}</style>
    </div>
  );
}
