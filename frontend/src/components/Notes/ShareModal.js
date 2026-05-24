import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';

const ShareModal = ({ noteId, onClose }) => {
  const { shareNote } = useNotes();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('read');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await shareNote(noteId, { email, permission });
      setSuccess(`Note partagée avec ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du partage');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Partager la note</h3>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleShare}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Permission</label>
            <select value={permission} onChange={(e) => setPermission(e.target.value)}>
              <option value="read">Lecture seule</option>
              <option value="write">Lecture et écriture</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Partager</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;