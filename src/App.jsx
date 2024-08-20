import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MessagesPanel from './components/MessagesPanel';
import ArchivedMessagesPanel from './components/ArchivedMessagesPanel';
import Login from './components/Login';
import { auth } from './firebase/config';
import { signOut } from 'firebase/auth';
import './css/main.css';  // Asegúrate de importar los estilos aquí

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
        <Router>
            <div className="App">
                {user ? (
                    <>
                        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
                        <nav>
                            <ul>
                                <li><Link to="/">Panel de Mensajes</Link></li>
                                <li><Link to="/archived-messages">Mensajes Archivados</Link></li>
                            </ul>
                        </nav>
                        <Routes>
                            <Route path="/" element={<MessagesPanel />} />
                            <Route path="/archived-messages" element={<ArchivedMessagesPanel />} />
                        </Routes>
                    </>
                ) : (
                    <Login onLogin={handleLogin} />
                )}
            </div>
        </Router>
    );
}

export default App;
