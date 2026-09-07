# StudyAI

Application React/Vite de revision avec authentification Supabase, stockage prive des PDF et generation de supports pedagogiques via Google Gemini.

## Configuration locale

1. Creer un projet sur Supabase.
2. Copier `.env.example` vers `.env` et renseigner l'URL du projet ainsi que la cle anon.
3. Executer `supabase/schema.sql` dans l'editeur SQL Supabase.
4. Activer les providers OAuth souhaites dans Authentication > Providers.
5. Installer la CLI Supabase, se connecter puis lier le projet :

```bash
supabase login
supabase link --project-ref <project-ref>
supabase secrets set GEMINI_API_KEY=<cle-gemini>
supabase functions deploy process-document
```

6. Lancer l'application :

```bash
npm install
npm run dev
```

L'URL de redirection OAuth doit inclure l'URL locale (`http://localhost:5173/dashboard`) et l'URL de production dans les reglages Supabase.

## Fonctionnement

- Les sessions sont gerees par Supabase Auth.
- Les profils, resumes, quiz et notes sont stockes dans PostgreSQL avec RLS.
- Les PDF sont places dans un bucket prive, dans un dossier identifie par l'utilisateur.
- La fonction `process-document` utilise la cle Gemini cote serveur uniquement, puis ecrit le resume et le quiz en base.
- Aucun contenu de demonstration n'est genere dans le navigateur.

## Verification

```bash
npm run build
npm run lint
```