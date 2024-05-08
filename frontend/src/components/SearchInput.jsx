/* eslint-disable react/prop-types */

// Defines a reusable SearchInput component that renders a text input field.
const SearchInput = ({ value, onChange, placeholder }) => (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
  
  export default SearchInput;
  