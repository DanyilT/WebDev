import React, { useState, useEffect } from 'react';
import Player from './Player';
import Dealer from './Dealer';
import Score from './Score';
import Controls from './Controls';

const Game = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  useEffect(() => {
    fetch('/api/game-state')
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.playerHand);
        setDealerHand(data.dealerHand);
        setPlayerScore(data.playerScore);
        setDealerScore(data.dealerScore);
      });
  }, []);

  const handleHit = () => {
    fetch('/api/hit', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.playerHand);
        setPlayerScore(data.playerScore);
      });
  };

  const handleStand = () => {
    fetch('/api/stand', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setDealerHand(data.dealerHand);
        setDealerScore(data.dealerScore);
      });
  };

  const handleNewGame = () => {
    fetch('/api/new-game', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setPlayerHand(data.playerHand);
        setDealerHand(data.dealerHand);
        setPlayerScore(data.playerScore);
        setDealerScore(data.dealerScore);
      });
  };

  return (
    <div>
      <Player cards={playerHand} onHit={handleHit} onStand={handleStand} />
      <Dealer cards={dealerHand} />
      <Score playerScore={playerScore} dealerScore={dealerScore} />
      <Controls onNewGame={handleNewGame} />
    </div>
  );
};

export default Game;
