import React from 'react';
import { Menu } from 'lucide-react';

type Problem = 'producer-consumer' | 'reader-writer' | 'dining-philosophers';

interface NavbarProps {
  selectedProblem: Problem;
  onProblemSelect: (problem: Problem) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedProblem, onProblemSelect }) => {
  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Menu className="h-6 w-6" />
          <h1 className="text-xl font-bold">Synchronization Problems</h1>
        </div>
        <div className="flex space-x-4">
          {['producer-consumer', 'reader-writer', 'dining-philosophers'].map((problem) => (
            <button
              key={problem}
              onClick={() => onProblemSelect(problem as Problem)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedProblem === problem
                  ? 'bg-white text-indigo-600'
                  : 'hover:bg-indigo-500'
              }`}
            >
              {problem.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;