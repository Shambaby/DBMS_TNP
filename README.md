# TNP DBMS Project

## Setup Instructions

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd tnp-project
```

### 2. Set up the database
- Open Railway → your MySQL service → Query tab
- Copy and run the entire contents of `schema.sql`

### 3. Configure backend environment
```bash
cd backend
cp .env.example .env
```
Edit `.env` with your Railway MySQL credentials from:
Railway → Service → Variables tab → Copy DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

### 4. Install and run backend
```bash
cd backend
npm install
npm run dev       # development (auto-reload)
# or
npm start         # production
```

### 5. Open in browser
Visit: http://localhost:5000

Default login: admin@tnp.edu / (set via schema.sql seed or create via API)

## Railway DB Credentials Location
Railway Dashboard → Your Project → MySQL Service → Variables tab
