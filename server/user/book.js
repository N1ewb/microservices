const express = require("express");
const app = express();
const cors = require("cors");
const {
  initializeDatabase,
  reserveRoom,
  getRooms,
  getBookedRoomsByUser,
  getReservationsByUserId,
  getReservationById,
  updateRoomStatus,
  updateReservationStatus,
  checkout,
  getBookingHistory,
  getBookingHistoryByUserId,
  getBookingHistoryById,
} = require("../db/db");

app.use(cors());
app.use(express.json());

app.post("/reserve", async (req, res) => {
  const { roomId, userId, date } = req.body;

  if (!roomId || !userId || !date) {
    return res.status(400).json({
      message: "Missing required fields: roomId, userId, or date.",
      status:400
    });
  }

  try {
    const db = await initializeDatabase();

    const rooms = await getRooms(db);
    const foundRoom = rooms.find((room) => room.id === Number(roomId));

    if (!foundRoom) {
      return res.status(404).json({ message: `No room with ID ${roomId}` });
    }

    if (foundRoom.status !== "available") {
      return res
        .status(400)
        .json({ message: `Room ${roomId} is not available for reservation.`, status: 404 });
    }

    const reservation = await reserveRoom(db, roomId, userId);

    return res.status(200).json({
      message: `Room ${foundRoom.type} successfully reserved for user ${userId}.`,
      reservation: {
        reservation_id: reservation.reservation_id,
        room_id: roomId,
        user_id: userId,
        date,
        reservation_status: "reserved",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error reserving room:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/booked/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const db = await initializeDatabase();

    const bookedRooms = await getBookedRoomsByUser(db, userId);

    if (bookedRooms.length === 0) {
      return res.status(404).json({ message: "No rooms booked by this user", status: 404 });
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

app.get("/reserved/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const db = await initializeDatabase();

    const reservedRooms = await getReservationsByUserId(db, userId);

    if (reservedRooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms booked by this user", status: 404 });
    }

    console.log(reservedRooms);
    return res.status(200).json({
      message: `Booked rooms for user ${userId}`,
      rooms: reservedRooms,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching booked rooms:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/checkin/:reservationId", async (req, res) => {
  const { reservationId } = req.params;

  if (!reservationId) {
    return res.status(400).json({ message: "Missing reservationId" });
  }

  try {
    const db = await initializeDatabase();

    const reservation = await getReservationById(db, reservationId);

    if (!reservation) {
      return res
        .status(404)
        .json({ message: `Reservation with ID ${reservationId} not found` });
    }

    if (reservation.reservation_status === "booked") {
      return res.status(400).json({
        message: `Reservation with ID ${reservationId} is already booked.`,
      });
    }
    console.log("AS")
    const updatedReservation = await updateReservationStatus(
      db,
      reservationId,
      "booked"
    );
    console.log("DS")
    await updateRoomStatus(db, reservation.room_id, "booked");

    return res.status(200).json({
      message: `Reservation with ID ${reservationId} successfully checked in.`,
      reservation: updatedReservation,
      status: 200,
    });
  } catch (error) {
    console.error("Error checking in reservation:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/checkout", async (req, res) => {
  const {
    roomId,
    userId,
    paymentMethod,
    amount,
    cardNumber,
    expiryDate,
    cvv,
    cardholderName,
  } = req.body;

  if (
    !roomId ||
    !userId ||
    !paymentMethod ||
    !amount ||
    !cardNumber ||
    !expiryDate ||
    !cvv ||
    !cardholderName
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: roomId, userId, paymentMethod, amount, cardNumber, expiryDate, cvv, or cardholderName.",
      status: 400,
    });
  }

  try {
    const db = await initializeDatabase();
    checkout(
      db,
      roomId,
      userId,
      paymentMethod,
      amount,
      cardNumber,
      expiryDate,
      cvv,
      cardholderName
    )
      .then((response) => {
        return res.status(response.status).json(response);
      })
      .catch((err) => {
        return res.status(err.status || 500).json(err);
      });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const db = await initializeDatabase();

    const bookingHistory = await getBookingHistory(db);

    if (bookingHistory.length === 0) {
      return res.status(404).json({ message: "No booking history found." });
    }

    return res.status(200).json({
      message: "Booking history fetched successfully.",
      history: bookingHistory,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
});

app.get("/bookings/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Missing booking ID." });
  }

  try {
    const db = await initializeDatabase();

    const booking = await getBookingHistoryById(db, id);

    if (!booking) {
      return res
        .status(404)
        .json({ message: `No booking found with ID ${id}.` });
    }

    return res.status(200).json({
      message: "Booking history fetched successfully.",
      booking,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching booking history by ID:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
});

app.get("/bookings/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "Missing user ID.",
      bookings: [],
      status: 400,
    });
  }

  try {
    const db = await initializeDatabase();

    const data = await getBookingHistoryByUserId(db, userId);

    if (data.length === 0) {
      return res.status(404).json({
        message: `No bookings found for user with ID ${userId}.`,
        bookings: [],
        status: 404,
      });
    }

    // Return data as an array
    return res.status(200).json({
      message: `Bookings fetched successfully for user ID ${userId}.`,
      data,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching booking history by user ID:", error);
    return res.status(500).json({
      message: "Internal server error",
      bookings: [],
      error: error.message,
      status: 500,
    });
  }
});

function Book() {
  const PORT = 4001;
  app.listen(PORT, () =>
    console.log(`Book Rooms Service running on port ${PORT}`)
  );
}

module.exports = { Book };
