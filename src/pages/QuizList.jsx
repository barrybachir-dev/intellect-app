import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function QuizList() {
  const { quizzes } = useAppContext();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem 0' }}>Mes <span className="text-gradient">Quiz</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Teste tes connaissances.</p>
      </header>

      {quizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Brain size={48} color="var(--border-color)" />
          <h2 className="text-2xl font-bold">Aucun quiz disponible</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>Générez d'abord un résumé à partir d'un PDF pour débloquer les quiz associés.</p>
          <Link to="/dashboard/upload" style={{ marginTop: '1rem' }}>
            <Button variant="primary">Uploader un PDF</Button>
          </Link>
        </div>
      ) : (
        <div className="grid-responsive-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {quizzes.map(quiz => (
            <Card key={quiz.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div className="btn-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <Brain size={20} color="var(--accent-purple)" />
                </div>
                {quiz.completed ? (
                  <span className="badge" style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}>Score: {quiz.score}%</span>
                ) : (
                  <span className="badge">Nouveau</span>
                )}
              </div>
              <h3 className="text-xl font-bold" style={{ marginBottom: '1rem' }}>{quiz.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {quiz.questions.length} questions
              </p>
              <div style={{ marginTop: 'auto' }}>
                <Link to={`/dashboard/quiz/${quiz.id}`} style={{ display: 'block' }}>
                  <Button variant="secondary" style={{ width: '100%' }}>
                    {quiz.completed ? 'Recommencer' : 'Démarrer le quiz'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
