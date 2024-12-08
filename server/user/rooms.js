const express = require("express");
const app = express();
const cors = require("cors");
const {
  initializeDatabase,
  getRooms,
  getRoomById,
  getRoomsByStatus,
} = require("../db/db");

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
      res.json({
        status: "success",
        message: "Rooms fetched successfully",
          rooms ,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch rooms",
        error: err ,
      });
    });
});

app.get("/status/:status", (req, res) => {
  const { status } = req.params;
  getRoomsByStatus(db, status)
    .then((rooms) => {
      res.json({
        status: "success",
        message: `Rooms with status ${status} fetched successfully`,
        rooms ,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch rooms by status",
        error: err ,
      });
    });
});

app.get("/rooms/:id", (req, res) => {
  const { id } = req.params;
  getRoomById(db, Number(id))
    .then((room) => {
      if (room) {
        res.json({
          status: "success",
          message: "Room fetched successfully",
          room ,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Room not found",
          data: {},
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch room by ID",
        data: { error: err },
      });
    });
});

function Room() {
  const PORT = 4003;
  app.listen(PORT, () =>
    console.log(`Show Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Room };
