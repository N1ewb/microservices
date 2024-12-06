const express = require("express");
const app = express();
const cors = require("cors");
const { rooms } = require("../StaticDatas");

app.use(cors());
app.use(express.json());

app.post("/rooms", (req, res) => {
  const { roomId, userId, date } = req.body;

  if(!req.body) return res.json({ message: `Invalid credentials` });

  let foundRoom = rooms.find((room) => {return room.id === roomId ? room : null})
  foundRoom = {...foundRoom, status: 'unavailable'}
  if(!foundRoom) return res.json({ message: `NO room with this ID` });

  res.json({ message: `Room ${foundRoom.type} booked for user ${userId} on ${date}` });
});


function Book() {
  const PORT = 4001;
  app.listen(PORT, () =>
    console.log(`Book Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Book };
