const mysql = require('mysql2/promise');

async function check() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hr_nexus_db'
    });
    const [rows] = await pool.query("SELECT * FROM employees LIMIT 1");
    if (rows.length > 0) {
      console.log("Keys in row:", Object.keys(rows[0]));
      console.log("Sample Data:", JSON.stringify(rows[0], null, 2));
    } else {
      console.log("No employees found in database.");
    }
    await pool.end();
  } catch (err) {
    console.error(err);
  }
}

check();
