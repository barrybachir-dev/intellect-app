import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AppContext } from './AppContextValue';

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('intellect-theme') || 'dark');
  const oauthProviders = {
    google: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',
    github: import.meta.env.VITE_ENABLE_GITHUB_AUTH === 'true',
  };

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    plan: 'Free',
    university: '',
    avatarUrl: '',
    notifications: {
      studyReminders: true,
      quizResults: true,
      productUpdates: false,
      resumeReady: true,
    },
    exams: [],
    authProvider: null, // 'email' | 'google' | 'github'
  });

  const [usage, setUsage] = useState({
    resumesCount: 0,
    resumesLimit: 10,
    quizzesCount: 0,
  });

  const [resumes, setResumes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('intellect-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setIsLoggedIn(Boolean(session));
        if (session) {
          const metadata = session.user.user_metadata || {};
          let avatarUrl = '';
          if (metadata.avatarPath) {
            const { data: avatar } = await supabase.storage.from('documents').createSignedUrl(metadata.avatarPath, 60 * 60);
            avatarUrl = avatar?.signedUrl || '';
          }
          const [{ data: profile }, { data: resumeRows }, { data: quizRows }, { data: noteRows }] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', session.user.id).single(),
            supabase.from('resumes').select('*').order('created_at', { ascending: false }),
            supabase.from('quizzes').select('*').order('created_at', { ascending: false }),
            supabase.from('notes').select('*').order('created_at', { ascending: false }),
          ]);
          setUser({
            firstName: profile?.first_name || session.user.user_metadata?.firstName || '',
            lastName: profile?.last_name || session.user.user_metadata?.lastName || '',
            email: session.user.email || '',
            plan: profile?.plan || 'Free',
            university: profile?.university || session.user.user_metadata?.university || '',
            avatarUrl,
            notifications: {
              studyReminders: metadata.notifications?.studyReminders ?? true,
              quizResults: metadata.notifications?.quizResults ?? true,
              productUpdates: metadata.notifications?.productUpdates ?? false,
              resumeReady: metadata.notifications?.resumeReady ?? true,
            },
            exams: Array.isArray(metadata.exams) ? metadata.exams : [],
            authProvider: session.user.app_metadata?.provider || 'email',
          });
          setResumes((resumeRows || []).map(row => ({ ...row, pages: row.page_count, time: new Date(row.created_at).toLocaleDateString('fr-FR'), keypoints: row.keypoints || [] })));
          setQuizzes((quizRows || []).map(row => ({ ...row, resumeId: row.resume_id, questions: row.questions || [] })));
          setNotes((noteRows || []).map(row => ({ ...row, date: new Date(row.created_at).toLocaleDateString('fr-FR') })));
          setUsage({
            resumesCount: (resumeRows || []).length,
            resumesLimit: 10,
            quizzesCount: (quizRows || []).filter(row => row.completed).length,
          });
        }
        setAuthLoading(false);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setIsLoggedIn(Boolean(session));
      if (event === 'SIGNED_OUT') {
        setUser({ firstName: '', lastName: '', email: '', plan: 'Free', university: '', authProvider: null });
      }
      if (event === 'SIGNED_IN') loadSession();
      else setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ────────── Auth ──────────
  const login = async (provider, userData = {}) => {
    if (provider === 'google' || provider === 'github') {
      if (!oauthProviders[provider]) {
        throw new Error(`Connexion ${provider === 'google' ? 'Google' : 'GitHub'} non activée. Active le provider dans Supabase puis repasse à true dans le fichier .env.`);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + '/dashboard' },
      });
      if (error) throw error;
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });
    if (error) throw error;
    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, authProvider: 'email', ...userData, password: undefined, ...data.user?.user_metadata }));
  };

  const register = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          university: userData.university,
        },
      },
    });
    if (error) throw error;
    setUser(prev => ({ ...prev, authProvider: 'email', ...userData, password: undefined }));
    setIsLoggedIn(Boolean(data.session));
    return data.session;
  };

  const logout = () => {
    supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser({ firstName: '', lastName: '', email: '', plan: 'Free', university: '', authProvider: null });
    setResumes([]);
    setQuizzes([]);
    setNotes([]);
    setRecentActivity([]);
    setUsage({ resumesCount: 0, resumesLimit: 10, quizzesCount: 0 });
  };

  const updateProfile = async (profileData) => {
    const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
    if (!authenticatedUser) throw new Error('Votre session a expire.');
    if (profileData.email && profileData.email !== authenticatedUser.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: profileData.email });
      if (emailError) throw emailError;
    }
    const { error } = await supabase.from('profiles').update({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      university: profileData.university,
      updated_at: new Date().toISOString(),
    }).eq('id', authenticatedUser.id);
    if (error) throw error;
    setUser(prev => ({ ...prev, ...profileData }));
  };

  const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const updateAvatar = async (file) => {
    const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
    if (!authenticatedUser) throw new Error('Votre session a expire.');
    if (!file || !file.type.startsWith('image/')) throw new Error('Choisissez une image valide.');
    if (file.size > 5 * 1024 * 1024) throw new Error('La photo ne doit pas dépasser 5 Mo.');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const avatarPath = `${authenticatedUser.id}/avatar-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from('documents').upload(avatarPath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    const { data: avatar, error: urlError } = await supabase.storage.from('documents').createSignedUrl(avatarPath, 60 * 60);
    if (urlError) throw urlError;
    const { error: metadataError } = await supabase.auth.updateUser({ data: { avatarPath } });
    if (metadataError) throw metadataError;
    setUser(prev => ({ ...prev, avatarUrl: avatar.signedUrl }));
  };

  const updateNotifications = async (notifications) => {
    const { error } = await supabase.auth.updateUser({ data: { notifications } });
    if (error) throw error;
    setUser(prev => ({ ...prev, notifications }));
  };

  const updateExams = async (exams) => {
    const { error } = await supabase.auth.updateUser({ data: { exams } });
    if (error) throw error;
    setUser(prev => ({ ...prev, exams }));
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/settings`,
    });
    if (error) throw error;
  };

  // ────────── Upload / Limits ──────────
  const canUpload = () => usage.resumesCount < usage.resumesLimit || user.plan === 'Pro';

  const processDocument = async (fileData, generationMode = 'all') => {
    const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
    if (!authenticatedUser) throw new Error('Votre session a expire.');

    const isPdfFile = fileData && (
      fileData.type === 'application/pdf' ||
      (typeof fileData.name === 'string' && fileData.name.toLowerCase().endsWith('.pdf'))
    );

    if (!isPdfFile) throw new Error('Seuls les fichiers PDF sont acceptes.');
    if (fileData.size > 20 * 1024 * 1024) throw new Error('Le fichier ne doit pas depasser 20 Mo.');

    const resumeId = crypto.randomUUID();
    const sourcePath = `${authenticatedUser.id}/${resumeId}.pdf`;
    const { error: uploadError } = await supabase.storage.from('documents').upload(sourcePath, fileData, { contentType: 'application/pdf', upsert: false });
    if (uploadError) throw uploadError;

    const title = fileData.name.replace(/\.pdf$/i, '').replace(/_/g, ' ');
    const { error: insertError } = await supabase.from('resumes').insert({
      id: resumeId,
      user_id: authenticatedUser.id,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      source_path: sourcePath,
    });
    if (insertError) {
      await supabase.storage.from('documents').remove([sourcePath]);
      throw insertError;
    }

    const { data: functionData, error: functionError } = await supabase.functions.invoke('process-document', {
      body: JSON.stringify({ resumeId: String(resumeId), mode: generationMode }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (functionError) {
      let detail = functionError.message;
      if (functionError.context instanceof Response) {
        try {
          const body = await functionError.context.json();
          detail = body.error || detail;
        } catch {
          // Keep the SDK message when the function did not return JSON.
        }
      }
      await supabase.from('resumes').update({ status: 'failed', error_message: detail }).eq('id', resumeId);
      throw new Error(detail);
    }
    if (functionData?.error) throw new Error(functionData.error);
    const [{ data: resume }, { data: quiz }] = await Promise.all([
      supabase.from('resumes').select('*').eq('id', resumeId).single(),
      supabase.from('quizzes').select('*').eq('resume_id', resumeId).single(),
    ]);
    if (resume) setResumes(prev => [{ ...resume, pages: resume.page_count, time: new Date(resume.created_at).toLocaleDateString('fr-FR'), keypoints: resume.keypoints || [] }, ...prev]);
    if (quiz) setQuizzes(prev => [{ ...quiz, resumeId: quiz.resume_id, questions: quiz.questions || [] }, ...prev]);
    if (functionData?.generatedNote) setNotes(prev => [functionData.generatedNote, ...prev]);
    setUsage(prev => ({ ...prev, resumesCount: prev.resumesCount + 1 }));
    return resumeId;
  };

  const generateForResume = async (resumeId, mode) => {
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: JSON.stringify({ resumeId: String(resumeId), mode }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    const [{ data: quiz }, { data: resume }] = await Promise.all([
      supabase.from('quizzes').select('*').eq('resume_id', resumeId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('resumes').select('*').eq('id', resumeId).single(),
    ]);
    if (resume) {
      setResumes(prev => prev.map(item => item.id === resume.id ? { ...item, ...resume, pages: resume.page_count, time: new Date(resume.created_at).toLocaleDateString('fr-FR'), keypoints: resume.keypoints || [] } : item));
    }
    if (quiz) {
      setQuizzes(prev => prev.some(item => item.id === quiz.id) ? prev : [{ ...quiz, resumeId: quiz.resume_id, questions: quiz.questions || [] }, ...prev]);
    }
    if (data?.generatedNote) setNotes(prev => [data.generatedNote, ...prev]);
  };

  const generateTopic = async (topic, mode = 'all') => {
    const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
    if (!authenticatedUser) throw new Error('Votre session a expire.');
    if (!topic.trim()) throw new Error('Saisissez un sujet à étudier.');

    const resumeId = crypto.randomUUID();
    const { error: insertError } = await supabase.from('resumes').insert({
      id: resumeId,
      user_id: authenticatedUser.id,
      title: topic.trim(),
      source_path: `topic/${authenticatedUser.id}/${resumeId}`,
    });
    if (insertError) throw insertError;

    const { data, error } = await supabase.functions.invoke('process-document', {
      body: JSON.stringify({ resumeId, mode, topic: topic.trim() }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (error || data?.error) {
      await supabase.from('resumes').update({ status: 'failed', error_message: error?.message || data.error }).eq('id', resumeId);
      throw new Error(error?.message || data.error);
    }

    const [{ data: resume }, { data: quiz }] = await Promise.all([
      supabase.from('resumes').select('*').eq('id', resumeId).single(),
      supabase.from('quizzes').select('*').eq('resume_id', resumeId).maybeSingle(),
    ]);
    if (resume) setResumes(prev => [{ ...resume, pages: resume.page_count, time: new Date(resume.created_at).toLocaleDateString('fr-FR'), keypoints: resume.keypoints || [] }, ...prev]);
    if (quiz) setQuizzes(prev => [{ ...quiz, resumeId: quiz.resume_id, questions: quiz.questions || [] }, ...prev]);
    if (data.generatedNote) setNotes(prev => [data.generatedNote, ...prev]);
    setUsage(prev => ({ ...prev, resumesCount: prev.resumesCount + 1 }));
    return resumeId;
  };

  const submitQuiz = async (quizId, scorePct) => {
    const { error } = await supabase.from('quizzes').update({ completed: true, score: scorePct }).eq('id', quizId);
    if (error) throw error;
    const wasCompleted = quizzes.find(q => q.id === quizId)?.completed;
    setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, completed: true, score: scorePct } : q));
    if (!wasCompleted) setUsage(prev => ({ ...prev, quizzesCount: prev.quizzesCount + 1 }));

    const quizTitle = quizzes.find(q => q.id === quizId)?.title || 'Quiz';
    setRecentActivity(prev => [
      { type: 'quiz', title: quizTitle, meta: `à l'instant · Score ${scorePct}%`, id: quizId },
      ...prev,
    ]);
  };

  // ────────── Notes ──────────
  const addNote = async (note) => {
    const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
    if (!authenticatedUser) throw new Error('Votre session a expire.');
    const { data, error } = await supabase.from('notes').insert({ ...note, user_id: authenticatedUser.id }).select().single();
    if (error) throw error;
    const newNote = { ...data, date: new Date(data.created_at).toLocaleDateString('fr-FR') };
    setNotes(prev => [newNote, ...prev]);
  };

  const deleteNote = async (noteId) => {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) throw error;
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // ────────── Stats ──────────
  const getAverageScore = () => {
    const completed = quizzes.filter(q => q.completed);
    if (completed.length === 0) return 0;
    return Math.round(completed.reduce((acc, q) => acc + q.score, 0) / completed.length);
  };

  const stats = {
    resumes: usage.resumesCount,
    quizzes: usage.quizzesCount,
    notes: notes.length,
    score: getAverageScore(),
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, authLoading, login, register, logout, updateProfile, updatePassword, resetPassword, updateAvatar, updateNotifications, updateExams, theme, toggleTheme,
      user, setUser,
      usage, canUpload, processDocument, generateForResume, generateTopic, submitQuiz,
      resumes, quizzes, notes, addNote, deleteNote, recentActivity,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

