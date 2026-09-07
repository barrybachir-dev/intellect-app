import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';

export function QuizExecution() {
  const { id } = useParams();
  const { quizzes, submitQuiz } = useAppContext();
  
  const quiz = quizzes.find(q => String(q.id) === id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  if (!quiz) {
    return <div>Quiz introuvable.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    let newScore = score;
    if (selectedOption === currentQuestion.answer) {
      newScore += 1;
      setScore(newScore);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      const finalScorePct = Math.round((newScore / quiz.questions.length) * 100);
      submitQuiz(quiz.id, finalScorePct).catch(() => {});
      setShowResult(true);
    }
  };

  if (!isRetaking && (showResult || quiz.completed)) {
    const finalScore = showResult ? Math.round((score / quiz.questions.length) * 100) : quiz.score;
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Brain size={40} color="var(--bg-color)" />
        </div>
        <h1 className="text-4xl font-bold" style={{ marginBottom: '1rem' }}>Score : <span className="text-gradient">{finalScore}%</span></h1>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>Bonnes réponses enregistrées.</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="primary" onClick={() => { setIsRetaking(true); setShowResult(false); setCurrentQuestionIndex(0); setScore(0); setSelectedOption(null); }}>
            Recommencer
          </Button>
          <Link to={`/dashboard/resumes/${quiz.resumeId}`}>
            <Button variant="secondary">Voir le résumé</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Brain size={16} color="var(--accent-cyan)" /> {quiz.title}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Question {currentQuestionIndex + 1} / {quiz.questions.length}
        </div>
      </div>

      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-card)', borderRadius: '2px', marginBottom: '3rem' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '2px', transition: 'width 0.3s ease' }}></div>
      </div>

      <Card style={{ padding: '3rem 2rem' }}>
        <h2 className="text-2xl font-bold" style={{ marginBottom: '2rem', lineHeight: '1.4' }}>
          {currentQuestion.q}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              style={{
                width: '100%', textAlign: 'left', padding: '1rem 1.5rem', 
                backgroundColor: selectedOption === idx ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-input)',
                border: `1px solid ${selectedOption === idx ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease',
                fontWeight: selectedOption === idx ? 'bold' : 'normal'
              }}
            >
              {option}
            </button>
          ))}
        </div>

        <Button 
          variant="primary" 
          style={{ width: '100%', padding: '1rem' }} 
          disabled={selectedOption === null}
          onClick={handleNext}
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer le quiz' : 'Question suivante →'}
        </Button>
      </Card>
    </div>
  );
}
