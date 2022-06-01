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
  const ranking = [{ name: 'joão',
    picture: "https://www.gravatar.com/avatar/7fda68e0d1734e8715b9751dce97c7b8",
    score: 20,
}]
  localStorage.setItem('ranking', JSON.stringify(ranking));
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

  test('testa se a mesnagem exibida na tela é Well done!', () => {
    renderWithRouterAndRedux(<App />, initialState, "/feedback");
    const message = screen.getByRole('heading', { name: /well done!/i});
    expect(message).toBeInTheDocument();
  });

  test('testa se a mesnagem exibida na tela é Could be better', () => {
    renderWithRouterAndRedux(<App />,   
  {
    name: 'teste',
    gravatarEmail: 'teste@teste.com',
    score: 30,
    assertions: 1,
  }, "/feedback");

    const message = screen.getByRole('heading', { name: /could be better.../i});
    expect(message).toBeInTheDocument();
  });
});