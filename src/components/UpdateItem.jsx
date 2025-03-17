import { useState, useEffect } from "react";
import '../App.css'

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors/`; 

const UpdateItem = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URI);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const handleEdit = (item) => {
    setSelectedItem(item);
    setUpdatedName(item.name);
    setUpdatedStatus(item.status);
  };

  const handleNameChange = (e) => {
    setUpdatedName(e.target.value);
  };

  const handleStatusChange = (e) => {
    setUpdatedStatus(e.target.value);
  };

  
  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`${API_URI}${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName, status: updatedStatus }),
      });
      if (!response.ok) throw new Error("Failed to update item");
      fetchItems(); 
      setSelectedItem(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Items</h2>
      <ul>
        {items.map((door) => (
          <li key={door.id}>
            {door.name} - {door.status}
            <button onClick={() => handleEdit(door)}>Edit</button>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <div>
          <h2>Update Item</h2>
          <input type="text" value={updatedName} onChange={handleNameChange} placeholder="Update Name" />
          <input type="text" value={updatedStatus} onChange={handleStatusChange} placeholder="Update Status" />
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}
    </div>
  );
};

export default UpdateItem;