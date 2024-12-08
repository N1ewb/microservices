import toast from "react-hot-toast";
import { api } from "../src/lib/api";

export async function getRoomById(roomId) {
  const response = await api.get(`show/rooms/${roomId}`);
  if (response.status !== 500 || response.status !== 404) {
    return response.data;
  }
}

export async function getBookedRooms(user) {
  const response = await api.get(`rooms/booked/${user.id}`);
  if (response.status !== 500 || response.status !== 404) {
    return response.data;
  }
}
export async function getReservedRooms(user) {
  try {
    const response = await api.get(`rooms/reserved/${user.id}`);
    if (response.status !== 500 || response.status !== 404) {
      return response.data;
    }
  } catch (error) {
    console.log("Error in finding reservered rooms");
  }
}

export async function bookedRoom(formData) {
  try {
    const params = {
      ...formData,
      date: Date.now().toString(),
    };
    const response = await api.post("rooms/rooms", {
      ...params,
    });

    if (response.status !== 500 && response.status !== 404) {
      return response.data;
    } else {
      toast.error("Failed to book room: Server error.");
    }
  } catch (error) {
    toast.error("Error booking room:", error);
  }
}

export async function reserveRoom(formData) {
  try {
    const params = {
      ...formData,
      date: Date.now().toString(),
    };

    const response = await api.post("http://localhost:4001/reserve", {
      ...params,
    });

    if (response.status !== 500 && response.status !== 404) {
      return response.data;
    } else {
      throw new Error("Failed to reserve room: Server error.");
    }
  } catch (error) {
    console.error("Error reserving room:", error);
    throw error;
  }
}

export async function paymentRecords(userid) {
  try {
    const response = await api.get(`pay/payments/user/${userid}`);
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

export async function checkIn(reservation_id) {
  try {
    const response = await api.post(`rooms/checkin/${reservation_id}`);

    if (response.status !== 500 && response.status !== 404) {
      return response.data;
    } else {
      throw new Error("Failed to checkin: Server error.");
    }
  } catch (error) {
    console.error("Error checkig in:", error);
    throw error;
  }
}
export async function checkOut(formValues) {
  try {
    const response = await api.post(`http://localhost:4001/checkout`, {
      ...formValues,
    });

    if (response.status !== 500 && response.status !== 404) {
      return response.data;
    } else {
      throw new Error("Failed to checkin: Server error.");
    }
  } catch (error) {
    console.error("Error checkig in:", error);
    throw error;
  }
}

export async function getBookingHistory(userId) {
  try {
    const response = await api.get(
      `http://localhost:4001/bookings/user/${userId}`
    );

    if (response.status !== 500 && response.status !== 404) {
      return response.data.data;
    } else {
      throw new Error("Failed to checkin: Server error.");
    }
  } catch (error) {
    console.error("Error checkig in:", error);
    throw error;
  }
}
