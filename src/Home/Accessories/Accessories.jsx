import React from 'react';
import './Accessories.css';

const Accessories = ({
  gifPath,
  alt = 'animation',
  size = 10,
  className = '',
  onClick
}) => (
  <div
    className={`accessories ${className}`}
    style={{
      '--size': `${size}px`
    }}
    onClick={onClick}
  >
    <img
      src={gifPath}
      alt={alt}
      className="accessories__image"
    />
  </div>
);

export default Accessories;
