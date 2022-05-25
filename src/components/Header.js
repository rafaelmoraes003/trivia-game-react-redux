import React from 'react';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      playerInfo: JSON.parse(localStorage.getItem('ranking')),
    };
  }

  render() {
    const { playerInfo } = this.state;
    return (
      <header>
        <img
          data-testid="header-profile-picture"
          src={ playerInfo[0].picture }
          alt={ playerInfo[0].name }
        />
        <h5 data-testid="header-player-name">{ playerInfo[0].name }</h5>
        <h5 data-testid="header-score">{ playerInfo[0].score }</h5>
      </header>
    );
  }
}

export default Header;
