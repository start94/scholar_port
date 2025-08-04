
import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleList from './ArticleList.jsx'; 
import { formatDate } from '../utils/formatDate';

// Mock della funzione formatdate per avere un output prevedibile
jest.mock('../utils/formatDate', () => ({
  formatDate: jest.fn((date) => `formatted-${date}`),
}));

const mockArticles = [
  {
    _id: '1',
    title: 'Primo Articolo di Test',
    authors: ['Autore A', 'Autore B'],
    publicationDate: '2023-01-15',
    citations: [{ _id: 'c1' }, { _id: 'c2' }],
  },
  {
    _id: '2',
    title: 'Secondo Articolo di Test',
    authors: ['Autore C'],
    publicationDate: '2023-02-20',
    citations: [{ _id: 'c3' }],
  },
];

const mockProps = {
  articles: mockArticles,
  isLoading: false,
  onViewArticle: jest.fn(),
  onEditArticle: jest.fn(),
  onDeleteArticle: jest.fn(),
};

describe('ArticleList Component', () => {
  beforeEach(() => {
    // Pulisce i mock prima di ogni test
    jest.clearAllMocks();
  });

  test('1. renders a list of articles', () => {
    render(<ArticleList {...mockProps} />);
    expect(screen.getByText('Primo Articolo di Test')).toBeInTheDocument();
    expect(screen.getByText('Secondo Articolo di Test')).toBeInTheDocument();
  });

  test('2. displays article authors correctly', () => {
    render(<ArticleList {...mockProps} />);
    expect(screen.getByText('Autore A, Autore B')).toBeInTheDocument();
    expect(screen.getByText('Autore C')).toBeInTheDocument();
  });

  test('3. displays citation counts', () => {
    render(<ArticleList {...mockProps} />);
    expect(screen.getByText('Citazioni: 2')).toBeInTheDocument();
    expect(screen.getByText('Citazioni: 1')).toBeInTheDocument();
  });

  test('4. renders action buttons for each article', () => {
    render(<ArticleList {...mockProps} />);
    const viewButtons = screen.getAllByText('Visualizza');
    const editButtons = screen.getAllByText('Modifica');
    const deleteButtons = screen.getAllByText('Elimina');
    expect(viewButtons).toHaveLength(2);
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  test('5. displays the publication date formatted correctly', () => {
  render(<ArticleList {...mockProps} />);
  // Verifice solo che la funzione sia stata chiamata con la data giusta.
  
  expect(formatDate).toHaveBeenCalledWith('2023-01-15');
  expect(formatDate).toHaveBeenCalledWith('2023-02-20');
});
});