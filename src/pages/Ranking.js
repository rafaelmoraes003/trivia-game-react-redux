import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import pontuation from '../redux/actions/pontuation';
import './Ranking.css';

class Ranking extends React.Component {
  constructor() {
    super();
    this.state = {
      ranking: [],
    };
  }

  componentDidMount() {
    const sortedRanking = JSON.parse(localStorage.getItem('ranking'))
      .sort((a, b) => b.score - a.score);
    this.setState({ ranking: sortedRanking });
  }

  backHome = () => {
    const { history, savePontuation } = this.props;
    savePontuation({ score: 0, assertions: 0 });
    history.push('/');
  }

  render() {
    const { ranking } = this.state;
    return (
      <div data-testid="ranking-title" className="ranking-container">
        {ranking.map(({ name, picture, score }, index) => (
          <div key={ index } className="ranking">
            <img
              style={ { display: 'none' } }
              alt={ name }
              src={ picture }
            />
            <h2 className="position">{`#${index + 1}`}</h2>
            <h3 data-testid={ `player-name-${index}` }>
              {name}
            </h3>
            <h3 data-testid={ `player-score-${index}` }>
              {score}
            </h3>
          </div>
        ))}
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.backHome }
          className="btn btn-dark"
        >
          Home
        </button>
      </div>);
  }
}

const mapDispatchToProps = (dispatch) => ({
  savePontuation: (value) => (dispatch(pontuation(value))),
});

export default connect(null, mapDispatchToProps)(Ranking);

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  savePontuation: PropTypes.func.isRequired,
};
