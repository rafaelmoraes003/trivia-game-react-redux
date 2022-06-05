import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Header from '../components/Header';
import pontuation from '../redux/actions/pontuation';
import './Feedback.css';

class Feedback extends React.Component {
  componentDidMount() {
    // Atualizando o score no local storage - será útil no requisito 12
    const { score } = this.props;
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    ranking[ranking.length - 1].score = score;
    localStorage.setItem('ranking', JSON.stringify(ranking));
  }

  playAgainClick = () => {
    const { history, savePontuation } = this.props;
    savePontuation({ score: 0, assertions: 0 });
    history.push('/');
  }

  render() {
    const { assertions, score, history } = this.props;
    return (
      <div data-testid="feedback-text">
        {/* <Header /> */}
        <section data-testid="feedback-text" className="feedback-container">
          { assertions > 2 ? (<h2>Well Done!</h2>) : (<h2>Could be better...</h2>) }
          <h3 data-testid="feedback-total-question">
            {`Assertions: ${Number(assertions)}`}
          </h3>
          <h3 data-testid="feedback-total-score">
            {`Score: ${Number(score)}`}
          </h3>

          <button
            data-testid="btn-play-again"
            type="button"
            onClick={ this.playAgainClick }
            className="btn btn-primary"
          >
            Play Again
          </button>

          <button
            data-testid="btn-ranking"
            type="button"
            onClick={ () => history.push('/ranking') }
            className="btn btn-warning"
          >
            Ranking
          </button>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  savePontuation: (value) => (dispatch(pontuation(value))),
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  savePontuation: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
