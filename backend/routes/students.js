const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Student ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Student WHERE student_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { email, dept, cgpa, academic_backlog } = req.body;
  if (!email || !dept) return res.status(400).json({ error: "Email and dept required" });
  try {
    const [result] = await db.query(
      "INSERT INTO Student (email, dept, cgpa, academic_backlog) VALUES (?, ?, ?, ?)",
      [email, dept, cgpa, academic_backlog || 0]
    );
    res.status(201).json({ student_id: result.insertId, message: "Student created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM Student WHERE student_id = ?", [req.params.id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
