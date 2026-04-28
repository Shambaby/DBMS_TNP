const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sa.*, s.student_name, s.official_email AS student_email,
             s.branch, s.cgpa, s.resume_url,
             j.job_description, c.company_name
      FROM StudentApplication sa
      LEFT JOIN Student s ON sa.enrollment_no = s.enrollment_no
      LEFT JOIN JobOpening j ON sa.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      ORDER BY sa.date_of_application DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sa.*, s.student_name, s.official_email AS student_email,
             s.branch, s.cgpa, s.resume_url,
             j.job_description, c.company_name
      FROM StudentApplication sa
      LEFT JOIN Student s ON sa.enrollment_no = s.enrollment_no
      LEFT JOIN JobOpening j ON sa.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      WHERE sa.application_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Application not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { enrollment_no, job_id, active_backlog, status, date_of_application } = req.body;
  if (!enrollment_no || !job_id) return res.status(400).json({ error: "enrollment_no and job_id required" });
  try {
    // Prevent duplicate applications
    const [existing] = await db.query(
      "SELECT application_id FROM StudentApplication WHERE enrollment_no = ? AND job_id = ?",
      [enrollment_no, job_id]
    );
    if (existing.length) return res.status(409).json({ error: "You have already applied for this job." });
    const [result] = await db.query(
      "INSERT INTO StudentApplication (enrollment_no, job_id, active_backlog, status, date_of_application) VALUES (?, ?, ?, ?, ?)",
      [enrollment_no, job_id, active_backlog || 0, status || "Applied", date_of_application || new Date().toISOString().split("T")[0]]
    );
    res.status(201).json({ application_id: result.insertId, message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { enrollment_no, job_id, active_backlog, status, date_of_application } = req.body;
  try {
    await db.query(
      "UPDATE StudentApplication SET enrollment_no=?, job_id=?, active_backlog=?, status=?, date_of_application=? WHERE application_id=?",
      [enrollment_no, job_id, active_backlog || 0, status || "Applied", date_of_application || null, req.params.id]
    );
    res.json({ message: "Application updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM StudentApplication WHERE application_id = ?", [req.params.id]);
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
