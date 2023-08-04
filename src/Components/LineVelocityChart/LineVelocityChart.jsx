import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

function LineVelocityChart(props) {

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

  // const data = props.data.map((item) => ({
  //   name: item.name,
  //   Standard: props.est[item.id],
  //   Actual: item.completed.value,
  // }));

  return (
    <LineChart
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
      <Line dataKey="Standard" stroke="#4f4f4f" strokeWidth={3}/>
      <Line dataKey="Actual" stroke="#418fe8" strokeWidth={3}/>
    </LineChart>
  );
}

export default LineVelocityChart;
