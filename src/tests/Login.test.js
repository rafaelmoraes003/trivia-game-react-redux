import React from 'react';
import {  screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa a página de Login', () => {
  test('Verifica os inputs de nome e email', () =>{
    renderWithRouterAndRedux(<App />);
    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });
  
  test('Verifica se há 2 botões na tela', () => {
    renderWithRouterAndRedux(<App />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent(/play/i);
    expect(buttons[1]).toHaveTextContent(/settings/i);
  });

  test('Testa a rota /games', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const playButton = screen.getByRole('button', { name: /play/i });
    const nameInput = screen.getByTestId('input-player-name');
    const emailInput = screen.getByTestId('input-gravatar-email');
    expect(playButton).toBeDisabled();
    userEvent.type(nameInput, 'teste');
    userEvent.type(emailInput, 'teste@trybe.com');
    expect(playButton).not.toBeDisabled();
    userEvent.click(playButton);
    const gamePageDiv = await screen.findByTestId('game-div');
    expect(gamePageDiv).toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/game');
  });

  test('Testa o botão settings', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toBeInTheDocument();
    userEvent.click(settingsButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/settings');
  });
});
