import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const ArchivedMessagesPanel = () => {
    const [archivedMessages, setArchivedMessages] = useState([]);

    useEffect(() => {
        const fetchArchivedMessages = async () => {
            const querySnapshot = await getDocs(collection(db, 'msjarchivo'));
            const archivedMessagesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setArchivedMessages(archivedMessagesData);
        };

        fetchArchivedMessages();
    }, []);

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
            // Referencias
            const archivedMessageRef = doc(db, 'msjarchivo', id);
            const messageRef = doc(db, 'mensajes', id);

            // Obtener el mensaje archivado
            const messageSnap = await getDoc(archivedMessageRef);
            if (messageSnap.exists()) {
                // Añadir el mensaje a la colección 'mensajes'
                await setDoc(messageRef, messageSnap.data());
                // Eliminar el mensaje de la colección 'msjarchivo'
                await deleteDoc(archivedMessageRef);

                // Actualizar el estado local
                const updatedArchivedMessages = archivedMessages.filter(message => message.id !== id);
                setArchivedMessages(updatedArchivedMessages);
            } else {
                console.error("Mensaje archivado no encontrado");
            }
        } catch (error) {
            console.error("Error desarchivando mensaje: ", error);
        }
    };

    return (
        <div className="archived-panel-container">
            <h2>Mensajes Archivados</h2>
            <ul className="archived-messages-list">
                {archivedMessages.map(message => (
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
