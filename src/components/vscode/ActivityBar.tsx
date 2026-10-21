import React from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Play, 
  Boxes, 
  Settings, 
  FileCode,
  Laptop,
  HelpCircle
} from 'lucide-react';

export type SidebarView = 'explorer' | 'search' | 'git' | 'replay_debug' | 'extensions' | 'companion' | 'none';

interface ActivityBarProps {
  activeView: SidebarView;
  onSelectView: (view: SidebarView) => void;
  isSourcePanelVisible: boolean;
  onToggleSourcePanel: () => void;
  onOpenSettings: () => void;
  fileCount: number;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeView,
  onSelectView,
  isSourcePanelVisible,
  onToggleSourcePanel,
  onOpenSettings,
  fileCount,
}) => {
  const handleViewClick = (view: SidebarView) => {
    if (activeView === view) {
      onSelectView('none'); // Toggle off
    } else {
      onSelectView(view);
    }
  };

  return (
    <div className="w-12 bg-[#2c2c2c] border-r border-[#242424] flex flex-col justify-between items-center py-2 select-none z-20 shrink-0">
      {/* Top action icons */}
      <div className="flex flex-col items-center w-full space-y-1">
        {/* Explorer icon */}
        <button
          onClick={() => handleViewClick('explorer')}
          title="Explorer (Files)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors ${
            activeView === 'explorer' 
              ? 'text-white border-l-2 border-white bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Files className="w-5 h-5" />
          {fileCount > 0 && (
            <span className="absolute top-2 right-2 text-[9px] font-mono bg-[#007acc] text-white rounded-full px-1 min-w-[14px] text-center leading-3">
              {fileCount}
            </span>
          )}
        </button>

        {/* Source Code Panel toggle button */}
        <button
          onClick={onToggleSourcePanel}
          title={isSourcePanelVisible ? 'Hide Source Code Input' : 'Show Source Code Input'}
          className={`relative w-full h-11 flex items-center justify-center transition-colors ${
            isSourcePanelVisible 
              ? 'text-[#4fc1ff] border-l-2 border-[#4fc1ff] bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <FileCode className="w-5 h-5" />
        </button>

        {/* Search */}
        <button
          onClick={() => handleViewClick('search')}
          title="Search in Files"
          className={`w-full h-11 flex items-center justify-center transition-colors ${
            activeView === 'search' 
              ? 'text-white border-l-2 border-white bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Source Control */}
        <button
          onClick={() => handleViewClick('git')}
          title="Source Control (Git Simulation)"
          className={`w-full h-11 flex items-center justify-center transition-colors ${
            activeView === 'git' 
              ? 'text-white border-l-2 border-white bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <GitBranch className="w-5 h-5" />
        </button>

        {/* Run & Debug / Replay Controls */}
        <button
          onClick={() => handleViewClick('replay_debug')}
          title="Run & Replay Controller"
          className={`w-full h-11 flex items-center justify-center transition-colors ${
            activeView === 'replay_debug' 
              ? 'text-white border-l-2 border-white bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Play className="w-5 h-5" />
        </button>

        {/* Extensions */}
        <button
          onClick={() => handleViewClick('extensions')}
          title="Extensions & Themes"
          className={`w-full h-11 flex items-center justify-center transition-colors ${
            activeView === 'extensions' 
              ? 'text-white border-l-2 border-white bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Boxes className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col items-center w-full space-y-1">
        {/* Companion Desktop Integration */}
        <button
          onClick={() => handleViewClick('companion')}
          title="VS Code Desktop Companion Integration"
          className={`w-full h-11 flex items-center justify-center transition-colors ${
            activeView === 'companion' 
              ? 'text-[#007acc] border-l-2 border-[#007acc] bg-[#37373d]/40' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Laptop className="w-5 h-5" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Settings & Keybindings"
          className="w-full h-11 flex items-center justify-center text-[#858585] hover:text-[#e0e0e0] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
