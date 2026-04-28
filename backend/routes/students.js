const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// GET all students
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT enrollment_no, student_name, branch, year_of_graduation, official_email, personal_email, cgpa, active_backlog, dead_backlog, resume_url, created_at FROM Student ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student
router.get("/:enrollment_no", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Student WHERE enrollment_no = ?", [req.params.enrollment_no]);
    if (!rows.length) return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student's applications with job + company + placement info
router.get("/:enrollment_no/applications", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sa.*, j.job_description, j.appl_deadline, c.company_name,
             p.ctc, p.join_date
      FROM StudentApplication sa
      LEFT JOIN JobOpening j ON sa.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      LEFT JOIN Placement p ON p.application_id = sa.application_id
      WHERE sa.enrollment_no = ?
      ORDER BY sa.created_at DESC
    `, [req.params.enrollment_no]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create student
router.post("/", async (req, res) => {
  const { enrollment_no, student_name, branch, year_of_graduation, official_email, personal_email, cgpa, active_backlog, dead_backlog, resume_url } = req.body;
  if (!enrollment_no || !student_name || !branch || !official_email) return res.status(400).json({ error: "Enrollment No, Student Name, Branch, and Official Email required" });
  try {
    const [result] = await db.query(
      "INSERT INTO Student (enrollment_no, student_name, branch, year_of_graduation, official_email, personal_email, cgpa, active_backlog, dead_backlog, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [enrollment_no, student_name, branch, year_of_graduation || null, official_email, personal_email || null, cgpa || null, active_backlog || 0, dead_backlog || 0, resume_url || null]
    );
    res.status(201).json({
      enrollment_no: enrollment_no,
      message: "Student created"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update student info
router.put("/:enrollment_no", async (req, res) => {
  const { student_name, branch, year_of_graduation, official_email, personal_email, cgpa, active_backlog, dead_backlog, resume_url } = req.body;
  try {
    await db.query(
      "UPDATE Student SET student_name=?, branch=?, year_of_graduation=?, official_email=?, personal_email=?, cgpa=?, active_backlog=?, dead_backlog=?, resume_url=? WHERE enrollment_no=?",
      [student_name, branch, year_of_graduation || null, official_email, personal_email || null, cgpa || null, active_backlog || 0, dead_backlog || 0, resume_url || null, req.params.enrollment_no]
    );
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete("/:enrollment_no", async (req, res) => {
  try {
    await db.query("DELETE FROM Student WHERE enrollment_no = ?", [req.params.enrollment_no]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
