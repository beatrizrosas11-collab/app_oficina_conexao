# Oficina Conexão

Aplicação de teste construída com React 19, Vite 8 e Supabase JS.

## Requisitos

- Node.js 20.19+ (ou 22.12+)
- npm

## Instalação

```bash
npm install
npm run dev
```

## Supabase

1. Crie ou selecione um projeto Supabase.
2. Execute o SQL de `supabase/migrations/202611040001_create_nomes_teste.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local`.
4. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os dados do projeto.
5. Reinicie o servidor Vite.

Sem as variáveis de ambiente, o formulário funciona em modo demonstração e guarda os registros apenas no navegador. Com as variáveis configuradas, os nomes são inseridos na tabela `public.nomes_teste`.

> A política de inserção pública é apropriada somente para este protótipo de teste. Antes de uso real, implemente autenticação, limites contra abuso e políticas de acesso adequadas.

## Build

```bash
npm run build
npm run preview
```
