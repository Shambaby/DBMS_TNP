const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Company ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Company WHERE company_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Company not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { company_name, industry_type, description, email, contact_no, address, website } = req.body;
  if (!company_name) return res.status(400).json({ error: "Company name required" });
  try {
    const [result] = await db.query(
      "INSERT INTO Company (company_name, industry_type, description, email, contact_no, address, website) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [company_name, industry_type, description, email, contact_no, address, website]
    );
    res.status(201).json({ company_id: result.insertId, message: "Company created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { company_name, industry_type, description, email, contact_no, address, website } = req.body;
  try {
    await db.query(
      "UPDATE Company SET company_name=?, industry_type=?, description=?, email=?, contact_no=?, address=?, website=? WHERE company_id=?",
      [company_name, industry_type, description, email, contact_no, address, website, req.params.id]
    );
    res.json({ message: "Company updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM Company WHERE company_id = ?", [req.params.id]);
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
