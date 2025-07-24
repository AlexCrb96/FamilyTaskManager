import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
function App() {
    const [refresh, setRefresh] = useState(false);
    const handleTaskAdded = () => {
        setRefresh(!refresh); // Toggle the refresh state to trigger a re-render
    };
  return (
      <div>
          <TaskList key={refresh} />
          <TaskForm onTaskAdded={handleTaskAdded} />
      </div>
  );
}

export default App;
