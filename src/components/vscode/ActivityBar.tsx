import React from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Play, 
  Boxes, 
  Settings, 
  User,
  Globe,
  RefreshCw
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
    <div className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-1 select-none z-20 shrink-0">
      {/* Top action icons matching Screenshot */}
      <div className="flex flex-col items-center w-full">
        {/* Explorer icon */}
        <button
          onClick={() => handleViewClick('explorer')}
          title="Explorer (Ctrl+Shift+E)"
          className={`relative w-full h-12 flex items-center justify-center transition-colors cursor-pointer ${
            activeView === 'explorer' 
              ? 'text-white border-l-2 border-white bg-[#252526]/50' 
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

        {/* Search */}
        <button
          onClick={() => handleViewClick('search')}
          title="Search (Ctrl+Shift+F)"
          className={`w-full h-12 flex items-center justify-center transition-colors cursor-pointer ${
            activeView === 'search' 
              ? 'text-white border-l-2 border-white bg-[#252526]/50' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Source Control with sync badge matching screenshot */}
        <button
          onClick={() => handleViewClick('git')}
          title="Source Control (Ctrl+Shift+G)"
          className={`relative w-full h-12 flex items-center justify-center transition-colors cursor-pointer ${
            activeView === 'git' 
              ? 'text-white border-l-2 border-white bg-[#252526]/50' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <GitBranch className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#007acc] text-white rounded-full flex items-center justify-center text-[8px]">
            <RefreshCw className="w-2 h-2 animate-spin-slow" />
          </span>
        </button>

        {/* Run and Debug */}
        <button
          onClick={() => handleViewClick('replay_debug')}
          title="Run and Debug (Ctrl+Shift+D)"
          className={`w-full h-12 flex items-center justify-center transition-colors cursor-pointer ${
            activeView === 'replay_debug' 
              ? 'text-white border-l-2 border-white bg-[#252526]/50' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Play className="w-5 h-5" />
        </button>

        {/* Extensions */}
        <button
          onClick={() => handleViewClick('extensions')}
          title="Extensions (Ctrl+Shift+X)"
          className={`w-full h-12 flex items-center justify-center transition-colors cursor-pointer ${
            activeView === 'extensions' 
              ? 'text-white border-l-2 border-white bg-[#252526]/50' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Boxes className="w-5 h-5" />
        </button>

        {/* Browser Preview / Edge icon from screenshot */}
        <button
          onClick={() => handleViewClick('companion')}
          title="Browser Preview"
          className={`w-full h-12 flex items-center justify-center transition-colors cursor-pointer ${
            activeView === 'companion' 
              ? 'text-white border-l-2 border-white bg-[#252526]/50' 
              : 'text-[#858585] hover:text-[#e0e0e0]'
          }`}
        >
          <Globe className="w-5 h-5 text-blue-400" />
        </button>

        {/* Python Extension Icon from screenshot */}
        <button
          onClick={() => handleViewClick('explorer')}
          title="Python Environment"
          className="w-full h-12 flex items-center justify-center text-[#858585] hover:text-[#e0e0e0] transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center font-bold text-[11px] text-amber-400">
            🐍
          </div>
        </button>
      </div>

      {/* Bottom icons matching Screenshot: User Account & Settings */}
      <div className="flex flex-col items-center w-full">
        {/* User Account / Profile */}
        <button
          onClick={onOpenSettings}
          title="Accounts (adams)"
          className="w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors cursor-pointer"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Manage Settings Gear */}
        <button
          onClick={onOpenSettings}
          title="Manage Settings"
          className="w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
