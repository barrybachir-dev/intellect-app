import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileText, Brain, FolderOpen, Settings, Sparkles, X, BookOpen, Layers, PenLine, TrendingUp, Timer, CalendarDays } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAppContext();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <UploadCloud size={20} />, label: 'Importer un document', path: '/dashboard/upload' },
    { icon: <PenLine size={20} />, label: 'Étudier un sujet', path: '/dashboard/topic' },
    { icon: <TrendingUp size={20} />, label: 'Ma progression', path: '/dashboard/progress' },
    { icon: <Timer size={20} />, label: 'Examen blanc', path: '/dashboard/mock-exam' },
    { icon: <CalendarDays size={20} />, label: 'Calendrier', path: '/dashboard/calendar' },
    { icon: <FileText size={20} />, label: 'Bibliothèque', path: '/dashboard/resumes' },
    { icon: <BookOpen size={20} />, label: 'Réviser par matière', path: '/dashboard/review' },
    { icon: <Layers size={20} />, label: 'Flashcards', path: '/dashboard/flashcards' },
    { icon: <Brain size={20} />, label: 'Mes quiz', path: '/dashboard/quiz' },
    { icon: <FolderOpen size={20} />, label: 'Mes notes', path: '/dashboard/notes' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={onClose}
        ></div>
      )}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`} style={{
        width: '260px',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        position: 'fixed',
        left: 0,
        top: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <div style={{ backgroundColor: '#c084fc', padding: '0.25rem', borderRadius: '50%', color: '#fff' }}>
              <Sparkles size={20} />
            </div>
            <div>
              Intellect
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginTop: '-0.2rem' }}>BETA</div>
            </div>
          </div>
          
          <button className="mobile-menu-btn" style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Espace
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => window.innerWidth <= 768 && onClose()}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink
            to="/dashboard/settings"
            onClick={() => window.innerWidth <= 768 && onClose()}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              fontWeight: '500',
              textDecoration: 'none'
            })}
          >
            <Settings size={20} /> Paramètres
          </NavLink>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.plan}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
