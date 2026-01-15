
import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg';
  
  return (
    <div className={`flex items-center gap-1 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRatingChange?.(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-200'
          } transition-colors`}
        >
          <i className={`fa-star ${star <= rating ? 'fas' : 'far'}`}></i>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
