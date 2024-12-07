require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { Room } = require("./user/rooms");
const { Book } = require("./user/book");
const { mockUsers } = require("./StaticDatas");
const { addUser, initializeDatabase, loginUser } = require("./db/db");
const { AddRoom } = require("./admin/addRoom");
const { PaymentService } = require("./user/pay");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Rate Limiting
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // Per second
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ message: "Too many requests" }));
});

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Token Required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user;
    next();
  });
};

app.post("/register", async (req, res) => {
  const { username, password, first_name, last_name } = req.body;

  if (!username || !password || !first_name || !last_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = await initializeDatabase();

    // Check if username exists in the database
    db.get(
      "SELECT * FROM Users WHERE username = ?",
      [username],
      async (err, existingUser) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error checking username", error: err.message });
        }

        if (existingUser) {
          return res.status(400).json({ message: "Username already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add user to the database
        addUser(db, first_name, last_name, username, hashedPassword)
          .then((userId) => {
            // Generate JWT token
            const token = jwt.sign(
              { id: userId, username },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            // Return success message and token
            res
              .status(201)
              .json({ message: "User registered successfully", token });
          })
          .catch((error) => {
            console.error("Error during registration:", error);
            res
              .status(500)
              .json({
                message: "Error during registration",
                error: error.message,
              });
          });
      }
    );
  } catch (err) {
    console.error("Error during registration:", err);
    res
      .status(500)
      .json({ message: "Error during registration", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const db = await initializeDatabase();
    loginUser(db, username, password)
      .then(({ user, token }) => {
        res.status(200).json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          token,
        });
      })
      .catch((error) => {
        console.error("Login error:", error);
        res.status(401).json({ message: "Invalid credentials" });
      });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

app.use(
  "/book",

  authenticateJWT,
  createProxyMiddleware({
    target: process.env.BOOK_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({
        message: "Proxy error occurred",
        error: err.message,
      });
    },
  })
);

app.use(
  "/pay",
  authenticateJWT,

  createProxyMiddleware({
    target: process.env.PAY_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({
        message: "Proxy error occurred",
        error: err.message,
      });
    },
  })
);

app.use(
  "/show",

  authenticateJWT,
  createProxyMiddleware({
    target: process.env.SHOW_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({
        message: "Proxy error occurred",
        error: err.message,
      });
    },
  })
);
app.use(
  "/add",
  authenticateJWT,
  createProxyMiddleware({
    target: process.env.SHOW_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({
        message: "Proxy error occurred",
        error: err.message,
      });
    },
  })
);

app.get("/health", (req, res) =>
  res.status(200).json({ status: "API Gateway is running" })
);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));


initializeDatabase();

//BOOK ROOMS
Book();
//SHOW ROOMS
Room();
//PAYMENTS
PaymentService()

//Admin
AddRoom()