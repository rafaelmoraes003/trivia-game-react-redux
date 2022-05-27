import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    const { assertions, score } = this.props;
    return (
      <div data-testid="feedback-text">
        <Header />
        <section data-testid="feedback-text">
          { assertions > 2 ? (<h3>Well Done!</h3>) : (<h3>Could be better...</h3>) }
          <span data-testid="feedback-total-question">
            {Number(assertions)}
          </span>
          <p data-testid="feedback-total-score">
            {Number(score)}
          </p>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Feedback);
