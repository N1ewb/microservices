require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { Room } = require("./rooms");
const { Book } = require("./book");
const { mockUsers } = require("./StaticDatas");

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

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate request
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find user
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Token expiry
    }
  );

  // Return token
  res.json({ token });
});

// Proxy Setup
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

app.get("/health", (req, res) =>
  res.status(200).json({ status: "API Gateway is running" })
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));

//BOOK ROOMS
Book();
//SHOW ROOMS
Room();
