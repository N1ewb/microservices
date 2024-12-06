const express = require("express");
const app = express();
const cors = require("cors");
const { addRoom, initializeDatabase } = require("../db/db");

app.use(cors());
app.use(express.json());

let db;
initializeDatabase()
  .then((database) => {
    db = database;
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
  });

app.post("/room", (req, res) => {
  const { type, price, status, image_path } = req.body;

  if (!type || !price || !status || !image_path) {
    return res.status(400).json({ message: "All fields are required" });
  }

  addRoom(db, type, price, status, image_path)
    .then((roomId) => {
      res.status(200).json({
        message: "Room added successfully",
        room: {
          id: roomId,
          type,
          price,
          status,
          image_path,
        },
        status: 200
      });
    })
    .catch((err) => {
      console.error("Error adding room:", err);
      res.status(500).json({ message: "Error adding room" });
    });
});

function AddRoom() {
  const PORT = 4004;
  app.listen(PORT, () =>
    console.log(`Add Rooms Service running on port ${PORT}`)
  );
}

module.exports = { AddRoom };
