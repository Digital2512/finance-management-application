import HeaderBox from '@/components/ui/HeaderBox';
import TotalBalanceBox from '@/components/ui/TotalBalanceBox';
import React, { use } from 'react'

let userName ='Adrian';

const Home = () => {
    const loggedInUser = {firstName: 'User', lastName: 'Tester'}

    const totalCurrentBalanceAmount = 1250.35
    const totalIncomingBalanceAmount = 1000.50
    const totalCurrentMonthDebtBalanceAmount = 100.40
    const totalExpenseBalance = 120.50
    const totalLeftToSpendBalance = totalCurrentBalanceAmount - totalExpenseBalance - totalCurrentMonthDebtBalanceAmount

  return (
    <section className='home'>
        <div className='home-content'>
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedInUser?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
                accounts = {[]}
                totalBanks = {1}
                totalLeftToSpendBalance = {totalLeftToSpendBalance}
                totalCurrentBalance = {totalCurrentBalanceAmount}
                totalIncomingBalance = {totalIncomingBalanceAmount}
                totalExpenseBalance={totalExpenseBalance}
                totalCurrentMonthDebtBalance = {totalCurrentMonthDebtBalanceAmount}
            />
        </header>
        </div>
    </section>
  )
}

export default Home