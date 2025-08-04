// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import api from './api';

// percorsi importati
import Navbar from './components/Navbar.jsx';
import ArticleList from './components/ArticleList.jsx';
import ArticleDetail from './components/ArticleDetail.jsx';
import ArticleForm from './components/ArticleForm.jsx';
import SearchFilters from './components/SearchFilters.jsx';

function App() {
  
  const [articles, setArticles] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.fetchArticles();
        setArticles(response.data.data);
      } catch (err) {
        setError('Impossibile caricare gli articoli. Riprova più tardi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialArticles();
  }, []);

  const handleFilterChange = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const response = await api.fetchArticles(cleanFilters);
      setArticles(response.data.data);
    } catch (err) {
      setError('Impossibile caricare gli articoli filtrati.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewArticle = async (articleId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.fetchArticleById(articleId);
      setSelectedArticle(response.data.data);
      setCurrentView('detail');
    } catch (err) {
      setError('Impossibile trovare l-articolo specificato.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticle(null);
    setArticleToEdit(null);
    setError(null);
  };

  const handleShowAddForm = () => {
    setArticleToEdit(null);
    setCurrentView('form');
    setError(null);
  };

  const handleEditArticle = (article) => {
    setArticleToEdit(article);
    setCurrentView('form');
    setError(null);
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo articolo e tutte le sue citazioni?')) {
      try {
        await api.deleteArticle(articleId);
        handleFilterChange();
        handleBackToList();
      } catch (err) {
        setError('Errore durante l-eliminazione dell-articolo.');
      }
    }
  };

  const handleSaveArticle = async (articleData) => {
    try {
      if (articleData.id) {
        await api.updateArticle(articleData.id, articleData);
      } else {
        await api.createArticle(articleData);
      }
      handleFilterChange();
      handleBackToList();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Errore durante il salvataggio.';
      setError(errorMsg);
    }
  };

  const handleAddCitation = async (articleId, citationData) => {
    try {
      await api.addCitation(articleId, citationData);
      await handleViewArticle(articleId);
    } catch (err) {
      setError('Errore durante l-aggiunta della citazione.');
    }
  };

  const handleDeleteCitation = async (articleId, citationId) => {
    if (window.confirm('Sei sicuro di voler rimuovere questa citazione?')) {
      try {
        await api.deleteCitation(citationId);
        await handleViewArticle(articleId);
      } catch (err) {
        setError('Errore durante la rimozione della citazione.');
      }
    }
  };

  const renderContent = () => {
    const errorMessage = error ? <div className="error-message mb-3" style={{border: '1px solid red', padding: '1rem', borderRadius: '8px'}}>{error}</div> : null;

    switch (currentView) {
      case 'detail':
        return (
          <>
            {isLoading ? <div className="loading-error-container"><div className="spinner"></div></div> : null}
            {errorMessage}
            {!isLoading && <ArticleDetail 
              article={selectedArticle} 
              onBack={handleBackToList} 
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onAddCitation={handleAddCitation}
              onDeleteCitation={handleDeleteCitation}
            />}
          </>
        );
      case 'form':
        return <ArticleForm 
                  onSave={handleSaveArticle} 
                  onCancel={handleBackToList} 
                  articleToEdit={articleToEdit} 
                  serverError={error}
               />;
      case 'list':
      default:
        return (
          <>
            {errorMessage}
            <SearchFilters onFilterChange={handleFilterChange} />
            <ArticleList 
              articles={articles} 
              isLoading={isLoading}
              onViewArticle={handleViewArticle} 
              onEditArticle={handleEditArticle}
              onDeleteArticle={handleDeleteArticle}
            />
          </>
        );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>ScholarPort</h1>
          <p>Portfolio Accademico.</p>
        </div>
      </header>
      <Navbar onShowAddForm={handleShowAddForm} />
      <main className="app-main">
        <div className="container">
          {renderContent()}
        </div>
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} ScholarPort. 2025 Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}

export default App;