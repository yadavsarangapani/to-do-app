import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("new");

  // Add new goal
  const addItem = () => {
    if (task.trim() === "") return;
    setItems([...items, { id: Date.now(), text: task, status: "new" }]);
    setTask("");
  };

  // Save edited status
  const saveStatus = () => {
    if (!selectedId) return;
    setItems(
      items.map((item) =>
        item.id === parseInt(selectedId)
          ? { ...item, status: selectedStatus }
          : item
      )
    );
    setSelectedId("");
    setSelectedStatus("new");
  };

  // Delete a Pending item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Render items by status
  const renderList = (status) =>
    items
      .filter((item) => item.status === status)
      .map((item) => (
        <li
          key={item.id}
          className={`list-item ${status}`} // Add status class for color
        >
          {item.text}
          {/* Show delete emoji only on Pending */}
          {status === "pending" && (
            <span
              className="delete-icon"
              onClick={() => deleteItem(item.id)}
            >
              ❌
            </span>
          )}
        </li>
      ));

  return (
    <div className="container">
      <div className="todo-box">
        <h2>Bucket List - 2026</h2>

        {/* Add + Edit controls */}
        <div className="input-box">
          <input
            type="text"
            placeholder="Add new goal..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <button onClick={addItem}>Add</button>

          {/* Edit dropdowns */}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select goal to edit</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.text}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button onClick={saveStatus}>Save</button>
        </div>

        {/* Sections */}
        <div className="sections">
          <div>
            <h3>🆕 New</h3>
            <ul>{renderList("new")}</ul>
          </div>
          <div>
            <h3>⏳ Pending</h3>
            <ul>{renderList("pending")}</ul>
          </div>
          <div>
            <h3>✅ Completed</h3>
            <ul>{renderList("completed")}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
