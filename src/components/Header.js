import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import './Header.css';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      picture: '',
    };
  }

  componentDidMount() {
    const { email } = this.props;
    const gravatarHash = md5(email).toString();
    const gravatarURL = `https://www.gravatar.com/avatar/${gravatarHash}`;
    this.setState({ picture: gravatarURL });
  }

  render() {
    const { picture } = this.state;
    const { name, score } = this.props;
    return (
      <header>
        <img
          data-testid="header-profile-picture"
          src={ picture }
          alt={ name }
        />
        <h2 data-testid="header-player-name">
          { name }
        </h2>
        <h2 data-testid="header-score">
          {`Score: ${score}`}
        </h2>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.player.name,
  email: state.player.gravatarEmail,
  score: state.player.score,
});

Header.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Header);
