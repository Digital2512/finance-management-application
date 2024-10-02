'use client';
import CountUp from 'react-countup'

let currencyPrefix = "$";

const AnimatedCounter = ({amount}: {amount: number}) => {
  return (
    <div>
        <CountUp 
        duration = {2}
        decimals = {2}
        decimal ="," 
        prefix = {currencyPrefix} 
        end = {amount}/>
    </div>
  )
}

export default AnimatedCounter