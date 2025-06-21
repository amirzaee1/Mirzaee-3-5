import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glowEffect?: boolean;
  breathing?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glowEffect = false,
  breathing = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center space-x-2 space-x-reverse';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg gold-border border-2';
      if (glowEffect) variantStyles += ' button-glow';
      break;
    case 'secondary':
      variantStyles = 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md gold-border border';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border-2 gold-border text-yellow-400 hover:bg-yellow-400 hover:text-gray-900';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-6 py-2.5 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-8 py-3 text-lg';
      break;
  }

  const animationClass = breathing ? 'breathing-animation' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${animationClass} ${className}`}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
