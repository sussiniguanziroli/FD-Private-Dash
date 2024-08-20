import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const ArchivedMessagesPanel = () => {
    const [archivedMessages, setArchivedMessages] = useState([]);
    const [filterType, setFilterType] = useState('default'); // Estado para el filtro
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    useEffect(() => {
        const fetchArchivedMessages = async () => {
            const querySnapshot = await getDocs(collection(db, 'msjarchivo'));
            let archivedMessagesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setArchivedMessages(archivedMessagesData);
        };

        fetchArchivedMessages();
    }, []);

    // Función para manejar la búsqueda y filtrado
    const getFilteredMessages = () => {
        let filteredMessages = archivedMessages;

        if (searchTerm) {
            filteredMessages = filteredMessages.filter(message =>
                message.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType === 'name') {
            return filteredMessages.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (filterType === 'oldest') {
            return filteredMessages.sort((a, b) => a.timestamp - b.timestamp);
        } else {
            return filteredMessages;
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'msjarchivo', id));
            const updatedMessages = archivedMessages.filter(message => message.id !== id);
            setArchivedMessages(updatedMessages);
        } catch (error) {
            console.error("Error deleting archived message: ", error);
        }
    };

    const handleUnarchive = async (id) => {
        try {
            const archivedMessageRef = doc(db, 'msjarchivo', id);
            const messageRef = doc(db, 'mensajes', id);

            const messageSnap = await getDoc(archivedMessageRef);
            if (messageSnap.exists()) {
                await setDoc(messageRef, messageSnap.data());
                await deleteDoc(archivedMessageRef);

                const updatedArchivedMessages = archivedMessages.filter(message => message.id !== id);
                setArchivedMessages(updatedArchivedMessages);
            } else {
                console.error("Mensaje archivado no encontrado");
            }
        } catch (error) {
            console.error("Error desarchivando mensaje: ", error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            const batch = archivedMessages.map(msg => deleteDoc(doc(db, 'msjarchivo', msg.id)));
            await Promise.all(batch);
            setArchivedMessages([]);
        } catch (error) {
            console.error("Error eliminando todos los mensajes archivados: ", error);
        }
    };

    return (
        <div className="archived-panel-container">
            <h2>Mensajes Archivados</h2>
            <div className="search-filter-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filters">
                    <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                        <option value="default">Por defecto</option>
                        <option value="name">Por nombre</option>
                        <option value="oldest">Más viejo a más nuevo</option>
                    </select>
                    <button className="delete-all" onClick={handleDeleteAll}>Eliminar Todos</button>
                </div>
            </div>
            <ul className="archived-messages-list">
                {getFilteredMessages().map(message => (
                    <li key={message.id}>
                        <p>Email: {message.email}</p>
                        <p>Nombre: {message.nombre}</p>
                        <p>Consulta: {message.mensaje}</p>
                        <button className='unarchive' onClick={() => handleUnarchive(message.id)}>Desarchivar</button>
                        <button className='delete' onClick={() => handleDelete(message.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArchivedMessagesPanel;
