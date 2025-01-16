"use client"
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Cell, Label, Pie, PieChart } from "recharts"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatAmount } from "@/lib/utils"

const DoughnutChartTextOverview = ({
  doughnutChartData,
  doughnutChartDataType,
  doughnutChartPercentageData,
}: DoughnutChartProps) => {

  if(doughnutChartPercentageData){
    console.log("===================================================================================");
    console.log('Grouped Chart Percentage Raw Data: ', doughnutChartPercentageData);
    console.log('Grouped Chart Total Raw Data: ', doughnutChartData);
    const groupedPercentageData = React.useMemo(() => {
      return doughnutChartPercentageData.reduce((acc, curr) => {
        if(!acc[curr.category]){
          acc[curr.category] = {category: curr.category, amount: 0};
        }
  
        acc[curr.category].amount += curr.amount;
        return acc;
      }, {} as Record<string, {category: string; amount: number;}>);
    }, [doughnutChartData]);

    console.log('Grouped Percentage Data: ', groupedPercentageData);

    const groupedTotalData = React.useMemo(() => {
      return doughnutChartData.reduce((acc, curr) => {
        if(!acc[curr.category]){
          acc[curr.category] = {category: curr.category, amount: curr.amount};
        }
  
        acc[curr.category].amount += curr.amount;
        return acc;
      }, {} as Record<string, {category: string; amount: number;}>);
    }, [doughnutChartData]);

    console.log('Grouped Total Data: ', groupedTotalData);
  
    const transformedDonePercentageData = React.useMemo(() => {
      return Object.values(groupedPercentageData);
    }, [groupedPercentageData])

    console.log('Done Data Transformed: ', transformedDonePercentageData);

    const totalDonePercentageAmount = React.useMemo(() => {
      return transformedDonePercentageData.reduce((acc, curr) => acc + curr.amount, 0)
    }, [transformedDonePercentageData])

    console.log('Total Percentage Done Amount: ', totalDonePercentageAmount);

    const transformedTotalPercentageDataAmount = React.useMemo(() => {
      return Object.values(groupedTotalData);
    }, [groupedTotalData])

    console.log('Total Data Transformed: ', transformedTotalPercentageDataAmount);

    const totalPercentageAmount = React.useMemo(() => {
      return transformedTotalPercentageDataAmount.reduce((acc, curr) => acc + curr.amount, 0)
    }, [transformedTotalPercentageDataAmount])

    console.log('Total Percentage Amount: ', totalPercentageAmount);

    const totalPercentageAmountChartData = React.useMemo(() => {
      var totalLeftPercentageAmount = totalPercentageAmount - totalDonePercentageAmount;

      const totalDonePercentageAmountChart = {
        category: "Done",
        amount: totalDonePercentageAmount,
        percentage: (totalDonePercentageAmount / totalPercentageAmount) * 100
      }      

      const totalLeftPercentageAmountChart = {
        category: "Left",
        amount: totalLeftPercentageAmount,
        percentage: (totalLeftPercentageAmount / totalPercentageAmount) * 100
      }      

      return [totalDonePercentageAmountChart, totalLeftPercentageAmountChart]
    }, [totalPercentageAmount, totalDonePercentageAmount])

    console.log('Total Percentage Amount Chart Data: ', totalPercentageAmountChartData);

    const transformedTotalDataChart = React.useMemo(() => {
      return Object.values(totalPercentageAmountChartData);
    }, [groupedTotalData])

    console.log('Total Percentage Amount Chart Data Transformed: ', transformedTotalDataChart);

    const totalDonePercentage = React.useMemo(() => {
      var totalPercentageAmountChart = (totalDonePercentageAmount / totalPercentageAmount) * 100;
      return totalPercentageAmountChart;
    }, [])

    console.log('Total Done Percentage: ', totalDonePercentage);
    console.log("===================================================================================");

    const chartPercentageConfig = {
      done: {
        label: "Done",
        color: "#0747b6",
      },
      notDone: {
        label: "Pending",
        color: "#2265d8",
      }
    } satisfies ChartConfig;
    return(
      <ChartContainer 
          config={chartPercentageConfig} // Pass the required config
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel/>}
            />
            <Pie
              data={transformedTotalDataChart}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              // fill={(entry) => entry.fillColor}
            >
              {totalPercentageAmountChartData.map((entry, index) => {
                const fillColor = 
                entry.category === "Done"
                ? chartPercentageConfig.done.color
                : chartPercentageConfig.notDone.color
                return <Cell key = {`cell-${index}`} fill={fillColor}></Cell>
              })}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-[20px] font-bold"
                        >
                          {(totalDonePercentage)}%
                        </tspan>
                          <>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {doughnutChartDataType === "income" ? "Amount Earned" : doughnutChartDataType === "expense" ? "Amount Spent" : doughnutChartDataType === "savings" ? "Amount Saved" : doughnutChartDataType === "debt" ? "Amount Left" : doughnutChartDataType === "percentage" ? "Finished" : "Amount"}
                          </tspan>
                          </>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
    )
  }else{
    const groupedData = React.useMemo(() => {
    return doughnutChartData.reduce((acc, curr) => {
      if(!acc[curr.category]){
        acc[curr.category] = {category: curr.category, amount: curr.amount};
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

    const top5 = sortedData.slice(0, 5);

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

  const chartConfig = {
    chart1: {
      label: top5CategoriesWithOthers[0]?.category || "N/A",
      color: "#0747b6",
    },
    chart2: {
      label: top5CategoriesWithOthers[1]?.category || "N/A",
      color: "#2265d8",
    },
    chart3: {
      label: top5CategoriesWithOthers[2]?.category || "N/A",
      color: "#f0c419",
    },
    chart4: {
      label: top5CategoriesWithOthers[3]?.category || "N/A",
      color: "#1f77b4",
    },
    chart5: {
      label: top5CategoriesWithOthers[4]?.category || "N/A",
      color: "#ff7f0e",
    },
    others: {
      label: top5CategoriesWithOthers[5]?.category || "N/A",
      color: "#d62728"
    }
  } satisfies ChartConfig;

  const chartKeys: (keyof typeof chartConfig)[]= ["chart1", "chart2", "chart3", "chart4", "chart5", "others"]

  return(
    <ChartContainer
          config={chartConfig} // Pass the required config
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel/>}
            />
            <Pie
              data={transformed5CategoriesWithOthersData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              // fill={(entry) => entry.fillColor}
              >
              {top5CategoriesWithOthers.map((entry, index) => {
                const key = chartKeys[index] as keyof typeof chartConfig;
                const configEntry = chartConfig[key];
                
                const fillColor = 
                entry.category === "Others"
                ? chartConfig.others.color
                : "color" in  configEntry
                ? configEntry.color
                : "#000"
                return <Cell key = {`cell-${index}`} fill={fillColor}></Cell>
              })}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-[20px] font-bold"
                        >
                          {formatAmount(totalAmount)}
                        </tspan>
                          <>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {doughnutChartDataType === "income" ? "Amount Earned" : doughnutChartDataType === "expense" ? "Amount Spent" : doughnutChartDataType === "savings" ? "Amount Saved" : doughnutChartDataType === "debt" ? "Amount Left" : "Amount"}
                          </tspan>
                          </>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
  )
  }
}

export default DoughnutChartTextOverview
