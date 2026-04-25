const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// GET all students
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT student_id, email, dept, cgpa, academic_backlog, created_at FROM Student ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT student_id, email, dept, cgpa, academic_backlog, created_at FROM Student WHERE student_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student's applications with job + company + placement info
router.get("/:id/applications", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sa.*, j.job_description, j.appl_deadline, c.company_name,
             p.ctc, p.join_date
      FROM StudentApplication sa
      LEFT JOIN JobOpening j ON sa.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      LEFT JOIN Placement p ON p.application_id = sa.application_id
      WHERE sa.student_id = ?
      ORDER BY sa.created_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create student — auto-sets password to email prefix
router.post("/", async (req, res) => {
  const { email, dept, cgpa, academic_backlog } = req.body;
  if (!email || !dept) return res.status(400).json({ error: "Email and dept required" });
  try {
    const defaultPassword = email.split("@")[0];
    const hashed = await bcrypt.hash(defaultPassword, 10);
    const [result] = await db.query(
      "INSERT INTO Student (email, dept, cgpa, academic_backlog, password) VALUES (?, ?, ?, ?, ?)",
      [email, dept, cgpa, academic_backlog || 0, hashed]
    );
    res.status(201).json({
      student_id: result.insertId,
      message: "Student created",
      default_password: defaultPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST student login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const [rows] = await db.query("SELECT * FROM Student WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });
    if (!rows[0].password) return res.status(401).json({ error: "Account not activated. Contact your TNP admin." });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const { password: _, ...student } = rows[0];
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT change password
router.put("/:id/password", async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: "Both passwords required" });
  if (new_password.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });
  try {
    const [rows] = await db.query("SELECT * FROM Student WHERE student_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Student not found" });
    const valid = await bcrypt.compare(current_password, rows[0].password);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
    const hashed = await bcrypt.hash(new_password, 10);
    await db.query("UPDATE Student SET password = ? WHERE student_id = ?", [hashed, req.params.id]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student info
router.put("/:id", async (req, res) => {
  const { email, dept, cgpa, academic_backlog } = req.body;
  try {
    await db.query(
      "UPDATE Student SET email=?, dept=?, cgpa=?, academic_backlog=? WHERE student_id=?",
      [email, dept, cgpa, academic_backlog, req.params.id]
    );
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM Student WHERE student_id = ?", [req.params.id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
