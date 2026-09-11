import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resumes, quizzes, generateForResume, updateResume } = useAppContext();
  const [generatingMode, setGeneratingMode] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [metadataForm, setMetadataForm] = useState({ title: '', subject: '', course: '', semester: '' });
  
  const resume = resumes.find(r => String(r.id) === id);
  const relatedQuiz = quizzes.find(q => String(q.resumeId) === id);

  const handleGenerate = async (mode) => {
    setGeneratingMode(mode);
    setGenerationError('');
    try {
      await generateForResume(id, mode);
    } catch (error) {
      setGenerationError(error.message || 'Impossible de préparer ce contenu.');
    } finally {
      setGeneratingMode('');
    }
  };

  const startMetadataEdit = () => {
    setMetadataForm({ title: resume.title, subject: resume.subject || '', course: resume.course || '', semester: resume.semester || '' });
    setEditingMetadata(true);
  };

  const saveMetadata = async event => {
    event.preventDefault();
    try {
      await updateResume(id, metadataForm);
      setEditingMetadata(false);
    } catch (error) {
      setGenerationError(error.message || 'Impossible de modifier le classement.');
    }
  };

  const downloadRevisionSheet = () => {
    const markdown = [
      `# ${resume.title}`,
      '',
      `**Matière :** ${resume.subject || 'Sans matière'}`,
      `**Cours :** ${resume.course || 'Non renseigné'}`,
      `**Semestre :** ${resume.semester || 'Non renseigné'}`,
      `**Pages :** ${resume.pages || 'Non renseigné'}`,
      '',
      '## Résumé',
      '',
      resume.content || 'Aucun résumé disponible.',
      '',
      '## Points clés',
      '',
      ...(resume.keypoints || []).map(point => `- ${point}`),
    ].join('\n');
    const file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'fiche-revision'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!resume) {
    return <div>Résumé introuvable.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/dashboard/resumes')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
        >
          <ArrowLeft size={16} /> Retour aux résumés
        </button>
      </div>

      <Card style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge" style={{ marginBottom: '1rem' }}>{resume.subject}</span>
            {editingMetadata ? (
              <form onSubmit={saveMetadata} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0' }}>
                {['title', 'subject', 'course', 'semester'].map(field => <input key={field} required={field === 'title'} value={metadataForm[field]} onChange={event => setMetadataForm(previous => ({ ...previous, [field]: event.target.value }))} placeholder={field === 'title' ? 'Titre' : field === 'subject' ? 'Matière' : field === 'course' ? 'Cours' : 'Semestre'} style={{ padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />)}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button variant="primary" type="submit">Enregistrer</Button><Button variant="secondary" type="button" onClick={() => setEditingMetadata(false)}>Annuler</Button></div>
              </form>
            ) : <h1 className="text-3xl font-bold" style={{ margin: '0.5rem 0' }}>{resume.title}</h1>}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{resume.pages} pages · {resume.time}</p>
            {(resume.course || resume.semester) && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>{[resume.course, resume.semester].filter(Boolean).join(' · ')}</p>}
          </div>
          
          {relatedQuiz && (
            <Link to={`/dashboard/quiz/${relatedQuiz.id}`}>
              <Button variant="primary" style={{ padding: '0.5rem 1rem' }}>
                <Sparkles size={16} /> Quiz associé
              </Button>
            </Link>
          )}
          {!relatedQuiz && (
            <Button variant="secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleGenerate('quiz')} disabled={Boolean(generatingMode)}>
              {generatingMode === 'quiz' ? 'Préparation...' : 'Créer le quiz'}
            </Button>
          )}
          <Button variant="secondary" style={{ padding: '0.5rem 1rem' }} onClick={downloadRevisionSheet}>
            <Download size={16} /> Fiche Markdown
          </Button>
        </div>

        {!editingMetadata && <Button variant="secondary" onClick={startMetadataEdit} style={{ marginBottom: '1.5rem' }}>Modifier le classement</Button>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Button variant="secondary" onClick={() => handleGenerate('notes')} disabled={Boolean(generatingMode)}>
            {generatingMode === 'notes' ? 'Préparation...' : 'Créer une fiche de notes'}
          </Button>
          {generationError && <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{generationError}</span>}
        </div>

        <div style={{ margin: '2.5rem 0' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>RÉSUMÉ</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            {resume.content}
            Étude détaillée des concepts principaux abordés dans ce document. Ce résumé met en avant les éléments les plus utiles pour faciliter vos révisions.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>POINTS CLÉS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resume.keypoints.map((point, idx) => (
              <div key={idx} style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', 
                padding: '1rem', backgroundColor: 'var(--bg-input)', 
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' 
              }}>
                <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div style={{ fontWeight: '500' }}>{point}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
