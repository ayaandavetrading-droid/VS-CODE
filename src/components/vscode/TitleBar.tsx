import React, { useState } from 'react';
import { 
  Code2, 
  Search, 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  Minus, 
  Square, 
  X,
  FileCode,
  Sparkles,
  Maximize2,
  Minimize2,
  Check,
  ArrowLeft,
  ArrowRight,
  PanelLeft,
  PanelBottom,
  PanelRight,
  MessageSquareCode
} from 'lucide-react';
import { WorkspaceProject, WorkspaceFile, ReplayState, PanelLayoutConfig } from '../../types';

interface TitleBarProps {
  project: WorkspaceProject;
  activeFile?: WorkspaceFile;
  replayState: ReplayState;
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
  onRestart: () => void;
  onOpenCommandPalette: () => void;
  onToggleSourcePanel: () => void;
  isSourcePanelVisible: boolean;
  onExportZip: () => void;
  onQuickLoadSample: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  layoutConfig: PanelLayoutConfig;
  onTogglePanel: (panel: keyof PanelLayoutConfig) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  project,
  activeFile,
  replayState,
  onStart,
  onPause,
  onFinish,
  onRestart,
  onOpenCommandPalette,
  onToggleSourcePanel,
  isSourcePanelVisible,
  onExportZip,
  onQuickLoadSample,
  isFocusMode,
  onToggleFocusMode,
  layoutConfig,
  onTogglePanel,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

  return (
    <div className="h-9 bg-[#1f1f1f] text-[#cccccc] text-xs flex items-center justify-between select-none border-b border-[#2b2b2b] px-2 z-30">
      {/* Left: App Logo & Menu Bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-blue-400 font-semibold px-1 tracking-tight">
          <Code2 className="w-4 h-4 text-[#007acc]" />
          <span className="hidden sm:inline text-white font-medium">CodeReplay</span>
          <span className="text-[#858585] hidden md:inline">Studio</span>
        </div>

        {/* Standard VS Code Menu Bar */}
        <div className="hidden lg:flex items-center ml-2 space-x-0.5">
          {menus.map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className={`px-2 py-1 rounded hover:bg-[#333333] transition-colors ${
                  activeMenu === menu ? 'bg-[#333333] text-white' : 'text-[#cccccc]'
                }`}
              >
                {menu}
              </button>

              {activeMenu === menu && (
                <div 
                  className="absolute left-0 top-full mt-1 w-64 bg-[#252526] border border-[#454545] rounded shadow-2xl py-1 z-50 text-[#cccccc]"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {menu === 'View' && (
                    <>
                      <button 
                        onClick={() => { onToggleFocusMode(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between font-medium text-blue-300"
                      >
                        <div className="flex items-center gap-2">
                          {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                          <span>{isFocusMode ? 'Restore Full Layout' : 'Focus Editor (Clean Mode)'}</span>
                        </div>
                        <span className="text-[#858585] text-[10px]">F11</span>
                      </button>

                      <div className="border-t border-[#3c3c3c] my-1" />

                      <button 
                        onClick={() => { onTogglePanel('showSourcePanel'); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {layoutConfig.showSourcePanel ? <Check className="w-3.5 h-3.5 text-[#007acc]" /> : <span className="w-3.5" />}
                          <span>Source Code Panel</span>
                        </div>
                        <span className="text-[#858585] text-[10px]">Ctrl+S</span>
                      </button>

                      <button 
                        onClick={() => { onTogglePanel('showSidebar'); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {layoutConfig.showSidebar ? <Check className="w-3.5 h-3.5 text-[#007acc]" /> : <span className="w-3.5" />}
                          <span>File Explorer Sidebar</span>
                        </div>
                        <span className="text-[#858585] text-[10px]">Ctrl+B</span>
                      </button>

                      <button 
                        onClick={() => { onTogglePanel('showActivityBar'); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {layoutConfig.showActivityBar ? <Check className="w-3.5 h-3.5 text-[#007acc]" /> : <span className="w-3.5" />}
                          <span>Activity Bar</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => { onTogglePanel('showPlaybackBar'); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {layoutConfig.showPlaybackBar ? <Check className="w-3.5 h-3.5 text-[#007acc]" /> : <span className="w-3.5" />}
                          <span>Replay Controls Bar</span>
                        </div>
                        <span className="text-[#858585] text-[10px]">Ctrl+Shift+B</span>
                      </button>

                      <button 
                        onClick={() => { onTogglePanel('showBottomPanel'); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {layoutConfig.showBottomPanel ? <Check className="w-3.5 h-3.5 text-[#007acc]" /> : <span className="w-3.5" />}
                          <span>Bottom Panel (Terminal/Output)</span>
                        </div>
                        <span className="text-[#858585] text-[10px]">Ctrl+`</span>
                      </button>

                      <button 
                        onClick={() => { onTogglePanel('showStatusBar'); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {layoutConfig.showStatusBar ? <Check className="w-3.5 h-3.5 text-[#007acc]" /> : <span className="w-3.5" />}
                          <span>Status Bar</span>
                        </div>
                      </button>
                    </>
                  )}

                  {menu === 'File' && (
                    <>
                      <button 
                        onClick={() => { onToggleSourcePanel(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>{isSourcePanelVisible ? 'Hide Source Panel' : 'Show Source Panel'}</span>
                        <span className="text-[#858585] text-[10px]">Ctrl+S</span>
                      </button>
                      <button 
                        onClick={() => { onQuickLoadSample(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>Load Sample Code...</span>
                        <span className="text-[#858585] text-[10px]">Ctrl+L</span>
                      </button>
                      <button 
                        onClick={() => { onExportZip(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>Export Project as ZIP</span>
                        <span className="text-[#858585] text-[10px]">Ctrl+E</span>
                      </button>
                    </>
                  )}

                  {menu === 'Run' && (
                    <>
                      <button 
                        onClick={() => { onStart(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>Start Replay (Very Slow)</span>
                        <span className="text-[#858585] text-[10px]">F5</span>
                      </button>
                      <button 
                        onClick={() => { onPause(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>Pause Replay Immediately</span>
                        <span className="text-[#858585] text-[10px]">F6</span>
                      </button>
                      <button 
                        onClick={() => { onFinish(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>Fast-Forward to Finish</span>
                        <span className="text-[#858585] text-[10px]">F8</span>
                      </button>
                      <button 
                        onClick={() => { onRestart(); setActiveMenu(null); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between"
                      >
                        <span>Restart Replay</span>
                        <span className="text-[#858585] text-[10px]">Ctrl+R</span>
                      </button>
                    </>
                  )}

                  {menu !== 'File' && menu !== 'Run' && menu !== 'View' && (
                    <div className="px-3 py-1.5 text-[#858585] italic text-[11px]">
                      {menu} options active. Use Command Palette (Ctrl+P) for more.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Search & Navigation arrows matching Screenshot */}
      <div className="flex items-center gap-1.5 flex-1 max-w-lg mx-auto">
        <button 
          className="p-1 hover:bg-[#333333] text-[#858585] hover:text-[#cccccc] rounded cursor-pointer transition-colors"
          title="Go Back (Alt+LeftArrow)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button 
          className="p-1 hover:bg-[#333333] text-[#858585] hover:text-[#cccccc] rounded cursor-pointer transition-colors"
          title="Go Forward (Alt+RightArrow)"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="flex-1 h-6 bg-[#2a2d2e] hover:bg-[#323638] text-[#9da5b4] border border-[#3c3c3c] rounded px-3 flex items-center justify-between transition-colors shadow-inner text-xs cursor-pointer"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Search className="w-3.5 h-3.5 text-[#858585]" />
            <span className="truncate">Search (DeskPilot Workspace)</span>
          </div>
          <span className="text-[10px] text-[#717171] font-mono bg-[#1e1e1e] px-1.5 py-0.2 rounded border border-[#333333] hidden sm:inline">
            Ctrl+P
          </span>
        </button>
      </div>

      {/* Right: Copilot, Layout controls & Native Window buttons matching Screenshot */}
      <div className="flex items-center gap-1">
        <button
          onClick={onOpenCommandPalette}
          title="DeskPilot Copilot Chat"
          className="p-1.5 hover:bg-[#333333] text-[#858585] hover:text-white rounded transition-colors cursor-pointer"
        >
          <MessageSquareCode className="w-3.5 h-3.5 text-blue-400" />
        </button>

        <div className="flex items-center gap-0.5 border-l border-[#333333] pl-1 ml-1 text-[#858585]">
          <button
            onClick={() => onTogglePanel('showSidebar')}
            title="Toggle Primary Side Bar (Ctrl+B)"
            className={`p-1 hover:bg-[#333333] rounded transition-colors cursor-pointer ${
              layoutConfig.showSidebar ? 'text-white' : 'text-[#666666]'
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onTogglePanel('showBottomPanel')}
            title="Toggle Panel (Ctrl+`)"
            className={`p-1 hover:bg-[#333333] rounded transition-colors cursor-pointer ${
              layoutConfig.showBottomPanel ? 'text-white' : 'text-[#666666]'
            }`}
          >
            <PanelBottom className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onTogglePanel('showSourcePanel')}
            title="Toggle Secondary Side Bar"
            className={`p-1 hover:bg-[#333333] rounded transition-colors cursor-pointer ${
              layoutConfig.showSourcePanel ? 'text-white' : 'text-[#666666]'
            }`}
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Windows Standard Window Controls */}
        <div className="flex items-center ml-2 border-l border-[#333333] -mr-2 text-[#cccccc]">
          <button 
            className="w-10 h-9 flex items-center justify-center hover:bg-[#333333] transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            className="w-10 h-9 flex items-center justify-center hover:bg-[#333333] transition-colors"
            title="Maximize"
          >
            <Square className="w-3 h-3" />
          </button>
          <button 
            className="w-10 h-9 flex items-center justify-center hover:bg-[#e81123] hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
