import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import userEvent from '@testing-library/user-event'
import App from '../App';

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
    jest.setTimeout(15000);
    const { history } = renderWithRouterAndRedux(<App />)
    const nameInput = screen.getByTestId('input-player-name');
    const emailInput = screen.getByTestId('input-gravatar-email');
    const playButton = screen.getByRole('button', { name: /play/i });

    expect(playButton).toBeDisabled();

    userEvent.type(nameInput, 'teste')
    userEvent.type(emailInput, 'teste@teste.gamil.com')

    expect(nameInput).toHaveValue('teste')
    expect(emailInput).toHaveValue('teste@teste.gamil.com')
    expect(playButton).not.toBeDisabled();
    userEvent.click(playButton);
    await waitForElementToBeRemoved(playButton);
    expect(playButton).not.toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/game')

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
