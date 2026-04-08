const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sa.*, s.email AS student_email, s.dept, s.cgpa,
             j.job_description, c.company_name
      FROM StudentApplication sa
      LEFT JOIN Student s ON sa.student_id = s.student_id
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
      SELECT sa.*, s.email AS student_email, s.dept, s.cgpa,
             j.job_description, c.company_name
      FROM StudentApplication sa
      LEFT JOIN Student s ON sa.student_id = s.student_id
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
  const { student_id, job_id, academic_backlog, date_of_application } = req.body;
  if (!student_id || !job_id) return res.status(400).json({ error: "student_id and job_id required" });
  try {
    const [result] = await db.query(
      "INSERT INTO StudentApplication (student_id, job_id, academic_backlog, date_of_application) VALUES (?, ?, ?, ?)",
      [student_id, job_id, academic_backlog || 0, date_of_application || new Date()]
    );
    res.status(201).json({ application_id: result.insertId, message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { student_id, job_id, academic_backlog, date_of_application } = req.body;
  try {
    await db.query(
      "UPDATE StudentApplication SET student_id=?, job_id=?, academic_backlog=?, date_of_application=? WHERE application_id=?",
      [student_id, job_id, academic_backlog, date_of_application, req.params.id]
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
