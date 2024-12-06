import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import DataTable from "../../components/Table";
import BookedRoom from "../../components/user/BookedRoom";

const Userdashboard = () => {
  const { user, token } = useAuth();
  const [availableRooms, setAvailableRooms] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const response = await api.get("/show/rooms");
        setAvailableRooms(response.data.availableRooms);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user, token]);

  const TableHead = [
    {
      name: "Room Type",
    },
    {
      name: "Room Price",
    },
    {
      name: "Room Status",
    },
    {
      name: "Action",
    },
  ];

  return (
    <div className="max-h-full w-full overflow-auto bg-white p-10 flex flex-col gap-4">
      <BookedRoom />
      <input type="text" placeholder="Search room" />
      <main className="max-w-full h-full">
        <DataTable TableHead={TableHead} TableData={availableRooms} />
      </main>
    </div>
  );
};

export default Userdashboard;
