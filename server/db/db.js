const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(
      "./my_database.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          reject("Error opening database", err.message);
        } else {
          console.log("Connected to SQLite database");

          db.run(
            `CREATE TABLE IF NOT EXISTS Users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              role TEXT NOT NULL DEFAULT 'user'
            );`,
            (err) => {
              if (err) {
                reject("Error creating Users table", err.message);
              } else {
                console.log("Users table is ready.");
              }
            }
          );

          db.run(
            `CREATE TABLE IF NOT EXISTS Rooms (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              type TEXT NOT NULL,
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              price REAL NOT NULL,
              status TEXT NOT NULL DEFAULT 'available', 
              image_path TEXT NOT NULL
            );
            `,
            (err) => {
              if (err) {
                reject("Error creating Rooms table", err.message);
              } else {
                console.log("Rooms table is ready.");
                resolve(db);
              }
            }
          );

          db.run(
            `CREATE TABLE IF NOT EXISTS Payments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              reservation_id INTEGER NOT NULL, 
              amount REAL NOT NULL,
              payment_method TEXT NOT NULL,
              payment_status TEXT NOT NULL DEFAULT 'pending', 
              payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              card_number TEXT NOT NULL,
              expiry_date TEXT NOT NULL,
              cvv TEXT NOT NULL,
              cardholder_name TEXT NOT NULL,
              FOREIGN KEY (reservation_id) REFERENCES Reservations(id)
            );
            `,
            (err) => {
              if (err) {
                reject("Error creating Payments table", err.message);
              } else {
                console.log("Payments table is ready.");
              }
            }
          );

          db.run(
            `CREATE TABLE IF NOT EXISTS Reservations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              room_id INTEGER NOT NULL, 
              user_id INTEGER NOT NULL,
              reservation_status TEXT NOT NULL DEFAULT 'reserved', 
              reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              check_in_date TIMESTAMP NULL,
              check_out_date TIMESTAMP NULL,
              FOREIGN KEY (room_id) REFERENCES Rooms(id),
              FOREIGN KEY (user_id) REFERENCES Users(id)
            );
            `,
            (err) => {
              if (err) {
                reject("Error creating BookingsHistory table", err.message);
              } else {
                console.log("Reservation table is ready.");
                resolve(db);
              }
            }
          );
          db.run(
            `CREATE TABLE IF NOT EXISTS BookingsHistory (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              room_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,
              booked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              payment_id INTEGER NOT NULL,
              reservation_id INTEGER NOT NULL,
              FOREIGN KEY (room_id) REFERENCES Rooms(id),
              FOREIGN KEY (user_id) REFERENCES Users(id),
              FOREIGN KEY (payment_id) REFERENCES Payments(id)
              FOREIGN KEY (reservation_id) REFERENCES Reservations(id)
            );`,
            (err) => {
              if (err) {
                reject("Error creating BookingsHistory table", err.message);
              } else {
                console.log("BookingsHistory table is ready.");
                resolve(db);
              }
            }
          );
        }
      }
    );
  });
};

const addUser = (
  db,
  first_name,
  last_name,
  username,
  password,
  role = "user"
) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Users (first_name, last_name, username, password, role)
      VALUES (?, ?, ?, ?, ?);
    `;

    db.run(
      query,
      [first_name, last_name, username, password, role],
      function (err) {
        if (err) {
          reject("Error inserting user", err.message);
        } else {
          console.log(`User added with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      }
    );
  });
};

const loginUser = (db, username, password) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Users WHERE username = ?`;

    db.get(query, [username], async (err, user) => {
      if (err) {
        return reject("Error fetching user", err.message);
      }

      if (!user) {
        return reject("User not found");
      }

      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return reject("Invalid password");
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );

        resolve({ user, token });
      } catch (error) {
        reject("Error during password comparison", error.message);
      }
    });
  });
};

const addRoom = (db, name, description, type, price, status, image_path) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Rooms (name, description, type, price, status, image_path)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.run(
      query,
      [name, description, type, price, status, image_path],
      function (err) {
        if (err) {
          reject("Error inserting room", err.message);
        } else {
          console.log(`Room added with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      }
    );
  });
};

const getRooms = (db) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Rooms`;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject("Error fetching rooms", err.message);
      } else {
        resolve(rows);
      }
    });
  });
};

const getRoomById = (db, roomId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Rooms WHERE id = ?`;

    db.get(query, [roomId], (err, row) => {
      if (err) {
        reject("Error fetching room by ID", err.message);
      } else {
        resolve(row);
      }
    });
  });
};

const getRoomsByStatus = (db, status) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Rooms WHERE status = ?`;

    db.all(query, [status], (err, rows) => {
      if (err) {
        reject("Error fetching rooms", err.message);
      } else {
        resolve(rows);
      }
    });
  });
};

const getRoomsByTypeAndPrice = (db, type, minPrice, maxPrice) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Rooms WHERE type = ? AND price BETWEEN ? AND ?`;

    db.all(query, [type, minPrice, maxPrice], (err, rows) => {
      if (err) {
        reject("Error fetching rooms", err.message);
      } else {
        resolve(rows);
      }
    });
  });
};

const reserveRoom = (db, room_id, user_id) => {
  return new Promise((resolve, reject) => {
    const checkRoomQuery = `SELECT * FROM Rooms WHERE id = ? AND status = 'available'`;
    db.get(checkRoomQuery, [room_id], (err, room) => {
      if (err) {
        return reject("Error checking room availability: " + err.message);
      }

      if (!room) {
        return reject(
          "Room is either already reserved, occupied, or does not exist."
        );
      }

      const reserveRoomQuery = `
        INSERT INTO Reservations (room_id, user_id, status)
        VALUES (?, ?, 'reserved');
      `;
      db.run(reserveRoomQuery, [room_id, user_id], function (err) {
        if (err) {
          return reject("Error creating reservation: " + err.message);
        }

        const updateRoomStatusQuery = `
          UPDATE Rooms
          SET status = 'reserved'
          WHERE id = ?;
        `;
        db.run(updateRoomStatusQuery, [room_id], (err) => {
          if (err) {
            return reject("Error updating room status: " + err.message);
          }

          resolve({
            message: "Room successfully reserved.",
            reservation_id: this.lastID,
            room_id,
            user_id,
          });
        });
      });
    });
  });
};

const getBookedRoomsByUser = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM Rooms
      WHERE status = 'booked' AND booked_by = ?;
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject("Error fetching booked rooms", err.message);
      } else {
        resolve(rows);
      }
    });
  });
};

const addPayment = (
  db,
  userId,
  amount,
  paymentMethod,
  cardNumber,
  expiryDate,
  cvv,
  cardholderName
) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Payments (user_id, amount, payment_method, card_number, expiry_date, cvv, cardholder_name, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed');
    `;

    db.run(
      query,
      [
        userId,
        amount,
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
      ],
      function (err) {
        if (err) {
          return reject({
            message: "Error inserting payment",
            error: err.message,
            status: 500,
          });
        }

        resolve({
          id: this.lastID,
          user_id: userId,
          amount,
          payment_method: paymentMethod,
          card_number: cardNumber,
          expiry_date: expiryDate,
          cvv,
          cardholder_name: cardholderName,
          payment_status: "completed",
        });
      }
    );
  });
};

const addBookingHistory = (db, roomId, userId, paymentId, reservationId) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO BookingsHistory (room_id, user_id, payment_id, reservation_id)
      VALUES (?, ?, ?, ?);
    `;

    db.run(query, [roomId, userId, paymentId, reservationId], function (err) {
      if (err) {
        return reject("Error inserting booking history: " + err.message);
      }

      resolve({
        id: this.lastID,
        room_id: roomId,
        user_id: userId,
        payment_id: paymentId,
        reservation_id: reservationId,
      });
    });
  });
};

const getPayments = (db) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM payments`;

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getPaymentById = (db, paymentId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM payments WHERE id = ?`;

    db.get(query, [paymentId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const getPaymentsByUserId = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM payments WHERE user_id = ?`;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const checkIn = (db, reservationId) => {
  return new Promise((resolve, reject) => {
    const updateQuery = `UPDATE Reservations SET status = 'booked', checkin_time = ? WHERE id = ?`;

    const currentTime = new Date().toISOString();

    db.run(updateQuery, [currentTime, reservationId], function (err) {
      if (err) {
        reject("Error checking in reservation", err.message);
      } else if (this.changes === 0) {
        reject("No reservation found with the given ID");
      } else {
        resolve("Reservation checked in successfully");
      }
    });
  });
};

const checkout = (
  db,
  roomId,
  userId,
  paymentMethod,
  amount,
  cardNumber,
  expiryDate,
  cvv,
  cardholderName
) => {
  return new Promise((resolve, reject) => {
    const checkRoomQuery = `
      SELECT * FROM Rooms WHERE id = ? AND status = 'booked';
    `;

    db.get(checkRoomQuery, [roomId], (err, room) => {
      if (err) {
        return reject({
          message: "Error checking room booking status",
          error: err.message,
          status: 500,
        });
      }

      if (!room || room.status !== "booked") {
        return reject({
          message: "Room is not booked or is already available.",
          status: 400,
        });
      }

      const fetchReservationQuery = `
        SELECT id FROM Reservations WHERE room_id = ? AND user_id = ?;
      `;

      db.get(fetchReservationQuery, [roomId, userId], (err, reservation) => {
        if (err) {
          return reject({
            message: "Error fetching reservation details",
            error: err.message,
            status: 500,
          });
        }

        if (!reservation) {
          return reject({
            message: "No reservation found for this room and user.",
            status: 404,
          });
        }

        addPayment(
          db,
          userId,
          amount,
          paymentMethod,
          cardNumber,
          expiryDate,
          cvv,
          cardholderName
        )
          .then((paymentResponse) => {
            const updateRoomQuery = `
              UPDATE Rooms SET status = 'available' WHERE id = ?;
            `;

            db.run(updateRoomQuery, [roomId], (err) => {
              if (err) {
                return reject({
                  message: "Error updating room status",
                  error: err.message,
                  status: 500,
                });
              }

              const updateReservationQuery = `
                UPDATE Reservations
                SET status = 'checkedout'
                WHERE id = ?;
              `;

              db.run(updateReservationQuery, [reservation.id], (err) => {
                if (err) {
                  return reject({
                    message: "Error updating reservation status",
                    error: err.message,
                    status: 500,
                  });
                }

                const bookingHistoryQuery = `
                  INSERT INTO BookingsHistory (room_id, user_id, payment_id, reservation_id)
                  VALUES (?, ?, ?, ?);
                `;

                db.run(
                  bookingHistoryQuery,
                  [roomId, userId, paymentResponse.id, reservation.id],
                  function (err) {
                    if (err) {
                      return reject({
                        message: "Error recording booking history",
                        error: err.message,
                        status: 500,
                      });
                    }

                    resolve({
                      message: "Checkout successful.",
                      data: {
                        paymentId: paymentResponse.id,
                        reservationId: reservation.id,
                        roomId,
                        userId,
                        amount,
                        paymentMethod,
                        cardNumber: paymentResponse.card_number,
                        expiryDate: paymentResponse.expiry_date,
                        cvv: paymentResponse.cvv,
                        cardholderName: paymentResponse.cardholder_name,
                      },
                      status: 200,
                    });
                  }
                );
              });
            });
          })
          .catch((paymentError) => {
            return reject(paymentError);
          });
      });
    });
  });
};

const getReservations = (db) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Reservations`;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject("Error fetching reservations", err.message);
      } else {
        resolve(rows);
      }
    });
  });
};
const getReservationsByUserId = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        Reservations.id AS reservation_id,   
        Reservations.*,                      
        Rooms.*                               
      FROM Reservations
      INNER JOIN Rooms ON Reservations.room_id = Rooms.id
      WHERE Reservations.user_id = ? 
        AND Reservations.status != 'checkedout';
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error("Query error:", err);
        reject("Error fetching reservations by user ID: " + err.message);
      } else {
        resolve(rows);
      }
    });
  });
};

const getReservationById = (db, reservationId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Reservations WHERE id = ?`;

    db.get(query, [reservationId], (err, row) => {
      if (err) {
        reject("Error fetching reservation by ID", err.message);
      } else {
        resolve(row);
      }
    });
  });
};

const updateReservationStatus = (db, reservationId, newStatus) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Reservations
      SET status = ?
      WHERE id = ?;
    `;
    db.run(query, [newStatus, reservationId], function (err) {
      if (err) {
        reject("Error updating reservation status", err.message);
      } else {
        resolve({ reservation_id: reservationId, status: newStatus });
      }
    });
  });
};

const updateRoomStatus = (db, roomId, newStatus) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Rooms
      SET status = ?
      WHERE id = ?;
    `;
    db.run(query, [newStatus, roomId], function (err) {
      if (err) {
        reject("Error updating room status", err.message);
      } else {
        resolve({ room_id: roomId, status: newStatus });
      }
    });
  });
};

const getBookingHistory = (db) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        bh.*, 
        r.* AS reservation, 
        p.* AS payment, 
        rm.* AS room
      FROM BookingsHistory bh
      LEFT JOIN reservation r ON bh.reservation_id = r.id
      LEFT JOIN payment p ON bh.payment_id = p.id
      LEFT JOIN room rm ON bh.room_id = rm.id;
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        return reject({
          message: "Error fetching booking history",
          error: err.message,
          status: 500,
        });
      }

      const formattedData = rows.map((row) => {
        const { reservation, payment, room, ...booking } = row;
        return {
          ...booking,
          reservation: reservation ? JSON.parse(reservation) : null,
          payment: payment ? JSON.parse(payment) : null,
          room: room ? JSON.parse(room) : null,
        };
      });

      resolve({
        message: "Booking history fetched successfully.",
        data: formattedData,
        status: 200,
      });
    });
  });
};

const getBookingHistoryById = (db, id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        bh.*, 
        r.* AS reservation, 
        p.* AS payment, 
        rm.* AS room
      FROM BookingsHistory bh
      LEFT JOIN reservation r ON bh.reservation_id = r.id
      LEFT JOIN payment p ON bh.payment_id = p.id
      LEFT JOIN room rm ON bh.room_id = rm.id
      WHERE bh.id = ?;
    `;

    db.get(query, [id], (err, row) => {
      if (err) {
        return reject({
          message: `Error fetching booking history with ID ${id}`,
          error: err.message,
          status: 500,
        });
      }

      if (!row) {
        return reject({
          message: `No booking history found with ID ${id}`,
          status: 404,
        });
      }

      const { reservation, payment, room, ...booking } = row;
      const formattedData = {
        ...booking,
        reservation: reservation ? JSON.parse(reservation) : null,
        payment: payment ? JSON.parse(payment) : null,
        room: room ? JSON.parse(room) : null,
      };

      resolve({
        message: "Booking history fetched successfully.",
        data: formattedData,
        status: 200,
      });
    });
  });
};

const getBookingHistoryByUserId = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        bh.*, 
        r.*, 
        p.*, 
        rm.* 
      FROM BookingsHistory bh
      LEFT JOIN reservations r ON bh.reservation_id = r.id
      LEFT JOIN payments p ON bh.payment_id = p.id
      LEFT JOIN rooms rm ON bh.room_id = rm.id
      WHERE bh.user_id = ?;
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error("SQL Error: ", err);
        return reject({
          message: `Error fetching booking history for user ID ${userId}`,
          error: err.message,
          status: 500,
        });
      }

      if (rows.length === 0) {
        return reject({
          message: `No booking history found for user ID ${userId}`,
          status: 404,
        });
      }

      const formattedData = rows.map((row) => {
        const {
          reservation_id,
          payment_id,
          room_id,
          user_id,
          reservation_status,
          reservation_date,
          date,
          check_in_date,
          check_out_date,
          amount,
          payment_method,
          payment_status,
          payment_date,
          type,
          name,
          description,
          price,
          image_path,
          card_number,
          expiry_date,
          cvv,
          cardholder_name,

        } = row;
        console.log(row)

        return {
          id: reservation_id,
          user_id,
          reservation_status,
          reservation: {
            id: reservation_id,
            name: name || null,
            status: reservation_status || null,
            reservation_date: reservation_date || null,
          },
          payment: {
            id: payment_id,
            amount,
            method: payment_method || null,
            status: payment_status || null,
            date: payment_date || null,
            card_details: {
              card_number,
              expiry_date,
              cvv,
              cardholder_name,
            },
          },
          room: {
            id: room_id,
            name: name || null,
            type: type || null,
            price: price || null,
            image_path: image_path || null,
            description: description || null
          },
          booking_details: {
            description,
            price,
            booked_by: user_id,
            reservation_date: date,
            check_in_date,
            check_out_date,
          },
        };
      });

      resolve({
        data: formattedData,
      });
    });
  });
};

module.exports = {
  initializeDatabase,
  addUser,
  loginUser,
  addRoom,
  getRooms,
  getRoomById,
  getRoomsByStatus,
  getRoomsByTypeAndPrice,
  reserveRoom,
  getBookedRoomsByUser,
  addPayment,
  addBookingHistory,
  getPaymentById,
  getPayments,
  getPaymentsByUserId,
  checkIn,
  checkout,
  getReservations,
  getReservationById,
  getReservationsByUserId,
  updateReservationStatus,
  updateRoomStatus,
  getBookingHistory,
  getBookingHistoryById,
  getBookingHistoryByUserId,
};
