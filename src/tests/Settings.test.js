import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import userEvent from '@testing-library/user-event'
import App from '../App';

describe('Testa o componente Settings', () => {
  test('Testa a rota', () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, '/settings');
    const { pathname } = history.location;
    expect(pathname).toBe('/settings');
  });

  test('Testa os selects', async () => {
    renderWithRouterAndRedux(<App />, {}, '/settings');
    const categorySelect = await screen.findByLabelText('Category');
    const difficultySelect = await screen.findByLabelText('Difficulty');
    const typeSelect = await screen.findByLabelText('Type');

    expect(categorySelect).toBeInTheDocument();
    expect(categorySelect).toHaveAttribute('name', 'categoryValue');

    expect(difficultySelect).toBeInTheDocument();
    expect(difficultySelect).toHaveAttribute('name', 'difficultyValue');

    expect(typeSelect).toBeInTheDocument();
    expect(typeSelect).toHaveAttribute('name', 'typeValue');
  });

  test('Testa os valores dos selects', async () => {
    renderWithRouterAndRedux(<App />, {}, '/settings');
    const categorySelect = await screen.findByLabelText('Category');
    expect(categorySelect).toBeInTheDocument();
    userEvent.selectOptions(categorySelect, ['23']);
    expect(categorySelect).toHaveValue('23')
  })

  test('Testa o local storage', async () => {
    renderWithRouterAndRedux(<App />, {}, '/settings');
    const saveButton = await screen.findByRole('button', { name: /save changes/i });
    expect(saveButton).toBeInTheDocument();
    userEvent.click(saveButton);
    expect(localStorage).toHaveProperty('TriviaMOD', `https://opentdb.com/api.php?amount=5&
      category=&difficulty=&type=`);
  });

  test('Testa limpar o local storage', async () => {
    localStorage.setItem('TriviaMOD', 'xxxx')
    renderWithRouterAndRedux(<App />, {}, '/settings');
    const clearButton = await screen.findByRole('button', { name: /clear changes/i });
    expect(clearButton).toBeInTheDocument();
    userEvent.click(clearButton);
    expect(localStorage).toHaveLength(0);
  });

  test('Testa se é possível voltar para a home', async () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, '/settings');
    const homeButton = await screen.findByRole('button', { name: /home/i });
    expect(homeButton).toBeInTheDocument();
    userEvent.click(homeButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  })
});
