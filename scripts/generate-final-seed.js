const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "seed_final.sql");

let seed = 20260428;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
}
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function int(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function money(minLakhs, maxLakhs) {
  return (int(minLakhs * 100, maxLakhs * 100) / 100).toFixed(2);
}
function annualCtc(minLakhs, maxLakhs) {
  return (int(minLakhs * 100, maxLakhs * 100) * 1000).toFixed(2);
}
function pad(n, width) {
  return String(n).padStart(width, "0");
}
function esc(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}
function dateObj(yyyy, mm, dd) {
  return new Date(Date.UTC(yyyy, mm - 1, dd));
}
function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}
function isoDate(date) {
  return date.toISOString().slice(0, 10);
}
function timestamp(date) {
  return `${isoDate(date)} ${pad(int(9, 17), 2)}:${pad(int(0, 59), 2)}:00`;
}
function insertRows(table, columns, rows, chunkSize = 250) {
  const chunks = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    chunks.push(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n` +
      chunk.map(row => `(${row.map(esc).join(", ")})`).join(",\n") +
      ";\n"
    );
  }
  return chunks.join("\n");
}

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan",
  "Krishna", "Ishaan", "Shaurya", "Atharv", "Kabir", "Ananya", "Diya", "Aadhya",
  "Myra", "Ira", "Sara", "Anika", "Saanvi", "Kiara", "Navya", "Meera", "Riya",
  "Kavya", "Nisha", "Aditi", "Pranav", "Rohan", "Harsh", "Yash", "Neha", "Pooja"
];
const lastNames = [
  "Sharma", "Patel", "Singh", "Mehta", "Gupta", "Rao", "Iyer", "Nair",
  "Menon", "Kapoor", "Das", "Joshi", "Verma", "Chatterjee", "Malhotra",
  "Bose", "Saxena", "Dubey", "Kumar", "Pandey", "Shetty", "Kulkarni"
];
const branches = [
  "Computer Science", "Information Technology", "Artificial Intelligence",
  "Data Science", "Electronics & Communication", "Electrical Engineering",
  "Mechanical Engineering", "Civil Engineering", "Cybersecurity"
];
const domains = ["student.edu.in", "enggcollege.ac.in", "campusmail.edu"];
const cities = ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Chennai", "Gurugram", "Noida", "Ahmedabad"];
const jobTitles = [
  "Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer",
  "Data Analyst", "Data Engineer", "Cloud Engineer", "DevOps Engineer",
  "QA Automation Engineer", "Security Analyst", "Business Analyst",
  "Machine Learning Engineer", "Associate Consultant", "Product Engineer"
];
const skills = [
  "Java", "Python", "JavaScript", "React", "Node.js", "SQL", "REST APIs",
  "AWS", "Docker", "Linux", "Git", "Data Structures", "System Design",
  "Power BI", "Spark", "TensorFlow", "Cybersecurity fundamentals"
];
const statuses = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Offered", "Accepted", "Rejected"];

const companyList = [
  ["Infosys", "IT Services", "https://www.infosys.com"],
  ["TCS", "IT Services", "https://www.tcs.com"],
  ["Wipro", "IT Services", "https://www.wipro.com"],
  ["HCLTech", "IT Services", "https://www.hcltech.com"],
  ["Tech Mahindra", "IT Services", "https://www.techmahindra.com"],
  ["Accenture", "Consulting & Technology", "https://www.accenture.com"],
  ["Deloitte", "Consulting", "https://www.deloitte.com"],
  ["Capgemini", "IT Consulting", "https://www.capgemini.com"],
  ["Cognizant", "IT Services", "https://www.cognizant.com"],
  ["Mphasis", "IT Services", "https://www.mphasis.com"],
  ["LTIMindtree", "IT Services", "https://www.ltimindtree.com"],
  ["Persistent Systems", "Software Product Engineering", "https://www.persistent.com"],
  ["Oracle", "Enterprise Software", "https://www.oracle.com"],
  ["SAP Labs India", "Enterprise Software", "https://www.sap.com"],
  ["IBM India", "Technology", "https://www.ibm.com"],
  ["Microsoft India", "Technology", "https://www.microsoft.com"],
  ["Google India", "Technology", "https://www.google.com"],
  ["Amazon Development Centre", "E-Commerce & Cloud", "https://www.amazon.jobs"],
  ["Flipkart", "E-Commerce", "https://www.flipkartcareers.com"],
  ["Razorpay", "Fintech", "https://razorpay.com"],
  ["PhonePe", "Fintech", "https://www.phonepe.com"],
  ["Paytm", "Fintech", "https://paytm.com"],
  ["Zoho", "SaaS", "https://www.zoho.com"],
  ["Freshworks", "SaaS", "https://www.freshworks.com"],
  ["Atlassian India", "Software", "https://www.atlassian.com"],
  ["Adobe India", "Software", "https://www.adobe.com"],
  ["ServiceNow India", "Cloud Software", "https://www.servicenow.com"],
  ["Zomato", "Food Tech", "https://www.zomato.com"],
  ["Swiggy", "Food Tech", "https://www.swiggy.com"],
  ["Tata Elxsi", "Embedded & Design Technology", "https://www.tataelxsi.com"]
];

const adminRows = Array.from({ length: 10 }, (_, i) => {
  const id = i + 1;
  const created = dateObj(2024, int(1, 6), int(1, 28));
  return [
    id,
    `admin${id}@tnp.edu.in`,
    "$2a$10$7EqJtq98hPqEX7fNZaFWoOHi5y7w1NmpC7biL9qN6G4BMLcwmwQxK",
    `9${int(100000000, 999999999)}`,
    timestamp(created),
    timestamp(addDays(created, int(30, 400)))
  ];
});

const companyRows = companyList.map((company, index) => {
  const [name, type, website] = company;
  const city = pick(cities);
  const created = dateObj(2024, int(1, 12), int(1, 28));
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18);
  return [
    index + 1,
    name,
    type,
    `${name} hires engineering graduates for software development, analytics, cloud platforms, testing, and product delivery roles. The company regularly partners with colleges for campus recruitment.`,
    `campus.${slug}@careers.example.com`,
    `8${int(100000000, 999999999)}`,
    `${city}, India`,
    website,
    timestamp(created),
    timestamp(addDays(created, int(30, 500)))
  ];
});

const studentRows = [];
for (let i = 1; i <= 2000; i++) {
  const gradYear = pick([2025, 2026, 2027, 2028]);
  const branch = pick(branches);
  const prefix = String(gradYear).slice(2);
  const enrollment = `${prefix}CE${pad(i, 4)}`;
  const first = pick(firstNames);
  const last = pick(lastNames);
  const username = `${first}.${last}${i}`.toLowerCase();
  const cgpa = (int(610, 985) / 100).toFixed(2);
  const activeBacklog = rand() < 0.86 ? 0 : int(1, 3);
  const deadBacklog = rand() < 0.78 ? 0 : int(1, 4);
  const created = dateObj(2024, int(1, 12), int(1, 28));
  studentRows.push([
    enrollment,
    `${first} ${last}`,
    branch,
    gradYear,
    `${username}@${pick(domains)}`,
    `${username}@gmail.com`,
    cgpa,
    activeBacklog,
    deadBacklog,
    `https://drive.google.com/file/d/resume-${enrollment}/view`,
    timestamp(created),
    timestamp(addDays(created, int(10, 420)))
  ]);
}

const jobRows = [];
for (let i = 1; i <= 200; i++) {
  const companyId = int(1, 30);
  const adminId = int(1, 10);
  const title = pick(jobTitles);
  const required = Array.from(new Set(Array.from({ length: 5 }, () => pick(skills)))).join(", ");
  const created = dateObj(2025, int(1, 12), int(1, 28));
  const deadline = addDays(created, int(25, 110));
  const ctc = money(4.2, companyId >= 16 && companyId <= 27 ? 42 : 18);
  const description = `${title} opening for final-year engineering students. Responsibilities include building reliable software, collaborating with cross-functional teams, writing clean code, debugging production issues, and contributing to product releases. Preferred skills: ${required}. Approximate campus CTC: INR ${ctc} LPA.`;
  jobRows.push([
    i,
    adminId,
    companyId,
    description,
    isoDate(deadline),
    timestamp(created)
  ]);
}

const applicationRows = [];
const usedPairs = new Set();
for (let i = 1; i <= 3500; i++) {
  let studentIndex;
  let jobId;
  let key;
  do {
    studentIndex = int(0, studentRows.length - 1);
    jobId = int(1, 200);
    key = `${studentRows[studentIndex][0]}-${jobId}`;
  } while (usedPairs.has(key));
  usedPairs.add(key);

  const job = jobRows[jobId - 1];
  const jobCreated = new Date(`${job[5].slice(0, 10)}T00:00:00Z`);
  const appliedDate = addDays(jobCreated, int(1, 45));
  const status = pick(statuses);
  applicationRows.push([
    i,
    studentRows[studentIndex][0],
    jobId,
    studentRows[studentIndex][7],
    status,
    isoDate(appliedDate),
    timestamp(appliedDate)
  ]);
}

const placedEligible = applicationRows
  .filter(row => ["Offered", "Accepted", "Shortlisted", "Interview Scheduled"].includes(row[4]))
  .slice();
while (placedEligible.length < 334) {
  placedEligible.push(applicationRows[int(0, applicationRows.length - 1)]);
}

const placementRows = [];
const usedApplications = new Set();
for (let i = 1; i <= 334; i++) {
  let app;
  do {
    app = placedEligible[int(0, placedEligible.length - 1)];
  } while (usedApplications.has(app[0]));
  usedApplications.add(app[0]);
  const appDate = new Date(`${app[5]}T00:00:00Z`);
  const joinDate = addDays(appDate, int(45, 160));
  const jobCompanyId = jobRows[app[2] - 1][2];
  const ctc = annualCtc(4.5, jobCompanyId >= 16 && jobCompanyId <= 27 ? 48 : 22);
  placementRows.push([
    i,
    app[0],
    app[2],
    app[1],
    ctc,
    isoDate(joinDate),
    timestamp(addDays(appDate, int(25, 75)))
  ]);
}

const sql = `-- Final realistic dummy seed data for finalized TNP schema
-- Generated by scripts/generate-final-seed.js
-- Row counts: Admin=10, Company=30, JobOpening=200, Student=2000, StudentApplication=3500, Placement=334
-- WARNING: This resets these six tables before inserting data.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Placement;
TRUNCATE TABLE StudentApplication;
TRUNCATE TABLE JobOpening;
TRUNCATE TABLE Student;
TRUNCATE TABLE Company;
TRUNCATE TABLE Admin;
SET FOREIGN_KEY_CHECKS = 1;

${insertRows("Admin", ["admin_id", "email", "password", "phone_no", "created_at", "updated_at"], adminRows)}
${insertRows("Company", ["company_id", "company_name", "industry_type", "description", "email", "contact_no", "address", "website", "created_at", "updated_at"], companyRows)}
${insertRows("Student", ["enrollment_no", "student_name", "branch", "year_of_graduation", "official_email", "personal_email", "cgpa", "active_backlog", "dead_backlog", "resume_url", "created_at", "updated_at"], studentRows)}
${insertRows("JobOpening", ["job_id", "admin_id", "company_id", "job_description", "appl_deadline", "created_at"], jobRows)}
${insertRows("StudentApplication", ["application_id", "enrollment_no", "job_id", "active_backlog", "status", "date_of_application", "created_at"], applicationRows)}
${insertRows("Placement", ["placement_id", "application_id", "job_id", "enrollment_no", "ctc", "join_date", "created_at"], placementRows)}
SELECT 'Admin' AS table_name, COUNT(*) AS row_count FROM Admin
UNION ALL SELECT 'Company', COUNT(*) FROM Company
UNION ALL SELECT 'JobOpening', COUNT(*) FROM JobOpening
UNION ALL SELECT 'Student', COUNT(*) FROM Student
UNION ALL SELECT 'StudentApplication', COUNT(*) FROM StudentApplication
UNION ALL SELECT 'Placement', COUNT(*) FROM Placement;
`;

fs.writeFileSync(OUT, sql, "utf8");
console.log(`Wrote ${OUT}`);
