import React from 'react';
import { MOCK_ACTIVITY_DATA } from '../constants';
import { User } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Clock, TrendingUp, Crown, Medal, Flame } from 'lucide-react';

interface ActivityProps {
    users?: User[];
}

const Activity: React.FC<ActivityProps> = ({ users = [] }) => {
  const getContributionColor = (value: number) => {
    // Violet/Pink Heatmap Theme
    if (value === 0) return '#f1f5f9'; // Slate-100
    if (value < 2) return '#e9d5ff'; // Purple-200
    if (value < 4) return '#c084fc'; // Purple-400
    if (value < 6) return '#9333ea'; // Purple-600
    return '#581c87'; // Purple-900
  };

  const sortedUsers = [...users].sort((a, b) => b.contributionScore - a.contributionScore);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs">
          <p className="font-bold mb-1">{new Date(label).toLocaleDateString()}</p>
          <p className="text-blue-300">Focus: {payload[0].value.toFixed(1)} hrs</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 h-full overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Growth & Analytics</h1>
        <p className="text-slate-500 font-medium mt-1">Visualize your academic momentum and community impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Charts */}
        <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Clock size={64} className="text-blue-600"/></div>
                    <div className="z-10 text-slate-500 font-semibold text-xs uppercase tracking-wider">Focus Time</div>
                    <div className="z-10">
                        <p className="text-3xl font-black text-slate-800">124.5<span className="text-lg text-slate-400 font-normal">h</span></p>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">▲ 12% <span className="text-slate-400 font-normal">vs last week</span></p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={64} className="text-emerald-600"/></div>
                    <div className="z-10 text-slate-500 font-semibold text-xs uppercase tracking-wider">Total Commits</div>
                    <div className="z-10">
                        <p className="text-3xl font-black text-slate-800">843</p>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">▲ 5 <span className="text-slate-400 font-normal">today</span></p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Flame size={64} className="text-orange-600"/></div>
                    <div className="z-10 text-slate-500 font-semibold text-xs uppercase tracking-wider">Current Streak</div>
                    <div className="z-10">
                        <p className="text-3xl font-black text-slate-800">12 <span className="text-lg text-slate-400 font-normal">days</span></p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Keep it burning!</p>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Deep Work Sessions</h3>
                    <select className="text-xs bg-slate-50 border-none rounded-lg px-3 py-1 text-slate-600 font-medium focus:ring-0">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_ACTIVITY_DATA} barSize={12}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(str) => new Date(str).getDate().toString()} 
                                stroke="#94a3b8" 
                                fontSize={11} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="hours" radius={[6, 6, 6, 6]} fill="url(#barGradient)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Heatmap */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Contribution Density</h3>
                <div className="flex flex-wrap gap-2">
                    {MOCK_ACTIVITY_DATA.map((day, idx) => (
                        <div 
                            key={idx} 
                            title={`${day.hours.toFixed(1)} hours on ${day.date}`} 
                            className="w-5 h-5 rounded hover:scale-125 transition-transform duration-200 cursor-pointer" 
                            style={{ backgroundColor: getContributionColor(day.hours) }} 
                        />
                    ))}
                    {Array.from({length: 40}).map((_, i) => (
                        <div key={`e-${i}`} className="w-5 h-5 rounded bg-slate-50" />
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl flex flex-col overflow-hidden h-fit relative">
            <div className="p-8 border-b border-slate-700/50">
                <h3 className="font-bold text-xl flex items-center gap-2 text-white">
                    <Crown className="text-yellow-400 fill-yellow-400" size={24} />
                    Hall of Fame
                </h3>
                <p className="text-sm text-slate-400 mt-2">Top academic contributors this month.</p>
            </div>
            
            <div className="divide-y divide-slate-700/50">
                {sortedUsers.map((user, index) => (
                    <div key={user.id} className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="font-bold text-lg w-6 text-center">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-slate-500 text-sm">#{index + 1}</span>}
                        </div>
                        <div className="relative">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-lg border border-slate-600" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                  {user.name.charAt(0)}
                              </div>
                            )}
                            {index < 3 && <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] p-0.5 rounded-full border border-slate-800"><Medal size={8}/></div>}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.role}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-bold text-emerald-400">{user.contributionScore}</p>
                            <p className="text-[10px] text-slate-500">XP</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-6 border-t border-slate-700/50 text-center">
                <button className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">View Global Rankings</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;