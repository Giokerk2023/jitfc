import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Section = ({ title, children, level = 1 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const bgColors = {
    1: 'bg-blue-50',
    2: 'bg-blue-100',
    3: 'bg-blue-200'
  };

  return (
    <div className={`border-l-4 border-blue-500 mb-2 ${bgColors[level]} rounded-lg overflow-hidden`}>
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left p-4 font-semibold flex items-center justify-between hover:bg-opacity-50">
        {title}
        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      {isExpanded && <div className="p-4">{children}</div>}
    </div>
  );
};

export default Section;