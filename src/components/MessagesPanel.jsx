// src/components/MessagesPanel.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';


const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'mensajes'));
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'mensajes', id));
    setMessages(messages.filter(message => message.id !== id));
  };

  return (
    <div className="panel-container">
      <h2>Mensajes</h2>
      <ul className="messages-list">
        {messages.map(message => (
          <li key={message.id}>
            <p>Email: {message.email}</p>
            <p>Nombre: {message.nombre}</p>
            <p>Consulta: {message.mensaje}</p>
            <button onClick={() => handleDelete(message.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesPanel;
