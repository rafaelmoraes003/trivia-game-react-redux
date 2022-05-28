import React from 'react';
import PropTypes from 'prop-types';

class Ranking extends React.Component {
  backHome = () => {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    return (
      <div data-testid="ranking-title">
        <span>Ranking</span>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.backHome }
        >
          Início
        </button>
      </div>);
  }
}

export default Ranking;

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
