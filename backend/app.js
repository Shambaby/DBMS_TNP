const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const frontendDir = path.join(__dirname, "../frontend");

app.use(cors());
app.use(express.json());

app.use(express.static(frontendDir));

app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users").router);
app.use("/api/companies", require("./routes/companies"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/students", require("./routes/students"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/placements", require("./routes/placements"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

module.exports = app;
