import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="title-logo">GameHub</Link>
    </header>
  );
};

export default Header;
