-- Acesso somente leitura do Power BI ao PostgreSQL do TENEO.
-- Execute com um usuario administrador (por padrao, "teneo").
-- A senha deve ser passada pelo psql: -v powerbi_password='...'

\if :{?powerbi_password}
\else
  \warn Informe a senha com: -v powerbi_password=SuaSenha
  \quit
\endif

SELECT format('CREATE ROLE powerbi_reader LOGIN PASSWORD %L', :'powerbi_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'powerbi_reader')\gexec

ALTER ROLE powerbi_reader WITH LOGIN PASSWORD :'powerbi_password';
ALTER ROLE powerbi_reader SET default_transaction_read_only = on;
ALTER ROLE powerbi_reader SET statement_timeout = '60s';

DO $$
BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO powerbi_reader', current_database());
END
$$;

CREATE SCHEMA IF NOT EXISTS bi;

CREATE OR REPLACE VIEW bi.organizations AS
SELECT
  id,
  name,
  slug,
  created_at,
  updated_at
FROM public.organizations;

REVOKE ALL ON SCHEMA bi FROM PUBLIC;
GRANT USAGE ON SCHEMA bi TO powerbi_reader;
GRANT SELECT ON bi.organizations TO powerbi_reader;

ALTER DEFAULT PRIVILEGES IN SCHEMA bi
  GRANT SELECT ON TABLES TO powerbi_reader;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM powerbi_reader;
