import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'cancel';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  spinner?: boolean;
}

interface Sizes {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface Variants {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  cancel: string;
}

const Button = ({
  children,
  className,
  color = 'primary',
  size = 'md',
  disabled = false,
  spinner = false,
  ...props
}: ButtonProps) => {
  const variantClasses: Variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-black',
    warning: 'bg-warning text-black',
    danger: 'bg-danger text-white',
    cancel: 'bg-gray-400 text-white',
  };

  const sizeClasses: Sizes = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
    xl: 'text-xl py-4 px-8',
  };

  const buttonClasses = `rounded focus:outline-none focus:ring-0 ${
    sizeClasses[size]
  } ${variantClasses[color]} ${className} ${
    disabled
      ? 'opacity-50 cursor-default'
      : 'hover:bg-opacity-75 active:bg-opacity-50'
  }`;

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {children}
      {!!spinner && (
        <FontAwesomeIcon className="ms-1" icon={faCircleNotch} spin />
      )}
    </button>
  );
};

export default Button;
