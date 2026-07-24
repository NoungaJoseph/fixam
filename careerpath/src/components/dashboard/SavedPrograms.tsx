import { Bookmark, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SavedPrograms({ savedPrograms }: { savedPrograms: any[] }) {

  if (!savedPrograms || savedPrograms.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-bold text-gray-800">Saved for Later</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {savedPrograms.map((prog, index) => (
          <Link
            key={index}
            to={`/career-paths/${prog.categoryKey}`}
            className="bg-white border border-gray-250 rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:border-primary hover:shadow-sm cursor-pointer group"
          >
            {/* Card Image */}
            <div className="relative w-full h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
              <img
                src={`/images/${prog.categoryKey}.jpg`}
                alt={prog.categoryKey}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 capitalize leading-snug">
                {prog.categoryKey.replace('-', ' ')}
              </h3>
              <div className="mt-3 text-xs font-semibold text-primary flex items-center gap-1">
                <Play className="w-3.5 h-3.5" />
                View Details
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
