"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin } from "chart.js";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  totalExpenseBalance: number;
  totalCurrentMonthDebtBalance: number;
}

const DoughnutChart = ({ totalExpenseBalance, totalCurrentMonthDebtBalance }: DoughnutChartProps) => {

  const data = {
    datasets: [
      {
        data: [totalExpenseBalance, totalCurrentMonthDebtBalance],
        backgroundColor: ['#0747b6', '#2265d8'],
        borderWidth: 1
      }
    ],
    labels: ['Expense', 'Debt']
  };

  // Plugin to display text in the center
  const centerTextPlugin: Plugin<'doughnut'> = {
    id: "centerText",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      const { datasets } = chart.data;

      // Ensure datasets[0].data is an array of numbers
      const total = (datasets[0].data as number[]).reduce((acc: number, val: number) => {
        return acc + val;
      }, 0);

      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(`$${total}`, centerX, centerY);
      ctx.restore();
    }
  };

  const options = {
    cutout: '60%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Doughnut
      data={data}
      options={options}
      plugins={[centerTextPlugin]} // Pass the plugin here
    />
  );
};

export default DoughnutChart;
