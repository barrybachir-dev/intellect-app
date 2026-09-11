import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Lock, Brain } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAppContext } from '../context/AppContext';

export function Upload() {
  const { canUpload, processDocument, usage } = useAppContext();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState('');
  const [processingStage, setProcessingStage] = useState('');
  const [generationMode, setGenerationMode] = useState('all');

  const handleProcessFile = (file) => {
    if (!canUpload()) {
      setShowPaywall(true);
      return;
    }

    setError('');
    setProcessingStage('Téléchargement du PDF…');
    setIsUploading(true);
    processDocument(file, generationMode)
      .then(resumeId => navigate('/dashboard/resumes/' + resumeId))
      .catch(uploadError => {
        setError(uploadError.message || 'Le traitement du document a echoue.');
        setProcessingStage('');
      })
      .finally(() => {
        setIsUploading(false);
        setProcessingStage('');
      });
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  if (showPaywall) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'rgba(255, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={32} color="#f87171" />
          </div>
          <h2 className="text-3xl font-bold">Limite atteinte</h2>
          <p className="text-secondary text-lg">Vous avez utilisé vos {usage.resumesLimit} résumés mensuels inclus dans le plan Free.</p>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }}></div>
          <Button variant="primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }} onClick={() => navigate('/dashboard/settings')}>
            Passer Pro — 9€/mois
          </Button>
          <Button variant="secondary" onClick={() => setShowPaywall(false)}>Retour</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0.5rem 0' }}>Upload un <span className="text-gradient">PDF</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Glisse ton document de cours pour générer un résumé et un quiz.</p>
      </header>

      <fieldset style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
        <legend style={{ padding: '0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Que veux-tu préparer ?</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          {[
            ['summary', 'Résumé seul'],
            ['quiz', 'Quiz seul'],
            ['notes', 'Notes seules'],
            ['all', 'Tout'],
          ].map(([value, label]) => (
            <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: `1px solid ${generationMode === value ? 'var(--accent-cyan)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              <input type="radio" name="generationMode" value={value} checked={generationMode === value} onChange={e => setGenerationMode(e.target.value)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(0, 229, 255, 0.05)' : 'var(--bg-card)',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative'
        }}
      >
        {isUploading ? (
          <>
            <div className="btn-icon" style={{ width: '4rem', height: '4rem', animation: 'pulse 1.5s infinite' }}>
              <Brain size={32} color="var(--accent-cyan)" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">Traitement en cours...</h2>
            <p className="text-secondary" style={{ marginBottom: '0.5rem' }}>
              {processingStage || 'Préparation du résumé, des points-clés et du quiz sur mesure.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="badge">Upload</span>
              <span className="badge">Analyse du PDF</span>
              <span className="badge">Quiz généré</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <UploadCloud size={32} color="var(--bg-color)" />
            </div>
            
            <h2 className="text-2xl font-bold">Dépose ton PDF ici</h2>
            <p className="text-secondary">
              ou clique pour parcourir · tous les PDF sont acceptes · max 20 Mo
            </p>
            
            <input type="file" accept="application/pdf,.pdf" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={onFileInput} />
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <span className="badge">PDF natif</span>
              <span className="badge">PDF scanné (OCR)</span>
              <span className="badge">Articles scientifiques</span>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
        }
      `}</style>
    </div>
  );
}
