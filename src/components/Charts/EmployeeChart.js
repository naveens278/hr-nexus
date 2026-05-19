import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function EmployeeChart({ chartData }) {
  // Fallback data if no props provided
  const data = chartData || {
    labels: ["IT", "HR", "Finance"],
    datasets: [
      {
        label: "Employees",
        data: [0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Employees by Department",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px", display: "flex", justifyContent: "center" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default EmployeeChart;