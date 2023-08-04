import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from 'recharts';

function VelocityAreaChart(props) {

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
  
  // const data = props.data.map((item, index) => ({
  //   name: item.name,
  //   Standard: props.est[item.id],
  //   Actual:item.completed.value
  // }));

  return (
    <AreaChart
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
      <YAxis><Label value='Velocity' angle={90} position={'left'}/></YAxis>
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="Standard" stackId={1} fill="#4f4f4f" stroke="#4f4f4f" />
      <Area type="monotone" dataKey="Actual" stackId={1} fill="#418fe8" stroke="#418fe8" />
      <ReferenceLine y={data[data.length - 1].Standard} label={{ value: 'Estimated', position: "left", fontSize: 12, fill: '#4f4f4f' }} stroke="#4f4f4f" strokeWidth={3} />
      <ReferenceLine y={data[data.length - 1].Actual} label={{ value: 'Actual', position: "right", fontSize: 12, fill: '#418fe8' }} stroke="#418fe8" strokeWidth={3} />
    </AreaChart>
  );
}

export default VelocityAreaChart;
