import React from 'react';
import Task from './Task';

function TaskList({ tasks, deleteTask, toggleCompleteTask,editTask }) {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>No tasks available. Add a new one! </p>
      ) : (
        tasks.map(task => (
          <Task 
            key={task.id} 
            task={task} 
            deleteTask={deleteTask} 
            toggleCompleteTask={toggleCompleteTask} 
            editTask={editTask}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;
