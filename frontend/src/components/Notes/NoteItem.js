import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import { useAuth } from '../../hooks/useAuth';
import ShareModal from './ShareModal';

const NoteItem = ({ note }) => {
  const [showShare, setShowShare] = useState(false);
  const { deleteNote } = useNotes();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner = note.owner === user?.id || note.owner?._id === user?.id;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette note ?')) {
      await deleteNote(note._id);
    }
  };

  return (
    <div className="note-item" onClick={() => navigate(`/notes/${note._id}`)}>
      <div className="note-item-header">
        <h3>{note.title}</h3>
        {isOwner && (
          <button className="btn-delete" onClick={handleDelete}>✕</button>
        )}
      </div>
      <div
        className="note-preview"
        dangerouslySetInnerHTML={{ __html: note.content?.substring(0, 100) + '...' }}
      />
      <div className="note-meta">
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        {note.sharedWith?.length > 0 && <span>👥 Partagée</span>}
      </div>
      {isOwner && (
        <button
          className="btn-share"
          onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
        >
          🔗 Partager
        </button>
      )}
      {showShare && (
        <ShareModal noteId={note._id} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
};

export default NoteItem;