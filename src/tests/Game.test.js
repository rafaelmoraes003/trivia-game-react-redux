import React from "react";
import { screen, waitFor } from "@testing-library/react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import App from "../App";
import userEvent from "@testing-library/user-event";
import apiResponse from './data/mock';
  
describe('Testa o componente Game', () => {
    const ranking = [{ name: 'joão',
    picture: "https://www.gravatar.com/avatar/7fda68e0d1734e8715b9751dce97c7b8",
    score: 20,
    }]
    localStorage.setItem('ranking', JSON.stringify(ranking));

    test('testa se retorna para página inicial quando token é inválido', async () => {
        const response = {
            response_code: 3,
            results: []
        }
        global.fetch = jest.fn().mockResolvedValue({
            json:jest.fn().mockResolvedValue(response)
        });

        const { history } = renderWithRouterAndRedux(<App />, {}, '/game');
        await waitFor(() => {
        expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
        const {pathname} = history.location;
        expect(pathname).toBe('/');
        
    });
    });

    test('testa se a rota está correta', () => {
        const { history } = renderWithRouterAndRedux(<App />, {}, '/game');
        const { pathname } = history.location;
        expect(pathname).toBe('/game');
    });
    test('testa os elementos da tela Game', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json:jest.fn().mockResolvedValue(apiResponse)
        });
        const {history} = renderWithRouterAndRedux(<App />, {}, '/game');
        
        const timer = screen.getByText(/timer/i);
        expect(timer).toBeInTheDocument();
        const { results } = apiResponse;    
        for(let index = 0; index < results.length; index +=1) {
            if(index < 4) {
                const category = await screen.findByTestId('question-category');
                expect(category).toHaveTextContent(results[index].category);
                const question = await screen.findByTestId('question-text');
                expect(question).toHaveTextContent(results[index].question);
                const buttons = await screen.findAllByRole('button');
                userEvent.click(buttons[0]);
                const nextButton = await screen.findByRole('button', {name: /next/i});
                expect(nextButton).toBeInTheDocument();
                const correctAnswer = await screen.findByTestId('correct-answer');
                expect(correctAnswer).toHaveStyle('border: 3px solid rgb(6,  240, 15)');
                expect(correctAnswer).not.toBeDisabled();
                const wrongAnswer = await screen.findByText(results[index].incorrect_answers[0]);
                expect(wrongAnswer).toHaveStyle('border: 3px solid red');
                userEvent.click(nextButton);
            } else {
                const buttons = await screen.findAllByRole('button');
                userEvent.click(buttons[0]);
                const nextButton = await screen.findByRole('button', {name: /next/i});
                userEvent.click(nextButton);
                const {pathname} = history.location;
                expect(pathname).toBe('/feedback');
                
            }
        }  
    });

    test('testa se após 30 segundo os botoẽs estão disabilitados', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json:jest.fn().mockResolvedValue(apiResponse)
        });

        jest.useFakeTimers();
        const time = jest.spyOn(global, 'setTimeout');

        renderWithRouterAndRedux(<App />, {}, '/game');
        const question = await screen.findByTestId('question-text');
        expect(question).toBeInTheDocument();
        jest.advanceTimersByTime(35000);
        expect(time).toHaveBeenCalled();
        const buttons = await screen.findAllByRole('button');
        for(let index = 0; index < 4; index += 1) {
            expect(buttons[index]).toBeDisabled();
        }
    });
})