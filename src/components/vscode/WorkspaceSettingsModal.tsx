import React from 'react';
import { Settings, X, Sliders, Check, Monitor, Eye } from 'lucide-react';
import { EditorSettings, ReplayConfig, ReplaySpeedPreset } from '../../types';

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  replayConfig: ReplayConfig;
  onSpeedPresetChange: (preset: ReplaySpeedPreset) => void;
  onCustomMsChange: (ms: number) => void;
  onToggleCadence: () => void;
}

export const WorkspaceSettingsModal: React.FC<WorkspaceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  replayConfig,
  onSpeedPresetChange,
  onCustomMsChange,
  onToggleCadence,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#252526] border border-[#454545] rounded-lg shadow-2xl w-full max-w-lg overflow-hidden text-[#cccccc] text-xs flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1e1e1e] border-b border-[#3c3c3c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Settings className="w-4 h-4 text-[#007acc]" />
            <span>Workspace Settings</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#858585] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Section: Editor Typography & Layout */}
          <div>
            <div className="text-[11px] font-semibold text-[#858585] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#007acc]" />
              <span>Editor Appearance</span>
            </div>
            
            <div className="bg-[#1e1e1e] rounded border border-[#333333] divide-y divide-[#2d2d2d]">
              {/* Font Size */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Font Size</div>
                  <div className="text-[11px] text-[#787878]">Controls editor font size in pixels</div>
                </div>
                <div className="flex items-center gap-1">
                  {[12, 13, 14, 16].map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateSettings({ fontSize: size })}
                      className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                        settings.fontSize === size
                          ? 'bg-[#007acc] text-white font-bold'
                          : 'bg-[#2a2d2e] text-[#cccccc] hover:bg-[#383a3c]'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Wrap */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Word Wrap</div>
                  <div className="text-[11px] text-[#787878]">Soft wrap long lines inside the viewport</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ wordWrap: !settings.wordWrap })}
                  className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    settings.wordWrap
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-[#2a2d2e] text-[#888888] hover:text-white'
                  }`}
                >
                  {settings.wordWrap ? 'On' : 'Off'}
                </button>
              </div>

              {/* Minimap */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Editor Minimap</div>
                  <div className="text-[11px] text-[#787878]">Display code overview thumbnail on right edge</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ minimap: !settings.minimap })}
                  className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    settings.minimap
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-[#2a2d2e] text-[#888888] hover:text-white'
                  }`}
                >
                  {settings.minimap ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Cursor Blinking */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Cursor Animation</div>
                  <div className="text-[11px] text-[#787878]">Controls how the cursor blinks</div>
                </div>
                <select
                  value={settings.cursorBlinking}
                  onChange={(e) => onUpdateSettings({ cursorBlinking: e.target.value as any })}
                  className="bg-[#2a2d2e] text-white text-xs px-2 py-1 rounded border border-[#3c3c3c] outline-none cursor-pointer"
                >
                  <option value="blink">Blink</option>
                  <option value="smooth">Smooth</option>
                  <option value="phase">Phase</option>
                  <option value="solid">Solid</option>
                </select>
              </div>

              {/* Tab Size */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Tab Size</div>
                  <div className="text-[11px] text-[#787878]">Spaces per indentation level</div>
                </div>
                <div className="flex items-center gap-1">
                  {[2, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateSettings({ tabSize: size })}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                        settings.tabSize === size
                          ? 'bg-[#007acc] text-white font-bold'
                          : 'bg-[#2a2d2e] text-[#cccccc] hover:bg-[#383a3c]'
                      }`}
                    >
                      {size} Spaces
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Replay Speed & Cadence Defaults */}
          <div>
            <div className="text-[11px] font-semibold text-[#858585] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Replay Defaults</span>
            </div>

            <div className="bg-[#1e1e1e] rounded border border-[#333333] divide-y divide-[#2d2d2d]">
              {/* Speed Preset */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Playback Speed</div>
                  <div className="text-[11px] text-[#787878]">Default typing pace per character</div>
                </div>
                <select
                  value={replayConfig.preset}
                  onChange={(e) => onSpeedPresetChange(e.target.value as ReplaySpeedPreset)}
                  className="bg-[#2a2d2e] text-white text-xs px-2.5 py-1 rounded border border-[#3c3c3c] outline-none cursor-pointer"
                >
                  <option value="very_slow">Very Slow (150ms) - Ultra-Slow</option>
                  <option value="slow">Slow (70ms)</option>
                  <option value="normal">Normal (30ms)</option>
                  <option value="fast">Fast (10ms)</option>
                  <option value="turbo">Turbo (Instant)</option>
                  <option value="custom">Custom ms</option>
                </select>
              </div>

              {/* Human Cadence */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Human Typing Cadence</div>
                  <div className="text-[11px] text-[#787878]">Simulate realistic pauses at newlines and punctuation</div>
                </div>
                <button
                  onClick={onToggleCadence}
                  className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    replayConfig.naturalCadence
                      ? 'bg-[#0e3b5e] border border-[#007acc] text-[#80d4ff] font-medium'
                      : 'bg-[#2a2d2e] text-[#888888] hover:text-white'
                  }`}
                >
                  {replayConfig.naturalCadence ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#1e1e1e] border-t border-[#3c3c3c] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#777777]">
            Preferences are saved automatically
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium transition-colors cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
