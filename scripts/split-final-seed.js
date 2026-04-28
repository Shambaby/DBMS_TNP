const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "seed_final.sql");
const outDir = path.join(root, "seed_parts");

const sql = fs.readFileSync(sourcePath, "utf8");
fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(outDir)) {
  if (file.endsWith(".sql")) fs.unlinkSync(path.join(outDir, file));
}

const statements = sql
  .split(/;\s*\r?\n/)
  .map((statement) => statement.trim())
  .filter(Boolean)
  .map((statement) => `${statement};\n`);

function writeFile(order, name, content) {
  const orderedName = `${String(order).padStart(2, "0")}_${name}`;
  fs.writeFileSync(path.join(outDir, orderedName), content, "utf8");
  console.log(orderedName);
}

let resetSql = "";
let finalCountsSql = "";
const groups = {
  admin: [],
  company: [],
  students: [],
  job_openings: [],
  student_applications: [],
  placements: [],
};

for (const statement of statements) {
  if (
    statement.startsWith("SET FOREIGN_KEY_CHECKS") ||
    statement.startsWith("TRUNCATE TABLE")
  ) {
    resetSql += statement;
    continue;
  }

  if (statement.startsWith("INSERT INTO Admin")) {
    groups.admin.push(statement);
  } else if (statement.startsWith("INSERT INTO Company")) {
    groups.company.push(statement);
  } else if (statement.startsWith("INSERT INTO Student ")) {
    groups.students.push(statement);
  } else if (statement.startsWith("INSERT INTO JobOpening")) {
    groups.job_openings.push(statement);
  } else if (statement.startsWith("INSERT INTO StudentApplication")) {
    groups.student_applications.push(statement);
  } else if (statement.startsWith("INSERT INTO Placement")) {
    groups.placements.push(statement);
  } else if (statement.startsWith("SELECT 'Admin'")) {
    finalCountsSql = statement;
  }
}

let order = 1;
writeFile(order, "reset_tables.sql", resetSql);
order += 1;

for (const [group, groupStatements] of Object.entries(groups)) {
  groupStatements.forEach((statement, index) => {
    const part = String(index + 1).padStart(3, "0");
    writeFile(order, `${group}_${part}.sql`, statement);
    order += 1;
  });
}

if (finalCountsSql) {
  writeFile(order, "final_counts.sql", finalCountsSql);
}

const files = fs.readdirSync(outDir).filter((file) => file.endsWith(".sql")).sort();
const readme = [
  "# Seed Parts",
  "",
  "Run these SQL files in Railway MySQL Query tab in filename order.",
  "",
  "The `reset_tables` file truncates the seeded tables. Run it first.",
  "The `final_counts` file should be run last to verify row counts.",
  "",
  ...files.map((file) => `- ${file}`),
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "README.md"), readme, "utf8");
console.log(`\nWrote ${files.length} SQL files to ${outDir}`);
