import React from 'react';

const Controls = ({ onNewGame, onResetGame }) => {
  return (
    <div>
      <button onClick={onNewGame}>New Game</button>
      <button onClick={onResetGame}>Reset Game</button>
    </div>
  );
};

export default Controls;
