
// 封装图表bar组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

function Bar({title, xData, yData, style}) {
  const domRef = useRef()
  const chartInit = () => {
    // 基于准备好的dom,初始化echarts实例化
    const myChart = echarts.init(domRef.current)

    // 指定图表的配置项和数据
    myChart.setOption(
      {
        title: {
          text: title
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: yData
          }
        ]
      }
    )

  }
  // 执行这个初始化的函数
  useEffect(() => {
    chartInit()
  }, [])

  return (
    <div>
      {/* 准备一个挂载节点 */}
      <div ref={domRef} style={style}></div>
    </div>
  )
}

export default Bar