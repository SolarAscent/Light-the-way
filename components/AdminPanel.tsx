import React, { useState, useRef } from 'react';
import { MOCK_LOGS, MOCK_CHANGE_REQUESTS, MOCK_FILE_SYSTEM } from '../constants';
import { User, FileSystemNode } from '../types';
import { Activity, Users, ShieldAlert, Server, Check, X, Database, GitPullRequest, ArrowRight, Cloud, Upload, File, Trash2, Folder } from 'lucide-react';

interface AdminPanelProps {
    users?: User[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users = [] }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'storage'>('overview');
  
  // File Upload State
  const [localFiles, setLocalFiles] = useState<FileSystemNode[]>(MOCK_FILE_SYSTEM);
  const [uploadQueue, setUploadQueue] = useState<{name: string, progress: number, size: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      
      const newUploads = Array.from(files).map(f => ({
          name: f.name,
          progress: 0,
          size: `${(f.size / 1024 / 1024).toFixed(2)} MB`
      }));

      setUploadQueue(prev => [...prev, ...newUploads]);

      // Simulate Upload Progress
      newUploads.forEach((item, index) => {
          let progress = 0;
          const interval = setInterval(() => {
              progress += Math.random() * 20;
              if (progress >= 100) {
                  progress = 100;
                  clearInterval(interval);
                  // Add to 'Cloud Uploads' folder in mock data
                  setLocalFiles(prev => {
                      const updated = [...prev];
                      const cloudFolder = updated.find(n => n.id === 'cloud-1');
                      if (cloudFolder && cloudFolder.children) {
                          cloudFolder.children.push({
                              id: `new-${Date.now()}-${index}`,
                              name: item.name,
                              type: 'file',
                              source: 'cloud',
                              size: item.size,
                              uploadDate: new Date().toISOString().split('T')[0]
                          });
                      }
                      return updated;
                  });
                  // Remove from queue after delay
                  setTimeout(() => {
                      setUploadQueue(q => q.filter(i => i.name !== item.name));
                  }, 1000);
              }
              setUploadQueue(prev => prev.map(u => u.name === item.name ? { ...u, progress } : u));
          }, 400);
      });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 h-full overflow-y-auto">
      {/* Header & Tabs */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Admin Console</h1>
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Requests <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px]">1</span>
            </button>
            <button 
                onClick={() => setActiveTab('storage')}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'storage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Storage
            </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Users', value: users.length.toLocaleString(), icon: Users, color: 'blue', trend: '+12%' },
                    { label: 'System Load', value: '42%', icon: Server, color: 'purple', trend: '-5%' },
                    { label: 'API Calls', value: '84.2k', icon: Activity, color: 'emerald', trend: '+24%' },
                    { label: 'Alerts', value: '3', icon: ShieldAlert, color: 'red', trend: '0' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex items-start justify-between group">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                            <p className={`text-xs font-bold mt-2 ${stat.color === 'red' ? 'text-red-500' : 'text-green-500'}`}>{stat.trend} <span className="text-slate-400 font-normal">this week</span></p>
                        </div>
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Registered Users</h3>
                        <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-semibold">User</th>
                                <th className="px-6 py-3 font-semibold">Role</th>
                                <th className="px-6 py-3 font-semibold text-right">XP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                        {user.avatar ? (
                                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
                                        )}
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                            user.role === 'editor' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-600">{user.contributionScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Audit Log */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                     <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">System Activity</h3>
                    </div>
                    <div className="p-0 overflow-y-auto max-h-[400px]">
                        {MOCK_LOGS.map(log => (
                            <div key={log.id} className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${log.status === 'Success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                                    <p className="text-xs text-slate-500">by <span className="font-medium">{log.user}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 font-mono">{log.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
      )}

      {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><GitPullRequest className="text-blue-500"/> Change Requests</h3>
                  <p className="text-slate-500 mt-2 max-w-2xl">Review, discuss, and merge proposed changes to your documentation. These changes will be live upon approval.</p>
              </div>
              <div className="divide-y divide-slate-100">
                  {MOCK_CHANGE_REQUESTS.map(req => {
                      const user = users.find(u => u.id === req.userId);
                      return (
                      <div key={req.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                              <div className="flex items-start gap-4">
                                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-1">
                                      <GitPullRequest size={20} />
                                  </div>
                                  <div>
                                      <h4 className="text-lg font-bold text-slate-800">{req.docTitle}</h4>
                                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                          <span>Proposed by</span>
                                          <span className="flex items-center gap-1 font-medium text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                                              {user?.avatar ? (
                                                  <img src={user.avatar} alt={req.userName} className="w-4 h-4 rounded-full object-cover"/>
                                              ) : (
                                                  <div className="w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">{req.userName[0]}</div>
                                              )}
                                              {req.userName}
                                          </span>
                                          <span>• {new Date(req.timestamp).toLocaleDateString()}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex gap-3">
                                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-800 shadow-lg shadow-slate-200 font-bold transition-all">
                                      <Check size={16} /> Approve Merge
                                  </button>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-100 rounded-xl text-sm hover:bg-red-50 font-bold transition-all">
                                      <X size={16} /> Reject
                                  </button>
                              </div>
                          </div>
                          
                          <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2 pb-2 border-b border-slate-700">
                                <span className="text-green-400">+ Added</span>
                                <span className="text-red-400">- Removed</span>
                             </div>
                             <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                {req.proposedContent}
                             </pre>
                          </div>
                      </div>
                  )})}
                  {MOCK_CHANGE_REQUESTS.length === 0 && (
                      <div className="p-20 text-center text-slate-400">
                          <div className="inline-block p-4 bg-slate-50 rounded-full mb-4"><Check size={32}/></div>
                          <p>All clear! No pending requests.</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {activeTab === 'storage' && (
           <div className="flex flex-col lg:flex-row gap-8">
               {/* Left: Storage Sources List */}
               <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Database className="text-purple-500"/> Storage Sources</h3>
                    </div>
                    <div>
                      {localFiles.map((node, i) => (
                          <div key={node.id} className={`p-6 hover:bg-slate-50/50 transition-colors ${i !== localFiles.length - 1 ? 'border-b border-slate-100' : ''}`}>
                              <div className="flex items-center gap-4 mb-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${node.source === 'nas' ? 'bg-purple-100 text-purple-600' : node.source === 'cloud' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                      {node.source === 'nas' ? <Server size={24} /> : node.source === 'cloud' ? <Cloud size={24}/> : <Activity size={24}/>}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-900">{node.name}</h4>
                                      <span className="text-xs text-slate-500 font-mono">{node.size || 'N/A'}</span>
                                  </div>
                              </div>
                              
                              {/* File List for Folder */}
                              {node.children && node.children.length > 0 && (
                                  <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                                      {node.children.map(child => (
                                          <div key={child.id} className="flex items-center justify-between text-sm px-2">
                                              <div className="flex items-center gap-2 text-slate-700">
                                                  {child.type === 'folder' ? <Folder size={14} className="text-yellow-500"/> : <File size={14} className="text-blue-400"/>}
                                                  <span className="truncate max-w-[150px]">{child.name}</span>
                                              </div>
                                              <div className="flex items-center gap-3 text-xs text-slate-400">
                                                  <span>{child.size}</span>
                                                  {child.uploadDate && <span>{child.uploadDate}</span>}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ))}
                    </div>
               </div>

               {/* Right: Upload Zone */}
               <div className="lg:w-96 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Upload size={20} className="text-blue-500"/> Quick Upload</h3>
                        
                        <div 
                            className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                multiple 
                                onChange={handleFileUpload}
                            />
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-500">
                                <Cloud size={32} />
                            </div>
                            <p className="font-bold text-slate-700">Click to upload</p>
                            <p className="text-xs text-slate-400 mt-1">or drag and drop files here</p>
                            <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-wider">Supports PDF, PNG, JPG, CSV</p>
                        </div>
                    </div>

                    {/* Upload Queue */}
                    {uploadQueue.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-4 text-sm">Uploading...</h3>
                            <div className="space-y-4">
                                {uploadQueue.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-slate-700 truncate max-w-[150px]">{item.name}</span>
                                            <span className="text-slate-500">{item.progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-blue-500 h-full transition-all duration-300 rounded-full" 
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
               </div>
           </div>
      )}
    </div>
  );
};

export default AdminPanel;