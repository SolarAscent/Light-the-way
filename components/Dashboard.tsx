import React from 'react';
import { INITIAL_PROJECTS } from '../constants';
import { Project } from '../types';
import { ArrowUpRight, GitFork, Star, Clock, Zap } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const statusColor = 
    project.status === 'Production' ? 'bg-emerald-100 text-emerald-700' :
    project.status === 'Development' ? 'bg-amber-100 text-amber-700' :
    'bg-violet-100 text-violet-700';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Decorative Gradient Background Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${
                 project.status === 'Production' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                 project.status === 'Development' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]'
             }`}></div>
             <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
              {project.status}
            </span>
          </div>
          {project.url && (
            <a href={project.url} className="text-slate-300 hover:text-blue-600 transition-colors p-1 bg-slate-50 rounded-full hover:bg-blue-50">
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer tracking-tight">
          {project.name}
        </h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          {project.description}
        </p>
      </div>
      
      <div className="relative z-10">
        <div className="flex gap-2 mb-5 flex-wrap">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-medium bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-xs font-medium text-slate-400 gap-4 pt-4 border-t border-slate-50">
            <span className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors"><Star size={14} className="fill-current text-slate-200 group-hover:text-yellow-400" /> 12</span>
            <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><GitFork size={14} /> 4</span>
            <span className="flex items-center gap-1.5 ml-auto"><Clock size={14} /> {project.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Developer</span>
            </h1>
            <p className="text-slate-500 font-medium">Your academic multiverse is running smoothly today.</p>
        </div>
        <div className="flex gap-3">
             <button className="px-5 py-2.5 bg-white text-slate-600 font-semibold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-sm">
                Import Repo
             </button>
             <button className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2">
                <Zap size={16} /> New Project
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INITIAL_PROJECTS.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {/* 'Add New' Placeholder */}
        <button className="group border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 transition-all h-full min-h-[200px]">
          <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
             <span className="text-3xl font-light">+</span>
          </div>
          <span className="font-semibold">Create New Project</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;