import React, { useState } from 'react';

function Task({ task, deleteTask, toggleCompleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      editTask(task.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text); // Reset the text if canceled
  };

  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={() => toggleCompleteTask(task.id)} 
        className="checkbox" 
      />

      {isEditing ? (
        <input 
          type="text" 
          value={editText} 
          onChange={(e) => setEditText(e.target.value)} 
          className="edit-input" 
        />
      ) : (
        <span className="task-text">{task.text}</span>
      )}

      <div className="task-buttons">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn"> Save</button>
            <button onClick={handleCancel} className="cancel-btn"> Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="edit-btn">✏️ Edit</button>
            <button onClick={() => deleteTask(task.id)} className="delete-btn">🗑️ Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Task;
