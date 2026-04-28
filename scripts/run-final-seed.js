const fs = require("fs");
const path = require("path");
const mysql = require("../backend/node_modules/mysql2/promise");
require("../backend/node_modules/dotenv").config({
  path: path.join(__dirname, "..", "backend", ".env"),
});

const sqlPath = path.join(__dirname, "..", "seed_final.sql");

function env(name) {
  return (process.env[name] || "").trim();
}

async function main() {
  const sql = fs.readFileSync(sqlPath, "utf8");
  const host = env("DB_HOST");
  const port = Number(env("DB_PORT") || 3306);
  const user = env("DB_USER");
  const database = env("DB_NAME");

  if (!host || !user || !database) {
    throw new Error("Missing DB_HOST, DB_USER, or DB_NAME in backend/.env");
  }

  console.log(`Connecting to ${host}:${port} as ${user}, database ${database}...`);
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password: env("DB_PASSWORD"),
    database,
    ssl: env("DB_SSL") === "true" ? { rejectUnauthorized: false } : false,
    connectTimeout: 20000,
    multipleStatements: true,
  });

  try {
    console.log("Running seed_final.sql...");
    const [results] = await connection.query(sql);
    const countResult = results[results.length - 1];
    console.table(countResult);
    console.log("Seed completed.");
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
