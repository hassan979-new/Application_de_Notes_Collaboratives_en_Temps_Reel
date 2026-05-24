import React, { createContext, useState, useEffect, useContext } from 'react';
import { noteService } from '../services/api';
import { AuthContext } from './AuthContext';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les notes lorsque l'utilisateur est connecté
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await noteService.getNotes();
        setNotes(response.data.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors du chargement des notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  // Créer une note
  const createNote = async (noteData) => {
    try {
      setError(null);
      const response = await noteService.createNote(noteData);
      setNotes([response.data.data, ...notes]);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création de la note');
      throw error;
    }
  };

  // Mettre à jour une note
  const updateNote = async (id, noteData) => {
    try {
      setError(null);
      const response = await noteService.updateNote(id, noteData);
      setNotes(notes.map(note => 
        note._id === id ? response.data.data : note
      ));
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour de la note');
      throw error;
    }
  };

  // Supprimer une note
  const deleteNote = async (id) => {
    try {
      setError(null);
      await noteService.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la suppression de la note');
      throw error;
    }
  };

  // Partager une note
  const shareNote = async (id, shareData) => {
    try {
      setError(null);
      const response = await noteService.shareNote(id, shareData);
      setNotes(notes.map(note => 
        note._id === id ? response.data.data : note
      ));
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du partage de la note');
      throw error;
    }
  };

  // Rechercher des notes
  const searchNotes = async (query) => {
    try {
      setError(null);
      setLoading(true);
      const response = await noteService.searchNotes(query);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la recherche');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      loading, 
      error, 
      createNote, 
      updateNote, 
      deleteNote, 
      shareNote,
      searchNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};