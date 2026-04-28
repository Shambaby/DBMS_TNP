const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

async function isValidPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;
  if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
    return bcrypt.compare(inputPassword, storedPassword);
  }
  return inputPassword === storedPassword;
}

router.post("/login", async (req, res) => {
  const { email, password, user_type } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const values = [email];
    let query = "SELECT * FROM `User` WHERE email = ?";

    if (user_type) {
      query += " AND user_type = ?";
      values.push(user_type);
    }

    const [rows] = await db.query(query, values);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await isValidPassword(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const { password: _, ...user } = rows[0];
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, isValidPassword };
