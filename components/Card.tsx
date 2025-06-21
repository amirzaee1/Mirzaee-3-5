import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ children, className, title, icon, onClick }) => {
  return (
    <div
      className={`bg-gray-800 bg-opacity-70 shadow-xl rounded-xl p-6 border border-gray-700 hover:shadow-purple-500/30 transition-shadow duration-300 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center mb-4">
          {icon && <span className="mr-3 text-purple-400">{icon}</span>}
          <h3 className="text-xl font-estedad gold-text">{title}</h3>
        </div>
      )}
      <div className="text-gray-300 font-vazir">{children}</div>
    </div>
  );
};

export default Card;