import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, FileText, TrendingUp, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function Progress() {
  const { user, resumes, quizzes, notes } = useAppContext();
  const storageKey = `intellect-study-seconds-${user.email || 'guest'}`;
  const [studySeconds, setStudySeconds] = useState(() => Number(localStorage.getItem(storageKey) || 0));
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isTracking) return undefined;
    const timer = window.setInterval(() => setStudySeconds(seconds => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isTracking]);

  useEffect(() => {
    localStorage.setItem(storageKey, String(studySeconds));
  }, [storageKey, studySeconds]);

  const formattedStudyTime = `${String(Math.floor(studySeconds / 3600)).padStart(2, '0')}:${String(Math.floor((studySeconds % 3600) / 60)).padStart(2, '0')}:${String(studySeconds % 60).padStart(2, '0')}`;
  const completedQuizzes = quizzes.filter(quiz => quiz.completed && Number.isFinite(quiz.score));
  const averageScore = completedQuizzes.length
    ? Math.round(completedQuizzes.reduce((total, quiz) => total + quiz.score, 0) / completedQuizzes.length)
    : null;

  const subjects = resumes.reduce((groups, resume) => {
    const subject = resume.subject || 'Sans matière';
    const resumeQuiz = quizzes.find(quiz => String(quiz.resumeId) === String(resume.id) && quiz.completed && Number.isFinite(quiz.score));
    if (!groups[subject]) groups[subject] = { documents: 0, scores: [] };
    groups[subject].documents += 1;
    if (resumeQuiz) groups[subject].scores.push(resumeQuiz.score);
    return groups;
  }, {});

  const subjectRows = Object.entries(subjects).map(([name, data]) => ({
    name,
    documents: data.documents,
    score: data.scores.length ? Math.round(data.scores.reduce((total, score) => total + score, 0) / data.scores.length) : null,
  })).sort((first, second) => (first.score ?? -1) - (second.score ?? -1));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem' }}>Ma <span className="text-gradient">progression</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Un aperçu fondé sur tes activités réelles.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          [FileText, resumes.length, 'Documents étudiés'],
          [CheckCircle2, completedQuizzes.length, 'Quiz terminés'],
          [TrendingUp, averageScore === null ? '—' : `${averageScore}%`, 'Score moyen'],
          [BookOpen, notes.length, 'Notes créées'],
        ].map(([Icon, value, label]) => (
          <Card key={label} style={{ padding: '1.25rem' }}>
            <Icon size={20} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-secondary text-sm">{label}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="btn-icon"><Clock size={20} color="var(--accent-cyan)" /></div>
          <div><h2 className="text-xl font-bold">Temps d’étude suivi</h2><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Suivi sur cet appareil · {formattedStudyTime}</p></div>
        </div>
        <Button variant={isTracking ? 'secondary' : 'primary'} onClick={() => setIsTracking(tracking => !tracking)}>{isTracking ? 'Mettre en pause' : 'Démarrer le suivi'}</Button>
      </Card>

      <Card style={{ padding: '1.5rem' }}>
        <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Résultats par matière</h2>
        {subjectRows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tes matières apparaîtront ici après tes premiers documents.</p>
            <Link to="/dashboard/upload"><Button variant="primary">Importer un document</Button></Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {subjectRows.map(subject => (
              <div key={subject.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>{subject.name}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{subject.score === null ? 'Aucun quiz terminé' : `${subject.score}%`} · {subject.documents} document{subject.documents > 1 ? 's' : ''}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${subject.score ?? 0}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
