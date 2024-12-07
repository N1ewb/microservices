const express = require("express");
const app = express();
const cors = require("cors");
const {
  initializeDatabase,
  bookRoom,
  getRooms,
  getBookedRoomsByUser,
  addPayment,
  addBookingHistory,
} = require("../db/db");

app.use(cors());
app.use(express.json());

app.post("/rooms", async (req, res) => {
  const { roomId, userId, date, paymentMethod, amount } = req.body;
  console.log(req.body)
  if (!roomId || !userId || !date || !paymentMethod || !amount) {
    return res
      .status(400)
      .json({
        message:
          "Missing required fields: roomId, userId, date, paymentMethod, or amount",
      });
  }

  try {
    const db = await initializeDatabase();

    const rooms = await getRooms(db);
    const foundRoom = rooms.find((room) => room.id === Number(roomId));  


    if (!foundRoom) {
      return res.status(404).json({ message: `No room with ID ${roomId}` });
    }

    if (foundRoom.status === "booked") {
      return res
        .status(400)
        .json({ message: `Room ${roomId} is already booked` });
    }

    const payment = await addPayment(db, userId, amount, paymentMethod);

    await bookRoom(db, roomId, userId);

    await addBookingHistory(db, roomId, userId, payment.id);

    return res.status(200).json({
      message: `Room ${foundRoom.type} booked for user ${userId} on ${date}`,
      room: { ...foundRoom, status: "booked", booked_by: userId },
      payment: payment,
    });
  } catch (error) {
    console.error("Error booking room:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/rooms/booked/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const db = await initializeDatabase();

    const bookedRooms = await getBookedRoomsByUser(db, userId);

    if (bookedRooms.length === 0) {
      return res.status(404).json({ message: "No rooms booked by this user" });
    }

    console.log(bookedRooms);
    return res.status(200).json({
      message: `Booked rooms for user ${userId}`,
      rooms: bookedRooms,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching booked rooms:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

function Book() {
  const PORT = 4001;
  app.listen(PORT, () =>
    console.log(`Book Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Book };
