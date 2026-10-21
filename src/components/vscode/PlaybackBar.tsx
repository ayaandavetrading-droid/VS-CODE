import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  StepForward, 
  RefreshCw, 
  Clock, 
  Eye, 
  ChevronRight,
  Zap,
  Gauge,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ReplayState, ReplaySpeedPreset, ReplayConfig, ReplayMetrics } from '../../types';

interface PlaybackBarProps {
  status: ReplayState;
  config: ReplayConfig;
  metrics: ReplayMetrics;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onReset: () => void;
  onStepLine: () => void;
  onStepChar: () => void;
  onFinish: () => void;
  onSpeedPresetChange: (preset: ReplaySpeedPreset) => void;
  onCustomMsChange: (ms: number) => void;
  onToggleCadence: () => void;
  isSourcePanelVisible: boolean;
  onShowSourcePanel: () => void;
  hasSource: boolean;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  status,
  config,
  metrics,
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
  isSourcePanelVisible,
  onShowSourcePanel,
  hasSource,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#202020] border-b border-[#2d2d2d] px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Left side: Main Replay Control Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Start / Pause / Resume Primary Button */}
        {isPlaying ? (
          <button
            onClick={onPause}
            className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Pause Replay Immediately (F6)"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="px-3 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Resume Replay (F5)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={!hasSource}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors shadow-sm ${
              hasSource
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-[#2b2b2b] text-[#666666] cursor-not-allowed'
            }`}
            title="Start Replay from Beginning (F5)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start</span>
          </button>
        )}

        {/* Step Line */}
        <button
          onClick={onStepLine}
          disabled={isPlaying || isCompleted || !hasSource}
          className={`px-2.5 py-1.5 rounded border border-[#3c3c3c] flex items-center gap-1 transition-colors ${
            !isPlaying && !isCompleted && hasSource
              ? 'bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] cursor-pointer'
              : 'bg-[#1b1b1b] text-[#555555] cursor-not-allowed'
          }`}
          title="Step Line: Insert exactly one source line"
        >
          <StepForward className="w-3.5 h-3.5 text-[#4fc1ff]" />
          <span>Step Line</span>
        </button>

        {/* Step Character */}
        <button
          onClick={onStepChar}
          disabled={isPlaying || isCompleted || !hasSource}
          className={`px-2 py-1.5 rounded border border-[#3c3c3c] flex items-center gap-1 transition-colors ${
            !isPlaying && !isCompleted && hasSource
              ? 'bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] cursor-pointer'
              : 'bg-[#1b1b1b] text-[#555555] cursor-not-allowed'
          }`}
          title="Step Character: Insert 1 character"
        >
          <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
          <span>Step Char</span>
        </button>

        {/* Finish */}
        <button
          onClick={onFinish}
          disabled={isCompleted || !hasSource}
          className={`px-2.5 py-1.5 rounded border border-[#3c3c3c] flex items-center gap-1 transition-colors ${
            !isCompleted && hasSource
              ? 'bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] cursor-pointer'
              : 'bg-[#1b1b1b] text-[#555555] cursor-not-allowed'
          }`}
          title="Finish: Immediately insert all remaining characters"
        >
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
          <span>Finish</span>
        </button>

        {/* Restart */}
        <button
          onClick={onRestart}
          disabled={!hasSource}
          className={`px-2 py-1.5 rounded border border-[#3c3c3c] flex items-center gap-1 transition-colors ${
            hasSource
              ? 'bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] cursor-pointer'
              : 'bg-[#1b1b1b] text-[#555555] cursor-not-allowed'
          }`}
          title="Restart: Move back to the beginning ready to replay"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Restart</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          disabled={metrics.currentChars === 0}
          className={`px-2 py-1.5 rounded border border-[#3c3c3c] flex items-center gap-1 transition-colors ${
            metrics.currentChars > 0
              ? 'bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] cursor-pointer'
              : 'bg-[#1b1b1b] text-[#555555] cursor-not-allowed'
          }`}
          title="Reset: Clear editor output and reset position (keeps source intact)"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset</span>
        </button>

        {/* Reveal Source Panel if hidden */}
        {!isSourcePanelVisible && !isFocusMode && (
          <button
            onClick={onShowSourcePanel}
            className="px-2.5 py-1.5 rounded bg-[#1e3a5f] hover:bg-[#254b7d] text-blue-200 border border-blue-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore Source Code Input Panel"
          >
            <Eye className="w-3.5 h-3.5 text-blue-300" />
            <span className="font-medium">Show Source</span>
          </button>
        )}
      </div>

      {/* Middle/Right: Speed Selector, Cadence, & Clean Focus Mode button */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Speed presets */}
        <div className="flex items-center gap-1.5 bg-[#181818] px-2 py-1 rounded border border-[#333333]">
          <Gauge className="w-3.5 h-3.5 text-[#007acc]" />
          <span className="text-[11px] text-[#858585] font-medium hidden sm:inline">Speed:</span>
          
          <select
            value={config.preset}
            onChange={(e) => onSpeedPresetChange(e.target.value as ReplaySpeedPreset)}
            className="bg-[#242424] text-[#e0e0e0] text-xs px-2 py-0.5 rounded border border-[#3c3c3c] outline-none cursor-pointer"
          >
            <option value="very_slow">Very Slow (150ms)</option>
            <option value="slow">Slow (70ms)</option>
            <option value="normal">Normal (30ms)</option>
            <option value="fast">Fast (10ms)</option>
            <option value="turbo">Turbo (Instant)</option>
            <option value="custom">Custom ms</option>
          </select>

          {config.preset === 'custom' && (
            <div className="flex items-center gap-1 pl-1">
              <input
                type="number"
                min="1"
                max="2000"
                value={config.customMs}
                onChange={(e) => onCustomMsChange(Math.max(1, parseInt(e.target.value) || 150))}
                className="w-14 bg-[#252526] text-white border border-[#007acc] rounded px-1.5 py-0.5 text-xs text-center font-mono outline-none"
              />
              <span className="text-[10px] text-[#858585]">ms</span>
            </div>
          )}
        </div>

        {/* Natural Cadence Switch */}
        <button
          onClick={onToggleCadence}
          title="Simulate realistic human typing rhythm (natural pauses at newlines and punctuation)"
          className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs transition-colors cursor-pointer ${
            config.naturalCadence
              ? 'bg-[#0e3b5e] border-[#007acc] text-[#80d4ff]'
              : 'bg-[#1e1e1e] border-[#333333] text-[#888888] hover:text-[#cccccc]'
          }`}
        >
          <Zap className={`w-3 h-3 ${config.naturalCadence ? 'text-amber-400' : 'text-gray-500'}`} />
          <span className="hidden md:inline">Human Cadence</span>
        </button>

        {/* Clean Editor / Focus Mode Button */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? 'Restore previous layout arrangement' : 'Enter clean, distraction-free Focus Editor mode'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium text-xs border transition-colors cursor-pointer ${
            isFocusMode
              ? 'bg-[#2d4a22] text-[#89d185] border-[#4ec9b0]/60 hover:bg-[#355628]'
              : 'bg-[#2a2d2e] hover:bg-[#373a3c] text-white border-[#3c3c3c]'
          }`}
        >
          {isFocusMode ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restore Layout</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#4fc1ff]" />
              <span>Focus Editor</span>
            </>
          )}
        </button>
      </div>

      {/* Progress metrics bar */}
      <div className="w-full flex items-center justify-between gap-4 pt-1 border-t border-[#2a2a2a] text-[11px] text-[#858585]">
        {/* Status indicator & progress bar */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <span className={`font-mono font-medium uppercase text-[10px] ${
            isPlaying ? 'text-blue-400' : isPaused ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-gray-400'
          }`}>
            {status}
          </span>
          <div className="flex-1 h-1.5 bg-[#141414] rounded-full overflow-hidden border border-[#2b2b2b]">
            <div 
              className={`h-full transition-all duration-150 ${
                isCompleted ? 'bg-emerald-500' : isPlaying ? 'bg-[#007acc]' : 'bg-[#4fc1ff]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, metrics.percent))}%` }}
            />
          </div>
          <span className="font-mono text-white text-[11px] min-w-[36px]">
            {metrics.percent.toFixed(1)}%
          </span>
        </div>

        {/* Character count & Line position */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span>Chars:</span>
            <span className="font-mono text-white">
              {metrics.currentChars.toLocaleString()} / {metrics.totalChars.toLocaleString()}
            </span>
          </div>

          <span aria-hidden="true" className="text-[#444444]">·</span>

          <div className="flex items-center gap-1">
            <span>Pos:</span>
            <span className="font-mono text-white">
              Ln {metrics.currentLine}, Col {metrics.currentColumn}
            </span>
          </div>

          <span aria-hidden="true" className="text-[#444444]">·</span>

          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#858585]" />
            <span className="font-mono text-white">{formatTime(metrics.elapsedSeconds)}</span>
            {isPlaying && metrics.estimatedRemainingSeconds > 0 && (
              <span className="text-[#777777]">
                (~{formatTime(metrics.estimatedRemainingSeconds)} left)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
