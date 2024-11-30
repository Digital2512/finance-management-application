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
  chartOverviewType,
}: DoughnutChartProps) => {

  const groupedData = React.useMemo(() => {
    return doughnutChartData.reduce((acc, curr) => {
      if(!acc[curr.category]){
        acc[curr.category] = {category: curr.category, amount: curr.amount, fillColor: curr.fillColor};
      }

      acc[curr.category].amount += curr.amount;
      return acc;
    }, {} as Record<string, {category: string; amount: number; fillColor: string}>);
  }, [doughnutChartData]);


  const transformedData = React.useMemo(() => {
    return Object.values(groupedData);
  }, [groupedData])

  const totalAmount = React.useMemo(() => {
    return transformedData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [transformedData])


  const chartConfig = {
    labelForAmount: {
      label: "Amount Spent", // will change based on box
    },
    chart1: {
      label: "Food and Beverage",
      color: "#0747b6",
    },
    chart2: {
      label: "Entertainment",
      color: "#2265d8",
    },
    chart3: {
      label: "Career", //will change based on the top 5 categories of the user and for the rest of the category just put it as others
      color: "#f0c419",
    },
    chart4: {
      label: "Living Expense",
      color: "#1f77b4",
    },
    chart5: {
      label: "Wants",
      color: "#ff7f0e",
    },
    others: {
      label: "Others",
      color: "#d62728"
    }
  } satisfies ChartConfig;

  return (
    <ChartContainer
  config={chartConfig} // Pass the required config
  className="mx-auto aspect-square max-h-[250px]">
  <PieChart>
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent hideLabel/>}
      // content={({active, payload} : any) => {
      //   if(active && payload && payload.length){
      //     const {category, amount} = payload[0];
      //     return(
      //       <ChartTooltipContent>
      //         <div>
      //           <strong>{category}</strong>
      //         </div>
      //         <div>
      //           {formatAmount(amount)}
      //         </div>
      //       </ChartTooltipContent>
      //     )
      //   }
      //   return null;      
    />
    <Pie
      data={transformedData}
      dataKey="amount"
      nameKey="category"
      innerRadius={60}
      strokeWidth={5}
      // fill={(entry) => entry.fillColor}
    >
      {transformedData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.fillColor}></Cell>
      ))}
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
                    {chartOverviewType === "expense" ? "Amount Spent" : chartOverviewType === "savings" ? "Amount Saved" : chartOverviewType === "debt" ? "Amount Left" : "Amount"}
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

export default DoughnutChartTextOverview
