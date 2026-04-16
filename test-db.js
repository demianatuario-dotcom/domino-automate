const { Pool } = require('pg');


const pool = new Pool({
  connectionString: 'postgres://postgres:domini_secret_pg_pwd@76.13.234.225:5434/db_Domini'
});

async function run() {
  const client = await pool.connect();
  const res = await client.query('SELECT * FROM videos ORDER BY id ASC');
  console.log(res.rows);
  client.release();
}
run().catch(console.error);
