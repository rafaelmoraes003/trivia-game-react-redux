import React from 'react';
import Header from '../components/Header';

class Game extends React.Component {
  render() {
    return (
      <div data-testid="game-div">
        <Header />
      </div>
    );
  }
}

export default Game;
