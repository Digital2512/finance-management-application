"use client"

import { formatAmount } from "@/lib/utils";
import AnimatedCounter from "./AnimatedCounter";
import { useState } from "react";
import DoughnutChartOverview from "./DoughnutChartOverview";
import DoughnutChartTextOverview from "./DoughnutChartTextOverview";

const BoxOverview = ({
    accounts = [],
    totalBanks,
    // totalLeftBalance,
    boxData,
    boxTextData,
    typeBox,
}: BoxOverviewProps) => {

  const totalLeftBalance = boxData.reduce((acc, val) => {
    return acc + val.amount
  }, 0)

    return (
        <>
          {typeBox === "Savings" ? (
            <section className="savings-balance">
              <div className="savings-chart">
                <DoughnutChartOverview doughnutChartData={boxData} />
                {/* <DoughnutChartTextOverview doughnutChartData={boxData} doughnutChartDataType="savings"/> */}
                {/* <DoughnutChartTextOverview doughnutChartData={boxTextData} chartOverviewType="savings"/> */}
              </div>
    
              <div className="flex flex-col gap-6">
                <h2 className="header-2">Savings</h2>
                <div className="flex flex-col gap-2">
                  <span className="savings-label">
                    Total Balance Left To Save:
                  </span>
                  <div className="savings-amount">
                    <AnimatedCounter amount={totalLeftBalance} />
                  </div>
                </div>
              </div>
            </section>
          ) : typeBox === "Expense" ? (
            <section className="savings-balance">
            <div className="savings-chart">
              <DoughnutChartOverview doughnutChartData={boxData} />
              {/* <DoughnutChartTextOverview doughnutChartData={boxData} doughnutChartDataType="expense"/> */}
            </div>
  
            <div className="flex flex-col gap-6">
              <h2 className="header-2">Expense</h2>
              <div className="flex flex-col gap-2">
                <span className="savings-label">
                  Total Balance Left To Spend:
                </span>
                <div className="savings-amount">
                  <AnimatedCounter amount={totalLeftBalance} />
                </div>
              </div>
            </div>
          </section>
          ): typeBox === "Debt" ? (
            <section className="savings-balance">
            <div className="savings-chart">
              <DoughnutChartOverview doughnutChartData={boxData} />              
              {/* <DoughnutChartTextOverview doughnutChartData={boxData} doughnutChartDataType="debt"/> */}
            </div>
  
            <div className="flex flex-col gap-6">
              <h2 className="header-2">Debts</h2>
              <div className="flex flex-col gap-2">
                <span className="savings-label">
                  Total Balance Left To Pay:
                </span>
                <div className="savings-amount">
                  <AnimatedCounter amount={totalLeftBalance} />
                </div>
              </div>
            </div>
          </section>
          ):(
            <section className="default-balance">
              {/* Handle other box types here */}
              <h2 className="header-2">{typeBox}</h2>
              <p>No specific data available for this type of box.</p>
            </section>
          )}
        </>
      );
}

export default BoxOverview;
