import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Vérifier si le token est expiré
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            // Récupérer les informations de l'utilisateur
            const response = await authService.getMe();
            setUser(response.data.data);
            
            // Initialiser la connexion Socket.IO
            initSocket(token);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Inscription
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      // Initialiser la connexion Socket.IO
      initSocket(response.data.token);
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'inscription');
      throw error;
    }
  };

  // Connexion
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      // Initialiser la connexion Socket.IO
      initSocket(response.data.token);
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la connexion');
      throw error;
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Déconnecter Socket.IO
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      register, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};