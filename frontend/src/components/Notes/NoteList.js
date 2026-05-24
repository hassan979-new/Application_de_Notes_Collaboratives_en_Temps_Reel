import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import NoteItem from './NoteItem';

const NoteList = () => {
  const { notes, loading, error, createNote, searchNotes } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Créer une nouvelle note
  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Nouvelle note',
        content: '<p>Commencez à écrire ici...</p>'
      });
      navigate(`/notes/${newNote._id}`);
    } catch (error) {
      console.error('Erreur lors de la création de la note:', error);
    }
  };

  // Rechercher des notes
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchNotes(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  // Filtrer les notes à afficher
  const displayedNotes = isSearching ? searchResults : notes;

  if (loading) {
    return <div className="loading">Chargement des notes...</div>;
  }

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Mes Notes</h2>
        <button className="btn-create" onClick={handleCreateNote}>
          Nouvelle Note
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher dans les notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      {error && <div className="error">{error}</div>}

      {displayedNotes.length === 0 ? (
        <div className="empty-notes">
          <p>Aucune note trouvée.</p>

          {!isSearching && (
            <button onClick={handleCreateNote}>Créer votre première note</button>
          )}
        </div>
      ) : (
        <div className="notes-list">
          {displayedNotes.map(note => (
            <NoteItem key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;