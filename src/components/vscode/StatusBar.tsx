import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Terminal
} from 'lucide-react';
import { ReplayState, ReplayMetrics } from '../../types';

interface StatusBarProps {
  languageName: string;
  metrics: ReplayMetrics;
  replayState: ReplayState;
  onToggleTerminal: () => void;
  onOpenCommandPalette: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  languageName,
  metrics,
  replayState,
  onToggleTerminal,
  onOpenCommandPalette,
}) => {
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-2 text-[11px] select-none z-30 font-sans shrink-0">
      {/* Left side items */}
      <div className="flex items-center space-x-3">
        {/* Remote environment indicator */}
        <button 
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1 bg-[#1f8ad2] hover:bg-[#1177bb] px-1.5 h-6 -ml-2 transition-colors cursor-pointer"
          title="Open Command Palette (Ctrl+P / ⌘P)"
        >
          <span className="font-bold tracking-tighter">&gt;&lt;</span>
          <span className="font-medium text-[11px]">CodeReplay</span>
        </button>

        {/* Git Branch */}
        <div className="flex items-center gap-1 hover:bg-[#1f8ad2] px-1.5 h-6 cursor-pointer transition-colors" title="Git Branch: main">
          <GitBranch className="w-3 h-3" />
          <span>main*</span>
        </div>

        {/* Diagnostics Errors / Warnings */}
        <button 
          onClick={onToggleTerminal}
          className="flex items-center gap-2 hover:bg-[#1f8ad2] px-1.5 h-6 transition-colors cursor-pointer"
          title="Problems: 0 errors, 0 warnings"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">ⓧ</span>
            <span>0</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">⚠</span>
            <span>0</span>
          </div>
        </button>

        {/* Replay State Live Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#005a9e] px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">
          {replayState === 'playing' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
              <span>REPLAYING ({metrics.percent.toFixed(0)}%)</span>
            </>
          ) : replayState === 'paused' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              <span>PAUSED</span>
            </>
          ) : replayState === 'completed' ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span>REPLAY COMPLETE</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span>READY</span>
            </>
          )}
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-3">
        {/* Cursor Position */}
        <div className="hover:bg-[#1f8ad2] px-1.5 h-6 flex items-center transition-colors">
          <span>Ln {metrics.currentLine}, Col {metrics.currentColumn}</span>
        </div>

        {/* Indentation */}
        <div className="hidden md:flex hover:bg-[#1f8ad2] px-1.5 h-6 items-center transition-colors">
          <span>Spaces: 2</span>
        </div>

        {/* Character Count */}
        <div className="hidden sm:flex hover:bg-[#1f8ad2] px-1.5 h-6 items-center transition-colors font-mono text-[10px]">
          <span>{metrics.currentChars} / {metrics.totalChars} chars</span>
        </div>

        {/* Encoding */}
        <div className="hidden md:flex hover:bg-[#1f8ad2] px-1.5 h-6 items-center transition-colors">
          <span>UTF-8</span>
        </div>

        {/* Language Mode */}
        <div className="hover:bg-[#1f8ad2] px-1.5 h-6 flex items-center font-medium transition-colors">
          <span>{languageName}</span>
        </div>

        {/* Bell / Notifications */}
        <div className="hover:bg-[#1f8ad2] px-1.5 h-6 flex items-center transition-colors cursor-pointer" title="Notifications">
          <Bell className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
