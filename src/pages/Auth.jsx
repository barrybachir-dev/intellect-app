import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppContext } from '../context/useAppContext';

export function Auth() {
  const { login, register, resetPassword } = useAppContext();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (mode === 'register') {
      if (!form.firstName || !form.lastName) {
        setError('Veuillez entrer votre prénom et nom.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
      if (form.password.length < 6) {
        setError('Le mot de passe doit comporter au moins 6 caractères.');
        return;
      }
    }

    setLoading(true);
    const authRequest = mode === 'register'
      ? register(form)
      : login('email', { email: form.email, password: form.password });

    authRequest
      .then(session => {
        if (mode === 'register' && !session) {
          setError('Compte créé. Vérifiez votre adresse email avant de vous connecter.');
          setMode('login');
          return;
        }
        navigate('/dashboard');
      })
      .catch(authError => setError(authError.message || 'Impossible de vous authentifier.'))
      .finally(() => setLoading(false));
  };

  const handleOAuth = (provider) => {
    setLoading(true);
    login(provider)
      .catch(authError => {
        setError(authError.message || 'Impossible de démarrer la connexion.');
        setLoading(false);
      });
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (!form.email) {
      setError('Entre ton email pour recevoir le lien de réinitialisation.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(form.email);
      setResetSent(true);
    } catch (resetError) {
      setError(resetError.message || 'Impossible d’envoyer le lien de réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-color)' }}>
      {/* Left side: Branding */}
      <div className="hide-on-mobile" style={{
        flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', borderRight: '1px solid var(--border-color)',
        background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, var(--bg-color) 70%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <div style={{ backgroundColor: '#c084fc', padding: '0.25rem', borderRadius: '50%', color: '#fff' }}>
            <Sparkles size={24} />
          </div>
          Intellect
        </div>

        <div>
          <h2 className="text-3xl font-bold" style={{ lineHeight: 1.4, marginBottom: '2rem' }}>
            « Intellect a divisé mon temps de révision par deux. Quiz instantanés, résumés parfaits. »
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', color: '#0d0e1a'
            }}>
              LM
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Léa M.</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>PASS — Université de Lyon</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '3rem' }}>
          <div>
            <div className="text-2xl font-bold text-gradient">PDF</div>
            <div className="text-sm text-secondary">importés en privé</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">Quiz</div>
            <div className="text-sm text-secondary">pour s'entraîner</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">Notes</div>
            <div className="text-sm text-secondary">organisées</div>
          </div>
        </div>
      </div>

      {/* Right side: Auth form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo mobile */}
          <div className="show-on-mobile" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#c084fc', padding: '0.2rem', borderRadius: '50%', color: '#fff' }}>
              <Sparkles size={20} />
            </div>
            Intellect
          </div>

          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            {mode === 'login' ? 'Bon retour 👋' : 'Créer un compte 🚀'}
          </h1>
          <p className="text-secondary" style={{ marginBottom: '2rem' }}>
            {mode === 'login'
              ? 'Connecte-toi à ton espace Intellect.'
              : 'Rejoins des milliers d\'étudiants qui révisent mieux.'}
          </p>

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading}
              style={{
                width: '100%', padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4"/>
                <path d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26a5.43 5.43 0 0 1-8.07-2.85H.93v2.34A9 9 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.6.1-1.17.28-1.71V4.95H.93a9 9 0 0 0 0 8.1l3.04-2.34z" fill="#FBBC05"/>
                <path d="M9 3.58a4.86 4.86 0 0 1 3.44 1.34l2.58-2.58A8.64 8.64 0 0 0 9 0a9 9 0 0 0-8.07 4.95l3.04 2.34A5.36 5.36 0 0 1 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ou avec ton email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Prénom *</label>
                  <input type="text" placeholder="Prénom" value={form.firstName} onChange={handleChange('firstName')} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Nom *</label>
                  <input type="text" placeholder="Nom" value={form.lastName} onChange={handleChange('lastName')} style={inputStyle} required />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Email *</label>
              <input type="email" placeholder="toi@exemple.com" value={form.email} onChange={handleChange('email')} style={inputStyle} required />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Établissement</label>
                <input type="text" placeholder="Ex : L2 Biologie — Sorbonne" value={form.university} onChange={handleChange('university')} style={inputStyle} />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Mot de passe *</label>
                {mode === 'login' && <button type="button" onClick={handlePasswordReset} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}>Oublié ?</button>}
              </div>
              <input type="password" placeholder="••••••••" value={form.password} onChange={handleChange('password')} style={inputStyle} required />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Confirmer le mot de passe *</label>
                <input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange('confirmPassword')} style={inputStyle} required />
              </div>
            )}

            {error && (
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            {resetSent && <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 'var(--radius-sm)', color: '#4ade80', fontSize: '0.875rem' }}>
              Vérifie ta boîte email pour réinitialiser ton mot de passe.
            </div>}

            <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Connexion...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <>Pas de compte ?{' '}
                <button onClick={() => { setMode('register'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>
                  S'inscrire gratuitement
                </button>
              </>
            ) : (
              <>Déjà un compte ?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold' }}>
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
