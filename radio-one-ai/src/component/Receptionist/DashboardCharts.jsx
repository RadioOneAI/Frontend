import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DashboardCharts() {
  
  // Dummy Data for Scans (Area Chart)
  const scanData = [
    { name: 'Mon', scans: 40 },
    { name: 'Tue', scans: 55 },
    { name: 'Wed', scans: 35 },
    { name: 'Thu', scans: 80 },
    { name: 'Fri', scans: 65 },
    { name: 'Sat', scans: 90 },
    { name: 'Sun', scans: 45 },
  ];

  // Dummy Data for Users (Pie Chart)
  const userData = [
    { name: 'Doctors', value: 24 },
    { name: 'Radiologists', value: 8 },
    { name: 'Patients', value: 125 },
  ];

  const COLORS = ['#570DF8', '#F000B8', '#37CDBE']; // DaisyUI Primary, Secondary, Accent

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* --- CHART 1: WEEKLY SCAN ACTIVITY --- */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">Weekly Scan Activity</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanData}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#570DF8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#570DF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="scans" stroke="#570DF8" fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- CHART 2: USER DISTRIBUTION --- */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">User Distribution</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}