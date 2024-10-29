"use client"

import { formatAmount } from "@/app/lib/utils";
import AnimatedCounter from "./AnimatedCounter";
import SavingsDoughnutChart from "./SavingsDoughnutChart";
import { useState } from "react";

const SavingsBox = ({
    accounts = [],
    totalBanks,
    totalLeftToSaveBalance,
    savingsData,
}: SavingsBoxProps) => {

    return (
        <section className="savings-balance">
            <div className="savings-chart">
                <SavingsDoughnutChart 
                savings={savingsData}
                />
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="header-2">
                    {/* Bank Accounts: {totalBanks} */}
                    Savings
                </h2>
                <div className="flex flex-col gap-2">
                    <span className="savings-label">
                        Total Balance Left To Save:
                    </span>
                    <div className="savings-amount">            
                        <AnimatedCounter amount={totalLeftToSaveBalance} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SavingsBox;
