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
  Check
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

      {/* Center: Command Palette / Title search bar */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-6 bg-[#2a2d2e] hover:bg-[#323638] text-[#9da5b4] border border-[#3c3c3c] rounded px-3 flex items-center justify-between transition-colors shadow-inner text-xs"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Search className="w-3.5 h-3.5 text-[#858585]" />
            <span className="truncate">
              {project.name} &mdash; {activeFile ? activeFile.name : 'No file'}
            </span>
          </div>
          <span className="text-[10px] text-[#717171] font-mono bg-[#1e1e1e] px-1.5 py-0.5 rounded border border-[#333333] hidden sm:inline">
            Ctrl+P / ⌘P
          </span>
        </button>
      </div>

      {/* Right: Quick action buttons & Decorative window controls */}
      <div className="flex items-center gap-1.5">
        {/* Dedicated Focus Editor button in Title Bar */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? 'Restore Full Layout' : 'Focus Editor (Distraction-free mode)'}
          className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors text-xs font-medium ${
            isFocusMode
              ? 'bg-[#2d4a22] text-[#89d185] hover:bg-[#355628] border border-[#4ec9b0]/50'
              : 'bg-[#2a2d2e] hover:bg-[#383838] text-[#cccccc] hover:text-white'
          }`}
        >
          {isFocusMode ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Restore Layout</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#4fc1ff]" />
              <span className="hidden sm:inline">Focus Editor</span>
            </>
          )}
        </button>

        <button
          onClick={onToggleSourcePanel}
          title={isSourcePanelVisible ? 'Hide Source Code Panel' : 'Show Source Code Panel'}
          className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors text-xs ${
            isSourcePanelVisible 
              ? 'bg-[#0e639c] text-white hover:bg-[#1177bb]' 
              : 'bg-[#333333] text-[#cccccc] hover:bg-[#444444]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-medium">Source</span>
        </button>

        <button
          onClick={onQuickLoadSample}
          title="Quick Load Code Sample"
          className="px-2 py-1 rounded bg-[#2b2b2b] hover:bg-[#383838] text-[#cccccc] flex items-center gap-1.5 transition-colors text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Sample</span>
        </button>

        {/* Decorative VS Code Window Controls */}
        <div className="flex items-center space-x-1 pl-2 border-l border-[#333333]">
          <div className="w-3 h-3 rounded-full bg-[#f1fa8c]/20 hover:bg-yellow-500/80 cursor-pointer flex items-center justify-center transition-colors">
            <Minus className="w-2 h-2 text-transparent hover:text-black" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#50fa7b]/20 hover:bg-green-500/80 cursor-pointer flex items-center justify-center transition-colors">
            <Square className="w-2 h-2 text-transparent hover:text-black" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#ff5555]/20 hover:bg-red-500/80 cursor-pointer flex items-center justify-center transition-colors">
            <X className="w-2 h-2 text-transparent hover:text-black" />
          </div>
        </div>
      </div>
    </div>
  );
};
