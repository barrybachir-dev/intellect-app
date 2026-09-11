import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Timer } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

const EXAM_DURATION_SECONDS = 15 * 60;

export function MockExam() {
  const { quizzes } = useAppContext();
  const questions = quizzes.flatMap(quiz => (quiz.questions || []).map(question => ({ ...question, sourceTitle: quiz.title })));
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_DURATION_SECONDS);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!hasStarted || isFinished) return undefined;
    const timer = window.setInterval(() => {
      setRemainingSeconds(seconds => {
        if (seconds <= 1) {
          setIsFinished(true);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hasStarted, isFinished]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce((total, question, questionIndex) => total + (answers[questionIndex] === question.answer ? 1 : 0), 0);
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const seconds = String(remainingSeconds % 60).padStart(2, '0');

  if (questions.length === 0) {
    return (
      <Card style={{ maxWidth: '650px', margin: '4rem auto', textAlign: 'center', padding: '4rem 1rem' }}>
        <Timer size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
        <h1 className="text-2xl font-bold" style={{ marginBottom: '0.75rem' }}>Examen blanc indisponible</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Termine ou crée un quiz pour avoir des questions à revoir ici.</p>
        <Link to="/dashboard/quiz"><Button variant="primary">Voir mes quiz</Button></Link>
      </Card>
    );
  }

  if (!hasStarted) {
    return (
      <Card style={{ maxWidth: '650px', margin: '2rem auto', padding: '2rem' }}>
        <Timer size={32} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
        <h1 className="text-3xl font-bold" style={{ marginBottom: '0.75rem' }}>Examen blanc</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{questions.length} question{questions.length > 1 ? 's' : ''} issues de tes quiz, avec 15 minutes pour répondre.</p>
        <Button variant="primary" onClick={() => setHasStarted(true)}>Commencer l’examen</Button>
      </Card>
    );
  }

  if (isFinished) {
    return (
      <Card style={{ maxWidth: '650px', margin: '2rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
        <CheckCircle2 size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
        <h1 className="text-3xl font-bold" style={{ marginBottom: '0.75rem' }}>Examen terminé</h1>
        <div className="text-5xl font-bold text-gradient" style={{ marginBottom: '0.75rem' }}>{score}%</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} sur {questions.length}.</p>
        <Button variant="secondary" onClick={() => { setHasStarted(false); setIsFinished(false); setCurrentIndex(0); setAnswers({}); setRemainingSeconds(EXAM_DURATION_SECONDS); }}>Recommencer</Button>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Question {currentIndex + 1} / {questions.length} · {answeredCount} répondue{answeredCount > 1 ? 's' : ''}</div>
        <div style={{ color: remainingSeconds < 60 ? '#f87171' : 'var(--accent-cyan)', fontWeight: 'bold' }}><Timer size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />{minutes}:{seconds}</div>
      </div>
      <div style={{ height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.3s ease' }} />
      </div>
      <Card style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{currentQuestion.sourceTitle}</p>
        <h2 className="text-2xl font-bold" style={{ lineHeight: 1.4, marginBottom: '1.5rem' }}>{currentQuestion.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQuestion.options.map((option, optionIndex) => (
            <button key={optionIndex} type="button" onClick={() => setAnswers(previous => ({ ...previous, [currentIndex]: optionIndex }))} style={{ padding: '1rem', textAlign: 'left', borderRadius: 'var(--radius-md)', border: `1px solid ${answers[currentIndex] === optionIndex ? 'var(--accent-cyan)' : 'var(--border-color)'}`, backgroundColor: answers[currentIndex] === optionIndex ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-input)', color: 'var(--text-primary)', cursor: 'pointer' }}>{option}</button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => setCurrentIndex(index => Math.max(0, index - 1))} disabled={currentIndex === 0}>Précédente</Button>
          <Button variant="primary" onClick={() => currentIndex === questions.length - 1 ? setIsFinished(true) : setCurrentIndex(index => index + 1)}>{currentIndex === questions.length - 1 ? 'Terminer' : 'Suivante'}</Button>
        </div>
      </Card>
    </div>
  );
}
