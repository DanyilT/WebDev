import React from 'react';

const Score = ({ playerScore, dealerScore }) => {
  return (
    <div>
      <h2>Scores</h2>
      <p>Player: {playerScore}</p>
      <p>Dealer: {dealerScore}</p>
    </div>
  );
};

export default Score;
