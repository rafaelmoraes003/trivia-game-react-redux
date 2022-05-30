import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import App from "../App";
import userEvent from "@testing-library/user-event";

const initialState = {
  player: {
    name: 'teste',
    gravatarEmail: 'teste@teste.com',
    score: 50,
    assertions: 4,
  }
}

describe('Testes do Feedback', () => {
  test('Testa a URL', () => {
    const { history } = renderWithRouterAndRedux(<App />, initialState, "/feedback");
    const { pathname } = history.location;
    expect(pathname).toBe('/feedback');
  });

  test('Testa os textos de Feedback', () => {
  renderWithRouterAndRedux(<App />, initialState, "/feedback");
  const assertionsText = screen.getByRole('heading', { level: 3, name: /Well Done!/i });
  const score = screen.getByTestId('feedback-total-score');
  expect(assertionsText).toBeInTheDocument();
  expect(score).toHaveTextContent('50');
  });

  test('Testa o botão de jogar novamente', () => {
    const { history } = renderWithRouterAndRedux(<App />, initialState, "/feedback");
    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    expect(playAgainButton).toBeInTheDocument();
    userEvent.click(playAgainButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });

  test('Testa o botão de ranking', () => {
    localStorage.setItem('ranking', JSON.stringify([{
      name: 'teste',
      score: 50,
      picture: 'https://www.gravatar.com/avatar/f2bc003d26af03264b9d48606bc6c53f',
    }]));

    const { history } = renderWithRouterAndRedux(<App />, initialState, "/feedback");
    const rankingButton = screen.getByRole('button', { name: /ranking/i });
    expect(rankingButton).toBeInTheDocument();
    userEvent.click(rankingButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
  });
});