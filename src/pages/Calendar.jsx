import React, { useState } from 'react';
import { CalendarDays, Check, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function Calendar() {
  const { user, updateExams } = useAppContext();
  const [form, setForm] = useState({ title: '', date: '', type: 'Examen', subject: '' });
  const [message, setMessage] = useState('');
  const events = Array.isArray(user.exams) ? user.exams : [];
  const sortedEvents = [...events].sort((first, second) => first.date.localeCompare(second.date));

  const handleSubmit = async event => {
    event.preventDefault();
    if (!form.title.trim() || !form.date) return;
    setMessage('');
    try {
      await updateExams([...events, { ...form, id: crypto.randomUUID(), title: form.title.trim(), subject: form.subject.trim() }]);
      setForm({ title: '', date: '', type: 'Examen', subject: '' });
      setMessage('Événement ajouté.');
    } catch (error) {
      setMessage(error.message || 'Impossible de sauvegarder cet événement.');
    }
  };

  const removeEvent = async id => {
    setMessage('');
    try {
      await updateExams(events.filter(item => item.id !== id));
    } catch (error) {
      setMessage(error.message || 'Impossible de supprimer cet événement.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem' }}>Mon <span className="text-gradient">calendrier</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Garde tes examens et devoirs importants au même endroit.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(320px, 1.2fr)', gap: '1.5rem', alignItems: 'start' }}>
        <Card style={{ padding: '1.5rem' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: '1.25rem' }}>Ajouter un événement</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input required value={form.title} onChange={event => setForm(previous => ({ ...previous, title: event.target.value }))} placeholder="Ex : Examen de biologie" style={inputStyle} />
            <input required type="date" value={form.date} onChange={event => setForm(previous => ({ ...previous, date: event.target.value }))} style={inputStyle} />
            <select value={form.type} onChange={event => setForm(previous => ({ ...previous, type: event.target.value }))} style={inputStyle}>
              <option>Examen</option>
              <option>Devoir</option>
              <option>Révision</option>
            </select>
            <input value={form.subject} onChange={event => setForm(previous => ({ ...previous, subject: event.target.value }))} placeholder="Matière (facultatif)" style={inputStyle} />
            <Button variant="primary" type="submit"><CalendarDays size={16} /> Ajouter</Button>
          </form>
          {message && <p style={{ color: message.includes('ajouté') ? '#4ade80' : '#f87171', fontSize: '0.875rem', marginTop: '1rem' }}>{message}</p>}
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: '1.25rem' }}>À venir</h2>
          {sortedEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}><CalendarDays size={36} color="var(--border-color)" style={{ marginBottom: '0.75rem' }} /><p>Aucun événement enregistré.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sortedEvents.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: 'rgba(0, 229, 255, 0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Check size={17} color="var(--accent-cyan)" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 'bold' }}>{item.title}</div><div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(`${item.date}T00:00:00`).toLocaleDateString('fr-FR')} · {item.type}{item.subject ? ` · ${item.subject}` : ''}</div></div>
                  <button type="button" aria-label={`Supprimer ${item.title}`} onClick={() => removeEvent(item.id)} style={{ border: 0, background: 'none', color: '#f87171', cursor: 'pointer', padding: '0.35rem' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' };
