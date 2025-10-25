const baseConfig = {
  db: {
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT,
    database: 'postgres',
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: true,
  },
  migrations: {
    ensureMigrationsTable: true,
  },
  autoloadModels: true,
};

module.exports = baseConfig;