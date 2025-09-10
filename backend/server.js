const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// API (backend)
// ----------------------
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hola desde Node.js 🚀" });
});

// ----------------------
// FRONTEND
// ----------------------
/*
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
