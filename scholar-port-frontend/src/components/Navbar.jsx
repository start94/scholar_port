import React from 'react';

const Navbar = ({ onShowAddForm }) => {
  return (
    <nav className="app-nav">
      <div className="container">
        <button className="btn btn-primary" onClick={onShowAddForm}>
          + Aggiungi Nuovo Articolo
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 