const express = require("express");
const db = require("./db");

const app = express();

// ======================
// MIDDLEWARE (IMPORTANT)
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// HOME TEST
// ======================
app.get("/", (req, res) => {
    res.send("Server running");
});

// ======================
// HEALTH CHECK
// ======================
app.get("/ping", (req, res) => {
    res.send("PING OK");
});

// ======================
// TEST DATABASE INSERT
// ======================
app.get("/test", (req, res) => {

    db.run(`
        INSERT INTO orders(ticket,buyer,recipient,product,amount,status,created_at)
        VALUES ('TKT-TEST','Browser User','Test Receiver','PolAra Bible',300,'PENDING',datetime('now'))
    `);

    res.send("TEST ORDER ADDED");
});

// ======================
// REAL ORDER ENDPOINT (POST)
// ======================
app.post("/order", (req, res) => {

    console.log("ORDER RECEIVED:", req.body);

    const { ticket, buyer, recipient, product, amount } = req.body;

    db.run(`
        INSERT INTO orders(ticket,buyer,recipient,product,amount,status,created_at)
        VALUES (?,?,?,?,?,'PENDING',datetime('now'))
    `,
    [ticket, buyer, recipient, product, amount],
    function(err) {
        if (err) {
            console.log("INSERT ERROR:", err);
            return res.send("DB INSERT ERROR");
        }

        console.log("INSERT SUCCESS, ID:", this.lastID);
        res.send("OK");
    });
});
// ======================
// VIEW ALL ORDERS
// ======================
app.get("/orders", (req, res) => {
    db.all("SELECT * FROM orders ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            console.log("DB ERROR:", err);
            return res.send("DB ERROR");
        }
        res.json(rows);
    });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});