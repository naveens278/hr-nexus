const mysql = require('mysql2/promise');

async function check() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hr_nexus_db'
    });
    const [cols] = await pool.query("DESCRIBE leaves_request");
    console.log("Columns in leaves_request:", JSON.stringify(cols, null, 2));
    await pool.end();
  } catch (err) {
    console.error(err);
  }
}

check();
