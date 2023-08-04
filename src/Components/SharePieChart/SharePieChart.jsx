import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';
import './SharePieChart.css'

const SharePieChart = ({ data }) => {
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AF19FF',
    '#FF77FF',
    '#A5D6A7',
    '#78909C',
    '#FFD54F',
    '#3F51B5',
    '#E91E63',
    '#009688',
    '#F57C00',
    '#9C27B0',
    '#4CAF50',
    '#FF5722',
    '#673AB7',
    '#03A9F4',
    '#8BC34A',
    '#FF9800',
    '#2196F3',
    '#CDDC39',
    '#F44336',
    '#FFEB3B',
  ];
  data=data.sort((p1, p2) => (p1.value < p2.value) ? 1 : (p1.value > p2.value) ? -1 : 0);
  console.log(data)

  return (
    <PieChart  width={1000} height={350}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label={({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          value,
          index
        }) => {
          const RADIAN = Math.PI / 180;
          const radius = 25 + innerRadius + (outerRadius - innerRadius);
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill="#818282"
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline="central"
            >
              {data[index].name} : {value}
            </text>
          );
        }}
      >
        {data.map((entry, share) => (
          <Cell key={`cell-${share}`} fill={COLORS[share%COLORS.length]} />
        ))}

      </Pie>
      <Tooltip />
      {/* <Legend /> */}
    </PieChart>
  );
};

export default SharePieChart;
