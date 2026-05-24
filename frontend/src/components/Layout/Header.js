import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/notes">📝 Collaborative Notes</Link>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="header-user">Bonjour, {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;