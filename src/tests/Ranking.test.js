import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa a página de Ranking', () => {
  localStorage.setItem('ranking', JSON.stringify([
    {
    name: 'teste',
    score: 50,
    picture: 'https://www.gravatar.com/avatar/f2bc003d26af03264b9d48606bc6c53f',
    },
    { 
    name: 'teste2',
    score: 80,
    picture: 'https://www.gravatar.com/avatar/f2bc703d26af03264b9d48606bc6c53f',
    }
  ]))

  test('Verifica o componente Ranking', () => {
    renderWithRouterAndRedux(<App />, {}, "/ranking");
    const rankingNames = screen.getAllByRole('heading', { level: 2 });
    const rankingImages = screen.getAllByRole('img');
    expect(rankingNames).toHaveLength(2);
    expect(rankingImages).toHaveLength(2);

    expect(rankingNames[0]).toHaveTextContent('teste2');
    const rankingScoreOne = screen.getByText('80');
    expect(rankingScoreOne).toBeInTheDocument();
    expect(rankingImages[0]).toHaveAttribute('src', 'https://www.gravatar.com/avatar/f2bc703d26af03264b9d48606bc6c53f');

    expect(rankingNames[1]).toHaveTextContent('teste');
    const rankingScoreTwo = screen.getByText('50');
    expect(rankingScoreTwo).toBeInTheDocument();
    expect(rankingImages[1]).toHaveAttribute('src', 'https://www.gravatar.com/avatar/f2bc003d26af03264b9d48606bc6c53f');
    
  });

  test( 'Testa o botão de voltar ao início', () => {
    const { history } = renderWithRouterAndRedux(<App />, {}, "/ranking");
    const backButton = screen.getByRole('button', { name: /home/i });
    expect(backButton).toBeInTheDocument();
    userEvent.click(backButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  } )
});