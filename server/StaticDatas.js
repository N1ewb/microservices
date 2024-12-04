const rooms = [
  { id: 1, type: "Single", price: 100, status: "available" },
  { id: 2, type: "Double", price: 150, status: "available" },
  { id: 3, type: "Suite", price: 300, status: "available" },
];

const mockUsers = [
  { id: 1, username: "admin", password: "admin123" },
  { id: 2, username: "user2", password: "password2" },
];

module.exports = { rooms, mockUsers };
