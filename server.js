const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE = "./orders.json";

const PAYEE = "d4c90b9d-58ca-4b07-8a54-fd30cd4c3281";

// -------------------- EMAIL SETUP --------------------
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "pinakpol134@gmail.com",
        pass: "xhkc cvkc oxfl lbcx"
    }
});

// -------------------- DB FUNCTIONS --------------------
function loadOrders() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, "[]");
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveOrders(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// -------------------- ROUTES --------------------

// test
app.get("/ping", (req, res) => {
    res.send("PING OK");
});

// admin dashboard
app.get("/admin", (req, res) => {
    let orders = loadOrders();

    let html = `<h2>Vendor Orders</h2><table border="1" cellpadding="5">
    <tr>
        <th>ID</th><th>Ticket</th><th>Buyer</th><th>Recipient</th>
        <th>Product</th><th>Amount</th><th>Status</th><th>Time</th>
    </tr>`;

    orders.reverse().forEach(o => {
        html += `
        <tr>
            <td>${o.id}</td>
            <td>${o.ticket}</td>
            <td>${o.buyer}</td>
            <td>${o.recipient}</td>
            <td>${o.product}</td>
            <td>L$${o.amount}</td>
            <td>${o.status}</td>
            <td>${o.created_at}</td>
        </tr>`;
    });

    html += "</table>";
    res.send(html);
});

// create order
app.post("/order", (req, res) => {

    console.log("ORDER RECEIVED:", req.body);

    let orders = loadOrders();

    const newOrder = {
        id: Date.now(),
        ticket: req.body.ticket,
        buyer: req.body.buyer,
        recipient: req.body.recipient,
        product: req.body.product,
        amount: req.body.amount,
        status: "PENDING",
        payee: PAYEE,
        created_at: new Date().toISOString()
    };

    orders.push(newOrder);
    saveOrders(orders);

    // ---------------- EMAIL NOTIFICATION (STEP B) ----------------
    transporter.sendMail({
        from: "SL Vendor System",
        to: "YOUR_EMAIL@gmail.com",
        subject: "🛒 New Second Life Order",
        text: `
New Order Received:

Ticket: ${newOrder.ticket}
Buyer: ${newOrder.buyer}
Recipient: ${newOrder.recipient}
Product: ${newOrder.product}
Amount: L$${newOrder.amount}
Payee: ${PAYEE}
`
    });

    res.send("OK");
});

// get orders
app.get("/orders", (req, res) => {
    res.json(loadOrders());
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});