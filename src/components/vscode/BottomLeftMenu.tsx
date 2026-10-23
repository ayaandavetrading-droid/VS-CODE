import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, 
  FileEdit, 
  Gauge, 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  FastForward, 
  Maximize2, 
  Minimize2, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  Settings,
  Activity,
  Terminal,
  Files
} from 'lucide-react';
import { 
  ReplayState, 
  ReplaySpeedPreset, 
  ReplayConfig, 
  PanelLayoutConfig 
} from '../../types';

interface BottomLeftMenuProps {
  replayState: ReplayState;
  replayConfig: ReplayConfig;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onReset: () => void;
  onStepLine: () => void;
  onStepChar: () => void;
  onFinish: () => void;
  onSpeedPresetChange: (preset: ReplaySpeedPreset) => void;
  onCustomMsChange?: (ms: number) => void;
  onToggleCadence: () => void;

  layoutConfig: PanelLayoutConfig;
  onTogglePanel: (panelKey: keyof PanelLayoutConfig) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onRestoreDefaultLayout: () => void;

  onOpenSourceCodeModal: () => void;
  onOpenFilenameLanguageModal: () => void;
  onOpenWorkspaceSettings?: () => void;
}

export const BottomLeftMenu: React.FC<BottomLeftMenuProps> = ({
  replayState,
  replayConfig,
  onStart,
  onPause,
  onResume,
  onRestart,
  onReset,
  onStepLine,
  onStepChar,
  onFinish,
  onSpeedPresetChange,
  onCustomMsChange,
  onToggleCadence,
  layoutConfig,
  onTogglePanel,
  isFocusMode,
  onToggleFocusMode,
  onRestoreDefaultLayout,
  onOpenSourceCodeModal,
  onOpenFilenameLanguageModal,
  onOpenWorkspaceSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSpeedSubmenu, setShowSpeedSubmenu] = useState(false);
  const [showControlsSubmenu, setShowControlsSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSpeedSubmenu(false);
        setShowControlsSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowSpeedSubmenu(false);
        setShowControlsSubmenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const isPlaying = replayState === 'playing';
  const isPaused = replayState === 'paused';

  const speedPresets: { id: ReplaySpeedPreset; label: string; desc: string }[] = [
    { id: 'very_slow', label: 'Very Slow', desc: '150ms/char (Default)' },
    { id: 'slow', label: 'Slow', desc: '70ms/char' },
    { id: 'normal', label: 'Normal', desc: '30ms/char' },
    { id: 'fast', label: 'Fast', desc: '10ms/char' },
    { id: 'turbo', label: 'Turbo', desc: 'Instant replay' },
  ];

  return (
    <div ref={menuRef} className="relative inline-block select-none text-xs">
      {/* Authentic VS Code Remote Window style trigger button in bottom-left status bar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowSpeedSubmenu(false);
          setShowControlsSubmenu(false);
        }}
        title="DeskPilot AI: Replay & Workspace Settings Menu"
        className={`flex items-center gap-1.5 px-2.5 h-6 -ml-2 transition-colors text-xs font-medium cursor-pointer ${
          isFocusMode
            ? 'bg-[#1b442a] text-[#89d185] hover:bg-[#235836] border-r border-[#3b8754]/60'
            : isOpen
            ? 'bg-[#005a9e] text-white'
            : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'
        }`}
      >
        <span className="font-bold tracking-tighter text-sm leading-none">&gt;&lt;</span>
        <span className="font-semibold tracking-tight">DeskPilot</span>
        
        {/* Active Focus Mode Indicator Badge */}
        {isFocusMode ? (
          <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-mono ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>[Focus]</span>
          </span>
        ) : (
          <ChevronUp className="w-3 h-3 opacity-75" />
        )}
      </button>

      {/* Upward Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute bottom-full left-0 mb-1.5 w-72 bg-[#252526] border border-[#454545] rounded-md shadow-2xl py-1 z-50 text-[#cccccc] font-sans text-xs animate-in fade-in zoom-in-95 duration-100"
          style={{ minWidth: '270px' }}
        >
          {/* Header */}
          <div className="px-3 py-1.5 border-b border-[#333333] flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#858585] uppercase">
            <span>DeskPilot AI Replay Menu</span>
            {isFocusMode && (
              <span className="text-emerald-400 font-mono normal-case text-[10px] bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/60">
                Focus Mode Active
              </span>
            )}
          </div>

          {/* 1. Configure Source Code */}
          <button
            onClick={() => {
              onOpenSourceCodeModal();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-[#007acc] group-hover:text-white" />
              <span className="font-medium text-white">Configure Source Code</span>
            </div>
            <span className="text-[#858585] text-[10px]">Buffer &amp; Paste</span>
          </button>

          {/* 2. Filename and Language */}
          <button
            onClick={() => {
              onOpenFilenameLanguageModal();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <FileEdit className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
              <span>Filename and Language</span>
            </div>
            <span className="text-[#858585] text-[10px]">Syntax mode</span>
          </button>

          <div className="border-t border-[#333333] my-1" />

          {/* 3. Replay Speed */}
          <div>
            <button
              onClick={() => {
                setShowSpeedSubmenu(!showSpeedSubmenu);
                setShowControlsSubmenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                <span>Replay Speed</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#858585]">
                <span className="capitalize font-mono text-amber-300">
                  {replayConfig.preset.replace('_', ' ')}
                </span>
                {showSpeedSubmenu ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </div>
            </button>

            {/* Replay Speed Expanded Submenu */}
            {showSpeedSubmenu && (
              <div className="bg-[#1e1e1e] border-y border-[#333333] py-1 px-1 space-y-0.5">
                {speedPresets.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      onSpeedPresetChange(sp.id);
                    }}
                    className={`w-full text-left px-3 py-1 rounded flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      replayConfig.preset === sp.id
                        ? 'bg-[#094771] text-white font-medium'
                        : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
                    }`}
                  >
                    <span>{sp.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#858585] font-mono">{sp.desc}</span>
                      {replayConfig.preset === sp.id && <Check className="w-3 h-3 text-[#4fc1ff]" />}
                    </div>
                  </button>
                ))}

                {/* Natural Human Cadence Toggle */}
                <button
                  onClick={onToggleCadence}
                  className="w-full text-left px-3 py-1 rounded flex items-center justify-between text-xs hover:bg-[#2a2d2e] transition-colors cursor-pointer text-[#cccccc]"
                >
                  <span>Natural Human Cadence</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={replayConfig.naturalCadence ? 'text-emerald-400 font-mono' : 'text-[#777777]'}>
                      {replayConfig.naturalCadence ? 'ON (±35%)' : 'OFF'}
                    </span>
                    {replayConfig.naturalCadence && <Check className="w-3 h-3 text-emerald-400" />}
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. Playback Controls */}
          <div>
            <button
              onClick={() => {
                setShowControlsSubmenu(!showControlsSubmenu);
                setShowSpeedSubmenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                <span>Playback Controls</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#858585]">
                <span className="capitalize font-mono">
                  {replayState}
                </span>
                {showControlsSubmenu ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </div>
            </button>

            {/* Playback Controls Submenu */}
            {showControlsSubmenu && (
              <div className="bg-[#1e1e1e] border-y border-[#333333] p-2 space-y-2">
                {/* Main Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {isPlaying ? (
                    <button
                      onClick={onPause}
                      className="flex-1 py-1 px-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium flex items-center justify-center gap-1 text-xs cursor-pointer shadow-xs"
                      title="Pause Replay (F6)"
                    >
                      <Pause className="w-3 h-3 fill-current" />
                      <span>Pause</span>
                    </button>
                  ) : isPaused ? (
                    <button
                      onClick={onResume}
                      className="flex-1 py-1 px-2 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium flex items-center justify-center gap-1 text-xs cursor-pointer shadow-xs"
                      title="Resume Replay (F5)"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={onStart}
                      className="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center justify-center gap-1 text-xs cursor-pointer shadow-xs"
                      title="Start Replay (F5)"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </button>
                  )}

                  <button
                    onClick={onStepLine}
                    className="py-1 px-2 rounded bg-[#2a2d2e] hover:bg-[#373a3c] text-white border border-[#3c3c3c] flex items-center gap-1 text-xs cursor-pointer"
                    title="Step 1 Line"
                  >
                    <StepForward className="w-3 h-3 text-[#4fc1ff]" />
                    <span>Line</span>
                  </button>

                  <button
                    onClick={onFinish}
                    className="py-1 px-2 rounded bg-[#2a2d2e] hover:bg-[#373a3c] text-white border border-[#3c3c3c] flex items-center gap-1 text-xs cursor-pointer"
                    title="Fast-Forward to Finish (F8)"
                  >
                    <FastForward className="w-3 h-3 text-amber-400" />
                    <span>Finish</span>
                  </button>

                  <button
                    onClick={onRestart}
                    className="p-1 rounded bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] border border-[#3c3c3c] cursor-pointer"
                    title="Restart from Beginning (Ctrl+R)"
                  >
                    <RotateCcw className="w-3 h-3 text-purple-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#858585] pt-1">
                  <span>Hotkeys: F5 (Start) · F6 (Pause) · F8 (Finish)</span>
                  <button
                    onClick={onReset}
                    className="text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#333333] my-1" />

          {/* 5. Show/Hide Replay Toolbar */}
          <button
            onClick={() => onTogglePanel('showPlaybackBar')}
            className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {layoutConfig.showPlaybackBar ? (
                <Eye className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#858585]" />
              )}
              <span>Show/Hide Replay Toolbar</span>
            </div>
            <div className="flex items-center gap-1.5">
              {layoutConfig.showPlaybackBar && <Check className="w-3 h-3 text-[#007acc]" />}
              <span className="text-[#858585] text-[10px] font-mono">
                {layoutConfig.showPlaybackBar ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </button>

          {/* 6. Show/Hide Progress Information */}
          <button
            onClick={() => onTogglePanel('showProgressInfo')}
            className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Show/Hide Progress Information</span>
            </div>
            <div className="flex items-center gap-1.5">
              {layoutConfig.showProgressInfo && <Check className="w-3 h-3 text-emerald-400" />}
              <span className="text-[#858585] text-[10px] font-mono">
                {layoutConfig.showProgressInfo ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </button>

          <div className="border-t border-[#333333] my-1" />

          {/* 7. Focus Editor Mode */}
          <button
            onClick={() => {
              onToggleFocusMode();
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
              isFocusMode
                ? 'bg-[#1e3b26] text-[#89d185] hover:bg-[#25492f]'
                : 'hover:bg-[#094771] hover:text-white text-[#cccccc]'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              {isFocusMode ? (
                <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-[#4fc1ff]" />
              )}
              <span>{isFocusMode ? 'Exit Focus Editor Mode' : 'Focus Editor Mode'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {isFocusMode && <span className="text-[9px] text-emerald-400 font-mono">[Active]</span>}
              <span className="text-[#858585] text-[10px] font-mono">F11</span>
            </div>
          </button>

          {/* 8. Restore Default Layout */}
          <button
            onClick={() => {
              onRestoreDefaultLayout();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[#cccccc]"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#858585]" />
              <span>Restore Default Layout</span>
            </div>
            <span className="text-[10px] text-[#858585]">Reset Chrome</span>
          </button>

          {/* Optional Workspace Settings link */}
          {onOpenWorkspaceSettings && (
            <>
              <div className="border-t border-[#333333] my-1" />
              <button
                onClick={() => {
                  onOpenWorkspaceSettings();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[#858585] hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-[#007acc]" />
                  <span>Workspace Settings...</span>
                </div>
                <span className="text-[10px] text-[#666666]">Font &amp; Minimap</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
