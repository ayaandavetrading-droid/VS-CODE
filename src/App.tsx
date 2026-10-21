import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TitleBar } from './components/vscode/TitleBar';
import { ActivityBar, SidebarView } from './components/vscode/ActivityBar';
import { FileExplorer } from './components/vscode/FileExplorer';
import { SourceCodePanel } from './components/vscode/SourceCodePanel';
import { PlaybackBar } from './components/vscode/PlaybackBar';
import { EditorArea } from './components/vscode/EditorArea';
import { BottomPanel, BottomTab } from './components/vscode/BottomPanel';
import { StatusBar } from './components/vscode/StatusBar';
import { CommandPalette } from './components/vscode/CommandPalette';
import { ClearConfirmModal } from './components/vscode/ClearConfirmModal';
import { useReplayEngine } from './hooks/useReplayEngine';
import { WorkspaceProject, WorkspaceFile, LogEntry, PanelLayoutConfig, ReplaySpeedPreset } from './types';
import { SAMPLE_SNIPPETS } from './utils/sampleSnippets';
import { detectLanguageFromFilename, getLanguageById } from './utils/languageMap';
import { downloadFile, exportProjectAsZip } from './services/zipService';

const STORAGE_KEY = 'codereplay_workspace_projects_v2';
const LAYOUT_STORAGE_KEY = 'codereplay_panel_layout_v2';
export default function App() {
  // Initialize default project and sample files
  const initialProjects: WorkspaceProject[] = useMemo(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Use fallback
    }

    const defaultSample = SAMPLE_SNIPPETS[0]; // Python sample
    const initialFile: WorkspaceFile = {
      id: 'file-1',
      name: defaultSample.filename,
      path: `src/${defaultSample.filename}`,
      language: defaultSample.languageId,
      sourceCode: defaultSample.code,
      currentOffset: 0,
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const secondSample = SAMPLE_SNIPPETS[1]; // TypeScript sample
    const tsFile: WorkspaceFile = {
      id: 'file-2',
      name: secondSample.filename,
      path: `src/${secondSample.filename}`,
      language: secondSample.languageId,
      sourceCode: secondSample.code,
      currentOffset: 0,
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return [
      {
        id: 'project-1',
        name: 'Workspace-Alpha',
        files: [initialFile, tsFile],
        activeFileId: initialFile.id,
        createdAt: Date.now(),
      },
      {
        id: 'project-2',
        name: 'Frontend-Demo',
        files: [
          {
            id: 'file-p2-1',
            name: SAMPLE_SNIPPETS[3].filename,
            path: `src/${SAMPLE_SNIPPETS[3].filename}`,
            language: SAMPLE_SNIPPETS[3].languageId,
            sourceCode: SAMPLE_SNIPPETS[3].code,
            currentOffset: 0,
            status: 'idle',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        ],
        activeFileId: 'file-p2-1',
        createdAt: Date.now(),
      }
    ];
  }, []);

  const [projects, setProjects] = useState<WorkspaceProject[]>(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string>(initialProjects[0].id);

  // Active project & file
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || projects[0];
  }, [projects, currentProjectId]);

  const activeFile = useMemo(() => {
    return activeProject?.files.find((f) => f.id === activeProject.activeFileId) || activeProject?.files[0];
  }, [activeProject]);

  // Open tabs tracking
  const [openFileIds, setOpenFileIds] = useState<string[]>([activeFile?.id || '']);

  // Ensure activeFile is in openFileIds
  useEffect(() => {
    if (activeFile && !openFileIds.includes(activeFile.id)) {
      setOpenFileIds((prev) => [...prev, activeFile.id]);
    }
  }, [activeFile, openFileIds]);

  const openFiles = useMemo(() => {
    return activeProject?.files.filter((f) => openFileIds.includes(f.id)) || [];
  }, [activeProject, openFileIds]);

  const closedFiles = useMemo(() => {
    return activeProject?.files.filter((f) => !openFileIds.includes(f.id)) || [];
  }, [activeProject, openFileIds]);

  // Clean Editor & Layout panel visibility configuration
  const [layoutConfig, setLayoutConfig] = useState<PanelLayoutConfig>(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            showActivityBar: parsed.showActivityBar !== false,
            showSidebar: parsed.showSidebar !== false,
            showSourcePanel: parsed.showSourcePanel !== false,
            showBottomPanel: parsed.showBottomPanel !== false,
            showPlaybackBar: parsed.showPlaybackBar !== false,
            showStatusBar: parsed.showStatusBar !== false,
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return {
      showActivityBar: true,
      showSidebar: true,
      showSourcePanel: true,
      showBottomPanel: true,
      showPlaybackBar: true,
      showStatusBar: true,
    };
  });

  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [savedLayoutConfig, setSavedLayoutConfig] = useState<PanelLayoutConfig | null>(null);

  const [sidebarView, setSidebarView] = useState<SidebarView>('explorer');
  const [bottomTab, setBottomTab] = useState<BottomTab>('terminal');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState<boolean>(false);

  // Source input state in the Source Code Panel
  const [inputSourceText, setInputSourceText] = useState<string>(activeFile?.sourceCode || '');
  const [inputFilename, setInputFilename] = useState<string>(activeFile?.name || 'main.py');
  const [inputLanguageId, setInputLanguageId] = useState<string>(activeFile?.language || 'python');

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-init',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      message: 'CodeReplay Studio runtime initialized with Ultra-Slow Replay engine.',
    },
    {
      id: 'log-welcome',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: `Default preset: Very Slow (150ms/char). Loaded workspace "${activeProject.name}".`,
    }
  ]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', details?: string) => {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details,
    };
    setLogs((prev) => [...prev.slice(-100), entry]);
  }, []);

  // Sync file offsets from engine without cross-file contamination
  const handleEngineOffsetChange = useCallback((fileId: string, newOffset: number, newStatus: any) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (!proj.files.some((f) => f.id === fileId)) return proj;
        return {
          ...proj,
          files: proj.files.map((f) => {
            if (f.id !== fileId) return f;
            return {
              ...f,
              currentOffset: newOffset,
              status: newStatus,
              updatedAt: Date.now(),
            };
          }),
        };
      })
    );
  }, []);

  // Replay Engine integration
  const {
    currentOffset,
    setCurrentOffset,
    status,
    config,
    metrics,
    start,
    pause,
    resume,
    restart,
    reset,
    stepLine,
    stepChar,
    finish,
    setSpeedPreset,
    setCustomMs,
    toggleCadence,
    loadSource,
  } = useReplayEngine({
    fileId: activeFile?.id || '',
    sourceCode: activeFile?.sourceCode || '',
    filename: activeFile?.name || 'unnamed',
    initialOffset: activeFile?.currentOffset || 0,
    initialStatus: activeFile?.status || 'idle',
    onLog: addLog,
    onOffsetChange: handleEngineOffsetChange,
  });

  // When switching files, update source panel fields and prevent cross-file typing
  const handleSelectFile = useCallback((fileId: string) => {
    const target = activeProject.files.find((f) => f.id === fileId);
    if (!target) return;

    // If currently playing, pause before switching to protect target file integrity
    if (status === 'playing') {
      pause();
      addLog(`Paused replay to switch tabs safely to "${target.name}".`, 'info');
    }

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === activeProject.id ? { ...proj, activeFileId: fileId } : proj
      )
    );

    if (!openFileIds.includes(fileId)) {
      setOpenFileIds((prev) => [...prev, fileId]);
    }

    setInputSourceText(target.sourceCode);
    setInputFilename(target.name);
    setInputLanguageId(target.language);
    addLog(`Switched active editor document to "${target.name}".`, 'info');
  }, [activeProject, openFileIds, status, pause, addLog]);

  // Tab Close
  const handleCloseTab = useCallback((fileId: string) => {
    if (openFileIds.length <= 1) {
      addLog('Cannot close the last open tab.', 'warn');
      return;
    }
    const remaining = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(remaining);
    if (activeFile?.id === fileId) {
      handleSelectFile(remaining[0]);
    }
  }, [openFileIds, activeFile?.id, handleSelectFile, addLog]);

  // Tab Reopen
  const handleReopenFile = useCallback((fileId: string) => {
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds((prev) => [...prev, fileId]);
    }
    handleSelectFile(fileId);
  }, [openFileIds, handleSelectFile]);

  // Load code from Source Code panel into active file
  const handleLoadCode = useCallback(() => {
    if (!activeFile) return;

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          files: proj.files.map((f) => {
            if (f.id !== activeFile.id) return f;
            return {
              ...f,
              name: inputFilename.trim() || f.name,
              language: inputLanguageId,
              sourceCode: inputSourceText,
              currentOffset: 0,
              status: 'idle',
              updatedAt: Date.now(),
            };
          }),
        };
      })
    );

    loadSource(inputSourceText, inputFilename);
    addLog(`Loaded new source into "${inputFilename}" (${inputSourceText.length} characters). Ready for replay.`, 'success');
  }, [activeFile, activeProject.id, inputFilename, inputLanguageId, inputSourceText, loadSource, addLog]);

  // Clear code request with safety modal
  const handleConfirmClear = () => {
    setInputSourceText('');
    if (activeFile) {
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== activeProject.id) return proj;
          return {
            ...proj,
            files: proj.files.map((f) => {
              if (f.id !== activeFile.id) return f;
              return { ...f, sourceCode: '', currentOffset: 0, status: 'idle' };
            }),
          };
        })
      );
      loadSource('', activeFile.name);
    }
    setIsClearConfirmOpen(false);
    addLog('Source code cleared from buffer.', 'warn');
  };

  // Create new file
  const handleCreateFile = useCallback((fileName: string) => {
    const lang = detectLanguageFromFilename(fileName);
    const newFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      path: `src/${fileName}`,
      language: lang.id,
      sourceCode: '',
      currentOffset: 0,
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProject.id) return p;
        return {
          ...p,
          files: [...p.files, newFile],
          activeFileId: newFile.id,
        };
      })
    );

    setOpenFileIds((prev) => [...prev, newFile.id]);
    setInputSourceText('');
    setInputFilename(fileName);
    setInputLanguageId(lang.id);
    loadSource('', fileName);
    addLog(`Created new file "${fileName}".`, 'info');
  }, [activeProject.id, loadSource, addLog]);

  // Delete file
  const handleDeleteFile = useCallback((fileId: string) => {
    if (activeProject.files.length <= 1) {
      addLog('Cannot delete the last remaining file in workspace.', 'warn');
      return;
    }

    const fileToDelete = activeProject.files.find((f) => f.id === fileId);
    const remaining = activeProject.files.filter((f) => f.id !== fileId);
    const nextActive = remaining[0];

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProject.id) return p;
        return {
          ...p,
          files: remaining,
          activeFileId: nextActive.id,
        };
      })
    );

    setOpenFileIds((prev) => prev.filter((id) => id !== fileId));
    handleSelectFile(nextActive.id);
    addLog(`Deleted file "${fileToDelete?.name}".`, 'info');
  }, [activeProject, handleSelectFile, addLog]);

  // Create new project
  const handleCreateProject = useCallback((name: string) => {
    const sample = SAMPLE_SNIPPETS[0];
    const initialFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      name: sample.filename,
      path: `src/${sample.filename}`,
      language: sample.languageId,
      sourceCode: sample.code,
      currentOffset: 0,
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newProj: WorkspaceProject = {
      id: `proj-${Date.now()}`,
      name,
      files: [initialFile],
      activeFileId: initialFile.id,
      createdAt: Date.now(),
    };

    setProjects((prev) => [...prev, newProj]);
    setCurrentProjectId(newProj.id);
    setOpenFileIds([initialFile.id]);
    setInputSourceText(initialFile.sourceCode);
    setInputFilename(initialFile.name);
    setInputLanguageId(initialFile.language);
    loadSource(initialFile.sourceCode, initialFile.name);
    addLog(`Created project "${name}".`, 'success');
  }, [loadSource, addLog]);

  // Quick load sample snippet
  const handleQuickLoadSample = useCallback(() => {
    const nextIndex = (SAMPLE_SNIPPETS.findIndex((s) => s.filename === activeFile?.name) + 1) % SAMPLE_SNIPPETS.length;
    const sample = SAMPLE_SNIPPETS[nextIndex];

    setInputSourceText(sample.code);
    setInputFilename(sample.filename);
    setInputLanguageId(sample.languageId);

    if (activeFile) {
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== activeProject.id) return proj;
          return {
            ...proj,
            files: proj.files.map((f) => {
              if (f.id !== activeFile.id) return f;
              return {
                ...f,
                name: sample.filename,
                language: sample.languageId,
                sourceCode: sample.code,
                currentOffset: 0,
                status: 'idle',
              };
            }),
          };
        })
      );
      loadSource(sample.code, sample.filename);
      addLog(`Loaded sample: "${sample.title}" into editor.`, 'info');
    }
  }, [activeFile, activeProject.id, loadSource, addLog]);

  // Clean Editor / Focus Mode Toggle
  const handleToggleFocusMode = useCallback(() => {
    if (!isFocusMode) {
      // Save current layout arrangement
      setSavedLayoutConfig({ ...layoutConfig });
      // Enter clean distraction-free mode
      setLayoutConfig({
        showActivityBar: false,
        showSidebar: false,
        showSourcePanel: false,
        showBottomPanel: false,
        showPlaybackBar: true, // Keep clean controls
        showStatusBar: false,
      });
      setIsFocusMode(true);
      addLog('Entered Clean Focus Editor Mode. Surrounding panels hidden.', 'info');
    } else {
      // Restore previous layout
      if (savedLayoutConfig) {
        setLayoutConfig(savedLayoutConfig);
      } else {
        setLayoutConfig({
          showActivityBar: true,
          showSidebar: true,
          showSourcePanel: true,
          showBottomPanel: true,
          showPlaybackBar: true,
          showStatusBar: true,
        });
      }
      setIsFocusMode(false);
      addLog('Restored previous panel layout arrangement.', 'info');
    }
  }, [isFocusMode, layoutConfig, savedLayoutConfig, addLog]);

  // Toggle Replay Control Bar without interrupting playback
  const handleToggleControls = useCallback(() => {
    setLayoutConfig((prev) => {
      const next = !prev.showPlaybackBar;
      addLog(
        next 
          ? 'Replay controls bar revealed.' 
          : 'Replay controls bar hidden (Ctrl+Shift+B or click "Show Controls" to reveal). Playback continues smoothly.',
        'system'
      );
      return { ...prev, showPlaybackBar: next };
    });
  }, [addLog]);

  // Restore Default Full VS Code Layout
  const handleRestoreDefaultLayout = useCallback(() => {
    setLayoutConfig({
      showActivityBar: true,
      showSidebar: true,
      showSourcePanel: true,
      showBottomPanel: true,
      showPlaybackBar: true,
      showStatusBar: true,
    });
    setIsFocusMode(false);
    addLog('Restored default full VS Code layout arrangement.', 'info');
  }, [addLog]);

  // Persist layoutConfig to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutConfig));
    } catch (e) {
      // Ignore quota errors
    }
  }, [layoutConfig]);

  // Toggle individual panels
  const handleTogglePanel = useCallback((panelKey: keyof PanelLayoutConfig) => {
    setLayoutConfig((prev) => {
      const next = { ...prev, [panelKey]: !prev[panelKey] };
      addLog(`Toggled ${panelKey}: ${next[panelKey] ? 'Visible' : 'Hidden'}`, 'system');
      return next;
    });
  }, [addLog]);

  // Export current project as ZIP
  const handleExportZip = useCallback(() => {
    exportProjectAsZip(activeProject)
      .then(() => {
        addLog(`Project "${activeProject.name}" exported as ZIP successfully.`, 'success');
      })
      .catch((err) => {
        addLog(`Failed to export project ZIP: ${err.message}`, 'error');
      });
  }, [activeProject, addLog]);

  // Download active file
  const handleDownloadActiveFile = useCallback(() => {
    if (activeFile) {
      downloadFile(activeFile);
      addLog(`Downloaded active file "${activeFile.name}".`, 'info');
    }
  }, [activeFile, addLog]);

  // Interactive Terminal Command Runner
  const handleRunTerminalCommand = useCallback((cmd: string) => {
    const raw = cmd.trim();
    const [action, ...args] = raw.split(' ');
    addLog(`$ ${raw}`, 'system');

    switch (action.toLowerCase()) {
      case 'help':
        addLog('Available commands: status, start, pause, resume, restart, reset, step, finish, speed <preset>, controls, focus, restore, clear, export, ls, cat', 'info');
        break;
      case 'status':
        addLog(`Status: ${status} | Speed: ${config.preset} (${config.customMs}ms) | Controls: ${layoutConfig.showPlaybackBar ? 'Visible' : 'Hidden'} | Chars: ${metrics.currentChars}/${metrics.totalChars} (${metrics.percent.toFixed(1)}%) | Line: ${metrics.currentLine}/${metrics.totalLines}`, 'info');
        break;
      case 'controls':
      case 'togglecontrols':
        handleToggleControls();
        break;
      case 'focus':
        if (!isFocusMode) handleToggleFocusMode();
        break;
      case 'restore':
        handleRestoreDefaultLayout();
        break;
      case 'start':
        start();
        break;
      case 'pause':
        pause();
        break;
      case 'resume':
        resume();
        break;
      case 'restart':
        restart();
        break;
      case 'reset':
        reset();
        break;
      case 'step':
        stepLine();
        break;
      case 'finish':
        finish();
        break;
      case 'speed':
        if (args[0]) {
          setSpeedPreset(args[0] as ReplaySpeedPreset);
        } else {
          addLog(`Current speed: ${config.preset} (${config.customMs}ms/char)`, 'info');
        }
        break;
      case 'clear':
        setLogs([]);
        break;
      case 'export':
        handleExportZip();
        break;
      case 'ls':
        const fileNames = activeProject.files.map((f) => f.name).join('   ');
        addLog(fileNames || '(empty workspace)', 'info');
        break;
      case 'cat':
        if (args[0]) {
          const target = activeProject.files.find((f) => f.name === args[0]);
          if (target) {
            addLog(`--- ${target.name} (${target.sourceCode.length} bytes) ---\n${target.sourceCode.slice(0, 150)}...`, 'info');
          } else {
            addLog(`File not found: ${args[0]}`, 'error');
          }
        } else {
          addLog(`Usage: cat <filename>`, 'warn');
        }
        break;
      default:
        addLog(`bash: command not found: ${action}. Type "help" for a list of commands.`, 'error');
        break;
    }
  }, [status, metrics, config, start, pause, resume, restart, reset, stepLine, finish, setSpeedPreset, isFocusMode, handleToggleFocusMode, handleToggleControls, handleRestoreDefaultLayout, handleExportZip, activeProject.files, layoutConfig.showPlaybackBar, addLog]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle replay controls: Ctrl+Shift+B / Cmd+Shift+B
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        handleToggleControls();
      }
      // Focus mode toggle: F11
      else if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFocusMode();
      }
      // Escape key exits focus mode or restores controls
      else if (e.key === 'Escape') {
        if (isFocusMode) {
          e.preventDefault();
          handleToggleFocusMode();
        }
      }
      // Command palette: Ctrl+P / Cmd+P
      else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Toggle sidebar: Ctrl+B / Cmd+B (without Shift)
      else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handleTogglePanel('showSidebar');
      }
      // Toggle source panel: Ctrl+S / Cmd+S
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleTogglePanel('showSourcePanel');
      }
      // Export zip: Ctrl+E / Cmd+E
      else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExportZip();
      }
      // F5: Start or Resume
      else if (e.key === 'F5') {
        e.preventDefault();
        if (status === 'paused') resume();
        else start();
      }
      // F6: Pause immediately
      else if (e.key === 'F6') {
        e.preventDefault();
        pause();
      }
      // F8: Finish replay
      else if (e.key === 'F8') {
        e.preventDefault();
        finish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, start, pause, resume, finish, handleExportZip, handleToggleFocusMode, handleToggleControls, handleTogglePanel, isFocusMode]);

  // Persist projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      // Ignore quota errors
    }
  }, [projects]);

  const activeLangOption = activeFile ? detectLanguageFromFilename(activeFile.name) : getLanguageById('plaintext');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#cccccc] overflow-hidden select-none font-sans">
      {/* 1. VS Code Title Bar */}
      <TitleBar
        project={activeProject}
        activeFile={activeFile}
        replayState={status}
        onStart={start}
        onPause={pause}
        onFinish={finish}
        onRestart={restart}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSourcePanel={() => handleTogglePanel('showSourcePanel')}
        isSourcePanelVisible={layoutConfig.showSourcePanel}
        onExportZip={handleExportZip}
        onQuickLoadSample={handleQuickLoadSample}
        isFocusMode={isFocusMode}
        onToggleFocusMode={handleToggleFocusMode}
        layoutConfig={layoutConfig}
        onTogglePanel={handleTogglePanel}
      />

      {/* 2. Main Middle Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Activity Bar */}
        {layoutConfig.showActivityBar && (
          <ActivityBar
            activeView={sidebarView}
            onSelectView={setSidebarView}
            isSourcePanelVisible={layoutConfig.showSourcePanel}
            onToggleSourcePanel={() => handleTogglePanel('showSourcePanel')}
            onOpenSettings={() => setIsCommandPaletteOpen(true)}
            fileCount={activeProject.files.length}
          />
        )}

        {/* File Explorer Sidebar */}
        {layoutConfig.showSidebar && sidebarView === 'explorer' && (
          <FileExplorer
            projects={projects}
            currentProjectId={currentProjectId}
            onSelectProject={setCurrentProjectId}
            onCreateProject={handleCreateProject}
            activeFileId={activeFile?.id || ''}
            onSelectFile={handleSelectFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onDownloadFile={downloadFile}
            onExportProjectZip={handleExportZip}
            onQuickLoadSample={handleQuickLoadSample}
          />
        )}

        {/* Companion Tab View in Sidebar if selected */}
        {layoutConfig.showSidebar && sidebarView === 'companion' && (
          <div className="w-64 bg-[#252526] p-4 text-xs border-r border-[#1e1e1e] flex flex-col gap-3">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Desktop Companion
            </div>
            <p className="text-[#858585] leading-relaxed">
              Connect CodeReplay to your local VS Code application via the optional companion script.
            </p>
            <button
              onClick={() => {
                setLayoutConfig((prev) => ({ ...prev, showBottomPanel: true }));
                setBottomTab('companion');
              }}
              className="px-3 py-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs transition-colors"
            >
              View Setup Guide &amp; Script
            </button>
          </div>
        )}

        {/* Dedicated "Source Code" Input Panel */}
        {layoutConfig.showSourcePanel && (
          <SourceCodePanel
            sourceText={inputSourceText}
            onSourceTextChange={setInputSourceText}
            selectedLanguageId={inputLanguageId}
            onSelectLanguage={setInputLanguageId}
            filename={inputFilename}
            onFilenameChange={setInputFilename}
            onLoadCode={handleLoadCode}
            onHideSource={() => handleTogglePanel('showSourcePanel')}
            onConfirmClearRequest={() => setIsClearConfirmOpen(true)}
            isLoaded={activeFile?.sourceCode === inputSourceText && inputSourceText.length > 0}
            totalCharacters={inputSourceText.length}
            onEnterFocusMode={handleToggleFocusMode}
          />
        )}

        {/* Center Code Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Replay Playback & Speed Controls Bar */}
          {layoutConfig.showPlaybackBar && (
            <PlaybackBar
              status={status}
              config={config}
              metrics={metrics}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onRestart={restart}
              onReset={reset}
              onStepLine={stepLine}
              onStepChar={stepChar}
              onFinish={finish}
              onSpeedPresetChange={setSpeedPreset}
              onCustomMsChange={setCustomMs}
              onToggleCadence={toggleCadence}
              isSourcePanelVisible={layoutConfig.showSourcePanel}
              onShowSourcePanel={() => handleTogglePanel('showSourcePanel')}
              hasSource={Boolean(activeFile?.sourceCode)}
              isFocusMode={isFocusMode}
              onToggleFocusMode={handleToggleFocusMode}
              onHideControls={handleToggleControls}
            />
          )}

          {/* Monaco Editor Canvas */}
          <EditorArea
            project={activeProject}
            activeFile={activeFile}
            openFiles={openFiles}
            closedFiles={closedFiles}
            onSelectTab={handleSelectFile}
            onCloseTab={handleCloseTab}
            onReopenFile={handleReopenFile}
            onShowSourcePanel={() => handleTogglePanel('showSourcePanel')}
            onQuickLoadSample={handleQuickLoadSample}
            onDownloadActiveFile={handleDownloadActiveFile}
            onStartReplay={start}
            replayState={status}
            isFocusMode={isFocusMode}
            onToggleFocusMode={handleToggleFocusMode}
            showPlaybackBar={layoutConfig.showPlaybackBar}
            onShowControls={handleToggleControls}
            onRestoreLayout={handleRestoreDefaultLayout}
          />

          {/* Bottom Panel: Terminal, Problems, Output, Companion */}
          {layoutConfig.showBottomPanel && (
            <BottomPanel
              logs={logs}
              problems={[]}
              metrics={metrics}
              activeFile={activeFile}
              onClearLogs={() => setLogs([])}
              isOpen={layoutConfig.showBottomPanel}
              onToggleOpen={() => handleTogglePanel('showBottomPanel')}
              activeTab={bottomTab}
              onSelectTab={setBottomTab}
              onRunTerminalCommand={handleRunTerminalCommand}
            />
          )}
        </div>
      </div>

      {/* 3. VS Code Status Bar */}
      {layoutConfig.showStatusBar && (
        <StatusBar
          languageName={activeLangOption.name}
          metrics={metrics}
          replayState={status}
          onToggleTerminal={() => {
            handleTogglePanel('showBottomPanel');
            setBottomTab('problems');
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      )}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        files={activeProject.files}
        onSelectFile={handleSelectFile}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onRestart={restart}
        onReset={reset}
        onStepLine={stepLine}
        onFinish={finish}
        onToggleSourcePanel={() => handleTogglePanel('showSourcePanel')}
        isSourcePanelVisible={layoutConfig.showSourcePanel}
        onExportZip={handleExportZip}
        onQuickLoadSample={handleQuickLoadSample}
        isFocusMode={isFocusMode}
        onToggleFocusMode={handleToggleFocusMode}
        onSetSpeedPreset={setSpeedPreset}
        showPlaybackBar={layoutConfig.showPlaybackBar}
        onToggleControls={handleToggleControls}
        onRestoreDefaultLayout={handleRestoreDefaultLayout}
      />

      {/* Clear Confirmation Modal */}
      <ClearConfirmModal
        isOpen={isClearConfirmOpen}
        onCancel={() => setIsClearConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        charCount={inputSourceText.length}
      />
    </div>
  );
}
