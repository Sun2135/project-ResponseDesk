const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./responsedesk.db");

db.run(`
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.get("/tickets", (req, res) => {
    db.all(
        "SELECT * FROM tickets ORDER BY created_at DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

app.post("/tickets", (req, res) => {
    const { title, description, severity } = req.body;
    if (!title || !description) {
    return res.status(400).json({
        error: "Title and description are required"
    });
}

    db.run(
        "INSERT INTO tickets (title, description, severity) VALUES (?, ?, ?)",
        [title, description, severity],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                title,
                description,
                severity,
                status: "Open"
            });
        }
    );
});

app.patch("/tickets/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run(
        "UPDATE tickets SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Ticket status updated" });
        }
    );
});

app.patch("/tickets/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run(
        "UPDATE tickets SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Ticket status updated" });
        }
    );
});

app.patch("/tickets/:id/notes", (req, res) => {
    const { notes } = req.body;
    const { id } = req.params;

    db.run(
        "UPDATE tickets SET notes = ? WHERE id = ?",
        [notes, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Ticket notes updated" });
        }
    );
});

app.delete("/tickets/:id", (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM tickets WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Ticket deleted" });
    });
});

app.patch("/tickets/:id/severity", (req, res) => {
    const { severity } = req.body;
    const { id } = req.params;

    db.run(
        "UPDATE tickets SET severity = ? WHERE id = ?",
        [severity, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Severity updated" });
        }
    );
});

app.listen(PORT, () => {
    console.log(`ResponseDesk running on port ${PORT}`);
});