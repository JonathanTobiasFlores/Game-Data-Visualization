import { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  
  const fetchData = useCallback(async () => {
    const params = new URLSearchParams({
      name: searchTerm,
      genre: genre,
      platform: platform,
      year: year,         
      publisher: publisher,
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    try {
      const response = await fetch(`http://localhost:8000/data?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChartData(transformDataToChartData(data));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [searchTerm, genre, platform, year, publisher, page, pageSize]);  // Dependencies of fetchData

  useEffect(() => {
    fetchData();
  }, [fetchData]);  // Depend only on fetchData, which itself depends on the search parameters

  const handleNameSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreSearch = (event) => {
    setGenre(event.target.value);
  };

  const handlePlatformSearch = (event) => {
    setPlatform(event.target.value);
  };

  const handleYearSearch = (event) => {
    setYear(event.target.value);
  };

  const handlePublisherSearch = (event) => {
    setPublisher(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value)); // Parse to integer
  };

  const transformDataToChartData = (data) => {
    return {
      labels: data.map(item => item.Name),
      datasets: [
        {
          label: 'Global Sales',
          data: data.map(item => item.Global_Sales),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  };

  return (
    <div className="App">
      <h1>Data Visualization with React and Chart.js</h1>
      <div>
        <input
          type="text"
          placeholder="Search Games by Name"
          value={searchTerm}
          onChange={handleNameSearch}
        />
        <input
          type="text"
          placeholder="Search Games by Genre"
          value={genre}
          onChange={handleGenreSearch}
        />
        <input
          type="text"
          placeholder="Search Games by Platform"
          value={platform}
          onChange={handlePlatformSearch}
        />
        <input
          type="text"
          placeholder="Search Games by Year"
          value={year}
          onChange={handleYearSearch}
        />
        <input
          type="text"
          placeholder="Search Games by Publisher"
          value={publisher}
          onChange={handlePublisherSearch}
        />
      </div>
      <div>
        <label>Page Size:</label>
        <input
          type="number"
          value={pageSize}
          onChange={handlePageSizeChange}
          min={1} // Minimum page size
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
        <Bar data={chartData} />
        <div>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Previous Page
          </button>
          <button onClick={() => handlePageChange(page + 1)}>
            Next Page
          </button>
        </div>
      </>
      )}
    </div>
  );
}

export default App;
