import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FileText, Brain, FolderOpen, TrendingUp, Upload, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export function DashboardOverview() {
  const { user, stats, recentActivity } = useAppContext();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Bonjour {user.firstName} 👋</p>
        <h1 className="text-4xl font-bold" style={{ margin: '0.5rem 0' }}>Prêt·e à <span className="text-gradient">apprendre</span> aujourd'hui ?</h1>
        <p style={{ color: 'var(--text-muted)' }}>{user.university}</p>
      </header>

      <div className="grid-responsive-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="btn-icon" style={{ width: '2rem', height: '2rem' }}><FileText size={16} color="var(--accent-cyan)" /></div>
            {stats.resumes > 0 && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 'bold' }}>+12%</span>}
          </div>
          <div className="text-3xl font-bold">{stats.resumes}</div>
          <div className="text-secondary text-sm">Résumés</div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="btn-icon" style={{ width: '2rem', height: '2rem' }}><Brain size={16} color="var(--accent-cyan)" /></div>
            {stats.quizzes > 0 && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 'bold' }}>+8%</span>}
          </div>
          <div className="text-3xl font-bold">{stats.quizzes}</div>
          <div className="text-secondary text-sm">Quiz complétés</div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="btn-icon" style={{ width: '2rem', height: '2rem' }}><FolderOpen size={16} color="var(--accent-cyan)" /></div>
            {stats.notes > 0 && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 'bold' }}>+24%</span>}
          </div>
          <div className="text-3xl font-bold">{stats.notes}</div>
          <div className="text-secondary text-sm">Notes</div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="btn-icon" style={{ width: '2rem', height: '2rem' }}><TrendingUp size={16} color="var(--accent-cyan)" /></div>
            {stats.score > 0 && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem', fontWeight: 'bold' }}>+3%</span>}
          </div>
          <div className="text-3xl font-bold">{stats.score}%</div>
          <div className="text-secondary text-sm">Score moyen</div>
        </Card>
      </div>

      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="text-xl font-bold">Activité récente</h2>
            {recentActivity.length > 0 && <Link to="/dashboard/resumes" style={{ color: 'var(--accent-cyan)', fontSize: '0.875rem' }}>Voir tout</Link>}
          </div>
          
          {recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <FileText size={48} color="var(--border-color)" />
              <p style={{ color: 'var(--text-secondary)' }}>Aucune activité pour le moment.</p>
              <Link to="/dashboard/upload">
                <Button variant="primary">Uploader mon premier PDF</Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivity.map((activity, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="btn-icon">
                    {activity.type === 'resume' ? <FileText size={18} color="var(--accent-cyan)" /> : <Brain size={18} color="var(--accent-cyan)" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{activity.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{activity.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Actions rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/dashboard/upload" style={{ display: 'block' }}>
              <Button variant="secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Upload size={18} color="var(--accent-cyan)" /> Uploader un PDF</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/dashboard/quiz" style={{ display: 'block' }}>
              <Button variant="secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Brain size={18} color="var(--accent-cyan)" /> Démarrer un quiz</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/dashboard/notes" style={{ display: 'block' }}>
              <Button variant="secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FileText size={18} color="var(--accent-cyan)" /> Nouvelle note</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
