import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DepartmentUtilization } from '../../services/dashboard.service';
import type { TooltipContentProps } from 'recharts';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface UtilizationChartProps {
  data: DepartmentUtilization[];
}

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card text-card-foreground border border-border/40 rounded-lg p-3 shadow-md text-xs">
        <p className="font-bold border-b border-border/10 pb-1 mb-1.5">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex justify-between items-center gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-extrabold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const UtilizationChart: React.FC<UtilizationChartProps> = ({ data }) => {
  return (
    <Card className="border border-border/40 bg-card/60 backdrop-blur-md shadow-sm h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Department Load & Resource Allocations
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-[280px] w-full p-6 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={10}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={10}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip content={CustomTooltip} cursor={{ fill: 'var(--accent)', opacity: 0.15 }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingBottom: '15px' }}
            />
            <Bar
              name="Active Bookings"
              dataKey="bookings"
              fill="#6366f1" // Indigo
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
            <Bar
              name="Event Proposals"
              dataKey="events"
              fill="#14b8a6" // Teal
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UtilizationChart;
export { UtilizationChart };
