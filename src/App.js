import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State variables
  const [task, setTask] = useState(""); // For the input field
  const [tasks, setTasks] = useState(() => {
    // Retrieve tasks from localStorage or initialize as empty
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filterBy, setFilterBy] = useState("all"); // For filtering tasks
  const [sortBy, setSortBy] = useState("date"); // For sorting tasks
  const [editing, setEditing] = useState(null); // For editing mode
  const [editText, setEditText] = useState(""); // For edit input field

  // Persist tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return; // Prevent empty tasks
    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setTask(""); // Clear the input
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Start editing a task
  const startEditing = (id, currentText) => {
    setEditing(id);
    setEditText(currentText);
  };

  // Save the edited task
  const saveTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === editing ? { ...t, text: editText } : t
      )
    );
    setEditing(null);
    setEditText("");
  };

  // Filtering tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterBy === "completed") return t.completed;
    if (filterBy === "pending") return !t.completed;
    return true; // "all"
  });

  // Sorting tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "status") {
      return a.completed - b.completed; // Completed tasks go last
    }
    return new Date(a.createdAt) - new Date(b.createdAt); // Older tasks first
  });

  return (
    <div className="app">
      <h1>To-Do App</h1>

      {/* Add Task */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Filters and Sorters */}
      <div className="filters">
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {sortedTasks.map((t) => (
          <li key={t.id} className={`task-item ${t.completed ? "completed" : ""}`}>
            {/* Display task or edit input */}
            {editing === t.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveTask(t.id)}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{t.text}</span>
                <button onClick={() => toggleTaskCompletion(t.id)}>
                  {t.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => startEditing(t.id, t.text)}>Edit</button>
                <button onClick={() => deleteTask(t.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Footer: Task Count */}
      <footer>
        <p>{tasks.filter((t) => !t.completed).length} tasks pending</p>
      </footer>
    </div>
  );
}

export default App;
