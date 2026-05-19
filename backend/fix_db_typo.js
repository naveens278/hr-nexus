const mysql = require('mysql2/promise');

async function fixTypo() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hr_nexus_db'
    });
    
    // Fix in employees table
    const [empRes] = await pool.query(
      "UPDATE employees SET email = '717824i605@kce.ac.in' WHERE email LIKE '%@kce.in.ac'"
    );
    console.log("Employees updated:", empRes.affectedRows);

    await pool.end();
  } catch (err) {
    console.error(err);
  }
}

fixTypo();
