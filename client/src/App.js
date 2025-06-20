import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import './styles.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newTaskObj = { id: Date.now(), text: newTask, completed: false };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompleteTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const generatePlan = async () => {
    const activeTasks = tasks
      .filter(task => !task.completed)
      .map(task => task.text);

    if (activeTasks.length === 0) {
      alert("Add some active tasks before generating a plan.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: activeTasks,
          date: new Date().toDateString()
        })
      });

      const data = await response.json();

if (!data.plan || typeof data.plan !== "string") {
  throw new Error("Invalid plan received from the server.");
}

        const lines = data.plan.split("\n").filter(Boolean);
setSchedule(lines);

     
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("AI generation failed.");
    } finally {
      setLoading(false);
    }
  };

  // const highlightTasks = (text, taskList) => {
  //   const regex = new RegExp(`\\b(${taskList.join('|')})\\b`, 'gi');
  //   return text.replace(regex, match => `<span class="highlight-task">${match}</span>`);
  // };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header>
        <h1>📝 To-Do List</h1>
        <button className="toggle-dark-mode" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <div className="add-task">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask();
          }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        toggleCompleteTask={toggleCompleteTask}
        editTask={editTask}
      />

      <div className="ai-planner">
        <button id="genbtn" onClick={generatePlan} disabled={loading}>
          {loading ? "Generating..." : "🧠 Generate Plan"}
        </button>

        {schedule.length > 0 && (
          <div className="schedule-wrapper">
            <h2 className="schedule-heading">Your Plan for Today</h2>
            <div className="schedule-cards">
              {schedule
                .filter(line => !line.toLowerCase().startsWith("here is"))
                .map((line, idx) => {
                  const cleanLine = line
                    // .replace(/["“”]/g, "")
                    .replace(/[**]/g, "")
                    
                    .replace(/^-/, "")
                    // .replace(/\s*:\s*/g, ": ")
                    .trim();
                  const [time, ...rest] = cleanLine.split(" - ");
                  const taskText = rest.join(" - ").trim();

                  const userTaskList = tasks.map(t => t.text.toLowerCase().trim());

                  const isMatch = userTaskList.some(userTask =>
                          cleanLine.toLowerCase().includes(userTask.toLowerCase())
                        );
                        
                         



                  return (
                    <div key={idx} 
                      className={`schedule-card ${isMatch ? "highlight-card" : ""}`}>
                      
                     <div className="schedule-time">{time}</div>
                    <div className="schedule-task">{taskText}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <div className="footer">
        <p>© 2025 AI Daily Planner</p>
        <p>Made with ❤️ by Kashish</p>
      </div>
    </div>
  );
}

export default App;
