const express = require("express");
const app = express();
const cors = require("cors");
const { initializeDatabase, addPayment, getPaymentById, getPaymentsByUserId, getPayments } = require("../db/db");

app.use(cors());
app.use(express.json());

let db;
initializeDatabase()
  .then((database) => {
    db = database;
    console.log("Database initialized successfully.");
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
  });

// Endpoint to create a payment
app.post("/payments", (req, res) => {
  const { userId, amount, paymentMethod } = req.body;

  if (!userId || !amount || !paymentMethod) {
    return res.status(400).json({
      message: "Missing required fields: userId, amount, or paymentMethod",
      data: null,
      status: 400,
    });
  }

  addPayment(db, userId, amount, paymentMethod)
    .then((payment) => {
      res.status(201).json({
        message: "Payment created successfully",
        data: payment,
        status: 201,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to create payment",
        data: null,
        status: 500,
        error: err.message,
      });
    });
});

// Endpoint to get all payments
app.get("/payments", (req, res) => {
  getPayments(db)
    .then((payments) => {
      res.status(200).json({
        message: "Payments fetched successfully",
        data: payments,
        status: 200,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to fetch payments",
        data: null,
        status: 500,
        error: err.message,
      });
    });
});

// Endpoint to get payments by userId
app.get("/payments/user/:userId", (req, res) => {
  const { userId } = req.params;

  getPaymentsByUserId(db, userId)
    .then((payments) => {
      if (payments.length === 0) {
        return res.status(404).json({
          message: `No payments found for user with ID ${userId}`,
          data: null,
          status: 404,
        });
      }
      res.status(200).json({
        message: `Payments for user ${userId}`,
        data: payments,
        status: 200,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to fetch payments for the user",
        data: null,
        status: 500,
        error: err.message,
      });
    });
});

// Endpoint to get a payment by its ID
app.get("/payments/:paymentId", (req, res) => {
  const { paymentId } = req.params;

  getPaymentById(db, paymentId)
    .then((payment) => {
      if (!payment) {
        return res.status(404).json({
          message: `Payment with ID ${paymentId} not found`,
          data: null,
          status: 404,
        });
      }
      res.status(200).json({
        message: "Payment fetched successfully",
        data: payment,
        status: 200,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to fetch payment",
        data: null,
        status: 500,
        error: err.message,
      });
    });
});

function PaymentService() {
  const PORT = 4002;
  app.listen(PORT, () =>
    console.log(`Payment Service running on port ${PORT}`)
  );
}

module.exports = { PaymentService };
