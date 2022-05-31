import React from 'react';
import { screen } from '@testing-library/react';

import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa a página de Ranking', () => {
  localStorage.setItem('ranking', JSON.stringify([{
    name: 'teste',
    score: 50,
    picture: 'https://www.gravatar.com/avatar/f2bc003d26af03264b9d48606bc6c53f',
  }]));

    test('Verifica o componente Ranking', () => {
      renderWithRouterAndRedux(<App />, {}, "/ranking");
      const rankingName = screen.getByRole('heading', { level: 2, name: /test/i });
      expect(rankingName).toBeInTheDocument();
      const rankingScore = screen.getByText('50');
      expect(rankingScore).toBeInTheDocument();
      const rankingPicture = screen.getByRole('img');
      expect(rankingPicture).toHaveAttribute("src", "https://www.gravatar.com/avatar/f2bc003d26af03264b9d48606bc6c53f");
    });

  test( 'Testa o botão de voltar ao início', () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, "/ranking");
    const backButton = screen.getByRole('button', { name: /início/i });
    expect(backButton).toBeInTheDocument();
    userEvent.click(backButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  } )
});