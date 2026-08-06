import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const ReviewCard = ({ review, onClick }) => {
  return (
    <div
      onClick={() => onClick(review.id)}
      className="flex-shrink-0 w-80 bg-[#f4f4f4] dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1 active:scale-95 active:translate-x-2 select-none"
    >
      <div>
        {/* Header: User Info & Google Logo */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {review.avatar ? (
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                {review.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">
                {review.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">{review.timeAgo}</p>
            </div>
          </div>

          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        {/* Stars and Verification Badge */}
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-amber-400 text-amber-400"
            />
          ))}
          <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white ml-1" />
        </div>

        {/* Review Text */}
        <p className="text-gray-800 dark:text-slate-200 text-sm font-medium leading-relaxed">
          {review.text}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;