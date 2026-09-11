import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Brain } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';

export function ReviewBySubject() {
  const { resumes, quizzes } = useAppContext();
  const subjects = resumes.reduce((groups, resume) => {
    const subject = resume.subject || 'Sans matière';
    if (!groups[subject]) groups[subject] = [];
    groups[subject].push(resume);
    return groups;
  }, {});

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem' }}>Réviser par <span className="text-gradient">matière</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Retrouve tes contenus et reprends là où tu t'étais arrêté.</p>
      </header>

      {Object.keys(subjects).length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <BookOpen size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
          <h2 className="text-2xl font-bold" style={{ marginBottom: '0.75rem' }}>Aucune matière disponible</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Importe un document pour commencer ta bibliothèque de révision.</p>
          <Link to="/dashboard/upload"><Button variant="primary">Importer un document</Button></Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(subjects).map(([subject, subjectResumes]) => {
            const subjectQuizCount = subjectResumes.filter(resume => quizzes.some(quiz => String(quiz.resumeId) === String(resume.id))).length;
            return (
              <Card key={subject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="btn-icon"><BookOpen size={20} color="var(--accent-cyan)" /></div>
                  <div>
                    <h2 className="text-xl font-bold">{subject}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{subjectResumes.length} document{subjectResumes.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span><FileText size={15} /> {subjectResumes.length} résumés</span>
                  <span><Brain size={15} /> {subjectQuizCount} quiz</span>
                </div>
                <Link to={`/dashboard/resumes/${subjectResumes[0].id}`} style={{ marginTop: 'auto' }}>
                  <Button variant="secondary" style={{ width: '100%' }}>Commencer la révision</Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
