import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, RotateCcw } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function Flashcards() {
  const { resumes } = useAppContext();
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeResumeId = selectedResumeId || resumes[0]?.id || '';
  const selectedResume = resumes.find(resume => String(resume.id) === String(activeResumeId));
  const cards = selectedResume?.keypoints || [];

  const changeCard = (nextIndex) => {
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
  };

  if (resumes.length === 0) {
    return (
      <Card style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem 1rem' }}>
        <Layers size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
        <h1 className="text-2xl font-bold" style={{ marginBottom: '0.75rem' }}>Aucune flashcard disponible</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Importe un document pour transformer ses points clés en cartes de révision.</p>
        <Link to="/dashboard/upload"><Button variant="primary">Importer un document</Button></Link>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem' }}>Mes <span className="text-gradient">flashcards</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Révise les notions essentielles de tes résumés.</p>
      </header>

      <select value={activeResumeId} onChange={event => { setSelectedResumeId(event.target.value); setCurrentIndex(0); setIsFlipped(false); }} style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
        {resumes.map(resume => <option key={resume.id} value={resume.id}>{resume.title}</option>)}
      </select>

      {cards.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Ce résumé ne contient pas encore de points clés.</p>
        </Card>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            <span>Carte {currentIndex + 1} / {cards.length}</span>
            <span>{selectedResume.subject || 'Révision'}</span>
          </div>
          <button type="button" onClick={() => setIsFlipped(flipped => !flipped)} aria-label="Retourner la flashcard" style={{ width: '100%', minHeight: '280px', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.18)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              {isFlipped ? 'Réponse' : 'À retenir'}
            </div>
            <div className="text-2xl font-bold" style={{ lineHeight: 1.45 }}>
              {isFlipped ? cards[currentIndex] : `Que faut-il retenir du point ${currentIndex + 1} ?`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2rem' }}>
              <RotateCcw size={14} /> Cliquer pour retourner
            </div>
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => changeCard(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
              <ArrowLeft size={16} /> Précédente
            </Button>
            <Button variant="primary" onClick={() => changeCard(Math.min(cards.length - 1, currentIndex + 1))} disabled={currentIndex === cards.length - 1}>
              Suivante <ArrowRight size={16} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
