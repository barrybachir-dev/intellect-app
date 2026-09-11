import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { Upload } from './Upload';
import { Resumes } from './Resumes';
import { ResumeDetail } from './ResumeDetail';
import { QuizList } from './QuizList';
import { QuizExecution } from './QuizExecution';
import { Notes } from './Notes';
import { Settings } from './Settings';
import { ReviewBySubject } from './ReviewBySubject';
import { Search, Bell, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppContext();
  const navigate = useNavigate();

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.firstName
    ? user.firstName[0].toUpperCase()
    : '?';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', overflowX: 'hidden' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content" style={{ marginLeft: '260px', flex: 1, padding: '2rem', transition: 'margin 0.3s ease', width: '100%' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-menu-btn"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="header-search" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: 'var(--bg-card)', padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
              width: '400px', maxWidth: '100%'
            }}>
              <Search size={18} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Rechercher dans tes notes, résumés..."
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button type="button" aria-label="Voir les notifications" onClick={() => navigate('/dashboard/settings')} style={{ position: 'relative', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', padding: 0 }}>
              <Bell size={20} color="var(--text-secondary)" />
              <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%' }}></div>
            </button>
            <div
              title={user.firstName ? `${user.firstName} ${user.lastName}` : 'Profil'}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/dashboard/settings')}
              onKeyDown={event => event.key === 'Enter' && navigate('/dashboard/settings')}
              style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem', color: '#0d0e1a'
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/resumes/:id" element={<ResumeDetail />} />
          <Route path="/review" element={<ReviewBySubject />} />
          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizExecution />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
