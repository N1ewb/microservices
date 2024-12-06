const express = require("express");
const app = express();
const cors = require("cors");
const { initializeDatabase, getRooms } = require("../db/db");

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

app.get("/rooms", (req, res) => {
  getRooms(db)
    .then((rooms) => {
      res.json({ availableRooms: rooms });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch rooms", message: err });
    });
});

app.get("/rooms/status/:status", (req, res) => {
  const { status } = req.params;
  getRoomsByStatus(db, status)
    .then((rooms) => {
      res.json({ availableRooms: rooms });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Failed to fetch rooms by status", message: err });
    });
});

function Room() {
  const PORT = 4003;
  app.listen(PORT, () =>
    console.log(`Show Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Room };
