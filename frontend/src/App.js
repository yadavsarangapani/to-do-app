import { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = "/api/yearplan";

function App() {
  const [task, setTask] = useState("");
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("new");

  // Load tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to load tasks: " + error.message);
    }
  };

  // Add new goal
  const addItem = async () => {
    if (task.trim() === "") return;
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task, status: "new" })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTask = await response.json();
      setItems([...items, newTask]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task: " + error.message);
    }
  };

  // Save edited status
  const saveStatus = async () => {
    if (!selectedId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: items.find(item => item.id === parseInt(selectedId))?.text, status: selectedStatus })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTask = await response.json();
      setItems(
        items.map((item) =>
          item.id === parseInt(selectedId) ? updatedTask : item
        )
      );
      setSelectedId("");
      setSelectedStatus("new");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task: " + error.message);
    }
  };

  // Delete a task
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task: " + error.message);
    }
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
