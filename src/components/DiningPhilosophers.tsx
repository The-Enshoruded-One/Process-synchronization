import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Utensils } from 'lucide-react';

interface Philosopher {
  id: number;
  status: 'thinking' | 'hungry' | 'waiting' | 'eating';
  timeSinceLastStateChange: number;
}

const DiningPhilosophers: React.FC = () => {
  const PHILOSOPHER_COUNT = 5;
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [forks, setForks] = useState<boolean[]>(Array(PHILOSOPHER_COUNT).fill(false));
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Strict check to prevent adjacent philosophers from eating
  const canEat = (philosopherId: number, philosophers: Philosopher[]): boolean => {
    const leftNeighbor = (philosopherId - 1 + PHILOSOPHER_COUNT) % PHILOSOPHER_COUNT;
    const rightNeighbor = (philosopherId + 1) % PHILOSOPHER_COUNT;
    const leftFork = philosopherId;
    const rightFork = (philosopherId + 1) % PHILOSOPHER_COUNT;

    // Extended conditions for eating
    return (
      philosophers[leftNeighbor].status !== 'eating' &&
      philosophers[rightNeighbor].status !== 'eating' &&
      !forks[leftFork] &&
      !forks[rightFork]
    );
  };

  const initializePhilosophers = () => {
    setPhilosophers(
      Array(PHILOSOPHER_COUNT)
        .fill(null)
        .map((_, index) => ({
          id: index,
          status: 'thinking',
          timeSinceLastStateChange: 0
        }))
    );
  };

  const handleStart = () => {
    setIsRunning(true);
    initializePhilosophers();
    addLog('Started dining philosophers simulation');
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhilosophers([]);
    setForks(Array(PHILOSOPHER_COUNT).fill(false));
    setLogs([]);
    addLog('Reset simulation');
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setPhilosophers((prev) => {
          const newPhilosophers = prev.map(p => ({
            ...p,
            timeSinceLastStateChange: p.timeSinceLastStateChange + 1
          }));

          newPhilosophers.forEach((philosopher, index) => {
            const leftFork = index;
            const rightFork = (index + 1) % PHILOSOPHER_COUNT;

            switch (philosopher.status) {
              case 'thinking':
                // Stay in thinking state longer
                if (philosopher.timeSinceLastStateChange >= 5 && Math.random() < 0.3) {
                  philosopher.status = 'hungry';
                  philosopher.timeSinceLastStateChange = 0;
                  addLog(`Philosopher ${philosopher.id + 1} is hungry`);
                }
                break;

              case 'hungry':
                if (canEat(index, newPhilosophers) && philosopher.timeSinceLastStateChange >= 2) {
                  // Acquire forks
                  setForks((prevForks) => {
                    const newForks = [...prevForks];
                    newForks[leftFork] = true;
                    newForks[rightFork] = true;
                    return newForks;
                  });

                  philosopher.status = 'eating';
                  philosopher.timeSinceLastStateChange = 0;
                  addLog(`Philosopher ${philosopher.id + 1} is eating`);
                } else if (philosopher.timeSinceLastStateChange >= 3) {
                  philosopher.status = 'waiting';
                  philosopher.timeSinceLastStateChange = 0;
                  addLog(`Philosopher ${philosopher.id + 1} is waiting`);
                }
                break;

              case 'waiting':
                if (canEat(index, newPhilosophers) && philosopher.timeSinceLastStateChange >= 2) {
                  // Acquire forks
                  setForks((prevForks) => {
                    const newForks = [...prevForks];
                    newForks[leftFork] = true;
                    newForks[rightFork] = true;
                    return newForks;
                  });

                  philosopher.status = 'eating';
                  philosopher.timeSinceLastStateChange = 0;
                  addLog(`Philosopher ${philosopher.id + 1} is now eating`);
                }
                break;

              case 'eating':
                // Stay in eating state longer
                if (philosopher.timeSinceLastStateChange >= 4) {
                  // Put down forks
                  setForks((prevForks) => {
                    const newForks = [...prevForks];
                    newForks[leftFork] = false;
                    newForks[rightFork] = false;
                    return newForks;
                  });

                  philosopher.status = 'thinking';
                  philosopher.timeSinceLastStateChange = 0;
                  addLog(`Philosopher ${philosopher.id + 1} is thinking after eating`);
                }
                break;
            }
          });
          
          return newPhilosophers;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          <span>Start</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>

      <div className="relative w-80 h-80 mx-auto mb-6">
        {philosophers.map((philosopher, index) => {
          const angle = (index * 2 * Math.PI) / PHILOSOPHER_COUNT;
          const radius = 120;
          const x = radius * Math.cos(angle) + radius;
          const y = radius * Math.sin(angle) + radius;

          return (
            <div
              key={philosopher.id}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                philosopher.status === 'thinking'
                  ? 'bg-blue-500'
                  : philosopher.status === 'hungry'
                  ? 'bg-yellow-500'
                  : philosopher.status === 'waiting'
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              }`}
            >
              <Utensils className="h-8 w-8 text-white" />
              <span className="absolute bottom-0 right-0 text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center">
                {philosopher.id + 1}
              </span>
            </div>
          );
        })}
        {/* Visualize Forks */}
        {/* {forks.map((fork, index) => {
          const angle = ((index + 0.5) * 2 * Math.PI) / PHILOSOPHER_COUNT;
          const radius = 90;
          const x = radius * Math.cos(angle) + radius + 30;
          const y = radius * Math.sin(angle) + radius + 30;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`w-6 h-6 rounded-full border-2 border-gray-400 ${
                fork ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <span className="text-xs absolute -top-6 left-1/2 transform -translate-x-1/2">
                Fork {index + 1}
              </span>
            </div>
          );
        })} */}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
        <h3 className="font-bold mb-2">Event Log</h3>
        <div>
          {logs.map((log, index) => (
            <div key={index} className="text-sm">{log}</div>
          ))}
          <div ref={logEndRef} /> {/* Anchor for auto-scrolling */}
        </div>
      </div>
    </div>
  );
};

export default DiningPhilosophers;