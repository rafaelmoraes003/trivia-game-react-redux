import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import username from '../redux/actions/username';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  enableButton = () => {
    const { name, email } = this.state;
    const regex = /^.*@.*\.com$/;
    return name.length > 0 && email.length > 0 && email.match(regex);
  }

  sendNameToGlobalState = async () => {
    const { sendName, history } = this.props;
    sendName(this.state);

    const { name, email } = this.state;
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json(); // TOKEN API

    const gravatarHash = md5(email).toString(); // IMAGEM GRAVATAR
    const gravatarURL = `https://www.gravatar.com/avatar/${gravatarHash}`;

    const ranking = [{ name, score: 0, picture: gravatarURL }];

    localStorage.setItem('ranking', JSON.stringify(ranking));
    localStorage.setItem('token', data.token);

    history.push('/game');
  };

  settingsButton = () => {
    const { history } = this.props;
    history.push('/settings');
  }

  render() {
    return (
      <div>
        <form>
          <label htmlFor="name">
            Nome
            <input
              type="text"
              name="name"
              id="name"
              data-testid="input-player-name"
              onChange={ this.handleChange }
            />
          </label>

          <label htmlFor="email">
            Email
            <input
              type="text"
              name="email"
              id="email"
              data-testid="input-gravatar-email"
              onChange={ this.handleChange }
            />
          </label>

          <button
            type="button"
            data-testid="btn-play"
            disabled={ !this.enableButton() }
            onClick={ this.sendNameToGlobalState }
          >
            Play
          </button>
        </form>
        <button
          type="button"
          data-testid="btn-settings"
          onClick={ this.settingsButton }
        >
          Settings
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendName: (value) => dispatch(username(value)),
});

export default connect(null, mapDispatchToProps)(Login);

Login.propTypes = {
  sendName: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
