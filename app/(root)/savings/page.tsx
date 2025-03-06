'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DoughnutChartOverview from '@/components/ui/DoughnutChartOverview';
import FloatingButton from '@/components/ui/FloatingButton';
import TransactionsSavingsTable from '@/components/ui/TransactionsSavingsTable'
import React, { useEffect, useState } from 'react'
import { formatAmount } from "@/lib/utils"
import axios from 'axios';
import TransactionsRepaymentTable from '@/components/ui/TransactionsRepaymentTable';

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
              <DoughnutChartOverview doughnutChartData={transformedUserSavingsData || [{category: 'None', amount: 0}]}/>              
              </div>

              {/* <div className='max-h-[150px]'>
              <DoughnutChartOverview doughnutChartData={transformedUserRepaymentData || [{category: 'None', amount: 0}]}/>
              </div> */}

              <div className='max-h-[150px]'>
                <DoughnutChartOverview doughnutChartData={transformedUserSavingsData  || [{category: 'None', amount: 0}]} doughnutChartPercentageData={transformedUserRepaymentData || [{category: 'None', amount: 0}]}/>              
              </div>

              <div className="items-center justify-center gap-4 ml-5">
                <div className="mb-1 text-lg font-bold">Total</div>
                <div className="mb-2">Total Savings: {formatAmount(totalSavings)}</div>
                <div className="mb-2">Total Deposits: {formatAmount(totalDeposit)}</div>
              
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
        <h2 className='ml-8 mb-2 text-xl'>Savings</h2>
        <TransactionsSavingsTable userID={loggedInUserID || ''}/>
        <br></br>
        <h2 className='ml-8 mb-2 text-xl'>Repayment</h2>
        <TransactionsRepaymentTable userID={loggedInUserID || ''} typeOfRepayment='Savings'/>
        <FloatingButton floatingButtonOptions={options}/>
    </div>
  )
}

export default SavingsPage