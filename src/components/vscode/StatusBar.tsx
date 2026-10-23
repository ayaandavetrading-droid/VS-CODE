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
  Terminal,
  Activity
} from 'lucide-react';
import { ReplayState, ReplayMetrics } from '../../types';

interface StatusBarProps {
  languageName: string;
  metrics: ReplayMetrics;
  replayState: ReplayState;
  onToggleTerminal: () => void;
  onOpenCommandPalette: () => void;
  bottomLeftMenuNode?: React.ReactNode;
  showProgressInfo?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  languageName,
  metrics,
  replayState,
  onToggleTerminal,
  onOpenCommandPalette,
  bottomLeftMenuNode,
  showProgressInfo = true,
}) => {
  return (
    <div className="h-6 bg-[#181818] border-t border-[#2b2b2b] text-[#cccccc] flex items-center justify-between px-2 text-[11px] select-none z-30 font-sans shrink-0">
      {/* Left side items */}
      <div className="flex items-center space-x-1">
        {/* Bottom-Left Unified DeskPilot Replay & Workspace Menu */}
        {bottomLeftMenuNode}

        {/* Git Branch matching screenshot */}
        <div className="flex items-center gap-1 hover:bg-[#2a2d2e] px-1.5 h-6 cursor-pointer transition-colors text-[#cccccc]" title="Git Branch: main">
          <GitBranch className="w-3 h-3 text-[#cccccc]" />
          <span>main*</span>
        </div>

        {/* Diagnostics Errors / Warnings matching screenshot: ⓧ 0  ⚠ 0 */}
        <button 
          onClick={onToggleTerminal}
          className="flex items-center gap-1.5 hover:bg-[#2a2d2e] px-1.5 h-6 transition-colors cursor-pointer text-[#cccccc]"
          title="Problems: 0 errors, 0 warnings"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-[11px] text-red-400">ⓧ</span>
            <span>0</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-[11px] text-amber-400">⚠</span>
            <span>0</span>
          </div>
        </button>

        {/* Replay State Live Indicator (shown when showProgressInfo is true) */}
        {showProgressInfo && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">
            {replayState === 'playing' ? (
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>REPLAYING ({metrics.percent.toFixed(0)}%)</span>
              </span>
            ) : replayState === 'paused' ? (
              <span className="flex items-center gap-1 text-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>PAUSED</span>
              </span>
            ) : replayState === 'completed' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>REPLAY COMPLETE</span>
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Right side items matching Screenshot */}
      <div className="flex items-center space-x-2 text-[#cccccc]">
        {/* Cursor Position: Ln X, Col Y (selected) */}
        <div className="hover:bg-[#2a2d2e] px-1.5 h-6 flex items-center transition-colors cursor-pointer">
          <span>
            Ln {metrics.currentLine}, Col {metrics.currentColumn}
            {replayState === 'playing' && ` (${metrics.currentChars} chars)`}
          </span>
        </div>

        {/* Indentation */}
        <div className="hidden md:flex hover:bg-[#2a2d2e] px-1.5 h-6 items-center transition-colors cursor-pointer">
          <span>Spaces: 2</span>
        </div>

        {/* Encoding */}
        <div className="hidden md:flex hover:bg-[#2a2d2e] px-1.5 h-6 items-center transition-colors cursor-pointer">
          <span>UTF-8</span>
        </div>

        {/* Line Endings */}
        <div className="hidden lg:flex hover:bg-[#2a2d2e] px-1.5 h-6 items-center transition-colors cursor-pointer">
          <span>LF</span>
        </div>

        {/* Language Mode with { } symbol matching screenshot */}
        <div 
          onClick={onOpenCommandPalette}
          className="hover:bg-[#2a2d2e] px-1.5 h-6 flex items-center gap-1 font-medium transition-colors cursor-pointer text-[#e0e0e0]"
          title="Select Language Mode"
        >
          <span className="font-mono text-[10px] text-blue-400">&#123; &#125;</span>
          <span>{languageName}</span>
        </div>

        {/* Go Live broadcast button from screenshot */}
        <div className="hidden sm:flex items-center gap-1 hover:bg-[#2a2d2e] px-1.5 h-6 transition-colors cursor-pointer text-[#4fc1ff]" title="Live Server Preview">
          <Radio className="w-3 h-3" />
          <span>Go Live</span>
        </div>

        {/* Bell / Notifications */}
        <div className="hover:bg-[#2a2d2e] px-1.5 h-6 flex items-center transition-colors cursor-pointer text-[#858585] hover:text-white" title="Notifications">
          <Bell className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
