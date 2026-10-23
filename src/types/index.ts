export type ReplayState = 'idle' | 'playing' | 'paused' | 'completed';

export type ReplaySpeedPreset = 'very_slow' | 'slow' | 'normal' | 'fast' | 'turbo' | 'custom';

export interface ReplayConfig {
  preset: ReplaySpeedPreset;
  customMs: number;
  naturalCadence: boolean;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  language: string;
  sourceCode: string;
  currentOffset: number;
  status: ReplayState;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  files: WorkspaceFile[];
  activeFileId: string;
  createdAt: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
  message: string;
  details?: string;
}

export interface SyntaxProblem {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  source: string;
}

export interface ReplayMetrics {
  totalChars: number;
  currentChars: number;
  totalLines: number;
  currentLine: number;
  currentColumn: number;
  percent: number;
  elapsedSeconds: number;
  estimatedRemainingSeconds: number;
  charsPerSecond: number;
}

export interface PanelLayoutConfig {
  showActivityBar: boolean;
  showSidebar: boolean;
  showSourcePanel: boolean;
  showBottomPanel: boolean;
  showPlaybackBar: boolean;
  showStatusBar: boolean;
  showProgressInfo: boolean;
}

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'solid';
  cursorStyle: 'line' | 'block' | 'underline';
  tabSize: number;
  smoothScrolling: boolean;
}
