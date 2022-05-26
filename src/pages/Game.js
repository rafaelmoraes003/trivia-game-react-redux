import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      trivia: [],
      index: 0,
      answers: [],
      showAnswers: false,
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const triviaFetch = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const response = await triviaFetch.json();
    if (response.response_code > 0) {
      const { history } = this.props;
      history.push('/');
    } else {
      let answers;
      const { index } = this.state;
      if (response.results[index].type === 'multiple') {
        answers = [
          { id: 0, answer: response.results[index].incorrect_answers[0] },
          { id: 1, answer: response.results[index].incorrect_answers[1] },
          { id: 2, answer: response.results[index].incorrect_answers[2] },
          { id: 3, answer: response.results[index].correct_answer },
        ];
      } else {
        answers = [
          { id: 0, answer: response.results[index].incorrect_answers[0] },
          { id: 3, answer: response.results[index].correct_answer },
        ];
      }
      const n = 0.5;
      this.setState({ trivia: response.results,
        answers: answers.sort(() => Math.random() - n) });
    }
  }

  handleClick = () => {
    this.setState({ showAnswers: true });
  }

  render() {
    const { trivia, index, answers, showAnswers } = this.state;
    return (
      <div data-testid="game-div">
        <Header />
        {trivia.length > 0 && (
          <div>
            <p data-testid="question-category">{ trivia[index].category}</p>
            <p data-testid="question-text">{trivia[index].question}</p>
            <div data-testid="answer-options">
              {answers.map(({ id, answer }) => {
                if (id === 2 + 1) {
                  return (
                    <button
                      style={ { border: showAnswers && '3px solid rgb(6, 240, 15)' } }
                      key={ id }
                      type="button"
                      data-testid="correct-answer"
                      onClick={ () => this.handleClick() }
                    >
                      {answer}
                    </button>
                  );
                } return (
                  <button
                    style={ { border: showAnswers && '3px solid red' } }
                    key={ id }
                    type="button"
                    data-testid={ `wrong-answer-${id}` }
                    onClick={ () => this.handleClick() }
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
export default Game;
