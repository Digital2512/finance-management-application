"use client"

import {useState, useEffect} from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import axios from 'axios'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { formatAmount } from "@/lib/utils"
import { fetchUserIncomeExpenseTransaction } from "@/lib/transaction/fetchUserIncomeExpenseTransaction"

// Sample data

const chartConfig = {
  amount: {
    label: "Amount",
  },
  savings: {
    label: "Savings",
    color: "#32CD32",
  },
  debts: {
    label: "Debts",
    color: "#FF0000",
  },
} satisfies ChartConfig

const SavingsDebtAreaChart = ({ userID }: AreaChartProps) => {

  const[isLoading, setIsLoading] = useState(false);
  const [userSavingsTransactionsData, setUserSavingsTransactionsData] = useState<Savings[]>([]);
  const [userDebtsTransactionsData, setUserDebtsTransactionsData] = useState<Debt[]>([]);
  const [userRepaymentsTransactionsData, setUserRepaymentsTransactionsData] = useState<Repayment[]>([]);
  const [userTransactionsChartData, setUserTransactionsChartData] = useState<ChartDataItem[]>([]);
  const [timeRange, setTimeRange] = useState("90d")

  useEffect(() => {
    const fetchUserSavingsTransactions = async (loggedInUserID: string) => {
      setIsLoading(true);
        if (loggedInUserID) {
          console.log('Logged In User ID Use Effect', loggedInUserID);
            try {
                const response = await axios.get('/api/transaction/savings/fetchUserTransactions', {
                    params: { userID: loggedInUserID }
                });

                console.log('User Transactions Response Function:', response);
                console.log('User Transactions Data Function:', response.data.userSavingsTransactionsData); 
                if(response.data.userSavingsTransactionsData){
                  setUserSavingsTransactionsData(response.data.userSavingsTransactionsData); 
                }else{
                  console.log("User Transactions Data Retrieval Failed");
                }
                // return {userTransactionsData: response.data.userTransactionData};
            } catch (error) {
                console.error("Error fetching user transactions:", error);
            }finally{
                setIsLoading(false);
            }
        } else {
            console.log("Error: No logged-in user ID found in session storage.");
            setIsLoading(false);
        }
    };

    if (userID) {
        console.log('User ID AC:', userID);
        fetchUserSavingsTransactions(userID);
    } else {
        console.log('No Logged In User ID');
        setIsLoading(false);
    }
  }, []); // Ensure only runs once

  useEffect(() => {
    const fetchUserSavingsTransactions = async (loggedInUserID: string) => {
      setIsLoading(true);
        if (loggedInUserID) {
          console.log('Logged In User ID Use Effect', loggedInUserID);
            try {
                const response = await axios.get('/api/transaction/savings/fetchUserTransactions', {
                    params: { userID: loggedInUserID }
                });

                console.log('User Transactions Response Function:', response);
                console.log('User Transactions Data Function:', response.data.userDebtTransactionsData); 
                if(response.data.userDebtTransactionsData){
                  setUserDebtsTransactionsData(response.data.userDebtTransactionsData); 
                }else{
                  console.log("User Transactions Data Retrieval Failed");
                }
                // return {userTransactionsData: response.data.userTransactionData};
            } catch (error) {
                console.error("Error fetching user transactions:", error);
            }finally{
                setIsLoading(false);
            }
        } else {
            console.log("Error: No logged-in user ID found in session storage.");
            setIsLoading(false);
        }
    };

    if (userID) {
        console.log('User ID AC:', userID);
        fetchUserSavingsTransactions(userID);
    } else {
        console.log('No Logged In User ID');
        setIsLoading(false);
    }
  }, []); // Ensure only runs once

  useEffect(() => {
    const fetchUserRepaymentTransactions = async (loggedInUserID: string) => {
      setIsLoading(true);
        if (loggedInUserID) {
          console.log('Logged In User ID Use Effect', loggedInUserID);
            try {
                const response = await axios.get('/api/transaction/repayment/fetchUserTransactions', {
                    params: { userID: loggedInUserID }
                });

                console.log('User Transactions Response Function:', response);
                console.log('User Transactions Data Function:', response.data.userRepaymentTransactionsData); 
                if(response.data.userRepaymentTransactionsData){
                  setUserRepaymentsTransactionsData(response.data.userRepaymentTransactionsData); 
                }else{
                  console.log("User Transactions Data Retrieval Failed");
                }
                // return {userTransactionsData: response.data.userTransactionData};
            } catch (error) {
                console.error("Error fetching user transactions:", error);
            }finally{
                setIsLoading(false);
            }
        } else {
            console.log("Error: No logged-in user ID found in session storage.");
            setIsLoading(false);
        }
    };

    if (userID) {
        console.log('User ID AC:', userID);
        fetchUserRepaymentTransactions(userID);
    } else {
        console.log('No Logged In User ID');
        setIsLoading(false);
    }
  }, []); // Ensure only runs once

  console.log('User Savings Transaction Data AC:', userSavingsTransactionsData);
  console.log('User Debts Transaction Data AC:', userDebtsTransactionsData);

  if (isLoading) {
      return <p>Loading...</p>; // Show loading message while fetching data
  }

  if (!userSavingsTransactionsData || userSavingsTransactionsData.length === 0 || !userDebtsTransactionsData || userDebtsTransactionsData.length === 0) {
      return <p>No transactions found</p>; // Show a message if no data is found
  }


  // const transformedData = chartData.reduce((acc, { date, type, amount }) => {
  //   const entry = acc.find((item) => item.date === date);

  //   if(entry) {
  //     if(type === "Income"){
  //       entry.income += amount;
  //     }else if(type === "Expense"){
  //       entry.expense += amount;
  //     }
  //   }else{
  //     acc.push({
  //       date,
  //       income: type === "income" ? amount : 0,
  //       expense: type === "expense" ? amount : 0,
  //     })
  //   }
  //   return acc;
  // }, []);

  // const transformedData: AreaChartDataItem[] = 
  //   userTransactionsData.reduce((acc: AreaChartDataItem[], { dateOfTransaction, transactionType, totalAmountOfTransaction }) => {
  //   // Find or create the entry for this date
  //   const entry = acc.find((item) => item.date === dateOfTransaction);
    
  //   if (entry) {
  //     // If entry exists, add the amount to the respective type
  //     if (transactionType === "Income") {
  //       entry.income += totalAmountOfTransaction;
  //     } else if (transactionType === "Expense") {
  //       entry.expense += totalAmountOfTransaction;
  //     }
  //   } else {
  //     // If entry doesn't exist, create it with initial values
  //     acc.push({
  //       date: dateOfTransaction,
  //       income: transactionType === "income" ? totalAmountOfTransaction : 0,
  //       expense: transactionType === "expense" ? totalAmountOfTransaction : 0,
  //     });
  //   }
  
  //   return acc;
  // }, []);

  const transformedData = userRepaymentsTransactionsData.reduce((acc: AreaChartSavingsDebtstDataItem[], curr) => {
    const date = new Date(curr.dateOfRepayment).toISOString().split("T")[0]; // Group by date (YYYY-MM-DD)
    
    // Find or create the date entry
    let entry = acc.find(item => item.date === date);
    if (!entry) {
      entry = { date, savings: 0, debts: 0};
      acc.push(entry);
    }
  
    if (curr.transactionType === "Savings") {
      entry.savings += curr.repaymentAmount;
    } else if (curr.transactionType === "Debt") {
      entry.debts += curr.repaymentAmount;
    }
  
    return acc;
  }, []);
  

  const transformedJsonData = JSON.stringify(transformedData, null, 2); // 'null' means no replacer, '2' adds indentation for readability
  
  console.log(`Transformed Data: ${transformedJsonData}`);

  const filteredData = transformedData.filter((item) => {
    const itemRawDate = new Date(item.date);

    const itemYear = itemRawDate.getFullYear();
    const itemMonth = String(itemRawDate.getMonth() + 1).padStart(2, '0');
    const itemDay = String(itemRawDate.getDate()).padStart(2, '0');

    const formattedItemDate = `${itemYear}-${itemMonth}-${itemDay}`;
    console.log(formattedItemDate); // Example: "Sun Nov 25 2024 14:30:45 GMT+0000 (UTC)"

    const itemDate = new Date(formattedItemDate)

    const todayDate = new Date();
    // console.log(`Todays Unformatted Date: ${todayDate}`);

    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');

    const formattedTodayDate = `${year}-${month}-${day}`;
    console.log(formattedTodayDate); // Example: "Sun Nov 25 2024 14:30:45 GMT+0000 (UTC)"
    // console.log(`Todays Date: ${formattedTodayDate}`);
    const referenceDate = new Date(formattedTodayDate)
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    // console.log(`Start Date: ${startDate}`);
    // console.log(`Item Date: ${date}`);
    return itemDate >= startDate
  })

  const totalSavings = filteredData.reduce((sum, item) => sum + item.savings, 0);
  const totalDebts = filteredData.reduce((sum, item) => sum + item.debts, 0);

  return (
    <Card className="w-[975px] m-6">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Income - Expense</CardTitle>
          <CardDescription>
            Showing total income-expense ratio for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white shadow-lg border border-gray-300">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-row px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-[700px]"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#32CD32"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#32CD32"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#FF0000"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#FF0000"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              stroke="#32CD32"
              stackId="a"
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillExpense)"
              stroke="#FF0000"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        <div className="items-center justify-center gap-4">
          <div className="mb-1 text-lg font-bold">Total</div>
          <div className="mb-2">Total Income: {formatAmount(totalSavings)}</div>
          <div className="mb-2">Total Expense: {formatAmount(totalDebts)}</div>

          {/* <div>
            Remaining Total: {" "}
            <span className={`font-bold ${remainingTotal>= 0 ? "text-green-600": "text-red-600"}`}>
              {formatAmount(remainingTotal)}
            </span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default SavingsDebtAreaChart
