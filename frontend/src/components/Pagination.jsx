/* eslint-disable react/prop-types */
const Pagination = ({ page, totalPages, onPageChange }) => (
    <div>
      <button onClick={() => onPageChange(1)} disabled={page <= 1}>First</button>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Previous</button>
      Page {page} of {totalPages}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</button>
      <button onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}>Last</button>
    </div>
  );
  
  export default Pagination;
  