import { useState, useCallback } from 'react';

// Custom hook for fetching and transforming chart data
const useChartData = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Function to transform raw data into chart format
  const transformDataToChartData = (data) => {
    return {
      labels: data.map(item => item.Name),
      datasets: [{
        label: 'Global Sales',
        data: data.map(item => item.Global_Sales),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      }]
    };
  };

  // Using the useCallback to memoize the fetchData function to avoid unnecessary re-renders
  const fetchData = useCallback(async (params) => {
    try {
      const response = await fetch(`http://localhost:8000/data?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setChartData(transformDataToChartData(result.data));
      setTotalPages(Math.ceil(result.total / parseInt(params.get('page_size'))));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Returning the states and fetchData function from the hook
  return { chartData, loading, error, totalPages, fetchData };
};

export default useChartData;
