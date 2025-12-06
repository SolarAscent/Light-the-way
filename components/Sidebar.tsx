import React, { useState, useEffect, useRef } from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewState, User } from '../types';
import { Hexagon, X, ChevronLeft, ChevronRight, LogOut, LogIn } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  width: number;
  setWidth: (w: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, setCurrentView, isOpen, onClose, 
  user, onLogin, onLogout, width, setWidth 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isResizing = useRef(false);

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      let newWidth = e.clientX;
      if (newWidth < 64) newWidth = 64; // Min width (collapsed state mostly)
      if (newWidth > 400) newWidth = 400; // Max width
      setWidth(newWidth);
      if (newWidth < 100 && !isCollapsed) setIsCollapsed(true);
      if (newWidth > 100 && isCollapsed) setIsCollapsed(false);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCollapsed, setWidth]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div 
        style={{ width: isOpen ? '100%' : `${width}px` }}
        className={`
          fixed top-0 left-0 h-screen bg-[#0d1117] text-[#c9d1d9] 
          z-30 transition-all duration-75 ease-linear
          border-r border-[#30363d] flex flex-col
          ${isOpen ? 'translate-x-0 w-[80%]' : '-translate-x-full'}
          md:translate-x-0 md:relative
        `}
      >
        {/* Resize Handle */}
        <div 
            className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 z-40 transition-colors hidden md:block"
            onMouseDown={(e) => {
                isResizing.current = true;
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            }}
        />

        {/* Header */}
        <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-[#30363d]`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <Hexagon className="text-blue-500 fill-current shrink-0" size={24} />
            {!isCollapsed && (
                <div className="whitespace-nowrap">
                    <h1 className="font-bold text-sm tracking-wide text-white">NEXUS</h1>
                    <p className="text-[10px] text-gray-400">Academic Hub</p>
                </div>
            )}
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              // Hide Admin for non-admins
              if (item.id === 'ADMIN' && user?.role !== 'admin') return null;

              return (
                <li key={item.id} className={item.separate ? 'mt-6 pt-6 border-t border-[#30363d]' : ''}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id as ViewState);
                      if (window.innerWidth < 768) onClose();
                    }}
                    title={isCollapsed ? item.label : ''}
                    className={`
                      w-[90%] flex items-center gap-3 px-3 py-2 my-1 mx-auto rounded-md transition-all duration-200 text-sm
                      ${isActive ? 'bg-[#1f6feb] text-white font-medium' : 'text-[#c9d1d9] hover:bg-[#161b22] hover:text-white'}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="hidden md:flex justify-end p-2">
             <button 
                onClick={() => {
                    const newWidth = isCollapsed ? 256 : 70;
                    setWidth(newWidth);
                    setIsCollapsed(!isCollapsed);
                }}
                className="p-1 text-gray-500 hover:text-white transition-colors"
            >
                 {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
             </button>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#30363d]">
          {user ? (
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-2 rounded-md hover:bg-[#161b22] cursor-pointer transition-colors group relative`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-[#30363d] shrink-0 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white border border-[#30363d] shrink-0">
                        {user.name.charAt(0)}
                    </div>
                  )}
                  {!isCollapsed && (
                      <div className="overflow-hidden flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                      </div>
                  )}
                  {/* Logout Button */}
                  <div className={`
                    absolute ${isCollapsed ? 'left-full ml-2' : 'right-2'} 
                    bg-red-900/80 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity
                  `}>
                      <button onClick={onLogout} title="Logout"><LogOut size={14}/></button>
                  </div>
              </div>
          ) : (
              <button 
                onClick={onLogin}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full p-2 rounded-md bg-[#238636] text-white hover:bg-[#2ea043] transition-colors`}
              >
                  <LogIn size={18} />
                  {!isCollapsed && <span className="text-sm font-medium">Sign In</span>}
              </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;