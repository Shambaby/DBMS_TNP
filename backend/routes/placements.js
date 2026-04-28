const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, sa.enrollment_no, s.student_name,
             s.official_email AS student_email, s.branch,
             j.job_description, c.company_name
      FROM Placement p
      LEFT JOIN StudentApplication sa ON p.application_id = sa.application_id
      LEFT JOIN Student s ON sa.enrollment_no = s.enrollment_no
      LEFT JOIN JobOpening j ON p.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, sa.enrollment_no, s.student_name,
             s.official_email AS student_email, s.branch,
             j.job_description, c.company_name
      FROM Placement p
      LEFT JOIN StudentApplication sa ON p.application_id = sa.application_id
      LEFT JOIN Student s ON sa.enrollment_no = s.enrollment_no
      LEFT JOIN JobOpening j ON p.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      WHERE p.placement_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Placement not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { application_id, job_id, ctc, join_date } = req.body;
  if (!application_id || !job_id) return res.status(400).json({ error: "application_id and job_id required" });
  try {
    const [[application]] = await db.query(
      "SELECT enrollment_no FROM StudentApplication WHERE application_id = ?",
      [application_id]
    );
    if (!application) return res.status(404).json({ error: "Application not found" });
    const [result] = await db.query(
      "INSERT INTO Placement (application_id, job_id, enrollment_no, ctc, join_date) VALUES (?, ?, ?, ?, ?)",
      [application_id, job_id, application.enrollment_no, ctc, join_date]
    );
    res.status(201).json({ placement_id: result.insertId, message: "Placement recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { application_id, job_id, ctc, join_date } = req.body;
  try {
    const [[application]] = await db.query(
      "SELECT enrollment_no FROM StudentApplication WHERE application_id = ?",
      [application_id]
    );
    if (!application) return res.status(404).json({ error: "Application not found" });
    await db.query(
      "UPDATE Placement SET application_id=?, job_id=?, enrollment_no=?, ctc=?, join_date=? WHERE placement_id=?",
      [application_id, job_id, application.enrollment_no, ctc, join_date, req.params.id]
    );
    res.json({ message: "Placement updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM Placement WHERE placement_id = ?", [req.params.id]);
    res.json({ message: "Placement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
