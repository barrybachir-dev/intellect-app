import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';

export function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resumes, quizzes } = useAppContext();
  
  const resume = resumes.find(r => String(r.id) === id);
  const relatedQuiz = quizzes.find(q => String(q.resumeId) === id);

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
            <h1 className="text-3xl font-bold" style={{ margin: '0.5rem 0' }}>{resume.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{resume.pages} pages · {resume.time}</p>
          </div>
          
          {relatedQuiz && (
            <Link to={`/dashboard/quiz/${relatedQuiz.id}`}>
              <Button variant="primary" style={{ padding: '0.5rem 1rem' }}>
                <Sparkles size={16} /> Quiz associé
              </Button>
            </Link>
          )}
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
