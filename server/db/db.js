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
              price REAL NOT NULL,
              status TEXT NOT NULL,
              image_path TEXT NOT NULL
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
        }
      }
    );
  });
};

const addUser = (db, first_name, last_name, username, password, role = "user") => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Users (first_name, last_name, username, password, role)
      VALUES (?, ?, ?, ?, ?);
    `;

    db.run(query, [first_name, last_name, username, password, role], function (err) {
      if (err) {
        reject("Error inserting user", err.message);
      } else {
        console.log(`User added with ID: ${this.lastID}`);
        resolve(this.lastID); // Return the ID of the newly inserted user
      }
    });
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
          { id: user.id, username: user.username, role: user.role, first_name: user.first_name, last_name: user.last_name  }, 
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

const addRoom = (db, type, price, status, image_path) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Rooms (type, price, status, image_path)
      VALUES (?, ?, ?, ?);
    `;

    db.run(query, [type, price, status, image_path], function (err) {
      if (err) {
        reject("Error inserting room", err.message);
      } else {
        console.log(`Room added with ID: ${this.lastID}`);
        resolve(this.lastID); 
      }
    });
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



module.exports = { 
  initializeDatabase, 
  addUser, 
  loginUser, 
  addRoom, 
  getRooms,
  getRoomsByStatus,
  getRoomsByTypeAndPrice
};

