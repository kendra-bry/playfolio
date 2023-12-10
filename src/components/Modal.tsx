export interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const modalClasses = isOpen
    ? 'fixed inset-0 flex items-center justify-center z-50'
    : 'hidden';
  return (
    <div className={modalClasses}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="absolute bg-white py-4 px-6 w-4/5 md:w-1/2 lg:w-1/3 rounded-md text-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose}>&#x1F5D9;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
