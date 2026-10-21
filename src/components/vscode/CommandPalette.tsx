import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  StepForward, 
  Download, 
  Eye, 
  EyeOff, 
  Sparkles, 
  File,
  Maximize2,
  Minimize2,
  Gauge
} from 'lucide-react';
import { WorkspaceFile, ReplaySpeedPreset } from '../../types';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  files: WorkspaceFile[];
  onSelectFile: (fileId: string) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onReset: () => void;
  onStepLine: () => void;
  onFinish: () => void;
  onToggleSourcePanel: () => void;
  isSourcePanelVisible: boolean;
  onExportZip: () => void;
  onQuickLoadSample: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onSetSpeedPreset: (preset: ReplaySpeedPreset) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  files,
  onSelectFile,
  onStart,
  onPause,
  onResume,
  onRestart,
  onReset,
  onStepLine,
  onFinish,
  onToggleSourcePanel,
  isSourcePanelVisible,
  onExportZip,
  onQuickLoadSample,
  isFocusMode,
  onToggleFocusMode,
  onSetSpeedPreset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const baseCommands: CommandItem[] = [
    {
      id: 'toggle-focus',
      label: isFocusMode ? 'View: Restore Layout (Exit Focus Mode)' : 'View: Focus Editor (Clean Distraction-Free Mode)',
      category: 'View',
      icon: isFocusMode ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-[#4fc1ff]" />,
      shortcut: 'F11',
      action: onToggleFocusMode,
    },
    {
      id: 'start-replay',
      label: 'Replay: Start from Beginning',
      category: 'Playback',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      shortcut: 'F5',
      action: onStart,
    },
    {
      id: 'pause-replay',
      label: 'Replay: Pause Immediately',
      category: 'Playback',
      icon: <Pause className="w-4 h-4 text-amber-400" />,
      shortcut: 'F6',
      action: onPause,
    },
    {
      id: 'resume-replay',
      label: 'Replay: Resume',
      category: 'Playback',
      icon: <Play className="w-4 h-4 text-blue-400" />,
      action: onResume,
    },
    {
      id: 'step-line',
      label: 'Replay: Step Line',
      category: 'Playback',
      icon: <StepForward className="w-4 h-4 text-cyan-400" />,
      action: onStepLine,
    },
    {
      id: 'finish-replay',
      label: 'Replay: Fast-Forward to Finish',
      category: 'Playback',
      icon: <FastForward className="w-4 h-4 text-amber-300" />,
      shortcut: 'F8',
      action: onFinish,
    },
    {
      id: 'restart-replay',
      label: 'Replay: Restart',
      category: 'Playback',
      icon: <RotateCcw className="w-4 h-4 text-purple-400" />,
      shortcut: 'Ctrl+R',
      action: onRestart,
    },
    {
      id: 'reset-editor',
      label: 'Replay: Reset Editor (Clear output)',
      category: 'Playback',
      icon: <RotateCcw className="w-4 h-4 text-gray-400" />,
      action: onReset,
    },
    {
      id: 'speed-very-slow',
      label: 'Speed: Set to Very Slow (150ms/char) - Ultra-Slow Default',
      category: 'Speed',
      icon: <Gauge className="w-4 h-4 text-amber-400" />,
      action: () => onSetSpeedPreset('very_slow'),
    },
    {
      id: 'speed-slow',
      label: 'Speed: Set to Slow (70ms/char)',
      category: 'Speed',
      icon: <Gauge className="w-4 h-4 text-yellow-400" />,
      action: () => onSetSpeedPreset('slow'),
    },
    {
      id: 'speed-normal',
      label: 'Speed: Set to Normal (30ms/char)',
      category: 'Speed',
      icon: <Gauge className="w-4 h-4 text-blue-400" />,
      action: () => onSetSpeedPreset('normal'),
    },
    {
      id: 'speed-fast',
      label: 'Speed: Set to Fast (10ms/char)',
      category: 'Speed',
      icon: <Gauge className="w-4 h-4 text-emerald-400" />,
      action: () => onSetSpeedPreset('fast'),
    },
    {
      id: 'toggle-source',
      label: isSourcePanelVisible ? 'View: Hide Source Code Panel' : 'View: Show Source Code Panel',
      category: 'View',
      icon: isSourcePanelVisible ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-blue-400" />,
      shortcut: 'Ctrl+S',
      action: onToggleSourcePanel,
    },
    {
      id: 'load-sample',
      label: 'Sample: Load Sample Snippet...',
      category: 'Source',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: onQuickLoadSample,
    },
    {
      id: 'export-zip',
      label: 'Project: Export Workspace as ZIP',
      category: 'Project',
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      shortcut: 'Ctrl+E',
      action: onExportZip,
    },
  ];

  const fileCommands: CommandItem[] = files.map((file) => ({
    id: `file-${file.id}`,
    label: `Go to File: ${file.name}`,
    category: 'Files',
    icon: <File className="w-4 h-4 text-blue-400" />,
    action: () => onSelectFile(file.id),
  }));

  const allItems = [...fileCommands, ...baseCommands];

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-14 z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#252526] border border-[#454545] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden text-[#cccccc] text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-2 border-b border-[#3c3c3c] bg-[#1e1e1e] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#858585] ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or file name..."
            className="w-full bg-transparent text-white outline-none border-none text-xs"
          />
          <kbd className="px-1.5 py-0.5 bg-[#2b2b2b] text-[10px] text-[#858585] rounded border border-[#3a3a3a]">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto py-1">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-6 text-center text-[#777777] italic">
              No matching commands or files found
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#094771] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#858585] uppercase tracking-wider">{item.category}</span>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 bg-[#1e1e1e] text-[10px] text-[#999999] rounded border border-[#333333]">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
