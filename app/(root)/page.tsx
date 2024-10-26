'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RightSidebar from '@/components/ui/RightSidebar';
import HeaderBox from '@/components/ui/HeaderBox';
import ExpenseBox from '@/components/ui/ExpenseBox';
import DebtsBox from '@/components/ui/DebtsBox';
import SavingsBox from '@/components/ui/SavingsBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const Home = () => {
    const goalDetails1 = {
        goalName: "Emergency Fund",
        goalType: "Savings",
        goalCurrentAmount: 1500,
        goalAmount: 5000,
    }

    const goalDetails2 = {
      goalName: "Vacation Fund",
      goalType: "Savings",
      goalCurrentAmount: 1000,
      goalAmount: 3000,
    }

    const goalDetails3 = {
      goalName: "New Car",
      goalType: "Savings",
      goalCurrentAmount: 2000,
      goalAmount: 20000,
    }
    const loggedInUser = { 
        firstName: 'User', 
        lastName: 'Tester', 
        email: 'userTester@gmail.com', 
        $id: "Tester_123",
        userId: "Tester_123",
        // dwollaCustomerUrl: "https://api.dwolla.com/customers/user_12345",
        // dwollaCustomerId: "dwolla_customer_12345",
        address1: "123 Main St",
        city: "Anytown",
        state: "CA",
        postalCode: "90210",
        dateOfBirth: "1990-01-01",
        ssn: "123-45-6789",
        goals: [goalDetails1, goalDetails2, goalDetails3]
    };
    const bankAccount1 = {
        $id: "bank_1",
        accountId: "acc_101",
        bankId: "bank_101",
        accessToken: "token_101",
        fundingSourceUrl: "https://funding.url/101",
        userId: "user_001",
        accountSharableId: "share_101",
        typeOfAccount: "Debit",
        typeOfCard: "Visa",
        id: "acc_101",
        availableBalance: 5000,
        currentBalance: 5500,
        officialName: "Savings Account",
        mask: "1111",
        institutionId: "inst_101",
        name: "John Doe's Savings",
        type: "deposit",
        subtype: "savings",
        bankSharableId: "share_101",
        cardNumber: "123456789012",
        expiryDate: "12/28",
      }
      const bankAccount2 = {
        $id: "bank_2",
        accountId: "acc_102",
        bankId: "bank_102",
        accessToken: "token_102",
        fundingSourceUrl: "https://funding.url/102",
        userId: "user_002",
        accountSharableId: "share_102",
        typeOfAccount: "Credit",
        typeOfCard: "MasterCard",
        id: "acc_102",
        availableBalance: 2500,
        currentBalance: 3000,
        officialName: "Checking Account",
        mask: "2222",
        institutionId: "inst_102",
        name: "Jane Smith's Checking",
        type: "deposit",
        subtype: "checking",
        bankSharableId: "share_102",
        cardNumber: "901234567890",
        expiryDate: "12/28"
      }

    const totalCurrentBalanceAmount = 1250.35;
    const totalExpenseBalance = 120.50;
    const totalRequiredDebtBalanceAmount = 500;
    const totalDebtBalanceAmount = 100.40;
    const totalRequiredSavingsBalanceAmount = 500;
    const totalSavingsBalanceAmount = 120.50;

    const totalLeftToSpendBalanceAmount = totalCurrentBalanceAmount - totalExpenseBalance - totalSavingsBalanceAmount - totalDebtBalanceAmount;
    const totalLeftToSaveBalanceAmount = totalRequiredSavingsBalanceAmount - totalSavingsBalanceAmount;
    const totalLeftToPayDebtBalanceAmount = totalRequiredDebtBalanceAmount - totalDebtBalanceAmount;

    const fakeExpenses = [
        { category: 'Food', amount: 300 },
        { category: 'Transportation', amount: 150 },
        { category: 'Utilities', amount: 100 },
        { category: 'Entertainment', amount: 200 },
        { category: 'Shopping', amount: 250 },
    ];

    const fakeSavings = [
        { category: 'Food', amount: 300 },
        { category: 'Transportation', amount: 100 },
        { category: 'Utilities', amount: 100 },
        { category: 'Entertainment', amount: 200 },
        { category: 'Shopping', amount: 250 },
    ];

    const fakeDebts = [
        { category: 'Food', amount: 300 },
        { category: 'Transportation', amount: 150 },
        { category: 'Utilities', amount: 25 },
        { category: 'Entertainment', amount: 200 },
        { category: 'Shopping', amount: 250 },
    ];

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

                    <Swiper
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{
                            clickable: true
                        }}
                        navigation = {{
                          hideOnClick: false
                        }}
                        modules={[Pagination, Navigation]}
                        className='w-full lg:max-w-[600px] custom-swiper'
                    >
                        <SwiperSlide>
                            <ExpenseBox
                                accounts={[]}
                                totalBanks={1}
                                totalLeftToSpendBalance={totalLeftToSpendBalanceAmount}
                                expenseData={fakeExpenses}
                            />
                        </SwiperSlide> 

                        <SwiperSlide>
                            <SavingsBox
                                accounts={[]}
                                totalBanks={1}
                                totalLeftToSaveBalance={totalLeftToSaveBalanceAmount}
                                savingsData={fakeSavings}
                            />
                        </SwiperSlide>

                        <SwiperSlide>
                            <DebtsBox
                                accounts={[]}
                                totalBanks={1}
                                totalLeftToPayBalance={totalLeftToPayDebtBalanceAmount}
                                debtsData={fakeDebts}
                            />
                        </SwiperSlide>
                     </Swiper>
                </header>
                <h2>Recent Transactions</h2>
                {/* Add your recent transactions component here */}
            </div>
            <RightSidebar
                user={loggedInUser}
                transactions={[]}
                bankAccounts={[bankAccount1, bankAccount2]}
                goalsTracker={[goalDetails1, goalDetails2, goalDetails3]}
            />
        </section>
    );
};

export default Home;
