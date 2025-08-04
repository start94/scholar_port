// Per migliorare l'organizzazione e la manutenibilità, ho aggiunto un file , 
// src/api.js, che centralizza tutte le chiamate al backend. 
// Questo è un approccio standard che rende il codice più pulito e facile da aggiornare.
import axios from 'axios';

// Configura l'URL di base per tutte le chiamate API
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Interceptor per gestire gli errori in un unico posto
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logga l'errore e restituisce una promessa rifiutata
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// funzioni API per gli Articoli 
export const fetchArticles = (params) => API.get('/articles', { params });
export const fetchArticleById = (id) => API.get(`/articles/${id}`);
export const createArticle = (articleData) => API.post('/articles', articleData);
export const updateArticle = (id, articleData) => API.put(`/articles/${id}`, articleData);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// funzioni API per le Citazioni
export const addCitation = (articleId, citationData) => API.post(`/articles/${articleId}/citations`, citationData);

export const deleteCitation = (citationId) => API.delete(`/citations/${citationId}`);

const api = {
  fetchArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  addCitation,
  deleteCitation,
};

export default api;