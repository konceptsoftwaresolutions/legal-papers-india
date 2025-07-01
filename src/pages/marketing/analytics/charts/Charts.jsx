import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
  ArcElement
);

const Charts = ({
  barDataArray = [8, 0, 0, 0, 0, 2],
  campaignDetails = {
    date: "2025-06-10 15:57:30",
    counter: "",
    status: "completed",
    id: "9602978",
    totalSms: 8,
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalInvalidNumber: 2,
    totalFailed: 0,
    type: "WHATSAPP",
    campaignStartTime: "",
    campaignEndTime: "2025-06-10 15:57:31",
    campaignStatus: "completed",
    campaignName: "wabaWhatsappTest3",
    scheduled: false,
    scheduledTime: null,
    scheduleStarted: false,
    reportMapped: false,
  },
}) => {
  // Don't map unless items are objects
  barDataArray = Array.isArray(barDataArray)
    ? barDataArray.map((item) =>
        typeof item === "object" && item !== null ? item.number ?? 0 : item
      )
    : [];

  return (
    <div className="flex flex-col md:flex-row w-full gap-3">
      <div className="flex flex-col border border-solid border-slate-300 h-fit md:w-3/5 w-full rounded-md my-2">
        <h1 className="text-xl text-center my-4 text-purple-800 font-bold">
          Status Report
        </h1>
        <div className="p-2 border border-solid border-gray-200">
          <BarChart barData={barDataArray} campaignDetails={campaignDetails} />
        </div>
      </div>
      <div className="flex flex-col border border-solid border-slate-300 h-fit md:w-2/5 w-full rounded-md my-2 p-3">
        <h1 className="text-xl text-center text-purple-800 my-4 font-bold">
          Overall Report
        </h1>
        <div className="p-2 border border-solid border-gray-200">
          <DonutChart
            barData={barDataArray}
            campaignDetails={campaignDetails}
          />
        </div>
      </div>
    </div>
  );
};

export const DonutChart = ({ barData, campaignDetails }) => {
  const getLabels = (type) => {
    return type === "EMAIL"
      ? ["Email", "Delivered", "Invalid", "Opened", "Undelivered"]
      : ["Total", "Sent", "Delivered", "Failed", "Read", "Invalid"];
  };

  const getDataset = (type, barData) => {
    const whatsappColors = [
      "#006eff",
      "#d4e157",
      "#169200",
      "#e53935",
      "#2196f3",
      "#ff9800",
    ];
    const emailColors = ["#d4e157", "#43a047", "#e53935", "#2196f3", "#ff9800"];

    return {
      data: barData.slice(0, type === "EMAIL" ? 5 : 6),
      backgroundColor: type === "EMAIL" ? emailColors : whatsappColors,
    };
  };

  const dataset = getDataset(campaignDetails?.type, barData);

  const data = {
    labels: getLabels(campaignDetails?.type),
    datasets: [{ ...dataset }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[250px] md:h-[370px]">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export const BarChart = ({ barData, campaignDetails }) => {
  const [options, setOptions] = useState({});

  const updateOptions = () => {
    const isSmallScreen = window.innerWidth < 768;
    const fontSize = isSmallScreen ? 10 : 14;

    setOptions({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: isSmallScreen ? "y" : "x",
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Status Report",
          font: { size: isSmallScreen ? 16 : 20 },
        },
      },
      scales: {
        x: {
          title: {
            display: !isSmallScreen,
            text: "Status",
            font: { size: fontSize, weight: "bold" },
          },
          ticks: { font: { size: fontSize } },
          grid: { display: false },
        },
        y: {
          title: {
            display: !isSmallScreen,
            text: "Numbers",
            font: { size: fontSize, weight: "bold" },
          },
          ticks: { font: { size: fontSize }, stepSize: 1 },
          grid: {
            display: true,
            color: "rgba(75, 192, 192, 0.2)",
            borderDash: [5, 5],
          },
        },
      },
    });
  };

  const getLabels = (type) => {
    return type === "EMAIL"
      ? ["Email", "Delivered", "Invalid", "Opened", "Undelivered"]
      : ["Total", "Sent", "Delivered", "Failed", "Read", "Invalid"];
  };

  const getDataset = (type, barData) => {
    return {
      data: barData.slice(0, type === "EMAIL" ? 5 : 6),
      backgroundColor:
        type === "EMAIL"
          ? ["#d4e157", "#43a047", "#e53935", "#2196f3", "#ff9800"]
          : ["#006eff", "#d4e157", "#169200", "#e53935", "#2196f3", "#ff9800"],
    };
  };

  const dataset = getDataset(campaignDetails?.type, barData);

  const data = {
    labels: getLabels(campaignDetails?.type),
    datasets: [
      {
        ...dataset,
        maxBarThickness: 40,
        borderRadius: 2,
      },
    ],
  };

  useEffect(() => {
    updateOptions();
    window.addEventListener("resize", updateOptions);
    return () => window.removeEventListener("resize", updateOptions);
  }, []);

  return (
    <div className="chart-container lg:h-fit h-[500px] w-[100%]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Charts;
