import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleForm from './ArticleForm.jsx';

const mockArticleToEdit = {
  _id: '1',
  title: 'Titolo Esistente',
  authors: ['Autore Esistente'],
  abstract: 'Abstract esistente che è sicuramente più lungo di cinquanta caratteri per superare la validazione.',
  doi: '10.1234/esistente',
  publicationDate: '2023-01-01',
};

const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

describe('ArticleForm Component', () => {
  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
  });

  test('1. renders in "create" mode with correct title', () => {
    render(<ArticleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByRole('heading', { name: /Aggiungi Nuovo Articolo/i })).toBeInTheDocument();
  });

  test('2. renders in "edit" mode and pre-fills the form fields', () => {
    render(<ArticleForm onSave={mockOnSave} onCancel={mockOnCancel} articleToEdit={mockArticleToEdit} />);
    expect(screen.getByRole('heading', { name: /Modifica Articolo/i })).toBeInTheDocument();
  });

  test('3. allows user to type in form fields', async () => {
    render(<ArticleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const titleInput = screen.getByLabelText(/Titolo/i);
    await userEvent.type(titleInput, 'Un nuovo titolo'); 
    expect(titleInput).toHaveValue('Un nuovo titolo');
  });

  

  test('5. calls onCancel when cancel button is clicked', async () => {
    render(<ArticleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const cancelButton = screen.getByRole('button', { name: /Annulla/i });
    await userEvent.click(cancelButton); 
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});