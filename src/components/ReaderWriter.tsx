import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowDown } from 'lucide-react';

interface EventLogProps {
  logs: string[];
}

const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAutoScrollEnabled && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScrollEnabled]);

  const toggleAutoScroll = () => {
    setIsAutoScrollEnabled(!isAutoScrollEnabled);
  };

  return (
    <div className="relative bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
      <button 
        onClick={toggleAutoScroll}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
          isAutoScrollEnabled 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-300 text-gray-700'
        }`}
        title={isAutoScrollEnabled ? 'Disable Autoscroll' : 'Enable Autoscroll'}
      >
        <ArrowDown className="h-4 w-4" />
      </button>
      <div>
        {logs.map((log, index) => (
          <div 
            key={index} 
            className="text-sm text-gray-800 border-b border-gray-200 py-1 last:border-b-0"
          >
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

const ReaderWriter: React.FC = () => {
  const [buffer, setBuffer] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isWriterActive, setIsWriterActive] = useState(false);
  const [activeReaders, setActiveReaders] = useState<number[]>([]);
  const BUFFER_SIZE = 1; // Single buffer for simplicity in this demo
  const READER_COUNT = 3;
  const READER_CYCLE_DURATION = 5000; // Time readers can be active before stopping
  const WRITER_DURATION = 2000; // Time writer takes to write
  
  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleStart = () => {
    setIsRunning(true);
    setBuffer(['empty']); // Initialize buffer with an "empty" status
    addLog('Started Reader-Writer simulation');
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWriterActive(false);
    setActiveReaders([]);
    setBuffer([]);
    setLogs([]);
    addLog('Reset simulation');
  };

  useEffect(() => {
    if (isRunning) {
      let readerCycleTimeout: NodeJS.Timeout | null = null;

      const startReaderCycle = () => {
        addLog('Readers active');
        const readerInterval = setInterval(() => {
          if (!isWriterActive) {
            const newReader = Math.floor(Math.random() * READER_COUNT);
            if (!activeReaders.includes(newReader)) {
              setActiveReaders((prev) => [...prev, newReader]);
              addLog(`Reader ${newReader + 1} started reading`);
              setTimeout(() => {
                setActiveReaders((prev) => prev.filter((reader) => reader !== newReader));
                addLog(`Reader ${newReader + 1} finished reading`);
              }, 1500); // Individual reading duration
            }
          }
        }, 1000); // Reader attempts every second

        readerCycleTimeout = setTimeout(() => {
          clearInterval(readerInterval);
          setActiveReaders([]);
          addLog('Readers stopped to allow writer');
          startWriterCycle();
        }, READER_CYCLE_DURATION);
      };

      const startWriterCycle = () => {
        setIsWriterActive(true);
        addLog('Writer started writing');
        setBuffer(['full']); // Writer writes to the buffer

        setTimeout(() => {
          setIsWriterActive(false);
          setBuffer(['empty']); // Reset buffer after writing
          addLog('Writer finished writing');
          startReaderCycle();
        }, WRITER_DURATION);
      };

      startReaderCycle();

      return () => {
        if (readerCycleTimeout) clearTimeout(readerCycleTimeout);
      };
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

      <div className="flex space-x-4 mb-6">
        <div
          className={`w-32 h-32 flex items-center justify-center text-white font-bold rounded-lg ${
            isWriterActive ? 'bg-red-500' : 'bg-gray-300'
          }`}
        >
          Writer
        </div>
        <div className="flex space-x-4">
          {Array.from({ length: READER_COUNT }, (_, index) => (
            <div
              key={index}
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold transition-colors ${
                isWriterActive
                  ? 'bg-gray-400'
                  : activeReaders.includes(index)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            >
              Reader {index + 1}
            </div>
          ))}
        </div>
      </div>

      <EventLog logs={logs} />
    </div>
  );
};

export default ReaderWriter;