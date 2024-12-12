import React from 'react';

interface EventLogProps {
  logs: string[];
}

const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 h-60 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Event Log</h2>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="text-sm text-gray-600">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLog;