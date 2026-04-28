# Training and Placement Management System

This is a DBMS mini project for managing Training and Placement Cell activities. The project stores student records, company records, job openings, student applications, placement results, and user login data in a MySQL database.

The application has two main web sides:

- Admin side: manage students, companies, jobs, applications, placements, and dashboard data.
- Student side: students can log in, view available jobs, apply for jobs, and view their applications.

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap Icons
- Backend: Node.js, Express.js
- Database: MySQL
- MySQL library: mysql2
- Authentication helper: bcryptjs

## Project Structure

```text
DBMS_TNP/
  backend/
    server.js
    db.js
    routes/
  frontend/
    index.html
    admin-login.html
    student-login.html
    dashboard.html
    student-dashboard.html
  schema.sql
  seed_final.sql
  populate_user_table.sql
```

## Database Tables

The database contains these main tables:

| Table | Purpose |
| --- | --- |
| `User` | Supertype table for login users |
| `Admin` | Admin profile data |
| `Student` | Student academic and profile data |
| `Company` | Company details |
| `JobOpening` | Jobs posted by companies |
| `StudentApplication` | Applications submitted by students |
| `Placement` | Final placement records |

`User` is the supertype of `Admin`, `Student`, and `Company`. It stores common login fields:

```text
user_id, email, phone_no, password, user_type
```

## Dataset Size

Expected row counts after loading the final seed data:

| Table | Rows |
| --- | ---: |
| Admin | 10 |
| Company | 30 |
| JobOpening | 200 |
| Student | 2000 |
| StudentApplication | 3500 |
| Placement | 334 |
| User | 2040 |

To check row counts in MySQL Workbench:

```sql
USE railway;

SELECT 'User' AS table_name, COUNT(*) AS row_count FROM `User`
UNION ALL SELECT 'Admin', COUNT(*) FROM Admin
UNION ALL SELECT 'Company', COUNT(*) FROM Company
UNION ALL SELECT 'JobOpening', COUNT(*) FROM JobOpening
UNION ALL SELECT 'Student', COUNT(*) FROM Student
UNION ALL SELECT 'StudentApplication', COUNT(*) FROM StudentApplication
UNION ALL SELECT 'Placement', COUNT(*) FROM Placement;
```

## Database Setup

Open MySQL Workbench or Railway MySQL query editor and run:

```sql
SOURCE schema.sql;
SOURCE seed_final.sql;
SOURCE populate_user_table.sql;
```

If `SOURCE` does not work in your tool, open each file, copy its full contents, and run it manually in this order:

1. `schema.sql`
2. `seed_final.sql`
3. `populate_user_table.sql`

## Backend Environment

Create a `.env` file inside `backend/`.

Example:

```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=railway
DB_SSL=true
PORT=5002
```

Use the database credentials from Railway or your local MySQL setup.

## How To Run The Website

Open PowerShell and run:

```powershell
cd F:\DBMS_Project_Final\DBMS_TNP\backend
npm install
$env:PORT=5002
npm run dev
```

Then open this URL in the browser:

```text
http://localhost:5002
```

If port `5002` is already in use, run:

```powershell
$env:PORT=5003
npm run dev
```

Then open:

```text
http://localhost:5003
```

## Deploy On Vercel

This project is ready for Vercel deployment. The files `api/index.js`, `package.json`, and `vercel.json` are included so Vercel can run the Express backend as a serverless function and serve the frontend.

### Option 1: Deploy From GitHub

1. Push the latest code to GitHub.
2. Open Vercel.
3. Click `Add New Project`.
4. Import this GitHub repo:

```text
https://github.com/Shambaby/DBMS_TNP.git
```

5. Keep the project root as the repository root.
6. In project settings, keep the Framework Preset as `Other` if Vercel asks.
7. Add these Environment Variables in Vercel:

```env
DB_HOST=your_mysql_host
DB_PORT=your_mysql_port
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=railway
DB_SSL=true
```

8. Click `Deploy`.

After deployment, Vercel will give a public URL like:

```text
https://your-project-name.vercel.app
```

Use these pages:

```text
https://your-project-name.vercel.app/admin-login.html
https://your-project-name.vercel.app/student-login.html
```

### Option 2: Deploy Using Vercel CLI

Install and login:

```powershell
npm install -g vercel
vercel login
```

Deploy:

```powershell
cd F:\DBMS_Project_Final\DBMS_TNP
vercel
```

For production deployment:

```powershell
vercel --prod
```

Make sure the same database environment variables are added in the Vercel dashboard.

## Admin Login

Admin login page:

```text
http://localhost:5002/admin-login.html
```

Admin credentials follow this format:

```text
Email: admin<number>@tnp.edu.in
Password: admin<number>
```

All admin demo logins:

| Admin | Email | Password |
| --- | --- | --- |
| Admin 1 | `admin1@tnp.edu.in` | `admin1` |
| Admin 2 | `admin2@tnp.edu.in` | `admin2` |
| Admin 3 | `admin3@tnp.edu.in` | `admin3` |
| Admin 4 | `admin4@tnp.edu.in` | `admin4` |
| Admin 5 | `admin5@tnp.edu.in` | `admin5` |
| Admin 6 | `admin6@tnp.edu.in` | `admin6` |
| Admin 7 | `admin7@tnp.edu.in` | `admin7` |
| Admin 8 | `admin8@tnp.edu.in` | `admin8` |
| Admin 9 | `admin9@tnp.edu.in` | `admin9` |
| Admin 10 | `admin10@tnp.edu.in` | `admin10` |

## Student Login

Student login page:

```text
http://localhost:5002/student-login.html
```

Student credentials follow this rule:

```text
Email: official_email from Student table
Password: part before @ in the email
```

Example:

```text
Email: riya.dubey1@student.edu.in
Password: riya.dubey1
```

More examples:

| Student Email | Password |
| --- | --- |
| `riya.dubey1@student.edu.in` | `riya.dubey1` |
| `nisha.verma2@campusmail.edu` | `nisha.verma2` |
| `anika.kapoor3@campusmail.edu` | `anika.kapoor3` |
| `riya.gupta4@campusmail.edu` | `riya.gupta4` |
| `diya.sharma5@campusmail.edu` | `diya.sharma5` |

To list all student login credentials from MySQL:

```sql
USE railway;

SELECT
  official_email AS email,
  SUBSTRING_INDEX(official_email, '@', 1) AS password
FROM Student
ORDER BY enrollment_no;
```

## Company User Credentials

Company rows are also inserted into the `User` table as `user_type = 'company'`.

There is currently no separate company login page in the frontend, but company credentials follow the same rule:

```text
Email: company email
Password: part before @ in the email
```

Example:

```text
Email: campus.infosys@careers.example.com
Password: campus.infosys
```

To list all company user credentials:

```sql
USE railway;

SELECT
  email,
  SUBSTRING_INDEX(email, '@', 1) AS password
FROM Company
WHERE email IS NOT NULL AND email <> ''
ORDER BY company_id;
```

## Important URLs

Use the correct port based on the server command you used.

| Page | URL |
| --- | --- |
| Role selection | `http://localhost:5002` |
| Admin login | `http://localhost:5002/admin-login.html` |
| Student login | `http://localhost:5002/student-login.html` |
| Admin dashboard | `http://localhost:5002/dashboard.html` |
| Student dashboard | `http://localhost:5002/student-dashboard.html` |

## Main Features

- Admin login and student login
- Dashboard with placement statistics
- Manage student records
- Manage company records
- Manage job openings
- Track student applications
- Record placement information
- Student dashboard for job applications
- `User` supertype table for common login data

## Demo Notes

For a simple demo in front of a teacher:

1. Start the server with PowerShell.
2. Open `http://localhost:5002`.
3. Log in as admin using `admin1@tnp.edu.in` and `admin1`.
4. Show dashboard counts, students, companies, jobs, applications, and placements.
5. Log out and open student login.
6. Log in as student using `riya.dubey1@student.edu.in` and `riya.dubey1`.
7. Show available jobs and student applications.

## Troubleshooting

If you get `EADDRINUSE`, the port is already being used. Run on another port:

```powershell
$env:PORT=5003
npm run dev
```

If MySQL does not connect, check `backend/.env` and verify:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL`

If login fails, run `populate_user_table.sql` again to refresh the `User` table from `Admin`, `Student`, and `Company`.

If the student dashboard opens but job cards keep showing `Loading...`, restart the backend server:

```powershell
Ctrl + C
$env:PORT=5002
npm run dev
```

Then refresh the browser with:

```text
Ctrl + F5
```
