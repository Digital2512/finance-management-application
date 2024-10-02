import { formatAmount } from "@/lib/utils";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
    accounts = [],
    totalBanks,
    totalCurrentBalance,
    totalIncomingBalance,
    totalCurrentMonthDebtBalance,
    totalLeftToSpendBalance,
    totalExpenseBalance
}: TotalBalanceBoxProps) => {
    return (
        <section className="total-balance">
            <div className="total-balance-chart">
                <DoughnutChart 
                totalExpenseBalance = {totalExpenseBalance}
                totalCurrentMonthDebtBalance = {totalCurrentMonthDebtBalance}
                />
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="header-2">
                    Bank Accounts: {totalBanks}
                </h2>
                <div className="flex flex-col gap-2">
                    <span className="total-balance-label">
                        Total Balance Left To Spend:
                    </span>
                    <div className="total-balance-amount">            
                        <AnimatedCounter amount={totalLeftToSpendBalance} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TotalBalanceBox;
