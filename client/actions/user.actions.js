import { api } from "../src/lib/api";

export async function getBookedRooms(user) {
  const response = await api.get(
    `http://localhost:4001/rooms/booked/${user.id}`
  );
  if (response.status !== 500 || response.status !== 404) {
    return response.data.rooms;
  }
}
export async function bookedRoom(formData) {
  try {
    const params = {
      ...formData,
      date: Date.now().toString(),
    }
    const response = await api.post("http://localhost:4001/rooms", {
      ...params
    });

    if (response.status !== 500 && response.status !== 404) {
      return response.data;
    } else {
      throw new Error("Failed to book room: Server error.");
    }
  } catch (error) {
    console.error("Error booking room:", error);
    throw error;
  }
}
export async function paymentRecords(userid) {
  try {

    const response = await api.get(`http://localhost:4002/payments/user/${userid}`);
    if (response.status !== 500 && response.status !== 404) {
      return response.data;
    } else {
      throw new Error("Failed to get payment records: Server error.");
    }
  } catch (error) {
    console.error("Error retreiving records:", error);
    throw error;
  }
}
