/* eslint-disable react/prop-types */
const SearchInput = ({ value, onChange, placeholder }) => (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
  
  export default SearchInput;
  