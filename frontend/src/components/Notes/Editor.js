import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { noteService } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';

const Editor = () => {
  const { id } = useParams();
  useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const quillRef = useRef(null);

  // Utiliser le hook Socket pour la collaboration en temps réel
  const { 
    isConnected, 
    collaborators, 
    remoteContent, 
    updateContent 
  } = useSocket(id);

  // Charger la note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await noteService.getNote(id);
        setNote(response.data.data);
        setTitle(response.data.data.title);
        setContent(response.data.data.content);
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors du chargement de la note');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  // Gérer les mises à jour distantes

  // eslint-disable-next-line
  useEffect(() => {
    if (remoteContent && remoteContent !== content) {
      setContent(remoteContent);
    }
  }, [remoteContent]);

  // Envoyer les mises à jour locales
  const handleContentChange = (value) => {
    setContent(value);
    
    // Obtenir la position du curseur
    const cursorPosition = quillRef.current?.getEditor().getSelection();
    
    // Envoyer la mise à jour aux autres utilisateurs
    updateContent(value, cursorPosition);
  };

  // Sauvegarder la note
  const saveNote = async () => {
    if (!id || !note) return;
    
    try {
      setSaving(true);
      await noteService.updateNote(id, { title, content });
      setLastSaved(new Date());
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Sauvegarde automatique

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content && title && note) {
        saveNote();
      }
    }, 30000); // Toutes les 30 secondes
    
    return () => clearInterval(autoSaveInterval);
  }, [content, title, note]);

  if (loading) {
    return <div className="loading">Chargement de la note...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la note"
        />
        <div className="editor-actions">
          <div className="collaboration-status">
            {isConnected ? (
                <span className="status connected">Connecté</span>
            ) : (
                <span className="status disconnected">Déconnecté</span>
            )}
            {collaborators.length > 0 && (
                <div className="collaborators">
                {collaborators.map(c => (
                    <span key={c.id} className="collaborator">{c.name}</span>
                ))}
                </div>
            )}
            </div>
          <button 
            className="btn-save" 
            onClick={saveNote} 
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button 
            className="btn-back" 
            onClick={() => navigate('/notes')}
          >
            Retour
          </button>
        </div>
      </div>
      
      {lastSaved && (
        <div className="last-saved">
          Dernière sauvegarde: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleContentChange}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
          ]
        }}
      />
    </div>
  );
};

export default Editor;