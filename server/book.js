const express = require("express");
const app = express();
const cors = require("cors");
// const { rooms } = require("./StaticDatas");

app.use(cors());
app.use(express.json());

app.post("/room", (req, res) => {
  const { roomId, userId, date } = req.body;
  // Booking logic here...
  res.json({ message: `Room ${roomId} booked for user ${userId} on ${date}` });
});

function Book() {
  const PORT = 4001;
  app.listen(PORT, () =>
    console.log(`Book Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Book };
