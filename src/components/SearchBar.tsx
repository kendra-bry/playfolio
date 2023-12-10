import React, { FormHTMLAttributes, useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';

type OmittedFormAttributes = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
>;

interface SearchBarProps extends OmittedFormAttributes {
  className?: string;
  inputClass?: string;
  buttonClass?: string;
  isLoading?: boolean;
  onSubmit: (searchTerm: string) => Promise<void>;
}

const SearchBar = ({
  className,
  inputClass,
  buttonClass,
  onSubmit,
  isLoading,
  ...props
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(searchTerm);
  };

  return (
    <form className={className} onSubmit={handleSubmit} {...props}>
      <input
        type="text"
        placeholder="eg. The Witcher 3"
        className={inputClass}
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit" className={buttonClass}>
        {!isLoading && <FontAwesomeIcon icon={faMagnifyingGlass} />}
        {!!isLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}
      </button>
    </form>
  );
};

export default SearchBar;
