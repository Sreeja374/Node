const express = require("express");
const { nanoid } = require("nanoid");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const pastes = {}; // in-memory storage

// Health check
app.get("/api/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// Create paste
app.post("/api/pastes", (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Content is required" });
  }

  const id = nanoid(6);
  pastes[id] = content;

  res.status(201).json({
    id,
    url: `http://localhost:3000/p/${id}`
  });
});

// Fetch paste (API)
app.get("/api/pastes/:id", (req, res) => {
  const paste = pastes[req.params.id];
  if (!paste) {
    return res.status(404).json({ error: "Paste not found" });
  }
  res.json({ content: paste });
});

// View paste (HTML)
app.get("/p/:id", (req, res) => {
  const paste = pastes[req.params.id];
  if (!paste) {
    return res.status(404).send("Paste not found");
  }

  res.send(`
    <html>
      <body>
        <pre>${paste.replace(/</g, "&lt;")}</pre>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
