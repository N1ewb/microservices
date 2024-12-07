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
              status TEXT NOT NULL,
              image_path TEXT NOT NULL,
              booked_by INTEGER NULL
            );`,
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
              user_id INTEGER NOT NULL,
              amount REAL NOT NULL,
              payment_method TEXT NOT NULL,
              payment_status TEXT NOT NULL,
              payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES Users(id)
            );`,
            (err) => {
              if (err) {
                reject("Error creating Payments table", err.message);
              } else {
                console.log("Payments table is ready.");
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
              FOREIGN KEY (room_id) REFERENCES Rooms(id),
              FOREIGN KEY (user_id) REFERENCES Users(id),
              FOREIGN KEY (payment_id) REFERENCES Payments(id)
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

const bookRoom = (db, room_id, user_id) => {
  return new Promise((resolve, reject) => {
    //
    const checkRoomQuery = `SELECT * FROM Rooms WHERE id = ? AND status != 'booked'`;
    db.get(checkRoomQuery, [room_id], (err, room) => {
      if (err) {
        return reject("Error checking room availability", err.message);
      }

      if (!room) {
        return reject("Room is either already booked or does not exist");
      }

      const bookRoomQuery = `
        UPDATE Rooms
        SET status = 'booked', booked_by = ?
        WHERE id = ?;
      `;

      db.run(bookRoomQuery, [user_id, room_id], function (err) {
        if (err) {
          return reject("Error booking room", err.message);
        }

        resolve({ message: "Room successfully booked", room_id, user_id });
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

const addPayment = (db, userId, amount, paymentMethod) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Payments (user_id, amount, payment_method, payment_status)
      VALUES (?, ?, ?, 'completed');
    `;

    db.run(query, [userId, amount, paymentMethod], function (err) {
      if (err) {
        return reject("Error inserting payment", err.message);
      }

      resolve({
        id: this.lastID,
        user_id: userId,
        amount,
        payment_method: paymentMethod,
        payment_status: "completed",
      });
    });
  });
};

const addBookingHistory = (db, roomId, userId, paymentId) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO BookingsHistory (room_id, user_id, payment_id)
      VALUES (?, ?, ?);
    `;

    db.run(query, [roomId, userId, paymentId], function (err) {
      if (err) {
        return reject("Error inserting booking history", err.message);
      }

      resolve({
        id: this.lastID,
        room_id: roomId,
        user_id: userId,
        payment_id: paymentId,
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

module.exports = {
  initializeDatabase,
  addUser,
  loginUser,
  addRoom,
  getRooms,
  getRoomsByStatus,
  getRoomsByTypeAndPrice,
  bookRoom,
  getBookedRoomsByUser,
  addPayment,
  addBookingHistory,
  getPaymentById,
  getPayments,
  getPaymentsByUserId
};
