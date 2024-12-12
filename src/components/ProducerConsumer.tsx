import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const ProducerConsumer: React.FC = () => {
  const [buffer, setBuffer] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const BUFFER_SIZE = 5;
  const PRODUCER_INTERVAL = 5000; // 5 seconds between production attempts
  const CONSUMER_INTERVAL = 7000; // 7 seconds between consumption attempts
  const OPERATION_DELAY = 1000; // 1 second delay for each operation to be visible

  const producerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const consumerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleStart = () => {
    // Check if intervals are already running
    if (producerIntervalRef.current || consumerIntervalRef.current) {
      addLog("Simulation already running.");
      return;
    }

    setIsRunning(true);
    addLog("Simulation started...");

    // Producer interval
    producerIntervalRef.current = setInterval(() => {
      setBuffer(prevBuffer => {
        if (prevBuffer.length < BUFFER_SIZE) {
          const newBuffer = [...prevBuffer, "item"];
          setTimeout(() => {
            addLog(`Producer: Added an item to buffer. (Buffer: ${newBuffer.length}/${BUFFER_SIZE})`);
          }, OPERATION_DELAY);
          return newBuffer;
        } else {
          setTimeout(() => {
            addLog("Producer: Buffer is FULL. Waiting...");
          }, OPERATION_DELAY);
          return prevBuffer;
        }
      });
    }, PRODUCER_INTERVAL);

    // Consumer interval
    consumerIntervalRef.current = setInterval(() => {
      setBuffer(prevBuffer => {
        if (prevBuffer.length > 0) {
          const newBuffer = prevBuffer.slice(1);
          setTimeout(() => {
            addLog(`Consumer: Removed an item from buffer. (Buffer: ${newBuffer.length}/${BUFFER_SIZE})`);
          }, OPERATION_DELAY);
          return newBuffer;
        } else {
          setTimeout(() => {
            addLog("Consumer: Buffer is EMPTY. Waiting...");
          }, OPERATION_DELAY);
          return prevBuffer;
        }
      });
    }, CONSUMER_INTERVAL);
  };

  const handleReset = () => {
    // Stop intervals
    if (producerIntervalRef.current) {
      clearInterval(producerIntervalRef.current);
      producerIntervalRef.current = null;
    }

    if (consumerIntervalRef.current) {
      clearInterval(consumerIntervalRef.current);
      consumerIntervalRef.current = null;
    }

    // Reset state
    setBuffer([]);
    setIsRunning(false);
    setLogs([]);
    addLog("Simulation reset.");
  };

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

      <div className="flex space-x-4 mb-6">
        {Array(BUFFER_SIZE).fill(null).map((_, index) => (
          <div
            key={index}
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold transition-colors ${
              index < buffer.length ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            {index < buffer.length ? "Item" : ""}
          </div>
        ))}
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

export default ProducerConsumer;