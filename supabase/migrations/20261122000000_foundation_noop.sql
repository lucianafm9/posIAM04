-- Foundation no-op migration.
-- Registra o pipeline de migrations sem criar objetos de domínio.
-- A segunda execução é ignorada pelo histórico em supabase_migrations.schema_migrations.
select 1;
