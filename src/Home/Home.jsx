/* src/Home/Home.jsx */
import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import ambient from '../assets/ambient.mp3';
import Board from '../Board/Board.jsx';
import {
  Body1, Body2, Body3, Body4,
  Eyes1, Eyes2, Eyes3, Eyes4,
  Hair1, Hair2, Hair3,
  Mouth1, Mouth2, Mouth3, Mouth4
} from './Accessories/AccessoriesImport.jsx';
import Accessories from './Accessories/Accessories.jsx';
import Player from '../Player/Player.jsx';

// Organize assets by category
const assets = {
  body:   [Body1, Body2, Body3, Body4],
  eyes:   [Eyes1, Eyes2, Eyes3, Eyes4],
  hair:   [Hair1, Hair2, Hair3],
  mouth:  [Mouth1, Mouth2, Mouth3, Mouth4]
};

// Define preview sizes for each type
const PREVIEW_SIZES = {
  body:   250,
  eyes:    172,
  hair:    150,
  mouth:   150
};

// Sequence of steps
const STEPS = ['body', 'eyes', 'hair', 'mouth'];

function Home() {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState({ body: null, eyes: null, hair: null, mouth: null });
  const [isFading, setIsFading] = useState(false);
  const audioRef = useRef(new Audio(ambient));
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;

    const resumeAndPlay = () => {
      audio.play().catch(e => console.warn('Audio play prevented:', e));
      document.removeEventListener('click', resumeAndPlay);
    };

    document.addEventListener('click', resumeAndPlay);
    return () => {
      audio.pause();
      document.removeEventListener('click', resumeAndPlay);
    };
  }, []);

  // Handle selection with fade-out transition
  const handleSelect = ({ src, type, size }) => {
    // only proceed if there's a valid step
    if (step >= STEPS.length) return;
    setIsFading(true);
    const currentKey = STEPS[step];
    const nextStep = step + 1;

    setTimeout(() => {
      setSelection(prev => ({ ...prev, [currentKey]: src }));
      setStep(nextStep);
      setIsFading(false);
    }, 300);

    setSelected(prev => ([
      ...prev,
      { src, type, size }
    ]));
  };

  // Build the list of assets for the current step, including size
  const currentAssets = () => {
    if (step < 0 || step >= STEPS.length) return [];
    const type = STEPS[step];
    return assets[type].map(asset => ({
      src: asset,
      type,
      size: PREVIEW_SIZES[type]
    }));
  };

  return (
    <div className="main-canvas">
      <Board selection={selection} />

      {/* only show accessory picker while steps remain */}
      {step < STEPS.length && (
        <div className="container">
          <div className={`accessories-container ${isFading ? 'fade-out' : 'fade-in'}`}>
            {currentAssets().map(({ src, type, size }, idx) => (
              <Accessories
                key={idx}
                gifPath={src}
                size={size}
                alt={`${type}-option-${idx}`}
                onClick={() => handleSelect({ src, type, size })}
              />
            ))}
          </div>
        </div>
      )}

      <Player selectedAccessories={selected} />
    </div>
  );
}

export default Home;

/* src/Player/Player.jsx remains unchanged */
