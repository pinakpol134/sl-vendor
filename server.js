const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE = "./orders.json";

// ----------------------
// LOAD DATABASE
// ----------------------
function loadOrders() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, "[]");
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}

// ----------------------
// SAVE DATABASE
// ----------------------
function saveOrders(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ----------------------
// TEST ROUTE
// ----------------------
app.get("/ping", (req, res) => {
    res.send("PING OK");
});

// ----------------------
// CREATE ORDER
// ----------------------
app.post("/order", (req, res) => {

    console.log("ORDER RECEIVED:", req.body);

    let orders = loadOrders();

    orders.push({
        id: Date.now(),
        ticket: req.body.ticket,
        buyer: req.body.buyer,
        recipient: req.body.recipient,
        product: req.body.product,
        amount: req.body.amount,
        status: "PENDING",
        created_at: new Date().toISOString()
    });

    saveOrders(orders);

    res.send("OK");
});

// ----------------------
// GET ALL ORDERS
// ----------------------
app.get("/orders", (req, res) => {
    res.json(loadOrders());
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});