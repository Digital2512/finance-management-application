"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin } from "chart.js";
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DebtsDoughnutChartProps {
  debts: Array<{ category: string, amount: number }>;
}

const DebtsDoughnutChart = ({ debts }: DebtsDoughnutChartProps) => {

  // Prepare the data for the doughnut chart
  const debtsData = debts.map(debt => debt.amount);  // Extract amounts
  const debtsLabels = debts.map(debt => debt.category);  // Extract categories

  // Include debt in the chart data
  const data = {
    datasets: [
      {
        data: [...debtsData],
        backgroundColor: ['#0747b6', '#2265d8', '#f0c419', '#1f77b4', '#ff7f0e', '#d62728'],  // Add more colors if needed
        borderWidth: 1
      }
    ],
    labels: [...debtsLabels, 'Debt']  // Include "Debt" as a category
  };

  // Plugin to display total in the center
  const centerTextPlugin: Plugin<'doughnut'> = {
    id: "centerText",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      const { datasets } = chart.data;

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

export default DebtsDoughnutChart;
