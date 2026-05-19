const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'hr_nexus_db' });
  try {
    const [res1] = await pool.query("UPDATE employees SET email = REPLACE(email, '@kce.in.ac', '@kce.ac.in') WHERE email LIKE '%@kce.in.ac'");
    console.log("Employees updated:", res1.affectedRows);
    
    // Also update previously inserted leaves if any, though emails are not primarily used for joining, just in case
    // wait, leaves_request doesn't strictly need email to be updated because it joins on employeeId
    
    console.log("Successfully fixed typos.");
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
