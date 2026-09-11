alter table public.resumes
  add column if not exists course text not null default '',
  add column if not exists semester text not null default '';

alter table public.notes
  add column if not exists course text not null default '',
  add column if not exists semester text not null default '';
