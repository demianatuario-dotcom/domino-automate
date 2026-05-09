const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:domini_secret_pg_pwd@76.13.234.225:5437/db_Domini'
});

async function run() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS comentarios (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        user_image VARCHAR(1024),
        provider VARCHAR(50),
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES comentarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(query);
    console.log("Tabela 'comentarios' criada com sucesso.");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
