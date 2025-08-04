import React, { useState } from 'react';
import CitationForm from './CitationForm';

const ArticleDetail = ({ article, onBack, onEdit, onDelete, onAddCitation, onDeleteCitation }) => {
  const [showCitationForm, setShowCitationForm] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data non disponibile';
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddCitationSubmit = (citationData) => {
    onAddCitation(article.id, citationData);
    setShowCitationForm(false);
  };

  if (!article) {
    return <div className="text-center">Articolo non trovato.</div>;
  }

  return (
    <div className="article-detail">
      <div className="mb-3">
        <button className="btn btn-outline" onClick={onBack}>
          ← Torna alla Lista
        </button>
      </div>

      <div className="card">
        <div className="article-header mb-3">
          <h1 className="mb-2">{article.title}</h1>
          <div className="article-meta">
            <div className="mb-1">
              <strong>Autori:</strong> {Array.isArray(article.authors) ? article.authors.join(', ') : ''}
            </div>
            <div className="mb-1">
              <strong>Data di Pubblicazione:</strong> {formatDate(article.publicationDate)}
            </div>
            <div className="mb-1">
              <strong>DOI:</strong> 
              <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '0.5rem', color: '#667eea' }}>
                {article.doi}
              </a>
            </div>
          </div>
          <div className="article-actions mt-3">
            <button className="btn btn-primary" onClick={() => onEdit(article)}>
              Modifica Articolo
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(article.id)}>
              Elimina Articolo
            </button>
          </div>
        </div>
        <div className="article-content">
          <h3 className="mb-2">Abstract</h3>
          <p className="text-justify" style={{ lineHeight: '1.8' }}>{article.abstract}</p>
        </div>
      </div>

      <div className="card mt-3">
        <div className="citations-section">
          <div className="citations-header mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Citazioni ({article.citations?.length || 0})</h3>
            <button className="btn btn-primary" onClick={() => setShowCitationForm(true)}>
              Aggiungi Citazione
            </button>
          </div>

          {showCitationForm && (
            <div className="mb-3">
              <CitationForm onSubmit={handleAddCitationSubmit} onCancel={() => setShowCitationForm(false)} />
            </div>
          )}

          {!article.citations || article.citations.length === 0 ? (
            <div className="text-center text-muted">
              <p>Nessuna citazione ancora aggiunta per questo articolo.</p>
            </div>
          ) : (
            <div className="citation-list">
              {article.citations.map(citation => (
                <div key={citation.id} className="citation-item">
                  <div className="citation-content">
                    <h4 className="mb-1">{citation.title}</h4>
                    <div className="citation-meta">
                      <span className="text-muted">{citation.authors} ({citation.year})</span>
                    </div>
                  </div>
                  <div className="citation-actions">
                    <button className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => onDeleteCitation(article.id, citation.id)}>
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;