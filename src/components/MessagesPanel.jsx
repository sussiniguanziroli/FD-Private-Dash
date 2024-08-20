// src/components/MessagesPanel.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';


const MessagesPanel = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const querySnapshot = await getDocs(collection(db, 'mensajes'));
            const messagesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesData);
            setFilteredMessages(messagesData);
        };

        fetchMessages();
    }, []);

    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = messages.filter(message =>
            message.email.toLowerCase().includes(lowercasedTerm) ||
            message.nombre.toLowerCase().includes(lowercasedTerm) ||
            message.mensaje.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredMessages(filtered);
    }, [searchTerm, messages]);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'mensajes', id));
        const updatedMessages = messages.filter(message => message.id !== id);
        setMessages(updatedMessages);
        setFilteredMessages(updatedMessages);
    };

    return (
        <div className="panel-container">
            <h2>Mensajes</h2>
            <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <ul className="messages-list">
                {filteredMessages.map(message => (
                    <li key={message.id}>
                        <p>Email: {message.email}</p>
                        <p>Nombre: {message.nombre}</p>
                        <p>mensaje: {message.mensaje}</p>
                        <button onClick={() => handleDelete(message.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagesPanel;
