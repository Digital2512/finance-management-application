"use client"

import { formatAmount } from "@/app/lib/utils";
import AnimatedCounter from "./AnimatedCounter";
import ExpenseDoughnutChart from "./ExpenseDoughnutChart";
import { useState } from "react";

const ExpenseBox = ({
    accounts = [],
    totalBanks,
    totalLeftToSpendBalance,
    expenseData,
}: ExpenseBoxProps) => {

    return (
        <section className="expense-balance">
            <div className="expense-chart">
                <ExpenseDoughnutChart 
                expenses={expenseData}
                />
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="header-2">
                    {/* Bank Accounts: {totalBanks} */}
                    Expenses
                </h2>
                <div className="flex flex-col gap-2">
                    <span className="expense-label">
                        Total Balance Left To Spend:
                    </span>
                    <div className="expense-amount">            
                        <AnimatedCounter amount={totalLeftToSpendBalance} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ExpenseBox;
