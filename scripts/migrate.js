const fs = require('fs');
const path = require('path');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL set. Migration skipped. Local JSON fallback is development-only.');
    return;
  }
  let pg;
  try {
    pg = require('pg');
  } catch (error) {
    console.error('DATABASE_URL is set, but dependency "pg" is not installed. Run npm install before migrating.');
    process.exit(1);
  }
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }
  });
  try {
    const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter((name) => name.endsWith('.sql')).sort();
    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      console.log(`Running EnglishLegalese migration ${file}`);
      await pool.query(sql);
      console.log(`Migration complete: ${file}`);
    }
    console.log('All migrations completed. Verify with /api/v119/production-readiness.');
  } finally {
    await pool.end();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
