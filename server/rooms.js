const express = require("express");
const app = express();
const cors = require("cors");
const { rooms } = require("./StaticDatas");

app.use(cors());
app.use(express.json());

// Endpoint to get available rooms
app.get("/rooms", (req, res) => {
  res.json({ availableRooms: rooms });
});

function Room() {
  const PORT = 4003;
  app.listen(PORT, () =>
    console.log(`Show Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Room };
