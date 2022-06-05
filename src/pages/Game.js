import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import pontuation from '../redux/actions/pontuation';
import './Game.css';

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
    this.interval = setInterval(() => {
      const { timer, showAnswers } = this.state;
      if (timer > 0 && !showAnswers) {
        this.setState((prevState) => ({
          timer: prevState.timer - 1,
          disabled: false,
        }));
      } else if (timer === 0 && !showAnswers) {
        this.setState({
          disabled: true,
          showAnswers: true,
          timer: 0,
        });
      }
    }, MAX_SECONDS);
  }

  fetchTrivia = async () => {
    const token = localStorage.getItem('token');
    const URL = localStorage.getItem('TriviaMOD')
      ? localStorage.getItem('TriviaMOD')
      : `https://opentdb.com/api.php?amount=5&token=${token}`;

    const triviaFetch = await fetch(URL);
    const response = await triviaFetch.json();
    if (response.response_code === 0) {
      this.setState({ trivia: response.results });
      const n = 0.5;
      const answers = response.results.map((item) => (
        [item.correct_answer, ...item.incorrect_answers].sort(() => Math.random() - n)
      ));
      this.setState({ answers });
    } else {
      const { history } = this.props;
      history.push('/');
    }
  }

  handleClick = (e) => {
    e.persist();
    this.setState((prevState) => ({
      timer: prevState.timer,
      showAnswers: true,
    }));
    const { trivia, index, timer, showAnswers } = this.state;
    const { name } = e.target;
    if (name === 'correct-answer' && !showAnswers) {
      this.setState((prevState) => ({
        assertions: prevState.assertions + 1,
      }));
      const { difficulty } = trivia[index];
      const base = 10;
      const db = { easy: 1, medium: 2, hard: 3 };
      let sumScore;
      Object.keys(db).forEach((item, i) => {
        if (difficulty === item) {
          sumScore = base + (timer * Object.values(db)[i]);
        }
      });

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
    const { trivia, index } = this.state;
    // const MAX_INDEX = 4;
    this.setState((prevState) => ({
      timer: 30,
      index: index >= 2 + 2 ? 2 + 2 : (prevState.index + 1) % trivia.length,
      showAnswers: false,
    }), () => {
      if (index >= 2 + 2) {
        // clearInterval(this.interval);
        const { history } = this.props;
        history.push('/feedback');
      }
    });
  };

  render() {
    const { trivia, index, answers, showAnswers, timer, disabled } = this.state;
    return (
      <div data-testid="game-page-div" className="game-container">
        <Header />
        {trivia.length > 0 && answers.length > 0 && (
          <div className="trivia">
            <p>
              <span
                className="timer-p"
              >
                Timer:
              </span>
              <span
                className="timer"
              >
                {timer}
              </span>
            </p>
            <p
              data-testid="question-category"
              className="question-category"
            >
              { trivia[index].category}
            </p>
            <p
              data-testid="question-text"
              className="question-text"
            >
              {trivia[index].question}
            </p>
            <div data-testid="answer-options" className="answer-options">
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
                      className="btn btn-dark"
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
                    className="btn btn-dark"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="next-btn">
          {showAnswers && (
            <button
              data-testid="btn-next"
              type="button"
              onClick={ this.nextBtn }
              className="btn btn-outline-warning"
            >
              Next
            </button>
          )}
        </div>

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
