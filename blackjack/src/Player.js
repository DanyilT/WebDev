import React from 'react';
import Card from './Card';

const Player = ({ cards, onHit, onStand }) => {
  return (
    <div>
      <h2>Player</h2>
      <div>
        {cards.map((card, index) => (
          <Card key={index} suit={card.suit} value={card.value} />
        ))}
      </div>
      <button onClick={onHit}>Hit</button>
      <button onClick={onStand}>Stand</button>
    </div>
  );
};

export default Player;
