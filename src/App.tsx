import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProducerConsumer from './components/ProducerConsumer';
import ReaderWriter from './components/ReaderWriter';
import DiningPhilosophers from './components/DiningPhilosophers';

type Problem = 'producer-consumer' | 'reader-writer' | 'dining-philosophers';

function App() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>('producer-consumer');

  const renderProblem = () => {
    switch (selectedProblem) {
      case 'producer-consumer':
        return <ProducerConsumer />;
      case 'reader-writer':
        return <ReaderWriter />;
      case 'dining-philosophers':
        return <DiningPhilosophers />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar selectedProblem={selectedProblem} onProblemSelect={setSelectedProblem} />
      <main className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md">
          {renderProblem()}
        </div>
      </main>
    </div>
  );
}

export default App;