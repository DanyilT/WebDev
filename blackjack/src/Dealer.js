import React from 'react';
import Card from './Card';

const Dealer = ({ cards }) => {
  return (
    <div>
      <h2>Dealer</h2>
      <div>
        {cards.map((card, index) => (
          <Card key={index} suit={card.suit} value={card.value} />
        ))}
      </div>
    </div>
  );
};

export default Dealer;
