import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DashboardCharts() {
  
  const scanData = [
    { name: 'Mon', scans: 60 },
    { name: 'Tue', scans: 55 },
    { name: 'Wed', scans: 35 },
    { name: 'Thu', scans: 80 },
    { name: 'Fri', scans: 65 },
    { name: 'Sat', scans: 90 },
    { name: 'Sun', scans: 45 },
  ];

  const userData = [
    { name: 'Doctors', value: 24 },
    { name: 'Radiologists', value: 8 },
    { name: 'Patients', value: 125 },
  ];

  const COLORS = ['#38BDF8', '#818CF8', '#FB7185']; // Custom vibrant colors

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass bg-base-100/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
          <p className="text-xs font-black uppercase tracking-widest text-base-content/50 mb-1">{label}</p>
          <p className="text-lg font-black text-primary">{`${payload[0].value} Scans`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Weekly Activity */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
        <div className="relative p-6 sm:p-8 h-full flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/40 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary/30"></span>
            Weekly Scan Activity
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#38BDF8" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScans)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
        <div className="relative p-6 sm:p-8 h-full flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/40 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-secondary/30"></span>
            User Distribution
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {userData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer shadow-xl"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff', fontWeight: 800 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}