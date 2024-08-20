import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, writeBatch, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const MessagesPanel = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'alphabetical'

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
        let filtered = messages.filter(message =>
            message.email.toLowerCase().includes(lowercasedTerm) ||
            message.nombre.toLowerCase().includes(lowercasedTerm) ||
            message.mensaje.toLowerCase().includes(lowercasedTerm)
        );

        if (sortOrder === 'latest') {
            filtered.sort((a, b) => b.date - a.date); // Assuming `date` is a timestamp
        } else if (sortOrder === 'alphabetical') {
            filtered.sort((a, b) => a.email.localeCompare(b.email));
        }

        setFilteredMessages(filtered);
    }, [searchTerm, messages, sortOrder]);

    const handleArchive = async (id) => {
        try {
            const messageRef = doc(db, 'mensajes', id);
            const archivedMessageRef = doc(db, 'msjarchivo', id);

            const messageSnap = await getDoc(messageRef);
            if (messageSnap.exists()) {
                await setDoc(archivedMessageRef, messageSnap.data());
                await deleteDoc(messageRef);

                const updatedMessages = messages.filter(message => message.id !== id);
                setMessages(updatedMessages);
                setFilteredMessages(updatedMessages);
            }
        } catch (error) {
            console.error("Error archiving message: ", error);
        }
    };

    const handleArchiveAll = async () => {
        const batch = writeBatch(db);
        const archiveBatch = writeBatch(db);

        messages.forEach(message => {
            const messageRef = doc(db, 'mensajes', message.id);
            const archivedMessageRef = doc(db, 'msjarchivo', message.id);

            batch.delete(messageRef);
            archiveBatch.set(archivedMessageRef, message);
        });

        await batch.commit();
        await archiveBatch.commit();

        setMessages([]);
        setFilteredMessages([]);
    };

    const handleRefresh = async () => {
        const querySnapshot = await getDocs(collection(db, 'mensajes'));
        const messagesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setMessages(messagesData);
        setFilteredMessages(messagesData);
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
            <div className="filters">
                <button onClick={() => setSortOrder('latest')} className={`filter-button ${sortOrder === 'latest' ? 'active' : ''}`}>
                    Más Recientes
                </button>
                <button onClick={() => setSortOrder('alphabetical')} className={`filter-button ${sortOrder === 'alphabetical' ? 'active' : ''}`}>
                    Orden Alfabético
                </button>
                <button onClick={handleRefresh} className="refresh-button">Recargar</button>
                <button onClick={handleArchiveAll} className="archive-all-button">Archivar Todos</button>
            </div>
            <ul className="messages-list">
                {filteredMessages.map(message => (
                    <li key={message.id}>
                        <p>Email: {message.email}</p>
                        <p>Nombre: {message.nombre}</p>
                        <p>Consulta: {message.mensaje}</p>
                        <button onClick={() => handleArchive(message.id)}>Archivar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagesPanel;
