import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import useChartData from './hooks/useChartData';
import SearchInput from './components/SearchInput';
import Pagination from './components/Pagination';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // State variables for storing search inputs and pagination details
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { chartData, loading, error, totalPages, fetchData } = useChartData();

  // Effect hook to fetch data when search inputs or pagination details change
  useEffect(() => {
    const params = new URLSearchParams({
      name: searchTerm,
      genre: genre,
      platform: platform,
      year: year,
      publisher: publisher,
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    fetchData(params);
  }, [searchTerm, genre, platform, year, publisher, page, pageSize, fetchData]);

  // Function to handle input change and filter out non-alphanumeric characters
  const handleInputChange = (value, setter) => {
    const filteredValue = value.replace(/[^a-z0-9 ]/gi, '');
    setter(filteredValue);
  };

  return (
    <div className="App">
      <h1>Data Visualization on Video Game Sales</h1>
      <SearchInput 
        value={searchTerm} 
        onChange={(e) => handleInputChange(e.target.value, setSearchTerm)} 
        placeholder="Search Games by Name" 
      />
      <SearchInput 
        value={genre} 
        onChange={(e) => handleInputChange(e.target.value, setGenre)} 
        placeholder="Search Games by Genre" 
      />
      <SearchInput 
        value={platform} 
        onChange={(e) => handleInputChange(e.target.value, setPlatform)} 
        placeholder="Search Games by Platform" 
      />
      <SearchInput 
        value={year} 
        onChange={(e) => handleInputChange(e.target.value, setYear)} 
        placeholder="Search Games by Year" 
      />
      <SearchInput 
        value={publisher} 
        onChange={(e) => handleInputChange(e.target.value, setPublisher)} 
        placeholder="Search Games by Publisher" 
      />
      <div>
        <label>Page Size: </label>
        <input
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          min={1}
          style={{ width: '60px' }}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <Bar data={chartData} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default App;
