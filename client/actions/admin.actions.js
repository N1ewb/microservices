import { api } from "../src/lib/api";

export async function addRoom(formvalues) {
  const response = await api.post(`add/room/`, formvalues, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.status !== 500 || response.status !== 404) {
    return response.data;
  }
}
