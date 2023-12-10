interface CardProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

const Card = ({ children, className, title }: CardProps) => {
  return (
    <div className={`${className} shadow rounded-lg`}>
      {title && <div className="text-2xl">{title}</div>}
      {children}
    </div>
  );
};

export default Card;
