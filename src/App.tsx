import React from 'react';
import Game from './components/Game';

import { AudioPlayerProvider } from './contexts/AudioContext';

function App() {
  return (
    <div className="App">
      <AudioPlayerProvider>
        <Game />
      </AudioPlayerProvider>
    </div>
  );
}

export default App;
