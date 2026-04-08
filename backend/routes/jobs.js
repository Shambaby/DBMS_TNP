const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT j.*, c.company_name, a.email AS admin_email
      FROM JobOpening j
      LEFT JOIN Company c ON j.company_id = c.company_id
      LEFT JOIN Admin a ON j.admin_id = a.admin_id
      ORDER BY j.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT j.*, c.company_name, a.email AS admin_email
      FROM JobOpening j
      LEFT JOIN Company c ON j.company_id = c.company_id
      LEFT JOIN Admin a ON j.admin_id = a.admin_id
      WHERE j.job_id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Job not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { admin_id, company_id, job_description, appl_deadline } = req.body;
  if (!company_id || !job_description) return res.status(400).json({ error: "Company and description required" });
  try {
    const [result] = await db.query(
      "INSERT INTO JobOpening (admin_id, company_id, job_description, appl_deadline) VALUES (?, ?, ?, ?)",
      [admin_id, company_id, job_description, appl_deadline]
    );
    res.status(201).json({ job_id: result.insertId, message: "Job opening created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { admin_id, company_id, job_description, appl_deadline } = req.body;
  try {
    await db.query(
      "UPDATE JobOpening SET admin_id=?, company_id=?, job_description=?, appl_deadline=? WHERE job_id=?",
      [admin_id, company_id, job_description, appl_deadline, req.params.id]
    );
    res.json({ message: "Job updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM JobOpening WHERE job_id = ?", [req.params.id]);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
