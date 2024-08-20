import React, { useState } from 'react'
import './css/main.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MessagesPanel from './components/MessagesPanel'
import Login from './components/Login';
import { auth } from '../src/firebase/config';
import { signOut } from 'firebase/auth';


function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (user) => {
      setUser(user);
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
      };

  return (
    <div className="App">
      {user ? (
        <>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          <MessagesPanel />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>

  )
}

export default App
