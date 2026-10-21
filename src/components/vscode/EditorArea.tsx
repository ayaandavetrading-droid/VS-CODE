import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  X, 
  FileCode, 
  ChevronRight, 
  Play, 
  Sparkles, 
  Upload, 
  Code2, 
  CheckCircle2, 
  Download,
  Plus,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { WorkspaceFile, WorkspaceProject, ReplayState } from '../../types';
import { detectLanguageFromFilename } from '../../utils/languageMap';

interface EditorAreaProps {
  project: WorkspaceProject;
  activeFile?: WorkspaceFile;
  openFiles: WorkspaceFile[];
  closedFiles: WorkspaceFile[];
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onReopenFile: (fileId: string) => void;
  onShowSourcePanel: () => void;
  onQuickLoadSample: () => void;
  onDownloadActiveFile: () => void;
  onStartReplay: () => void;
  replayState: ReplayState;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const EditorArea: React.FC<EditorAreaProps> = ({
  project,
  activeFile,
  openFiles,
  closedFiles,
  onSelectTab,
  onCloseTab,
  onReopenFile,
  onShowSourcePanel,
  onQuickLoadSample,
  onDownloadActiveFile,
  onStartReplay,
  replayState,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const editorRef = useRef<any>(null);
  const [showReopenDropdown, setShowReopenDropdown] = useState(false);

  // Compute text to display: exact slice up to currentOffset
  const displayText = activeFile ? activeFile.sourceCode.slice(0, activeFile.currentOffset) : '';
  const langConfig = activeFile ? detectLanguageFromFilename(activeFile.name) : null;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor layout & cursor
    editor.updateOptions({
      fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
      fontSize: 13,
      lineHeight: 20,
      minimap: { enabled: true, side: 'right', maxColumn: 80 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      cursorBlinking: 'blink',
      cursorStyle: 'line',
      cursorWidth: 2,
      smoothScrolling: true,
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true },
      guides: { indentation: true, bracketPairs: true },
      readOnly: false,
    });
  };

  // Keep cursor and view locked to current insertion position
  useEffect(() => {
    if (!editorRef.current || !activeFile) return;

    const lines = displayText.split('\n');
    const lineNumber = lines.length;
    const column = lines[lines.length - 1].length + 1;

    try {
      editorRef.current.setPosition({ lineNumber, column });
      editorRef.current.revealPositionInCenterIfOutsideViewport({ lineNumber, column });
    } catch (e) {
      // Ignore if editor not ready
    }
  }, [displayText, activeFile?.id]);

  const getFileIconColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py': return 'text-yellow-400';
      case 'ts': case 'tsx': return 'text-blue-400';
      case 'js': case 'jsx': return 'text-yellow-300';
      case 'html': return 'text-orange-500';
      case 'css': return 'text-blue-500';
      case 'sql': return 'text-emerald-400';
      case 'java': return 'text-red-400';
      case 'cs': return 'text-purple-400';
      case 'rs': return 'text-amber-600';
      case 'go': return 'text-cyan-400';
      case 'json': return 'text-yellow-200';
      case 'md': return 'text-slate-300';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden select-none relative">
      {/* Editor Tab Bar */}
      <div className="h-9 bg-[#252526] flex items-center justify-between border-b border-[#181818] px-1 overflow-x-auto no-scrollbar z-10">
        <div className="flex items-center h-full space-x-0.5">
          {openFiles.map((file) => {
            const isActive = activeFile?.id === file.id;
            const isTyping = file.status === 'playing';
            const isCompleted = file.status === 'completed';

            return (
              <div
                key={file.id}
                onClick={() => onSelectTab(file.id)}
                className={`group h-full px-3 flex items-center gap-2 cursor-pointer border-t-2 text-xs transition-colors shrink-0 max-w-[200px] ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-[#007acc] font-medium'
                    : 'bg-[#2d2d2d] hover:bg-[#333333] text-[#969696] border-transparent'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${getFileIconColor(file.name)}`} />
                <span className="truncate">{file.name}</span>

                {/* Progress or status indicator */}
                {isTyping && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" title="Replaying..." />
                )}
                {isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Completed" />
                )}

                {/* Close Tab button */}
                {openFiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#404040] rounded text-[#858585] hover:text-white transition-opacity"
                    title={`Close ${file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Reopen Closed Files (+) Dropdown */}
          {closedFiles.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowReopenDropdown(!showReopenDropdown)}
                className="p-1.5 hover:bg-[#333333] text-[#858585] hover:text-white rounded transition-colors text-xs"
                title="Reopen closed files"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {showReopenDropdown && (
                <div 
                  className="absolute left-0 top-full mt-1 w-48 bg-[#252526] border border-[#454545] rounded shadow-2xl py-1 z-50 text-xs"
                  onMouseLeave={() => setShowReopenDropdown(false)}
                >
                  <div className="px-3 py-1 text-[10px] text-[#858585] uppercase tracking-wider font-semibold border-b border-[#333333]">
                    Reopen File Tab
                  </div>
                  {closedFiles.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        onReopenFile(f.id);
                        setShowReopenDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex items-center gap-2"
                    >
                      <FileCode className={`w-3.5 h-3.5 ${getFileIconColor(f.name)}`} />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab bar right actions */}
        <div className="flex items-center gap-1.5 pr-2">
          {isFocusMode && (
            <button
              onClick={onToggleFocusMode}
              className="px-2 py-0.5 rounded bg-[#2d4a22] hover:bg-[#355628] text-[#89d185] border border-[#4ec9b0]/40 flex items-center gap-1 text-[11px] font-medium transition-colors"
              title="Exit Focus Mode (Esc or F11)"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Restore Layout</span>
            </button>
          )}

          {activeFile && (
            <button
              onClick={onDownloadActiveFile}
              title="Download Current File"
              className="p-1 hover:bg-[#37373d] text-[#858585] hover:text-white rounded transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb Path Bar */}
      {activeFile && (
        <div className="h-6 bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 flex items-center justify-between text-[11px] text-[#858585]">
          <div className="flex items-center gap-1">
            <span>{project.name}</span>
            <ChevronRight className="w-3 h-3 text-[#555555]" />
            <span>src</span>
            <ChevronRight className="w-3 h-3 text-[#555555]" />
            <span className="text-[#cccccc] font-medium">{activeFile.name}</span>
            {activeFile.status === 'completed' && (
              <span className="ml-3 text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Replay Complete
              </span>
            )}
          </div>

          {isFocusMode && (
            <span className="text-[10px] text-[#4ec9b0] font-mono uppercase tracking-wider">
              [Focus Editor Mode Active]
            </span>
          )}
        </div>
      )}

      {/* Main Monaco Editor Display */}
      <div className="flex-1 relative bg-[#1e1e1e]">
        {activeFile && activeFile.sourceCode.length > 0 ? (
          <Editor
            height="100%"
            language={langConfig ? langConfig.monacoLang : 'typescript'}
            theme="vs-dark"
            value={displayText}
            onMount={handleEditorDidMount}
            options={{
              readOnly: true,
              domReadOnly: true,
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: 13,
              minimap: { enabled: true },
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderWhitespace: 'selection',
            }}
          />
        ) : (
          /* Empty State / Welcome Screen when no code is loaded */
          <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none bg-[#1e1e1e] text-[#cccccc]">
            <div className="w-14 h-14 rounded-2xl bg-[#007acc]/10 border border-[#007acc]/30 flex items-center justify-center mb-4 text-[#007acc]">
              <Code2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">CodeReplay Studio</h2>
            <p className="text-xs text-[#858585] max-w-md mb-6 leading-relaxed">
              Paste your custom code into the Source Code panel, or select a preloaded sample to begin a realistic character-by-character coding replay.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onShowSourcePanel}
                className="px-4 py-2 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Open Source Code Panel</span>
              </button>

              <button
                onClick={onQuickLoadSample}
                className="px-4 py-2 rounded bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] hover:text-white border border-[#3c3c3c] text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Load Sample Snippet</span>
              </button>
            </div>

            <div className="mt-8 text-[11px] text-[#666666] flex items-center gap-4">
              <span>Press <kbd className="px-1.5 py-0.5 bg-[#252526] rounded border border-[#333333] text-gray-300">F5</kbd> to Start</span>
              <span>·</span>
              <span><kbd className="px-1.5 py-0.5 bg-[#252526] rounded border border-[#333333] text-gray-300">F6</kbd> to Pause</span>
              <span>·</span>
              <span><kbd className="px-1.5 py-0.5 bg-[#252526] rounded border border-[#333333] text-gray-300">F8</kbd> to Finish</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
