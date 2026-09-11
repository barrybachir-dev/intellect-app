import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function Resumes() {
  const { resumes } = useAppContext();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.trim().toLowerCase() || '';
  const [subjectFilter, setSubjectFilter] = React.useState('all');
  const [courseFilter, setCourseFilter] = React.useState('all');
  const [semesterFilter, setSemesterFilter] = React.useState('all');
  const subjects = [...new Set(resumes.map(resume => resume.subject).filter(Boolean))].sort();
  const courses = [...new Set(resumes.map(resume => resume.course).filter(Boolean))].sort();
  const semesters = [...new Set(resumes.map(resume => resume.semester).filter(Boolean))].sort();
  const visibleResumes = resumes.filter(resume => {
    const matchesSearch = !searchQuery || [resume.title, resume.subject, resume.content].some(value => String(value || '').toLowerCase().includes(searchQuery));
    const matchesSubject = subjectFilter === 'all' || resume.subject === subjectFilter;
    const matchesCourse = courseFilter === 'all' || resume.course === courseFilter;
    const matchesSemester = semesterFilter === 'all' || resume.semester === semesterFilter;
    return matchesSearch && matchesSubject && matchesCourse && matchesSemester;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem 0' }}>Mes <span className="text-gradient">résumés</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>{searchQuery ? `${visibleResumes.length} résultat${visibleResumes.length !== 1 ? 's' : ''} pour « ${searchQuery} »` : `${resumes.length} documents synthétisés.`}</p>
        </div>
        <Link to="/dashboard/upload">
          <Button variant="primary">
            <Sparkles size={18} /> Nouveau document
          </Button>
        </Link>
      </header>

      {resumes.length > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[['subject-filter', 'Matière', subjectFilter, setSubjectFilter, 'Toutes les matières', subjects], ['course-filter', 'Cours', courseFilter, setCourseFilter, 'Tous les cours', courses], ['semester-filter', 'Semestre', semesterFilter, setSemesterFilter, 'Tous les semestres', semesters]].map(([id, label, value, setter, emptyLabel, options]) => <React.Fragment key={id}>
          <label htmlFor={id} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label} :</label>
          <select id={id} value={value} onChange={event => setter(event.target.value)} style={{ padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <option value="all">{emptyLabel}</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </React.Fragment>)}
      </div>}

      {visibleResumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <FileText size={48} color="var(--border-color)" />
          <h2 className="text-2xl font-bold">{searchQuery || subjectFilter !== 'all' || courseFilter !== 'all' || semesterFilter !== 'all' ? 'Aucun résultat' : 'Aucun résumé'}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>{searchQuery || subjectFilter !== 'all' || courseFilter !== 'all' || semesterFilter !== 'all' ? 'Essaie une autre recherche ou un autre filtre.' : 'Uploadez votre premier cours au format PDF pour générer un résumé détaillé.'}</p>
          {!searchQuery && subjectFilter === 'all' && courseFilter === 'all' && semesterFilter === 'all' && <Link to="/dashboard/upload" style={{ marginTop: '1rem' }}><Button variant="primary">Commencer</Button></Link>}
        </div>
      ) : (
        <div className="grid-responsive-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {visibleResumes.map(resume => (
            <Link key={resume.id} to={`/dashboard/resumes/${resume.id}`}>
              <Card className="hover-lift" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div className="btn-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <FileText size={20} color="var(--accent-cyan)" />
                  </div>
                  <span className="badge">{resume.subject}</span>
                </div>
                <h3 className="text-xl font-bold" style={{ marginBottom: '0.5rem' }}>{resume.title}</h3>
                {(resume.course || resume.semester) && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 'auto' }}>{[resume.course, resume.semester].filter(Boolean).join(' · ')}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>{resume.pages} pages</span>
                  <span>{resume.time}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 229, 255, 0.1); border-color: rgba(0, 229, 255, 0.3); }
      `}</style>
    </div>
  );
}
