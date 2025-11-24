import { db } from './index';
import fs from 'fs';
import path from 'path';

async function run() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const full = path.join(migrationsDir, file);
    const sql = fs.readFileSync(full, 'utf8');
    console.log('Running migration', file);
    await db.query(sql);
  }

  console.log('Migrations complete');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
