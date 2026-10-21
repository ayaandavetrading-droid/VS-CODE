import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FilePlus, 
  Download, 
  Trash2, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw,
  Plus,
  Layers,
  Sparkles
} from 'lucide-react';
import { WorkspaceProject, WorkspaceFile } from '../../types';

interface FileExplorerProps {
  projects: WorkspaceProject[];
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDownloadFile: (file: WorkspaceFile) => void;
  onExportProjectZip: () => void;
  onQuickLoadSample: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onDownloadFile,
  onExportProjectZip,
  onQuickLoadSample,
}) => {
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreatingProject(false);
    }
  };

  const getFileIconColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py': return 'text-yellow-400';
      case 'ts': case 'tsx': return 'text-blue-400';
      case 'js': case 'jsx': return 'text-yellow-300';
      case 'html': return 'text-orange-500';
      case 'css': return 'text-blue-500';
      case 'sql': return 'text-emerald-400';
      case 'java': return 'text-red-400';
      case 'cs': return 'text-purple-400';
      case 'rs': return 'text-amber-600';
      case 'go': return 'text-cyan-400';
      case 'json': return 'text-yellow-200';
      case 'md': return 'text-slate-300';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-64 bg-[#252526] text-[#cccccc] flex flex-col h-full border-r border-[#1e1e1e] select-none text-xs shrink-0">
      {/* Sidebar Section Title */}
      <div className="h-9 px-3 flex items-center justify-between font-semibold tracking-wider text-[11px] text-[#bbbbbb] border-b border-[#2d2d2d]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#007acc]" />
          <span>EXPLORER</span>
        </div>

        {/* Quick project switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreatingProject(true)}
            title="Create New Virtual Project"
            className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExportProjectZip}
            title="Export Entire Project as ZIP"
            className="p-1 hover:bg-[#333333] rounded text-[#858585] hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project selector dropdown */}
      <div className="px-3 py-1.5 bg-[#1f1f1f] border-b border-[#2d2d2d] flex items-center justify-between">
        <label className="text-[10px] text-[#787878] font-medium uppercase tracking-wider">Project</label>
        <select
          value={currentProjectId}
          onChange={(e) => onSelectProject(e.target.value)}
          className="bg-[#2a2a2a] text-[#cccccc] text-xs px-2 py-0.5 rounded border border-[#3c3c3c] outline-none max-w-[150px] truncate"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.files.length} files)
            </option>
          ))}
        </select>
      </div>

      {/* New Project Input if active */}
      {isCreatingProject && (
        <form onSubmit={handleCreateProjectSubmit} className="p-2 bg-[#2a2d2e] border-b border-[#3c3c3c]">
          <div className="text-[10px] text-[#9da5b4] mb-1 font-medium">New Virtual Project Name:</div>
          <div className="flex gap-1">
            <input
              type="text"
              autoFocus
              placeholder="e.g. backend-microservice"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 bg-[#1e1e1e] border border-[#007acc] text-xs px-2 py-1 rounded text-white outline-none"
            />
            <button
              type="submit"
              className="bg-[#007acc] text-white px-2 py-1 rounded text-xs hover:bg-[#0062a3]"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingProject(false)}
              className="bg-[#3a3d41] text-[#cccccc] px-1.5 py-1 rounded text-xs hover:bg-[#45494e]"
            >
              ✕
            </button>
          </div>
        </form>
      )}

      {/* File Tree Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Workspace root folder */}
        <div className="group flex items-center justify-between px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc] font-semibold text-[11px]">
          <div 
            className="flex items-center gap-1 flex-1 truncate"
            onClick={() => setIsFolderOpen(!isFolderOpen)}
          >
            {isFolderOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#858585]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#858585]" />
            )}
            <span className="truncate uppercase tracking-wide">{currentProject?.name}</span>
          </div>

          <div className="hidden group-hover:flex items-center space-x-1">
            <button
              onClick={(e) => { e.stopPropagation(); setIsCreatingFile(true); }}
              title="New File"
              className="p-1 hover:bg-[#37373d] rounded text-[#cccccc]"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onQuickLoadSample(); }}
              title="Load Sample"
              className="p-1 hover:bg-[#37373d] rounded text-amber-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* New File Inline Form */}
        {isCreatingFile && (
          <form onSubmit={handleCreateFileSubmit} className="px-5 py-1 bg-[#1f1f1f]">
            <input
              type="text"
              autoFocus
              placeholder="filename.ext (e.g. index.ts)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => {
                if (!newFileName.trim()) setIsCreatingFile(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsCreatingFile(false);
              }}
              className="w-full bg-[#1e1e1e] border border-[#007acc] text-xs px-2 py-0.5 rounded text-white outline-none"
            />
          </form>
        )}

        {/* Files List */}
        {isFolderOpen && (
          <div className="flex flex-col py-0.5">
            {currentProject?.files.length === 0 ? (
              <div className="px-6 py-4 text-[#777777] italic text-xs flex flex-col gap-2">
                <span>No files in this project.</span>
                <button
                  onClick={() => setIsCreatingFile(true)}
                  className="text-left text-[#007acc] hover:underline"
                >
                  + Create a file
                </button>
              </div>
            ) : (
              currentProject?.files.map((file) => {
                const isActive = file.id === activeFileId;
                const hasReplayProgress = file.currentOffset > 0;
                const isCompleted = file.status === 'completed';

                return (
                  <div
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    className={`group flex items-center justify-between px-5 py-1 cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-[#37373d] text-white font-medium' 
                        : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${getFileIconColor(file.name)}`} />
                      <span className="truncate text-xs">{file.name}</span>
                    </div>

                    {/* Status & Action icons */}
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Replay completed" />
                      ) : hasReplayProgress ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" title="In progress" />
                      ) : null}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadFile(file);
                        }}
                        title={`Download ${file.name}`}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-white text-[#858585] transition-opacity"
                      >
                        <Download className="w-3 h-3" />
                      </button>

                      {currentProject.files.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete ${file.name}?`)) {
                              onDeleteFile(file.id);
                            }
                          }}
                          title={`Delete ${file.name}`}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 text-[#858585] transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Explorer bottom hints */}
      <div className="p-2.5 bg-[#1f1f1f] border-t border-[#2d2d2d] text-[11px] text-[#7f848e] flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span>Active Files:</span>
          <span className="font-mono text-white">{currentProject?.files.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Storage:</span>
          <span className="text-[#89d185]">Virtual Memory (Local)</span>
        </div>
      </div>
    </div>
  );
};
