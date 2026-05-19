const mysql = require('mysql2/promise');
(async () => {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', database: 'hr_nexus_db'});
  const [rows] = await pool.query("SELECT * FROM employees LIMIT 1");
  console.log(JSON.stringify(rows[0], null, 2));
  process.exit(0);
})();
