-- Tabela simples para o teste inicial do aplicativo Oficina Conexão.
create table if not exists public.nomes_teste (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(trim(nome)) between 1 and 120),
  created_at timestamptz not null default now()
);

alter table public.nomes_teste enable row level security;

grant insert on table public.nomes_teste to anon;

drop policy if exists "Permitir cadastro público de nomes para teste" on public.nomes_teste;

create policy "Permitir cadastro público de nomes para teste"
on public.nomes_teste
for insert
to anon
with check (char_length(trim(nome)) between 1 and 120);
