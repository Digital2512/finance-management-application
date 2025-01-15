import React from 'react'
import DoughnutChartTextOverview from './DoughnutChartTextOverview'

interface BoxDoughnutChartsComparisonProps{
  typeOfComparison: string,
  firstDoughnutChartDataType: string,
  firstDoughnutChartData: DoughnutChartData[],
  secondDoughnutChartDataType: string,
  secondDoughnutChartData: DoughnutChartData[],
}

const BoxDoughnutChartsComparison = ({
  typeOfComparison,
  firstDoughnutChartDataType,
  firstDoughnutChartData,
  secondDoughnutChartDataType,
  secondDoughnutChartData
}: BoxDoughnutChartsComparisonProps) => {
  return (    
    <div>
    {typeOfComparison === 'dual' ? 
      (<>
      <div>
        <div>
          <DoughnutChartTextOverview doughnutChartData={firstDoughnutChartData} doughnutChartDataType={firstDoughnutChartDataType} />
        </div>
        <div>
          <DoughnutChartTextOverview doughnutChartData={secondDoughnutChartData} doughnutChartDataType={secondDoughnutChartDataType}/>
        </div>
      </div>
      </>
    ) : (<>
    
    </>
    )
    }
    </div>
  )
}

export default BoxDoughnutChartsComparison