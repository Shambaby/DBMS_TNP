const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const { isValidPassword } = require("./users");

// GET all admins
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT admin_id, email, phone_no, created_at FROM Admin ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single admin
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT admin_id, email, phone_no, created_at FROM Admin WHERE admin_id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Admin not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create admin
router.post("/", async (req, res) => {
  const { email, password, phone_no } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO Admin (email, password, phone_no) VALUES (?, ?, ?)",
      [email, hashed, phone_no]
    );
    res.status(201).json({ admin_id: result.insertId, message: "Admin created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [userRows] = await db.query("SELECT * FROM `User` WHERE email = ? AND user_type = 'admin'", [email]);
    if (!userRows.length) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await isValidPassword(password, userRows[0].password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const [rows] = await db.query("SELECT * FROM Admin WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const { password: _, ...admin } = rows[0];
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update admin
router.put("/:id", async (req, res) => {
  const { email, phone_no } = req.body;
  try {
    await db.query("UPDATE Admin SET email=?, phone_no=? WHERE admin_id=?", [email, phone_no, req.params.id]);
    res.json({ message: "Admin updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE admin
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM Admin WHERE admin_id = ?", [req.params.id]);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
