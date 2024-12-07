const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { addRoom, initializeDatabase } = require("../db/db");

const app = express();

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../room_images");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/room", upload.single("image"), (req, res) => {
  const { type, price, status, name, description } = req.body;

  if (!req.file || !type || !price || !status || !name || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const image_path = `/room_images/${req.file.filename}`;

  addRoom(db, name, description, type, price, status, image_path)
    .then((roomId) => {
      res.status(200).json({
        message: "Room added successfully",
        room: {
          id: roomId,
          name,
          description,
          type,
          price,
          status,
          image_path,
        },
        status: 200,
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
