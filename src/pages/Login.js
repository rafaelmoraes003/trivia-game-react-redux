import React from 'react';
import PropTypes from 'prop-types';
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

  sendNameToGlobalState = () => {
    const { name } = this.state;
    const { sendName } = this.props;
    sendName(name);
  }

  render() {
    return (
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
