import React, { useState } from 'react';
import { MusicProvider } from './context/MusicContext';
import Home from './pages/Home';
import LoadingScreen from './components/UI/LoadingScreen';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <MusicProvider>
      {!isUnlocked ? (
        <LoadingScreen onEnter={() => setIsUnlocked(true)} />
      ) : (
        <Home />
      )}
    </MusicProvider>
  );
}

export default App;
