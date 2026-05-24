import React from 'react';

const MainContent = ({ children }) => {
  return (
    <div className="main-content-area">
      {children}
    </div>
  );
};

export default MainContent;