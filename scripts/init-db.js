require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function main() {
  const dbDir = path.join(__dirname, '..', 'db');
  for (const file of ['schema.sql', 'seed.sql']) {
    const filePath = path.join(dbDir, file);
    if (!fs.existsSync(filePath)) continue;
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log(`SQL aplicado: ${file}`);
  }
  await pool.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
