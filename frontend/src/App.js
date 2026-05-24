import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NoteList from './components/Notes/NoteList';
import Editor from './components/Notes/Editor';
import './App.css';

// Route protégée qui vérifie l'authentification
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/notes" 
                element={
                  <ProtectedRoute>
                    <NotesProvider>
                      <NoteList />
                    </NotesProvider>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notes/:id" 
                element={
                  <ProtectedRoute>
                    <NotesProvider>
                      <Editor />
                    </NotesProvider>
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/notes" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;