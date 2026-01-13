
import React from 'react';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b1528] selection:bg-cyan-500 selection:text-white">
      <LandingPage />
    </div>
  );
};

export default App;
