import React, { useState, useEffect, useRef } from 'react';
import { DocPage, User, FileSystemNode } from '../types';
import { INITIAL_DOCS, MOCK_FILE_SYSTEM } from '../constants';
import { 
  Save, Sparkles, FileText, ChevronRight, Bold, Italic, 
  List, Code, Eye, Edit2, FunctionSquare, Folder, Server, Database,
  GitPullRequest, Lock, Search
} from 'lucide-react';
import { summarizeText, expandNotes } from '../services/geminiService';

declare global {
  interface Window {
    katex: any;
  }
}

interface WikiProps {
    user: User | null;
}

const FileTreeItem: React.FC<{ node: FileSystemNode; depth?: number }> = ({ node, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ paddingLeft: `${depth * 12}px` }}>
            <div 
                className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-600 rounded"
                onClick={() => node.children && setIsOpen(!isOpen)}
            >
                {node.type === 'folder' && (
                    <ChevronRight size={14} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                )}
                {node.source === 'nas' ? <Server size={14} className="text-purple-500"/> : 
                 node.source === 'api' ? <Database size={14} className="text-green-500"/> : 
                 <FileText size={14} className="text-blue-500"/>}
                <span className="truncate">{node.name}</span>
            </div>
            {isOpen && node.children && (
                <div>
                    {node.children.map(child => (
                        <FileTreeItem key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

const Wiki: React.FC<WikiProps> = ({ user }) => {
  const [docs, setDocs] = useState<DocPage[]>(INITIAL_DOCS);
  const [activeDocId, setActiveDocId] = useState<string>(INITIAL_DOCS[0].id);
  const [editorContent, setEditorContent] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [leftPanelWidth, setLeftPanelWidth] = useState(250); // Document List Width
  const [editorRatio, setEditorRatio] = useState(50); // Percentage for Editor/Preview split
  const [searchTerm, setSearchTerm] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeDoc = docs.find(d => d.id === activeDocId) || docs[0];

  const canEditDirectly = user && (user.role === 'admin' || user.role === 'editor');
  const isGuest = !user;

  // Filter docs based on search term
  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setEditorContent(activeDoc.content);
    if (window.innerWidth < 1024) setViewMode('preview');
  }, [activeDocId, activeDoc]);

  const handleSave = () => {
    if (canEditDirectly) {
        setDocs(prev => prev.map(d => 
          d.id === activeDocId ? { ...d, content: editorContent, lastEdited: new Date().toISOString() } : d
        ));
        alert("Changes saved successfully.");
    } else if (user) {
        alert("Change request submitted for review! (Fork/PR created)");
    } else {
        alert("Please login to suggest changes.");
    }
  };

  const handleAiExpand = async () => {
    if (!canEditDirectly && !user) return; // Prevent AI usage for guests to save cost? or allow demo
    setIsAiProcessing(true);
    const expanded = await expandNotes(editorContent);
    setEditorContent(prev => prev + "\n\n" + expanded);
    setIsAiProcessing(false);
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    setEditorContent(value.substring(0, selectionStart) + prefix + value.substring(selectionStart, selectionEnd) + suffix + value.substring(selectionEnd));
  };

  const renderMarkdown = (text: string) => {
    // Simplified renderer
    const lines = text.split('\n');
    return lines.map((line, i) => {
        if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
             const math = line.trim().slice(2, -2);
             try {
                const html = window.katex ? window.katex.renderToString(math, { throwOnError: false, displayMode: true }) : math;
                return <div key={i} className="my-4" dangerouslySetInnerHTML={{ __html: html }} />;
             } catch (e) { return <div key={i}>{line}</div>; }
        }
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-gray-900 mt-6 mb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold text-gray-800 mt-5 mb-3">{line.replace('## ', '')}</h2>;
        if (line.trim().startsWith('- ')) return <li key={i} className="ml-5 list-disc text-gray-700">{line.replace('- ', '')}</li>;
        return <p key={i} className="mb-2 leading-7 text-gray-700 min-h-[1.5em]">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      
      {/* Top Toolbar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/50 shrink-0">
         <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={18} className="text-blue-600"/> {activeDoc.title}
            </span>
            {!canEditDirectly && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock size={10}/> Read Only
                </span>
            )}
         </div>

         <div className="flex items-center gap-2">
            {/* Editor formatting tools (only if editable or proposing) */}
            {user && (
                <div className="hidden md:flex items-center gap-1 mr-4 border-r border-gray-300 pr-4">
                    <button onClick={() => insertFormat('**', '**')} className="p-1 hover:bg-gray-200 rounded"><Bold size={14}/></button>
                    <button onClick={() => insertFormat('*', '*')} className="p-1 hover:bg-gray-200 rounded"><Italic size={14}/></button>
                    <button onClick={() => insertFormat('```\n', '\n```')} className="p-1 hover:bg-gray-200 rounded"><Code size={14}/></button>
                </div>
            )}

            <button 
                onClick={handleAiExpand}
                disabled={isAiProcessing || !user}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 disabled:opacity-50"
            >
                <Sparkles size={14} /> {isAiProcessing ? 'Thinking...' : 'AI Assist'}
            </button>
            
            <button 
                onClick={handleSave}
                disabled={isGuest}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    canEditDirectly ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {canEditDirectly ? <Save size={14} /> : <GitPullRequest size={14} />} 
                <span className="hidden sm:inline">{canEditDirectly ? 'Save' : 'Propose Changes'}</span>
            </button>
         </div>
      </div>

      <div className="flex flex-1 h-full overflow-hidden">
        {/* Resizable Sidebar (Doc Tree & NAS) */}
        <div style={{ width: leftPanelWidth }} className="hidden md:flex flex-col border-r border-gray-200 bg-gray-50 shrink-0 relative">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                 <div className="relative group">
                    <Search className="absolute left-2.5 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search docs..." 
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-50 transition-all placeholder-gray-400 text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
            </div>

            <div className="p-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Internal Docs</div>
            <div className="flex-1 overflow-y-auto px-2">
                {filteredDocs.map(doc => (
                    <button
                        key={doc.id}
                        onClick={() => setActiveDocId(doc.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 flex items-center gap-2 ${
                            activeDocId === doc.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <FileText size={14}/> {doc.title}
                    </button>
                ))}
                {filteredDocs.length === 0 && (
                    <div className="px-3 py-2 text-xs text-gray-400 italic text-center">
                        No documents found
                    </div>
                )}
            </div>

            {/* NAS / File System Section */}
            <div className="border-t border-gray-200 mt-2">
                <div className="p-3 font-semibold text-xs text-gray-500 uppercase tracking-wider flex justify-between">
                    <span>External Sources</span>
                    <button title="Add Source" className="hover:text-blue-600"><Database size={12}/></button>
                </div>
                <div className="overflow-y-auto max-h-48 px-2 pb-2">
                    {MOCK_FILE_SYSTEM.map(node => <FileTreeItem key={node.id} node={node} />)}
                </div>
            </div>

            {/* Drag Handle */}
            <div 
                className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 z-10"
                onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startWidth = leftPanelWidth;
                    const onMove = (mv: MouseEvent) => setLeftPanelWidth(startWidth + (mv.clientX - startX));
                    const onUp = () => {
                        window.removeEventListener('mousemove', onMove);
                        window.removeEventListener('mouseup', onUp);
                    };
                    window.addEventListener('mousemove', onMove);
                    window.addEventListener('mouseup', onUp);
                }}
            />
        </div>

        {/* Editor Split Pane */}
        <div className="flex-1 flex flex-col min-w-0 relative">
             {/* Mobile View Toggle */}
            <div className="md:hidden flex border-b border-gray-200">
                <button onClick={() => setViewMode('edit')} className={`flex-1 py-2 text-sm ${viewMode === 'edit' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}>Edit</button>
                <button onClick={() => setViewMode('preview')} className={`flex-1 py-2 text-sm ${viewMode === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}>Preview</button>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Editor */}
                <div 
                    style={{ width: viewMode === 'split' ? `${editorRatio}%` : '100%' }} 
                    className={`${viewMode === 'preview' ? 'hidden' : 'flex'} flex-col h-full bg-white relative`}
                >
                    <textarea 
                        ref={textareaRef}
                        className="w-full h-full p-6 font-mono text-sm resize-none outline-none leading-relaxed text-gray-800"
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        placeholder="Start writing..."
                        readOnly={isGuest} // Guests cannot type
                    />
                    {isGuest && (
                        <div className="absolute inset-0 bg-gray-50/10 flex items-center justify-center pointer-events-none">
                            {/* Visual cue that it is read only, though text is selectable */}
                        </div>
                    )}
                </div>

                {/* Split Resizer */}
                {viewMode === 'split' && (
                    <div 
                        className="w-1 bg-gray-100 hover:bg-blue-500 cursor-col-resize z-10 transition-colors"
                        onMouseDown={(e) => {
                            const parentW = e.currentTarget.parentElement?.offsetWidth || 1000;
                            const startX = e.clientX;
                            const startRatio = editorRatio;
                            const onMove = (mv: MouseEvent) => {
                                const deltaPx = mv.clientX - startX;
                                const deltaPercent = (deltaPx / parentW) * 100;
                                setEditorRatio(Math.min(90, Math.max(10, startRatio + deltaPercent)));
                            };
                            const onUp = () => {
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                            };
                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                        }}
                    />
                )}

                {/* Preview */}
                <div 
                    style={{ width: viewMode === 'split' ? `${100 - editorRatio}%` : '100%' }}
                    className={`${viewMode === 'edit' ? 'hidden' : 'flex'} flex-col h-full bg-white overflow-y-auto border-l border-gray-100`}
                >
                     <div className="p-8 prose prose-slate max-w-none">
                        {renderMarkdown(editorContent)}
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Wiki;