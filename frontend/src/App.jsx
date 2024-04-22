import { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import './App.css';

function App() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/data');
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
    };

    fetchData();
  }, []);

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
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  );
}

export default App;
