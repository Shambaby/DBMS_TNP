const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/stats", async (req, res) => {
  try {
    const [[{ total_students }]] = await db.query("SELECT COUNT(*) AS total_students FROM Student");
    const [[{ total_companies }]] = await db.query("SELECT COUNT(*) AS total_companies FROM Company");
    const [[{ total_jobs }]] = await db.query("SELECT COUNT(*) AS total_jobs FROM JobOpening");
    const [[{ total_applications }]] = await db.query("SELECT COUNT(*) AS total_applications FROM StudentApplication");
    const [[{ total_placements }]] = await db.query("SELECT COUNT(*) AS total_placements FROM Placement");
    const [[{ avg_ctc }]] = await db.query("SELECT ROUND(AVG(ctc), 2) AS avg_ctc FROM Placement");

    const [recent_placements] = await db.query(`
      SELECT p.ctc, p.join_date, s.official_email, s.branch, c.company_name
      FROM Placement p
      LEFT JOIN StudentApplication sa ON p.application_id = sa.application_id
      LEFT JOIN Student s ON sa.enrollment_no = s.enrollment_no
      LEFT JOIN JobOpening j ON p.job_id = j.job_id
      LEFT JOIN Company c ON j.company_id = c.company_id
      ORDER BY p.created_at DESC LIMIT 5
    `);

    const [dept_stats] = await db.query(`
      SELECT s.branch, COUNT(p.placement_id) AS placed
      FROM Student s
      LEFT JOIN StudentApplication sa ON s.enrollment_no = sa.enrollment_no
      LEFT JOIN Placement p ON sa.application_id = p.application_id
      GROUP BY s.branch
    `);

    res.json({
      total_students,
      total_companies,
      total_jobs,
      total_applications,
      total_placements,
      avg_ctc,
      recent_placements,
      dept_stats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
