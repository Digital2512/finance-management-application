'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DoughnutChartOverview from '@/components/ui/DoughnutChartOverview';
import FloatingButton from '@/components/ui/FloatingButton';
import TransactionsSavingsTable from '@/components/ui/TransactionsSavingsTable'
import React, { useEffect, useState } from 'react'
import { formatAmount } from "@/lib/utils"
import axios from 'axios';

const SavingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userSavingsTransactions, setUserSavingsTransactions] = useState<Savings[]>()
  const [userRepaymentTransactions, setUserRepaymentTransactions] = useState<Repayment[]>()
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');

    useEffect(() => {
      if(loggedInUserID){
        const fetchUserSavingsTransactions = async() => {
          setIsLoading(true);
          try{
            const response = await axios.get('/api/transaction/savings/fetchUserTransactions', {
              params: { userID: loggedInUserID }
            });
  
            if(response.data.userSavingsTransactionsData){
              setUserSavingsTransactions(response.data.userSavingsTransactionsData)
            }else{
              console.log('No User Savings Transactions Found')
            }
          }catch(error){
            console.log("Error fetching user transactions:", error);
          }finally{
            setIsLoading(false);
          }
        }

        if(loggedInUserID){
          console.log('Logged In User ID: ', loggedInUserID);
          fetchUserSavingsTransactions();
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
        const fetchUserSavingsRepaymentTransactions = async () => {
          setIsLoading(true);
          try{
            const response = await axios.get('/api/transactions/repayment/fetchUserTransactions', {
              params: {userID: loggedInUserID}
            }
            )
            if(response.data.userRepaymentTransactionsData){
              setUserRepaymentTransactions(response.data.userRepaymentTransactionsData);
            }else{
              console.error('No User Repayment Transactions Found')
            }
          }catch(error){
            console.error("Error fetching user transactions:", error)
          }finally{
            setIsLoading(false)
          }
        }
      }else{
        console.log('No User ID Found');
      }
    }, [])

    console.log('User Savings Transaction Data: ', userSavingsTransactions);

    if(isLoading){
      return <p>Loading...</p>
    }

    if(!userSavingsTransactions || userSavingsTransactions.length === 0){
      return <p>No transactions found</p>
    }

    if(!userRepaymentTransactions || userRepaymentTransactions.length === 0){
      return
    }

    const transformedUserSavingsData = userSavingsTransactions.map((curr) => ({
      category: curr.savingsCategory,
      amount: curr.savingsTotalAmount
    }), {} as DoughnutChartData[])

    const filteredUserRepaymentData = userRepaymentTransactions.filter((data) => data.typeOfRepayment === 'Savings');

    const transformedUserRepaymentData = filteredUserRepaymentData.map((curr) => ({
      category: curr.repaymentCategory,
      amount: curr.repaymentAmount
    }), {} as DoughnutChartData[])

    console.log('User Savings Data', transformedUserSavingsData);

    // const dummyData: DoughnutChartTextData[] = [
    //   { name: "Salary", category: "Job", amount: 4000},
    //   { name: "Side Hustle", category: "Freelance", amount: 1200},
    //   { name: "Rental Income", category: "Rent", amount: 700 },
    //   { name: "Stock Profits", category: "Investments", amount: 800 },
    //   { name: "Dividends", category: "Investments", amount: 500 },
    //   { name: "Consulting", category: "Freelance", amount: 900 },
    //   { name: "App Royalties", category: "Royalties", amount: 600 },
    //   { name: "YouTube Revenue", category: "Content Creation", amount: 1000 },
    //   { name: "Blog Ads", category: "Content Creation", amount: 750 },
    //   { name: "E-book Sales", category: "Sales", amount: 550 },
    //   { name: "Tutoring", category: "Education", amount: 400 },
    //   { name: "Delivery Tips", category: "Tips", amount: 300 },
    //   { name: "Gift", category: "Personal", amount: 200 },
    //   { name: "Scholarship", category: "Education", amount: 1500 },
    //   { name: "Cashback", category: "Rebates", amount: 250 },
    // ];
    
    // const doughnutChartPercentageData: DoughnutChartPercentageData[] = [
    //   { name: "January Income", category: "Income", amount: 3000, date: new Date("2025-01-01") },
    //   { name: "January Expense", category: "Income", amount: 1500, date: new Date("2025-01-01") },
    //   { name: "January Savings", category: "Income", amount: 1000, date: new Date("2025-01-01") },
    // ];
    
    // const doughnutChartData: DoughnutChartTextData[] = [
    //   { name: "Income for January", category: "Income", amount: 4000 }
    //   // { name: "Expenses for January", category: "Expense", amount: 2500 },
    //   // { name: "Savings for January", category: "Savings", amount: 1500 },
    // ];

    const options = [
      {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense', icon: "/icons/logo-wallet-blue.svg"},
      {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
    ]

    const totalSavings = transformedUserSavingsData.reduce((sum, item) => sum + item.amount, 0);
    const totalDeposit = transformedUserRepaymentData.reduce((sum, item) => sum + item.amount, 0);
    const remainingTotal = totalSavings-totalDeposit;
  return (
    <div>
        <Card className='w-[975px] m-6'>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className='mb-4'>Savings Progress</CardTitle>
            <CardDescription>
              Showing savings progress for the last 3 months
            </CardDescription>
          </div>

          </CardHeader>
          <CardContent className='max-h-[200px]'>
            <div className='flex flex-col'>
              <>
              {userSavingsTransactions 
              ? (<div className='ml-4 mt-6 mb-6 max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={transformedUserSavingsData}/>
                </div>) 
              : (<div className='ml-4 mt-6 mb-6 max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={[{ category: "None", amount: 0 }]}/>
                </div>
              )
              }
              </>

              <>
              {userRepaymentTransactions 
              ? (<div className='ml-4 mt-6 mb-6 max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={transformedUserRepaymentData}/>
                </div>) 
              : (<div className='ml-4 mt-6 mb-6 max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={[{ category: "None", amount: 0 }]}/>
                </div>
              )
              }
              </>

              <div className="items-center justify-center gap-4">
                <div className="mb-1 text-lg font-bold">Total</div>
                <div className="mb-2">Total Savings: {formatAmount(totalSavings)}</div>
                <div className="mb-2">Total Deposits: {formatAmount(totalDeposit)}</div>
              
                <div>
                  Remaining Total: {" "}
                  <span className={`font-bold ${remainingTotal>= 0 ? "text-green-600": "text-red-600"}`}>
                    {formatAmount(remainingTotal)}
                  </span>
                </div>
                </div> 
            </div>
          </CardContent>
        </Card>
        <TransactionsSavingsTable userID={loggedInUserID || ''}/>
        <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default SavingsPage