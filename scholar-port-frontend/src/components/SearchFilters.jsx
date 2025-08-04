// src/SearchFilters.js
import React, { useState, useEffect, useRef } from 'react';

const SearchFilters = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  
  // Uso una ref per sapere se è il primo render del componente
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Se è il primo render, non faccio nulla.
    // Aggiorno solo la ref e usciamo dall'effetto.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Per tutti i render successivi (causati da input dell'utente),
    // avvio la ricerca con un ritardo (debounce).
    const handler = setTimeout(() => {
      onFilterChange({ search, year });
    }, 500);

    // Funzione di pulizia: cancella il timer se l'utente scrive di nuovo
    return () => {
      clearTimeout(handler);
    };
  }, [search, year, onFilterChange]);

  const handleReset = () => {
    setSearch('');
    setYear('');
    // onFilterChange sarà chiamato automaticamente dall'useEffect dopo che lo stato si è aggiornato
  };

  return (
    <div className="search-filters card">
      <div className="filter-row">
        <div className="form-group">
          <label htmlFor="searchKeyword">Cerca per parola chiave</label>
          <input
            type="text"
            id="searchKeyword"
            className="form-control"
            placeholder="Titolo, abstract, autore..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="searchYear">Filtra per anno</label>
          <input
            type="number"
            id="searchYear"
            className="form-control"
            placeholder="Es. 2023"
            min="1900"
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="form-group">
            <button className="btn btn-secondary" onClick={handleReset} style={{width: '100%'}}>
              Reset
            </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;