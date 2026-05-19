const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

(async () => {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hr_nexus_db'
    });

    console.log("Connecting to database...");
    const [result] = await pool.query(
      "UPDATE employees SET profilePicture = REPLACE(profilePicture, 'localhost:5000', 'localhost:5001') WHERE profilePicture LIKE '%localhost:5000%'"
    );

    console.log(`Successfully updated ${result.affectedRows} profile picture URLs from port 5000 to 5001.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
