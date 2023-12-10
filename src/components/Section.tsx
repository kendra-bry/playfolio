import React, { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

const Section = ({ children, className, ...props }: SectionProps) => {
  return (
    <section className={`${className} p-4 flex flex-col justify-center`} {...props}>
      {children}
    </section>
  );
};

export default Section;
