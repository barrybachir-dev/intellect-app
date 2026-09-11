import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
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
import { Flashcards } from './Flashcards';
import { TopicStudy } from './TopicStudy';
import { Progress } from './Progress';
import { MockExam } from './MockExam';
import { Calendar } from './Calendar';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = event => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) navigate(`/dashboard/resumes?search=${encodeURIComponent(query)}`);
  };

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.firstName
    ? user.firstName[0].toUpperCase()
    : user.email
    ? user.email[0].toUpperCase()
    : 'U';

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
            <form className="header-search" onSubmit={handleSearch} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: 'var(--bg-card)', padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
              width: '400px', maxWidth: '100%'
            }}>
              <Search size={18} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Rechercher dans tes notes, résumés..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </form>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
            <button type="button" aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'} onClick={toggleTheme} style={{ display: 'flex', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label="Voir les notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen(open => !open)}
                style={{ position: 'relative', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', padding: 0, display: 'flex' }}
              >
              <Bell size={20} color="var(--text-secondary)" />
              <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%' }}></div>
              </button>
              {notificationsOpen && (
                <div style={{ position: 'absolute', top: '2rem', right: 0, width: '240px', padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', zIndex: 20 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.35rem' }}>Notifications</div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Aucune nouvelle notification.</p>
                  <Link to="/dashboard/settings?tab=notifications" onClick={() => setNotificationsOpen(false)} style={{ display: 'inline-block', marginTop: '0.75rem', color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>
                    Gérer les notifications
                  </Link>
                </div>
              )}
            </div>
            <button
              type="button"
              title={user.firstName ? `${user.firstName} ${user.lastName}` : 'Profil'}
              aria-label="Ouvrir mon profil"
              aria-expanded={profileOpen}
              onClick={() => { setProfileOpen(open => !open); setNotificationsOpen(false); }}
              style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem', color: '#0d0e1a', border: 'none'
              }}
            >
              {user.avatarUrl ? <img src={user.avatarUrl} alt="Profil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
            </button>
            {profileOpen && (
              <div style={{ position: 'absolute', top: '3.5rem', right: 0, width: '230px', padding: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', zIndex: 20 }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{user.firstName || 'Mon profil'} {user.lastName}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email || 'Compte connecté'}</div>
                </div>
                <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }} style={{ display: 'block', width: '100%', padding: '0.65rem 0.75rem', textAlign: 'left', border: 0, borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Paramètres du profil
                </button>
                <button type="button" onClick={logout} style={{ display: 'block', width: '100%', padding: '0.65rem 0.75rem', textAlign: 'left', border: 0, borderRadius: 'var(--radius-sm)', background: 'transparent', color: '#f87171', cursor: 'pointer' }}>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/resumes/:id" element={<ResumeDetail />} />
          <Route path="/review" element={<ReviewBySubject />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/topic" element={<TopicStudy />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizExecution />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
