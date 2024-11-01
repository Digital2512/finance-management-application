"use client"

import { formatAmount } from "@/lib/utils";
import AnimatedCounter from "./AnimatedCounter";
import DebtsDoughnutChart from "./DebtsDoughnutChart";
import { useState } from "react";

const DebtsBox = ({
    accounts = [],
    totalBanks,
    totalLeftToPayBalance,
    debtsData,
}: DebtsBoxProps) => {

    return (
        <section className="debt-balance">
            <div className="debt-chart">
                <DebtsDoughnutChart 
                debts={debtsData}
                />
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="header-2">
                    {/* Bank Accounts: {totalBanks} */}
                    Debts
                </h2>
                <div className="flex flex-col gap-2">
                    <span className="debt-label">
                        Total Balance Left To Pay:
                    </span>
                    <div className="debt-amount">            
                        <AnimatedCounter amount={totalLeftToPayBalance} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DebtsBox;
