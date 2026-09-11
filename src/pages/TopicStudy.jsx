import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PenLine } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAppContext } from '../context/useAppContext';

const MODES = [
  ['summary', 'Résumé seul'],
  ['quiz', 'Quiz seul'],
  ['notes', 'Notes seules'],
  ['all', 'Tout'],
];

export function TopicStudy() {
  const { generateTopic } = useAppContext();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [mode, setMode] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resumeId = await generateTopic(topic, mode, subject, { course, semester });
      navigate(`/dashboard/resumes/${resumeId}`);
    } catch (generationError) {
      setError(generationError.message || 'Impossible de préparer ce sujet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem' }}>Étudier un <span className="text-gradient">sujet</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Commence une fiche de révision sans importer de document.</p>
      </header>

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label htmlFor="study-topic" style={{ fontWeight: 'bold' }}>Quel sujet veux-tu travailler ?</label>
          <textarea id="study-topic" value={topic} onChange={event => setTopic(event.target.value)} placeholder="Ex : Les lois de Newton, la photosynthèse, le droit constitutionnel..." rows={4} disabled={loading} style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }} />
          <input value={subject} onChange={event => setSubject(event.target.value)} placeholder="Matière (facultatif) — ex : Physique" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <input value={course} onChange={event => setCourse(event.target.value)} placeholder="Cours (facultatif)" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }} />
            <input value={semester} onChange={event => setSemester(event.target.value)} placeholder="Semestre (facultatif)" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>

          <fieldset style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <legend style={{ padding: '0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Format souhaité</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {MODES.map(([value, label]) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: `1px solid ${mode === value ? 'var(--accent-cyan)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                  <input type="radio" name="topic-mode" value={value} checked={mode === value} onChange={event => setMode(event.target.value)} disabled={loading} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {error && <div role="alert" style={{ padding: '0.75rem 1rem', color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
          <Button variant="primary" type="submit" disabled={loading} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? 'Préparation en cours...' : <><PenLine size={17} /> Commencer à étudier</>}
          </Button>
        </form>
      </Card>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1.5rem' }}>
        <BookOpen size={18} color="var(--accent-cyan)" />
        Le contenu créé sera conservé dans ta bibliothèque personnelle.
      </div>
    </div>
  );
}
