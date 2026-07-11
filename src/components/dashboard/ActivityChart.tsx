import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyActivity } from '../../services/dashboard.service';
import type { TooltipContentProps } from 'recharts';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface ActivityChartProps {
  data: DailyActivity[];
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
            <span className="font-extrabold text-foreground">{item.value} bookings</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <Card className="border border-border/40 bg-card/60 backdrop-blur-md shadow-sm h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Platform Activity & Booking Volume
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-[280px] w-full p-6 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <XAxis
              dataKey="date"
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
              allowDecimals={false}
            />
            <Tooltip content={CustomTooltip} />
            <Area
              name="Booking Density"
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6" // Violet
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActivity)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
export { ActivityChart };
