import React, { useState } from 'react';
import { FolderOpen, Plus, X, BookOpen, Download, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { useAppContext } from '../context/useAppContext';

export function Notes() {
  const { notes, addNote, deleteNote } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [toast, setToast] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    try {
      await addNote({
        title: form.title,
        subject: form.subject.toUpperCase() || 'GEN',
        content: form.content,
      });
      setForm({ title: '', subject: '', content: '' });
      setShowModal(false);
      setToast('Note enregistrée.');
    } catch (error) {
      setToast(error.message || 'Impossible d’enregistrer la note.');
    }
  };

  const downloadNote = note => {
    const markdown = `# ${note.title}\n\n**Matière :** ${note.subject || 'Général'}\n\n${note.content}`;
    const file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'note'}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setToast('Note exportée en Markdown.');
  };

  const handleDelete = async note => {
    if (!window.confirm(`Supprimer la note « ${note.title} » ?`)) return;
    try {
      await deleteNote(note.id);
      setSelectedNote(null);
      setToast('Note supprimée.');
    } catch (error) {
      setToast(error.message || 'Impossible de supprimer la note.');
    }
  };

  const notesBySubject = notes.reduce((acc, note) => {
    const key = note.subject || 'GÉNÉRAL';
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)',
    color: 'white', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Toast message={toast} onClose={() => setToast('')} />
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem 0' }}>
            Mes <span className="text-gradient">Notes</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>{notes.length} note{notes.length !== 1 ? 's' : ''} organisée{notes.length !== 1 ? 's' : ''} par matière.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Nouvelle Note
        </Button>
      </header>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <BookOpen size={48} color="var(--border-color)" />
          <h2 className="text-2xl font-bold">Aucune note pour l'instant</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Créez votre première note pour organiser vos cours par matière et réviser efficacement.
          </p>
          <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Créer une note
          </Button>
        </div>
      ) : (
        Object.entries(notesBySubject).map(([subject, subjectNotes], idx) => (
          <div key={idx} style={{ marginBottom: '3rem' }}>
            <h2 className="text-xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <FolderOpen size={20} color="var(--accent-cyan)" /> {subject}
              <span className="badge" style={{ marginLeft: '1rem' }}>{subjectNotes.length}</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {subjectNotes.map(note => (
                <Card
                  key={note.id}
                  className="hover-lift"
                  onClick={() => setSelectedNote(note)}
                  style={{ cursor: 'pointer', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}
                >
                  <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{note.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.content}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{note.date}</div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Add Note Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Nouvelle note</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Titre *</label>
                <input
                  type="text" placeholder="Ex: Loi de Faraday" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={inputStyle} required autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Matière</label>
                <input
                  type="text" placeholder="Ex: PHYSIQUE" value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Contenu *</label>
                <textarea
                  placeholder="Contenu de votre note..." value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="primary" type="submit" style={{ flex: 1 }}>Enregistrer</Button>
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Annuler</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* View Note Modal */}
      {selectedNote && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }} onClick={(e) => e.target === e.currentTarget && setSelectedNote(null)}>
          <Card style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button
              onClick={() => setSelectedNote(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>{selectedNote.subject}</span>
            <h2 className="text-2xl font-bold" style={{ marginBottom: '1rem' }}>{selectedNote.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{selectedNote.content}</p>
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedNote.date}</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              <Button variant="secondary" onClick={() => downloadNote(selectedNote)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} /> Exporter en Markdown
              </Button>
              <Button variant="secondary" onClick={() => handleDelete(selectedNote)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
                <Trash2 size={16} /> Supprimer
              </Button>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 229, 255, 0.1); border-color: rgba(0, 229, 255, 0.3); }
      `}</style>
    </div>
  );
}
