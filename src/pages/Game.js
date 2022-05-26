import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import pontuation from '../redux/actions/pontuation';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      trivia: [],
      index: 0,
      answers: [],
      showAnswers: false,
      timer: 30,
      disabled: false,
      score: 0,
      assertions: 0,
    };
  }

  componentDidMount() {
    this.fetchTrivia();
    const MAX_SECONDS = 1000;

    setInterval(() => {
      const { timer, showAnswers } = this.state;
      if (timer > 0 && !showAnswers) {
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

  difficultyTimes = (level) => {
    if (level === 'easy') {
      return 1;
    } if (level === 'medium') {
      return 2;
    } return 2 + 1;
  }

  handleClick = (e) => {
    e.persist();
    this.setState((prevState) => ({
      timer: prevState.timer,
      showAnswers: true,
    }));
    const { trivia, index, timer } = this.state;
    const { name } = e.target;
    if (name === 'correct-answer') {
      this.setState((prevState) => ({
        assertions: prevState.assertions + 1,
      }));
      const { difficulty } = trivia[index];
      const base = 10;
      const sumScore = base + (timer * this.difficultyTimes(difficulty));
      this.setState((prevState) => ({
        score: prevState.score + sumScore,
      }), () => {
        const { score, assertions } = this.state;
        const { savePontuation } = this.props;
        savePontuation({ score, assertions });
      });
    }
  }

  nextBtn = () => {
    const { trivia } = this.state;
    this.setState((prevState) => ({
      timer: 30,
      index: (prevState.index + 1) % trivia.length,
      showAnswers: false,
    }));
  };

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
                      style={ { border: showAnswers && '3px solid rgb(6,  240, 15)' } }
                      key={ item }
                      type="button"
                      data-testid="correct-answer"
                      onClick={ this.handleClick }
                      disabled={ disabled }
                      name="correct-answer"
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
                    onClick={ this.handleClick }
                    disabled={ disabled }
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {showAnswers && (
          <button
            data-testid="btn-next"
            type="button"
            onClick={ this.nextBtn }
          >
            Next
          </button>
        )}

      </div>
    );
  }
}

Game.propTypes = {
  savePontuation: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  savePontuation: (value) => dispatch(pontuation(value)),
});

export default connect(null, mapDispatchToProps)(Game);
