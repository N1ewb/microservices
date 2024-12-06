import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import DataTable from "../../components/Table";
import AddRoomForm from "../../components/forms/AddRoomForm";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [formOpen, setFormOpen] = useState(false)
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
    <div className="max-h-full w-full overflow-auto bg-white p-10">
      <header className="w-full items-center py-5 justify-between">
        <input type="text" placeholder="Search room" />
        <button onClick={() => setFormOpen(true)} className="bg-blue-950 rounded-md px-10 py-2 text-white">Add room</button>
      </header>
      <main className="max-w-full h-full">
        <DataTable TableHead={TableHead} TableData={availableRooms}/>
        {formOpen && <AddRoomForm setFormOpen={setFormOpen} />}
      </main>
    </div>
  );
};

export default Dashboard;
