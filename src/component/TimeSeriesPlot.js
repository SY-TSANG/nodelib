import React from 'react'
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip, Legend } from 'recharts'
import moment from 'moment'

const Tick = ({ x, y, stroke, payload }) => {
  const dt_moment = moment(payload.value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">{dt_moment.format('HH')}</text>
      {(dt_moment.format('HH') == "00") &&
        <text x={0} y={0} dy={32} textAnchor="middle" fill="#666">{dt_moment.format('YYYY-MM-DD')}</text>
      }
    </g>
  );
}

export const TimeSeriesPlot = ({ data, items, day, hour, yLeft={}, yRight={} }) => {
  const t0 = moment(day).startOf('day').toDate()

  return (
    data &&
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data} margin={{ top: 30, right: 10, left: 10, bottom: 30 }}>
          <Line yAxisId="left" legendType="none" />
          <Line yAxisId="right" legendType="none" />

          {(items).map((i) => 
            <Line type="monotone" yAxisId={i["axis"]} dataKey={i["dataKey"]} name={i["name"]} stroke={i["stroke"]} activeDot={{ r: 8 }} />
          )}

          <YAxis yAxisId="left" orientation="left" domain={yLeft["range"]} label={{ value: yLeft["label"], angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" domain={yRight["range"]} label={{ value: yRight["label"], angle: 90, position: 'insideRight' }} />
          <XAxis type='number' dataKey='time' name = 'Time' domain = {[moment(new Date(t0)).add(hour[0], 'hours').toDate(), moment(new Date(t0)).add(hour[1], 'hours').toDate()]} interval={0} tick={<Tick hour={hour}/>} ticks={Array.from({ length: hour[1] - hour[0] + 1 }, (_, i) => hour[0] + i).map((i) => moment(new Date(t0)).add(i, 'hours').toDate().getTime())} />  

          <Tooltip labelFormatter={t =>  moment(t).format('YYYY-MM-DD HH:mm:SS')} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
  );
}
