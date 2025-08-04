import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import api from './api.js';

jest.mock('./api.js', () => ({
  fetchArticles: jest.fn(),
  fetchArticleById: jest.fn(),
  createArticle: jest.fn(),
  updateArticle: jest.fn(),
  deleteArticle: jest.fn(),
  addCitation: jest.fn(),
  deleteCitation: jest.fn(),
}));

const mockArticles = [
  { _id: '1', title: 'First Test Article', authors: ['Author A'], citations: [] },
  { _id: '2', title: 'Second Test Article', authors: ['Author B'], citations: [] },
];

const mockArticleDetail = {
  _id: '1', title: 'First Test Article', authors: ['Author A'], abstract: 'Detail abstract', publicationDate: '2023-01-01', citations: []
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.fetchArticles.mockResolvedValue({ data: { data: mockArticles } });
    api.fetchArticleById.mockResolvedValue({ data: { data: mockArticleDetail } });
  });

  test('1. renders the main title and fetches articles on initial load', async () => {
    render(<App />);
    expect(screen.getByText('ScholarPort')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('First Test Article')).toBeInTheDocument();
    });
  });

  test('2. navigates to add article form when button is clicked', async () => {
    render(<App />);
    await screen.findByText('First Test Article');
    const addButton = screen.getByText(/\+ Aggiungi Nuovo Articolo/i);
    await userEvent.click(addButton); 
    expect(screen.getByText('Aggiungi Nuovo Articolo')).toBeInTheDocument();
  });

  test('3. shows article detail when view button is clicked', async () => {
    render(<App />);
    await screen.findByText('First Test Article');
    const viewButtons = screen.getAllByText('Visualizza');
    await userEvent.click(viewButtons[0]);
    await waitFor(() => {
      expect(api.fetchArticleById).toHaveBeenCalledWith('1');
    });
  });
  
  test('4. handles API errors gracefully', async () => {
    api.fetchArticles.mockRejectedValue(new Error('Network error'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Impossibile caricare gli articoli/i)).toBeInTheDocument();
    });
  });

  test('5. filters articles when search keyword is entered', async () => {
    render(<App />);
    await screen.findByText('First Test Article');
    const searchInput = screen.getByPlaceholderText(/Titolo, abstract, autore.../i);
    await userEvent.type(searchInput, 'Second'); 
    await waitFor(() => {
      expect(api.fetchArticles).toHaveBeenCalled();
    }, {timeout: 600});
  });
});