import './App.css';
import React, { useState } from 'react';
import TaskList from './components/TaskList';
//import TaskForm from './components/TaskForm';
import LoginPage from './pages/LoginPage';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    //const [refresh, setRefresh] = useState(false);
    const handleLogin = (token) => {
        setToken(token);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };
    return (
        <div className="App">
            {token ? (
                <>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    <TaskList token={token} />
                </>  
            ) : (
                    <LoginPage onLogin={handleLogin} />    
            )}
        </div>
    );

   /* const handleTaskAdded = () => {
        setRefresh(!refresh); // Toggle the refresh state to trigger a re-render
    };
  return (
      <div>
          <TaskList key={refresh} />
          <TaskForm onTaskAdded={handleTaskAdded} />
      </div>
  );*/
}

export default App;
