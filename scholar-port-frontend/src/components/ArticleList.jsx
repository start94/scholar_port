
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/formatDate';

// Questo è un componente funzionale che mostra la lista degli articoli.
function ArticleList({ articles, isLoading, onViewArticle, onEditArticle, onDeleteArticle }) {
  
  // Se i dati sono in fase di caricamento, mostra uno spinner.
  if (isLoading) {
    return (
      <div className="loading-error-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Se non ci sono articoli (dopo che il caricamento è finito), mostra un messaggio.
  if (!articles || articles.length === 0) {
    return (
      <div className="no-articles-message">
        <p>Nessun articolo trovato. Prova a modificare i filtri di ricerca o aggiungine uno nuovo!</p>
      </div>
    );
  }

  // Se ci sono articoli, li mappa e crea una "card" per ciascuno.
  return (
    <div className="article-list">
      {articles.map((article) => (
        <div key={article._id || article.id} className="article-card">
          
          <div className="article-card-header">
            <h3 className="article-title">{article.title}</h3>
            <div className="article-meta">
              {/* Mostra gli autori, separati da una virgola */}
              <span className="authors">
                {Array.isArray(article.authors) ? article.authors.join(', ') : 'N/A'}
              </span>
              {/* Mostra la data di pubblicazione, formattata */}
              <span className="publication-date">
                {article.publicationDate ? formatDate(article.publicationDate) : 'Data non disponibile'}
              </span>
            </div>
          </div>

          <div className="article-card-body">
            {/* Mostra il conteggio delle citazioni */}
            <p className="citation-count">
              Citazioni: {article.citations ? article.citations.length : 0}
            </p>
          </div>

          <div className="article-card-actions">
            {/* Pulsanti per le azioni, che chiamano le funzioni passate come props */}
            <button onClick={() => onViewArticle(article._id || article.id)} className="btn btn-primary">
              Visualizza
            </button>
            <button onClick={() => onEditArticle(article)} className="btn btn-secondary">
              Modifica
            </button>
            <button onClick={() => onDeleteArticle(article._id || article.id)} className="btn btn-danger">
              Elimina
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Prop-types per la validazione delle props, una buona pratica in React.
ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    publicationDate: PropTypes.string,
    citations: PropTypes.array,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onViewArticle: PropTypes.func.isRequired,
  onEditArticle: PropTypes.func.isRequired,
  onDeleteArticle: PropTypes.func.isRequired,
};

// LA RIGA PIÙ IMPORTANTE: Esporta il componente per renderlo disponibile ad altri file.
export default ArticleList;