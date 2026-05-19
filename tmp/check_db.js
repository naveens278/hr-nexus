const mysql = require('mysql2/promise');
(async () => {
  try {
    const pool = mysql.createPool({ 
      host: 'localhost', 
      user: 'root', 
      password: '', 
      database: 'hr_nexus_db' 
    });
    const [rows] = await pool.query('SELECT firstName, lastName, phone FROM employees');
    console.log('EMPLOYEES_DATA_START');
    console.log(JSON.stringify(rows));
    console.log('EMPLOYEES_DATA_END');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
