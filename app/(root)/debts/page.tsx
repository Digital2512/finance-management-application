'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DoughnutChartOverview from '@/components/ui/DoughnutChartOverview';
import DoughnutChartTextOverview from '@/components/ui/DoughnutChartTextOverview';
import FloatingButton from '@/components/ui/FloatingButton';
import SavingsDebtAreaChart from '@/components/ui/SavingsDebtAreaChart';
import TransactionsDebtTable from '@/components/ui/TransactionsDebtTable'
import TransactionsRepaymentTable from '@/components/ui/TransactionsRepaymentTable';
import React from 'react'
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { formatAmount } from '@/lib/utils';

const options = [
  {label: 'Add Savings', value: 'addSavingsTransactions', route: '/savings', icon: "/icons/logo-wallet-blue.svg"},
  {label: 'Add Income and Expense Transactions', value: 'addIncomeExpenseTransactions', route: '/income-expense', icon: "/icons/logo-wallet-blue.svg"},
  {label: 'Add Repayment', value: 'addRepaymentTransactions', route: '/debts/individual-repayment-transaction', icon: "/icons/logo-wallet-blue.svg"},
  {label: 'Add Debt', value: 'addDebtsTransactions', route: '/debts/individual-transaction', icon: "/icons/logo-wallet-blue.svg"},
]

const DebtsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDebtsTransactions, setUserDebtsTransactions] = useState<Debt[]>()
  const [userRepaymentTransactions, setUserRepaymentTransactions] = useState<Repayment[]>()
  const loggedInUserID = sessionStorage.getItem('loggedInUserID');  

  useEffect(() => {
  if(loggedInUserID){
    const fetchUserDebtsTransactions = async() => {
      setIsLoading(true);
      try{
        const response = await axios.get('/api/transaction/debt/fetchUserTransactions', {
          params: { userID: loggedInUserID }
        });

        if(response.data.userDebtTransactionsData){
          setUserDebtsTransactions(response.data.userDebtTransactionsData)
        }else{
          console.log('No User Debts Transactions Found')
        }
      }catch(error){
        console.log("Error fetching user transactions:", error);
      }finally{
        setIsLoading(false);
      }
    }

    if(loggedInUserID){
      console.log('Logged In User ID: ', loggedInUserID);
      fetchUserDebtsTransactions();
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
      const fetchUserRepaymentTransactions = async () => {
        setIsLoading(true);
        try{
          const response = await axios.get('/api/transaction/repayment/fetchUserTransactions', {
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
      if(loggedInUserID){
        console.log('User Repayment Data: ', userRepaymentTransactions)
        fetchUserRepaymentTransactions()
      }else{
        console.log('No user repayment data found')
      }
    }else{
      console.log('No User ID Found');
      setIsLoading(false)
    }
  }, [])

  console.log('User Debts Transaction Data: ', userDebtsTransactions);
  console.log('User Repayments Transaction Data: ', userRepaymentTransactions);

  if(isLoading){
  return <p>Loading...</p>
  }

  if(!userDebtsTransactions || userDebtsTransactions.length === 0){
    return <p>No transactions found</p>
  }

  if(!userRepaymentTransactions || userRepaymentTransactions.length === 0){
    return <p>No transactions found</p>
  }

  // console.log('User Repayment Data', userRepaymentTransactions);

  const transformedUserDebtsData = userDebtsTransactions?.map((curr) => ({
  category: curr.debtName,
  amount: curr.debtAmount
  }), {} as DoughnutChartData[])

  const filteredUserRepaymentData = userRepaymentTransactions?.filter((data) => data.transactionType === 'Debts');

  const transformedUserRepaymentData = filteredUserRepaymentData?.map((curr) => ({
    category: curr.transactionType,
    amount: curr.repaymentAmount,
    date : curr.dateOfRepayment,
  }), {} as DoughnutChartPercentageData[])

  console.log('User Debts Data', transformedUserDebtsData);

  console.log('User Debts Repayment Data', transformedUserRepaymentData);

  const totalDebts = transformedUserDebtsData.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = transformedUserRepaymentData.reduce((sum, item) => sum + item.amount, 0);
  const remainingTotal = totalDebts - totalPaid;

  console.log('Data Retrieved: ', transformedUserDebtsData, transformedUserRepaymentData)
  return (
    <div>
      <Card className='w-[1100px] m-6'>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className='mb-4'>Savings Progress</CardTitle>
            <CardDescription>
              Showing savings progress for the last 3 months
            </CardDescription>
          </div>

          </CardHeader>
          <CardContent className='max-h-[200px]'>
            <div className='flex flex-row gap-4 mt-4'>
              <div className='max-h-[150px]'>
              <DoughnutChartOverview doughnutChartData={transformedUserDebtsData || [{category: 'None', amount: 0}]}/>              
              </div>

              {/* <div className='max-h-[150px]'>
              <DoughnutChartOverview doughnutChartData={transformedUserRepaymentData || [{category: 'None', amount: 0}]}/>
              </div> */}

              <div className='max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={transformedUserDebtsData  || [{category: 'None', amount: 0}]} doughnutChartPercentageData={transformedUserRepaymentData || [{category: 'None', amount: 0}]}/>              
              </div>

              <div className="items-center justify-center gap-4 ml-5">
                <div className="mb-1 text-lg font-bold">Total</div>
                <div className="mb-2">Total Debts: {formatAmount(totalDebts)}</div>
                <div className="mb-2">Total Paid: {formatAmount(totalPaid)}</div>
              
                <div>
                  Remaining Total: {" "}
                  <span className={`font-bold ${remainingTotal>= 0 ? "text-red-600": "text-green-600"}`}>
                    {formatAmount(remainingTotal)}
                  </span>
                </div>
                </div> 
            </div>
          </CardContent>
        </Card>
      {/* <DoughnutChartOverview doughnutChartData={dummyData} doughnutChartDataType='income'/> */}
      {/* <div className='page-chart-overview-box'>
        <div className='max-h-[130px]'>
        <DoughnutChartOverview doughnutChartData={doughnutChartData}/>
        </div>
      </div> */}
      <TransactionsDebtTable userID={loggedInUserID || ''}/>
      <TransactionsRepaymentTable userID={loggedInUserID || ''} typeOfRepayment='Debts'/>
      <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default DebtsPage
