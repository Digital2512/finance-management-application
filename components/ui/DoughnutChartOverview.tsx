"use client";

import * as React from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin } from "chart.js";
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import { ChartConfig } from "./chart";

ChartJS.register(ArcElement, Tooltip, Legend);

// interface DoughnutChartProps {
//     doughnutChartData: Array<{ category: string, amount: number }>;  
// }

const DoughnutChartOverview = ({ doughnutChartData, doughnutChartPercentageData }: DoughnutChartProps) => {

  console.log('Data Received: ', doughnutChartData, doughnutChartPercentageData);

  if(doughnutChartPercentageData){
    console.log("===================================")
    console.log("Grouped Chart Percentage Raw Data: ", doughnutChartPercentageData);
    console.log("Grouped Chart Total Raw Data: ", doughnutChartData);

    const groupedPercentageData = React.useMemo(() => {
      return doughnutChartPercentageData.reduce((acc, curr) => {
        if(!acc[curr.category]){
          acc[curr.category] = {category: curr.category, amount: 0}
        }

        acc[curr.category].amount += curr.amount;
        return acc;
      }, {} as Record<string, {category: string; amount: number;}>);
    }, [doughnutChartData]);

    console.log('Grouped Percentage Data: ', groupedPercentageData);

    const groupedTotalData = React.useMemo(() => {
      return doughnutChartData.reduce((acc, curr) => {
        if(!acc[curr.category]){
          acc[curr.category] = {category: curr.category, amount: 0}; 
        }

        acc[curr.category].amount += curr.amount;
        return acc;
      }, {} as Record<string, {category: string; amount:number}>);
    }, [doughnutChartData]);

    console.log("Grouped Total Data: ", groupedTotalData);

    const transformedDonePercentageData = React.useMemo(() => {
      return Object.values(groupedPercentageData);
    }, [groupedPercentageData])

    console.log("Transformed Done Data: ", transformedDonePercentageData);

    const totalDonePercentageDataAmount = React.useMemo(() => {
      return transformedDonePercentageData.reduce((acc, curr) => acc + curr.amount, 0 )
    }, [transformedDonePercentageData])

    console.log("Total Done Data Amount: ", totalDonePercentageDataAmount);

    const transformedTotalPercentageData = React.useMemo(() => {
      return Object.values(groupedTotalData);
    }, [groupedPercentageData])

    console.log("Transformed Total Data: ", transformedDonePercentageData);

    const totalPercentageDataAmount = React.useMemo(() => {
      return transformedTotalPercentageData.reduce((acc, curr) => acc + curr.amount, 0)
    }, [transformedTotalPercentageData])

    const totalPercentageAmountChartData = React.useMemo(() => {
      var totalLeftPercentageAmount = totalPercentageDataAmount - totalDonePercentageDataAmount;

      const totalDonePercentageAmountChart = {
        category: "Done",
        amount: totalDonePercentageDataAmount,
        percentage: (totalDonePercentageDataAmount / totalPercentageDataAmount)
      }

      const totalLeftPercentageAmountChart = {
        category: "Left",
        amount: totalLeftPercentageAmount,
        percentage: (totalLeftPercentageAmount / totalPercentageDataAmount)
      }

      return [totalDonePercentageAmountChart, totalLeftPercentageAmountChart]
    }, [totalDonePercentageDataAmount, totalPercentageDataAmount])

    console.log('Total Percentage Amount Chart Data: ', totalPercentageAmountChartData)

    const transformedTotalDataChart = React.useMemo(() => {      
      return Object.values(totalPercentageAmountChartData)
    }, [totalPercentageAmountChartData])

    console.log('Transformed Total Data Chart Data: ', transformedTotalDataChart)

    console.log('Total Done Percentage Amount: ', totalDonePercentageDataAmount);
    console.log('Total Percentage Amount: ', totalPercentageDataAmount);

    const totalDonePercentage = React.useMemo(() => {
      var totalPercentageAmountChart = (totalDonePercentageDataAmount / totalPercentageDataAmount) * 100;
      return totalPercentageAmountChart.toFixed(2);
    }, [totalPercentageDataAmount, totalPercentageDataAmount])

    console.log("Total Done Percentage: ", totalDonePercentage);
    console.log("============================================");

    // const chartPercentageConfig = {
    //   done: {
    //     label: "Done",
    //     color: "#0747b6",
    //   },
    //   notDone: {
    //     label: "Pending",
    //     color: "#2265d8",
    //   }
    // } satisfies ChartConfig;

    // Prepare the data for the doughnut chart
  const doughnutChartDataAmount = transformedTotalDataChart.map(dataIndividual => dataIndividual.amount);  // Extract amounts
  const doughnutChartDataLabels = transformedTotalDataChart.map(dataIndividual => dataIndividual.category);  // Extract categories

  // Include savings in the chart data
  const data = {
    datasets: [
      {
        data: [...doughnutChartDataAmount],
        backgroundColor: ['#0747b6', '#2265d8'],  // Add more colors if needed
        borderWidth: 1
      }
    ],
    labels: [...doughnutChartDataLabels]  // Include "savings" as a category
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
      ctx.fillText(`${totalDonePercentage}%`, centerX, centerY);
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
  }else{
    const groupedData = React.useMemo(() => {
        return doughnutChartData.reduce((acc, curr) => {
          if(!acc[curr.category]){
            acc[curr.category] = {category: curr.category, amount: 0};
          }
    
          acc[curr.category].amount += curr.amount;
          return acc;
        }, {} as Record<string, {category: string; amount: number;}>);
      }, [doughnutChartData]);
    
      const transformedData = React.useMemo(() => {
        return Object.values(groupedData);
      }, [groupedData])

      const top5CategoriesWithOthers = React.useMemo(() => {
        const sortedData = [...transformedData].sort((a,b) => b.amount - a.amount);

        const top5 = sortedData.slice(0,5);

        const others = sortedData.slice(5).reduce((acc, curr) => {
          acc.amount += curr.amount;
          return acc;
        }, 
      {category: "Others", amount: 0});

      return others.amount > 0 ? [...top5, others] : top5;
      }, [transformedData])

      const totalAmount = React.useMemo(() => {
        return transformedData.reduce((acc, curr) => acc + curr.amount, 0)
      }, [transformedData])

      const transformed5CategoriesWithOthersData = React.useMemo(() => {
        return Object.values(top5CategoriesWithOthers);
      }, [top5CategoriesWithOthers])

    // Prepare the data for the doughnut chart
  const doughnutChartDataAmount = top5CategoriesWithOthers.map(dataIndividual => dataIndividual.amount);  // Extract amounts
  const doughnutChartDataLabels = top5CategoriesWithOthers.map(dataIndividual => dataIndividual.category);  // Extract categories

  // Include savings in the chart data
  const data = {
    datasets: [
      {
        data: [...doughnutChartDataAmount],
        backgroundColor: ['#0747b6', '#2265d8', '#f0c419', '#1f77b4', '#ff7f0e', '#d62728'],  // Add more colors if needed
        borderWidth: 1
      }
    ],
    labels: [...doughnutChartDataLabels]  // Include "savings" as a category
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
  }
};

export default DoughnutChartOverview;
