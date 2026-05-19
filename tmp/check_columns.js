const mysql = require('mysql2/promise');
async function checkColumns() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hr_nexus_db'
  });
  try {
    const [fields] = await pool.query("DESCRIBE employees");
    console.log("COLUMNS:");
    fields.forEach(f => console.log(f.Field));
    
    const [rows] = await pool.query("SELECT * FROM employees LIMIT 1");
    if (rows.length > 0) {
      console.log("FIRST ROW KEYS:");
      console.log(Object.keys(rows[0]));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
checkColumns();
