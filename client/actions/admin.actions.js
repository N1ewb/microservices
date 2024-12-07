import toast from "react-hot-toast";
import { api } from "../src/lib/api";

export async function addRoom(formvalues) {
  const response = await api.post(`http://localhost:4004/room/`, formvalues, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.status !== 500 || response.status !== 404) {
    return response.data;
  }
}
