console.log("File loaded");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./db");
const generateCertificate = require("./certificate");

const app = express();

/* ✅ Middleware */
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

/* ✅ Connect to Database */
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Database Connected");
});

/* ✅ Home Route */
app.get("/", (req, res) => {
  res.send("Quiz API is running 🚀");
});

/* ✅ Get Questions */
app.get("/questions", (req, res) => {
  db.query("SELECT * FROM questions", (err, result) => {
    if (err) {
      console.error("❌ Error fetching questions:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

/* ✅ Submit Quiz */
app.post("/submit", (req, res) => {
  const { name, score } = req.body;

  if (!name || score === undefined) {
    return res.status(400).json({ error: "Missing data" });
  }

  db.query(
    "INSERT INTO results(username,score) VALUES (?,?)",
    [name, score],
    (err) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }

      let certificatePath = null;

      // 🎓 Generate certificate
      if (score >= 2) {
        try {
          certificatePath = generateCertificate(name, score);
        } catch (e) {
          console.error("❌ Certificate error:", e);
        }
      }

      // ✅ Send response once
      res.json({
        message: "Result Saved Successfully",
        score: score,
        certificate: certificatePath
      });
    }
  );
});

/* ✅ Start Server */
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});