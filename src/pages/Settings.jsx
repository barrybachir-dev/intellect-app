import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, CreditCard, Bell, Shield, Check, Sparkles, Lock, Camera } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0€',
    period: '/mois',
    description: 'Pour découvrir Intellect',
    features: [
      '5 résumés par mois',
      'Quiz illimités',
      'Notes illimitées',
      'Export PDF',
    ],
    locked: [],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '9€',
    period: '/mois',
    description: 'Pour les étudiants sérieux',
    features: [
      'Résumés illimités',
      'Quiz illimités',
      'Notes illimitées',
      'Export PDF + Word',
      'Accès premium complet',
      'Support prioritaire',
    ],
    locked: [],
    popular: true,
  },
  {
    id: 'team',
    name: 'Équipe',
    price: '6€',
    period: '/membre/mois',
    description: 'Pour groupes de révision',
    features: [
      'Tout Pro inclus',
      'Partage de notes',
      'Quiz collaboratifs',
      'Tableau de bord groupe',
      'Facturation centralisée',
    ],
    locked: [],
  },
];

export function Settings() {
  const { user, usage, logout, updateProfile, updatePassword, updateAvatar, updateNotifications } = useAppContext();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    university: user.university || '',
    currentPassword: '',
    newPassword: '',
  });
  const [saved, setSaved] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [billingMessage, setBillingMessage] = useState('');
  const [avatarMessage, setAvatarMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const notificationOptions = [
    { key: 'studyReminders', label: 'Rappels de révision', desc: 'Recevoir des rappels quotidiens pour réviser vos notes.' },
    { key: 'quizResults', label: 'Résultats de quiz', desc: 'Notification après chaque quiz complété.' },
    { key: 'productUpdates', label: 'Nouveautés produit', desc: "Soyez informé des nouvelles fonctionnalités d'Intellect." },
    { key: 'resumeReady', label: 'Résumés prêts', desc: 'Notification quand votre résumé PDF est généré.' },
  ];

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarMessage('');
    try {
      await updateAvatar(file);
      setAvatarMessage('Photo de profil mise à jour.');
    } catch (error) {
      setAvatarMessage(error.message || 'Impossible de mettre à jour la photo.');
    }
    event.target.value = '';
  };

  const handleNotificationChange = async (key, checked) => {
    const notifications = { ...user.notifications, [key]: checked };
    setNotificationMessage('');
    try {
      await updateNotifications(notifications);
    } catch (error) {
      setNotificationMessage(error.message || 'Impossible de sauvegarder cette préférence.');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      university: formData.university,
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }).catch(error => setSecurityMessage(error.message || 'Impossible de sauvegarder le profil.'));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSecurityMessage('');
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setSecurityMessage('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    try {
      await updatePassword(formData.newPassword);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setSecurityMessage('Mot de passe mis à jour.');
    } catch (error) {
      setSecurityMessage(error.message || 'Impossible de mettre à jour le mot de passe.');
    }
  };

  const currentPlanId = (user.plan || 'free').toLowerCase().replace('plan ', '');

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-4xl font-bold" style={{ margin: '0 0 0.5rem 0' }}>
          Mes <span className="text-gradient">Paramètres</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Gérez votre compte, votre abonnement et vos préférences.</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.25rem', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent-cyan)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                fontSize: '0.9rem', transition: 'all 0.2s ease', marginBottom: '-1px'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card style={{ padding: '2rem' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: '0.5rem' }}>Informations personnelles</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
            Ces informations sont utilisées pour personnaliser votre expérience Intellect.
          </p>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <div style={{
              width: '5rem', height: '5rem', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', flexShrink: 0
            }}>
              {user.avatarUrl ? <img src={user.avatarUrl} alt="Photo de profil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (formData.firstName ? formData.firstName[0].toUpperCase() : 'U')}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {formData.firstName || 'Prénom'} {formData.lastName || 'Nom'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{formData.email || 'email@exemple.com'}</div>
              <span className="badge">{user.plan || 'Free'}</span>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.8rem' }}>
                <Camera size={14} /> Modifier la photo
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
              {avatarMessage && <div style={{ color: avatarMessage.includes('mise à jour') ? '#4ade80' : '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>{avatarMessage}</div>}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Prénom</label>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nom</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.lastName}
                  onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Établissement / Université</label>
              <input
                type="text"
                placeholder="Ex: Sorbonne Université – L2 Biologie"
                value={formData.university}
                onChange={e => setFormData(p => ({ ...p, university: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {saved ? <><Check size={16} /> Enregistré !</> : 'Sauvegarder les modifications'}
              </Button>
              <Button variant="secondary" type="button" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Current usage */}
          <Card style={{ padding: '2rem' }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Utilisation actuelle</h2>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  {usage.resumesCount} / {currentPlanId === 'pro' ? '∞' : usage.resumesLimit}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Résumés ce mois</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>
                  {usage.quizzesCount}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Quiz complétés</div>
              </div>
            </div>
            {currentPlanId !== 'pro' && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Résumés utilisés</span>
                  <span>{usage.resumesCount} / {usage.resumesLimit}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px' }}>
                  <div style={{
                    width: `${Math.min((usage.resumesCount / usage.resumesLimit) * 100, 100)}%`,
                    height: '100%',
                    background: usage.resumesCount >= usage.resumesLimit ? 'linear-gradient(90deg, #f87171, #ef4444)' : 'var(--gradient-primary)',
                    borderRadius: '4px', transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            )}
          </Card>

          {/* Plans */}
          <div>
            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Changer de plan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {PLANS.map(plan => {
                const isCurrent = plan.id === currentPlanId || (currentPlanId === 'plan free' && plan.id === 'free') || (user.plan?.toLowerCase().includes(plan.id));
                return (
                  <Card key={plan.id} style={{
                    padding: '2rem',
                    border: plan.popular ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    position: 'relative', display: 'flex', flexDirection: 'column'
                  }}>
                    {plan.popular && (
                      <div style={{
                        position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--gradient-primary)', padding: '0.25rem 1rem',
                        borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#0d0e1a',
                        display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap'
                      }}>
                        <Sparkles size={12} /> Recommandé
                      </div>
                    )}
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{plan.description}</p>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{plan.price}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{plan.period}</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                          <Check size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isCurrent ? 'secondary' : 'primary'}
                      style={{ width: '100%' }}
                      disabled={isCurrent}
                      onClick={() => setBillingMessage(`Le changement vers le plan ${plan.name} sera disponible prochainement.`)}
                    >
                      {isCurrent ? 'Plan actuel' : `Choisir ${plan.name}`}
                    </Button>
                  </Card>
                );
              })}
            </div>
            {billingMessage && <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.875rem' }}>{billingMessage}</p>}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card style={{ padding: '2rem' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: '0.5rem' }}>Sécurité du compte</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>Modifiez votre mot de passe et gérez les accès à votre compte.</p>

          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mot de passe actuel</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={e => setFormData(p => ({ ...p, currentPassword: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={e => setFormData(p => ({ ...p, newPassword: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {securityMessage && <div style={{ color: securityMessage.includes('mis à jour') ? '#4ade80' : '#f87171', fontSize: '0.875rem' }}>{securityMessage}</div>}
            <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
              <Lock size={16} /> Mettre à jour le mot de passe
            </Button>
          </form>

          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '0.5rem' }}>Zone de danger</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>La suppression de votre compte est irréversible et effacera toutes vos données.</p>
            <Button type="button" variant="secondary" onClick={() => setSecurityMessage('La suppression du compte doit être confirmée par le support pour protéger tes données.')} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
              Supprimer mon compte
            </Button>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card style={{ padding: '2rem' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: '0.5rem' }}>Préférences de notifications</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>Choisissez quand et comment Intellect vous contacte.</p>

          {notificationOptions.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 0', borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" checked={Boolean(user.notifications?.[item.key])} onChange={event => handleNotificationChange(item.key, event.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, backgroundColor: user.notifications?.[item.key] ? 'var(--accent-cyan)' : 'var(--bg-input)',
                  borderRadius: '24px', transition: '0.3s',
                  border: '1px solid var(--border-color)'
                }} />
                <span style={{
                  position: 'absolute', top: '3px', left: user.notifications?.[item.key] ? '22px' : '3px',
                  width: '18px', height: '18px', backgroundColor: 'white',
                  borderRadius: '50%', transition: '0.3s'
                }} />
              </label>
            </div>
          ))}
          {notificationMessage && <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '1rem' }}>{notificationMessage}</p>}
        </Card>
      )}
    </div>
  );
}
