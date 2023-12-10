import { useField } from 'formik';

interface TextAreaProps {
  name: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
}

const TextArea = ({ label, ...props }: TextAreaProps) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-gray-600 text-sm font-bold mb-1"
          htmlFor={props.name}
        >
          {label}
        </label>
      )}
      <textarea
        className="border rounded-md w-full p-2 text-gray-800"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextArea;
