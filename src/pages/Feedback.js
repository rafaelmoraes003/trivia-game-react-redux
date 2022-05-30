import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import pontuation from '../redux/actions/pontuation';

class Feedback extends React.Component {
  playAgainClick = () => {
    const { history, savePontuation } = this.props;
    savePontuation({ score: 0, assertions: 0 });
    history.push('/');
  }

  render() {
    const { assertions, score, history } = this.props;
    return (
      <div data-testid="feedback-text">
        <Header />
        <section data-testid="feedback-text">
          { assertions > 2 ? (<h3>Well Done!</h3>) : (<h3>Could be better...</h3>) }
          <p data-testid="feedback-total-question">
            {Number(assertions)}
          </p>
          <p data-testid="feedback-total-score">
            {Number(score)}
          </p>

          <button
            data-testid="btn-play-again"
            type="button"
            onClick={ this.playAgainClick }
          >
            Play Again
          </button>

          <button
            data-testid="btn-ranking"
            type="button"
            onClick={ () => history.push('/ranking') }
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
