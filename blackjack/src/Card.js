import React from 'react';

const Card = ({ suit, value }) => {
  return (
    <div className="card">
      <div className="card-value">{value}</div>
      <div className="card-suit">{suit}</div>
    </div>
  );
};

export default Card;
