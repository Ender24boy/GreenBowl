import { useState, useEffect, useRef } from 'react';
import './Home/Home.css';
import blubert from './assets/blubert_idle.gif';
import blubert_inter from './assets/blubert_interrupt.gif';
import blubertSound from './assets/interrupt.mp3';

export default function Blubert() {
  const [state, setState] = useState('idle');
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(blubertSound);
    audioRef.current.load();
  }, []);

  const handleClick = () => {
    setState('interrupt');
    setFadeOut(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    let timer;
    if (fadeOut) {
      timer = setTimeout(() => {
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [fadeOut]);

  const currentSrc = state === 'interrupt' ? blubert_inter : blubert;
  const imgClass = `blubert ${fadeOut ? 'fade-out' : ''}`;

  return (
    <div className="container">
      <img
        src={currentSrc}
        className={imgClass}
        alt="Blubert"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}
