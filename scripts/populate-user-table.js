const fs = require("fs");
const path = require("path");
const mysql = require("../backend/node_modules/mysql2/promise");
require("../backend/node_modules/dotenv").config({ path: path.join(__dirname, "../backend/.env") });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, "../populate_user_table.sql"), "utf8");
  const [results] = await connection.query(sql);

  const summary = Array.isArray(results) ? results[results.length - 1] : [];
  console.log("User table populated.");
  console.table(summary);

  const [[missingCompanies]] = await connection.query(
    "SELECT COUNT(*) AS missing_company_emails FROM Company WHERE email IS NULL OR email = ''"
  );
  if (missingCompanies.missing_company_emails > 0) {
    console.log(`${missingCompanies.missing_company_emails} company rows were skipped because email is required in User.`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error("Failed to populate User table:", err.message);
  process.exit(1);
});
