import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label} from 'recharts';

function VelocityChart(props) {
  const data=[]
  const dat = props.data;
  
  for (let j = dat.length - 1; j >= 0; j--) {
    const i = dat[j]
    data.push({
          name:i.name,
          Standard:props.est[i.id],
          Actual:i.completed.value
        })
  }

  // for(const i of props.data)
  // {
  //   data.push({
  //     name:i.name,
  //     Standard:props.est[i.id],
  //     Actual:i.completed.value
  //   })
  // }

  // const averageStandard = data.reduce((sum, item) => sum + item.Standard, 0) / data.length;
  const averageActual = (data.reduce((sum, item) => sum + item.Actual, 0) / data.length).toFixed(2);

  return (
      <BarChart
          width={1300}
          height={470}
          data={data}
          margin={{
            top: 5,
            right: 100,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis><Label value='Velocity' angle={-90} position={'left'}/></YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="Standard" fill="#8c918e" />
          <Bar dataKey="Actual" fill="#418fe8" />
          <ReferenceLine y={averageActual} label={{ value: 'Avg: '+averageActual, position: "right", fontSize: 12, fill: 'black' }} stroke="black" strokeWidth={2.3} />
          </BarChart>
  );
}
export default VelocityChart;