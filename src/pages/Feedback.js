import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    const { assertions } = this.props;
    console.log(assertions);
    return (
      <div data-testid="feedback-text">
        <Header />
        <section data-testid="feedback-text">
          { assertions > 2 ? (<h5>Well Done!</h5>) : (<h5>Could be better...</h5>) }
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Feedback);
