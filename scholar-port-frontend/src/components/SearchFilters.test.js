import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilters from './SearchFilters.jsx';

const mockOnFilterChange = jest.fn();

describe('SearchFilters Component', () => {
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  test('1. renders input fields correctly', () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);
    expect(screen.getByLabelText(/Cerca per parola chiave/i)).toBeInTheDocument();
  });

  test('2. calls onFilterChange with debounce after user types', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);
    const keywordInput = screen.getByLabelText(/Cerca per parola chiave/i);
    await userEvent.type(keywordInput, 'React'); 
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    }, { timeout: 600 });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ search: 'React', year: '' });
  });

  test('3. calls onFilterChange with empty values on reset', async () => {
    render(<SearchFilters onFilterChange={mockOnFilterChange} />);
    const keywordInput = screen.getByLabelText(/Cerca per parola chiave/i);
    await userEvent.type(keywordInput, 'Test'); 
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    }, { timeout: 600 });
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    await userEvent.click(resetButton); 
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
    }, { timeout: 600 });
    expect(mockOnFilterChange).toHaveBeenLastCalledWith({ search: '', year: '' });
  });
});