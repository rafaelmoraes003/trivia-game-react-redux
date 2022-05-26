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
      timer: 10,
      disabled: false,
    };
  }

  componentDidMount() {
    this.fetchTrivia();
    const MAX_SECONDS = 1000;

    setInterval(() => {
      const { trivia, timer, showAnswers } = this.state;
      if (timer > 0) {
        this.setState((prevState) => ({
          timer: prevState.timer - 1,
          disabled: false,
        }));
      } else if (timer === 0 && !showAnswers) {
        this.setState({
          disabled: true,
          showAnswers: false,
          timer: 0,
        });
      } else if (timer === 0 && showAnswers) {
        this.setState((prevState) => ({
          timer: 10,
          index: (prevState.index + 1) % trivia.length,
          showAnswers: false,
        }));
      }
    }, MAX_SECONDS);
  }

  fetchTrivia = async () => {
    const token = localStorage.getItem('token');
    const triviaFetch = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const response = await triviaFetch.json();
    if (response.response_code > 0) {
      const { history } = this.props;
      history.push('/');
    }
    this.setState({ trivia: response.results });
    const n = 0.5;
    const answers = response.results.map((item) => (
      [item.correct_answer, ...item.incorrect_answers].sort(() => Math.random() - n)
    ));
    this.setState({ answers });
  }

  handleClick = () => {
    this.setState({ showAnswers: true });
  }

  render() {
    const { trivia, index, answers, showAnswers, timer, disabled } = this.state;
    return (
      <div data-testid="game-page-div">
        <Header />
        <p>{`Timer: ${timer}`}</p>
        {trivia.length > 0 && answers.length > 0 && (
          <div>
            <p data-testid="question-category">{ trivia[index].category}</p>
            <p data-testid="question-text">{trivia[index].question}</p>
            <div data-testid="answer-options">
              {answers[index].map((item, i) => {
                if (item === trivia[index].correct_answer) {
                  return (
                    <button
                      style={ { border: showAnswers && '3px solid rgb(6, 240, 15)' } }
                      key={ item }
                      type="button"
                      data-testid="correct-answer"
                      onClick={ () => this.handleClick() }
                      disabled={ disabled }
                    >
                      {item}
                    </button>
                  );
                }
                return (
                  <button
                    style={ { border: showAnswers && '3px solid red' } }
                    key={ item }
                    type="button"
                    data-testid={ `wrong-answer-${i}` }
                    onClick={ () => this.handleClick() }
                    disabled={ disabled }
                  >
                    {item}
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
