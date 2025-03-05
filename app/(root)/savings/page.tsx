'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DoughnutChartOverview from '@/components/ui/DoughnutChartOverview';
import FloatingButton from '@/components/ui/FloatingButton';
import TransactionsSavingsTable from '@/components/ui/TransactionsSavingsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import React, { useEffect, useState } from 'react'
import { formatAmount } from "@/lib/utils"
import axios from 'axios';
import TransactionsRepaymentTable from '@/components/ui/TransactionsRepaymentTable';
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon, CoinsIcon }  from "lucide-react"
import SavingsOverview from '@/components/ui/SavingsOverview';
import RepaymentOverview from '@/components/ui/RepaymentOverview';

const SavingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [overviewTab, setOverviewTab] = useState('monthly');
  const [userSavingsTransactions, setUserSavingsTransactions] = useState<Savings[]>()
  const [userRepaymentTransactions, setUserRepaymentTransactions] = useState<Repayment[]>()
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

  const getStartOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek;
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - diff);
    return weekStart;
  }

  // const getStartOfMonth = (date: Date) => {
  //   const monthStart = new Date(date);
  //   monthStart.setDate(1);
  //   return monthStart
  // }

    useEffect(() => {
      if(loggedInUserID){
        const fetchUserSavingsTransactions = async(loggedInUserID: string) => {
          setIsLoading(true);
          try{
            const response = await axios.get('/api/transaction/savings/fetchUserTransactions', {
              params: { userID: loggedInUserID }
            });

            console.log('New');
            console.log('User Savings Transactions Response Function:', response);
            console.log('User Savings Transactions Data Function:', response.data.userSavingsTransactionsData); 
            setUserSavingsTransactions(response.data.userSavingsTransactionsData); 
          }catch(error){
            console.log("Error fetching user transactions:", error);
          }finally{
            setIsLoading(false);
          }
        }

        if(loggedInUserID){
          console.log('Logged In User ID: ', loggedInUserID);
          fetchUserSavingsTransactions(loggedInUserID);
        }else{
          console.error('No user ID found')
        }
      }else{
        console.log('No user ID found')
        setIsLoading(false)
      }
    }, []);

    useEffect(() => {
      if(loggedInUserID){
        const fetchUserRepaymentTransactions = async (loggedInUserID: string) => {
          setIsLoading(true);
          try{
            const response = await axios.get('/api/transaction/repayment/fetchUserTransactions', {
                params: { userID: loggedInUserID }
            });

            console.log('New');
            console.log('User Repayment Transactions Response Function:', response);
            console.log('User Repayment Transactions Data Function:', response.data.userRepaymentTransactionsData); 
            setUserRepaymentTransactions(response.data.userRepaymentTransactionsData); 
          }catch(error){
            console.error("Error fetching user transactions:", error)
          }finally{
            setIsLoading(false)
          }
        }
        if(loggedInUserID){
          console.log('User Repayment Data: ', userRepaymentTransactions)
          fetchUserRepaymentTransactions(loggedInUserID)
        }else{
          console.log('No user repayment data found')
        }
      }else{
        console.log('No User ID Found');
        setIsLoading(false)
      }
    }, [])

    // const today = new Date();
    // const weekStart = getStartOfWeek(today);
    // const monthStart = getStartOfMonth(today);

    // const filteredSavingsTransactions = userSavingsTransactions?.filter((transactions) => {
    //   const transactionDate = new Date(transactions.startingDateOfSavings);
    //   if (overviewTab === 'daily') return transactionDate.toDateString() === today.toDateString();
    //   if (overviewTab === 'monthly') return transactionDate.toDateString() === today.toDateString();
    // })

    console.log('User Savings Transaction Data: ', userSavingsTransactions);
    console.log('User Repayments Transaction Data: ', userRepaymentTransactions);

    if(isLoading){
      return <p>Loading...</p>
    }

    if(!userSavingsTransactions || userSavingsTransactions.length === 0){
      return <p>No Transactions Found</p>
    }

    if(!userRepaymentTransactions || userRepaymentTransactions.length === 0){
      return <p>No Transactions Found</p>
    }

    const transformedUserSavingsData = userSavingsTransactions?.map((curr) => ({
      category: curr.savingsCategory,
      amount: curr.savingsTotalAmount
    }), {} as DoughnutChartData[])

    const filteredUserRepaymentData = userRepaymentTransactions?.filter((data) => data.transactionType === 'Savings');
    const transformedUserRepaymentData = filteredUserRepaymentData?.map((curr) => ({
      category: curr.transactionType,
      amount: curr.repaymentAmount,
      date : curr.dateOfRepayment,
    }), {} as DoughnutChartPercentageData[])

    console.log('User Savings Data', transformedUserSavingsData);

    console.log('User Savings Repayment Data', transformedUserRepaymentData);
    
    const options = [
      {label: 'Add Deposits', value: 'addDeposits', route: '/savings/individual-repayment-transaction', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense', icon: "/icons/logo-wallet-blue.svg"},
    ]

    const totalSavings = transformedUserSavingsData.reduce((sum, item) => sum + item.amount, 0);
    const totalDeposit = transformedUserRepaymentData.reduce((sum, item) => sum + item.amount, 0);
    const remainingTotal = totalSavings - totalDeposit;

    console.log('Data Retrieved: ', transformedUserSavingsData, transformedUserRepaymentData)
    console.log('Logged In User ID: ', loggedInUserID)
  return (
    // <div>
    //     <Card className='w-[1100px] m-6'>
    //     <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
    //       <div className="grid flex-1 gap-1 text-center sm:text-left">
    //         <CardTitle className='mb-4'>Savings Progress</CardTitle>
    //         <CardDescription>
    //           Showing savings progress for the last 3 months
    //         </CardDescription>
    //       </div>

    //       </CardHeader>
    //       <CardContent className='max-h-[200px]'>
    //         <div className='flex flex-row gap-4 mt-4'>
    //           <div className='max-h-[150px]'>
    //           <DoughnutChartOverview doughnutChartData={transformedUserSavingsData || [{category: 'None', amount: 0}]}/>              
    //           </div>

    //           {/* <div className='max-h-[150px]'>
    //           <DoughnutChartOverview doughnutChartData={transformedUserRepaymentData || [{category: 'None', amount: 0}]}/>
    //           </div> */}

    //           <div className='max-h-[150px]'>
    //             <DoughnutChartOverview doughnutChartData={transformedUserSavingsData  || [{category: 'None', amount: 0}]} doughnutChartPercentageData={transformedUserRepaymentData || [{category: 'None', amount: 0}]}/>              
    //           </div>

    //           <div className="items-center justify-center gap-4 ml-5">
    //             <div className="mb-1 text-lg font-bold">Total</div>
    //             <div className="mb-2">Total Savings: {formatAmount(totalSavings)}</div>
    //             <div className="mb-2">Total Deposits: {formatAmount(totalDeposit)}</div>
              
    //             <div>
    //               Remaining Total: {" "}
    //               <span className={`font-bold ${remainingTotal>= 0 ? "text-red-600": "text-green-600"}`}>
    //                 {formatAmount(remainingTotal)}
    //               </span>
    //             </div>
    //             </div> 
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <h2 className='ml-8 mb-2 text-xl'>Savings</h2>
    //     <TransactionsSavingsTable userID={loggedInUserID || ''}/>
    //     <br></br>
    //     <h2 className='ml-8 mb-2 text-xl'>Repayment</h2>
    //     <TransactionsRepaymentTable userID={loggedInUserID || ''} typeOfRepayment='Savings'/>
    //     <FloatingButton floatingButtonOptions={options}/>
    // </div>
    <div className='container mx-auto p-4 space-y-6'>
      <div></div>
      <SavingsOverview userID={loggedInUserID || ''} />
      <div></div>
      <RepaymentOverview userID={loggedInUserID || ''} />
      <div></div>
      <Card>
        <CardHeader>
          <CardTitle>Savings Overview</CardTitle>
          <CardDescription>Your Savings Progress</CardDescription>
          <Tabs defaultValue='monthly'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='daily'>Today</TabsTrigger>
              <TabsTrigger value='weekly'>This Week</TabsTrigger>
              <TabsTrigger value='monthly'>This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Savings Goal Total</CardTitle>
                <PiggyBankIcon className='h-4 w-4 text-muted-foreground'/>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatAmount(totalSavings)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Current Deposits Total</CardTitle>
                <CoinsIcon className='h-4 w-4 text-muted-foreground'/>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatAmount(totalDeposit)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                {remainingTotal >= 0 
                ? 'Total Left:'
                : 'Total: '
                }</CardTitle>
                {/* DESIGN CHANGE: Might need to change it to another icon */}
                {remainingTotal >= 0 
                ? (<ArrowUpIcon className='h-4 w-4 text-green-500'/>)
                : (<ArrowDownIcon className='h-4 w-4 text-red-500'/>)
                }
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${remainingTotal >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {remainingTotal >= 0 
                ? `- ${formatAmount(remainingTotal)}`
                : formatAmount(remainingTotal)
                }
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='savings'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='savings'>Savings</TabsTrigger>
          <TabsTrigger value='repayment'>Repayment</TabsTrigger>
        </TabsList>
        <TabsContent value='savings'>
          <Card>
            <CardContent className='mt-5'>
              <TransactionsSavingsTable userID={loggedInUserID || ""}/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='repayment'>
          <Card>
            <CardContent className='mt-5'>
              <TransactionsRepaymentTable userID={loggedInUserID || ""} typeOfRepayment='Savings'/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SavingsPage