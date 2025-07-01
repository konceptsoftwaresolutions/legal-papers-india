import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({
    series: propSeries = [],  // Default to empty array
    title = "",
    areaColor = '#FF1654'  // You can customize the color here
}) => {
    // The series should be an array of objects, so we pass it as such
    const chartSeries = [{
        name: "Leads",
        data: propSeries || [],  // Use propSeries or empty array if no data is provided
    }];

    const [options] = useState({
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2,  // Adjust the stroke width for the line
        },
        fill: {
            colors: [areaColor],  // Set the area color here
            type: 'solid',  // Solid fill for the area
            opacity: 0.3,  // Adjust the opacity of the fill area
        },
        title: {
            text: title || 'Month on Month Leads',
            align: 'left',
            style: {
                fontSize: '18px',  // Customize font size
                fontFamily: 'Poppins, sans-serif',  // Customize font family
                fontWeight: '500',  // Customize font weight
                color: '#4A4A4A'  // Customize text color
            }
        },
        subtitle: {
            text: 'Per Month',
            align: 'left',
            style: {
                fontSize: '14px',  // Customize font size for subtitle
                fontFamily: 'Poppins, sans-serif',  // Customize font family
                color: '#7D7D7D'  // Customize subtitle color
            }
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // months of the year
        },
        yaxis: {
            opposite: true,
            labels: {
                formatter: function (value) {
                    return value; // Show values like 0, 1000, 2000, etc.
                }
            }
        },
        legend: {
            horizontalAlign: 'left'
        }
    });

    return (
        <div>
            <div id="chart" className='border border-solid border-gray-300 shadow-md shadow-gray-200 w-full py-4 px-2 rounded-md'>
                <ReactApexChart options={options} series={chartSeries} type="area" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default ApexChart;
