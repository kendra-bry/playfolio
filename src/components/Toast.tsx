import { useState, useEffect } from 'react';

export type ToastProps = {
  message: string;
  visible: boolean;
  type?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
  timer?: number;
  noTimeout?: boolean;
};

const Toast = ({
  message,
  visible,
  type = 'primary',
  timer = 3000,
  noTimeout = false,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (noTimeout) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, timer);

    return () => clearTimeout(timeoutId);
  }, [isVisible, timer, noTimeout]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const toastClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-black',
    warning: 'bg-warning text-black',
    danger: 'bg-danger text-white',
  };

  return (
    <div
      className={`fixed top-0 right-0 m-6 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`${toastClasses[type]} py-2 ps-3 pe-10 rounded relative`}>
        <button
          title="Close"
          onClick={handleClose}
          className="absolute top-0 right-0 mx-2"
        >
          &#x1F5D9;
        </button>
        {message}
      </div>
    </div>
  );
};

export default Toast;
