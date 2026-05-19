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
      "UPDATE employees SET email = '717824i605@kce.ac.in' WHERE email = '717824i605@kce.in.ac'"
    );
    console.log("Employees updated:", empRes.affectedRows);
    
    // Fix in users table just in case
    const [usrRes] = await pool.query(
      "UPDATE users SET email = '717824i605@kce.ac.in' WHERE email = '717824i605@kce.in.ac'"
    );
    console.log("Users updated:", usrRes.affectedRows);

    await pool.end();
  } catch (err) {
    console.error(err);
  }
}

fixTypo();
