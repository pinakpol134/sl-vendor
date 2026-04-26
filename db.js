const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./vendor.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket TEXT,
            buyer TEXT,
            recipient TEXT,
            product TEXT,
            amount INTEGER,
            status TEXT DEFAULT 'PENDING',
            created_at TEXT
        )
    `);
});

module.exports = db;