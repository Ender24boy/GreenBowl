import React from 'react';
import './Player.css';

const LAYOUT_MAP = {
  body:  { width: 250, height: 250, top:   0, left:   0 },
  eyes:  { width:  72, height:  50, top:  50, left:  90 },
  hair:  { width:  43, height:  54, top: -40, left: 100 },
  mouth: { width:  50, height:  40, top: 100, left: 100 }
};

const Player = ({ selectedAccessories = [] }) => (
  <div className="player">
    {selectedAccessories.map(({ src, type, size }, i) => {
      const layout = LAYOUT_MAP[type] || {};
      const width  = layout.width  ?? size;
      const height = layout.height ?? size;
      const top    = layout.top    || 0;
      const left   = layout.left   || 0;

      return (
        <img
          key={i}
          src={src}
          alt={`${type}-${i}`}
          className="player__item"
          style={{
            animationDelay: `${i * 0.5}s`,
            width:  `${width}px`,
            height: `${height}px`,
            top:    `${top}px`,
            left:   `${left}px`,
          }}
        />
      );
    })}
  </div>
);

export default Player;