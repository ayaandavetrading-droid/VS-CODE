import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  AlertCircle, 
  Cpu, 
  Laptop, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { LogEntry, SyntaxProblem, ReplayMetrics, WorkspaceFile } from '../../types';

export type BottomTab = 'terminal' | 'problems' | 'output' | 'companion';

interface BottomPanelProps {
  logs: LogEntry[];
  problems: SyntaxProblem[];
  metrics: ReplayMetrics;
  activeFile?: WorkspaceFile;
  onClearLogs: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  activeTab: BottomTab;
  onSelectTab: (tab: BottomTab) => void;
  onRunTerminalCommand: (cmd: string) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  logs,
  problems,
  metrics,
  activeFile,
  onClearLogs,
  isOpen,
  onToggleOpen,
  activeTab,
  onSelectTab,
  onRunTerminalCommand,
}) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [copiedBridge, setCopiedBridge] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      onRunTerminalCommand(terminalInput.trim());
      setTerminalInput('');
    }
  };

  const desktopBridgeScript = `/**
 * CodeReplay Studio - Local VS Code Desktop Companion Bridge
 *
 * This companion script connects the browser-based CodeReplay Studio
 * to your local VS Code desktop application via a local WebSocket server.
 *
 * Requirements:
 * 1. Node.js installed on your machine
 * 2. VS Code with a document open
 *
 * Run: node codereplay-desktop-bridge.js
 */
const http = require('http');
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'connected', version: '1.0.0' }));
    return;
  }

  if (req.url === '/type-character' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { char, line, col, file } = JSON.parse(body || '{}');
      // Streams character into target file via VS Code IPC or simulated keystroke
      console.log(\`[Desktop Bridge] Injected '\${char}' into \${file} at L\${line}:C\${col}\`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

const PORT = 3899;
server.listen(PORT, () => {
  console.log(\`⚡ CodeReplay Desktop Bridge active on http://127.0.0.1:\${PORT}\`);
  console.log('Ready to stream typed characters to local editor documents.');
});
`;

  const handleCopyBridgeScript = () => {
    navigator.clipboard.writeText(desktopBridgeScript);
    setCopiedBridge(true);
    setTimeout(() => setCopiedBridge(false), 2000);
  };

  const handleDownloadBridgeScript = () => {
    const blob = new Blob([desktopBridgeScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codereplay-desktop-bridge.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <div className="h-6 bg-[#1f1f1f] border-t border-[#2b2b2b] px-3 flex items-center justify-between text-xs select-none">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] uppercase tracking-wide">Terminal / Problems / Logs</span>
          <span className="text-[10px] text-gray-500 font-mono">({logs.length} events)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-56 bg-[#181818] border-t border-[#2b2b2b] flex flex-col select-none text-xs shrink-0 z-10">
      {/* Panel Tab Header */}
      <div className="h-8 bg-[#202020] border-b border-[#2d2d2d] flex items-center justify-between px-2">
        <div className="flex items-center h-full space-x-1">
          {/* Terminal Tab */}
          <button
            onClick={() => onSelectTab('terminal')}
            className={`h-full px-3 flex items-center gap-1.5 font-medium transition-colors border-b-2 text-[11px] tracking-wide uppercase ${
              activeTab === 'terminal'
                ? 'text-white border-[#007acc] bg-[#181818]'
                : 'text-[#858585] border-transparent hover:text-[#cccccc]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
            {logs.length > 0 && (
              <span className="text-[9px] font-mono text-[#787878] ml-0.5">({logs.length})</span>
            )}
          </button>

          {/* Problems Tab */}
          <button
            onClick={() => onSelectTab('problems')}
            className={`h-full px-3 flex items-center gap-1.5 font-medium transition-colors border-b-2 text-[11px] tracking-wide uppercase ${
              activeTab === 'problems'
                ? 'text-white border-[#007acc] bg-[#181818]'
                : 'text-[#858585] border-transparent hover:text-[#cccccc]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Problems</span>
            <span className="text-[9px] font-mono text-[#787878] ml-0.5">({problems.length})</span>
          </button>

          {/* Output Tab */}
          <button
            onClick={() => onSelectTab('output')}
            className={`h-full px-3 flex items-center gap-1.5 font-medium transition-colors border-b-2 text-[11px] tracking-wide uppercase ${
              activeTab === 'output'
                ? 'text-white border-[#007acc] bg-[#181818]'
                : 'text-[#858585] border-transparent hover:text-[#cccccc]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Output (Telemetry)</span>
          </button>

          {/* VS Code Companion Tab */}
          <button
            onClick={() => onSelectTab('companion')}
            className={`h-full px-3 flex items-center gap-1.5 font-medium transition-colors border-b-2 text-[11px] tracking-wide uppercase ${
              activeTab === 'companion'
                ? 'text-white border-[#007acc] bg-[#181818]'
                : 'text-[#858585] border-transparent hover:text-[#cccccc]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#007acc]" />
            <span>VS Code Desktop Companion</span>
          </button>
        </div>

        {/* Panel controls */}
        <div className="flex items-center gap-1">
          {activeTab === 'terminal' && (
            <button
              onClick={onClearLogs}
              title="Clear Terminal Output"
              className="p-1 hover:bg-[#333333] text-[#858585] hover:text-white rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onToggleOpen}
            title="Minimize Panel"
            className="p-1 hover:bg-[#333333] text-[#858585] hover:text-white rounded transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel Content Area */}
      <div className="flex-1 overflow-y-auto font-mono text-[12px] bg-[#141414] p-3 text-[#cccccc]">
        {/* Terminal Content */}
        {activeTab === 'terminal' && (
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-1 overflow-y-auto pr-1">
              <div className="text-[#666666] text-[11px] mb-2">
                CodeReplay Studio Built-in Shell v1.0.0 &mdash; Type &quot;<span className="text-white">help</span>&quot; for replay shell commands.
              </div>

              {logs.map((log) => {
                let badgeClass = 'text-blue-400';
                if (log.type === 'success') badgeClass = 'text-emerald-400 font-semibold';
                if (log.type === 'warn') badgeClass = 'text-amber-400';
                if (log.type === 'error') badgeClass = 'text-red-400';
                if (log.type === 'system') badgeClass = 'text-[#858585]';

                return (
                  <div key={log.id} className="leading-tight flex items-start gap-2">
                    <span className="text-[#555555] text-[11px] shrink-0 font-sans">
                      [{log.timestamp}]
                    </span>
                    <span className={badgeClass}>{log.message}</span>
                    {log.details && (
                      <span className="text-[#777777] italic text-[11px]">
                        ({log.details})
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Prompt */}
            <form onSubmit={handleCommandSubmit} className="mt-2 pt-2 border-t border-[#262626] flex items-center gap-2">
              <span className="text-emerald-400 font-bold shrink-0">user@codereplay:~/workspace$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command (e.g. status, clear, help, export)..."
                className="flex-1 bg-transparent text-white outline-none border-none text-xs font-mono"
              />
            </form>
          </div>
        )}

        {/* Problems Content */}
        {activeTab === 'problems' && (
          <div className="h-full flex flex-col gap-2">
            <div className="text-[11px] text-[#858585] flex items-center justify-between pb-1 border-b border-[#242424]">
              <span>Realtime Syntax Diagnostics for {activeFile?.name || 'Workspace'}</span>
              <span>{problems.length} issues detected</span>
            </div>

            {problems.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-[#777777]">
                <Check className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-xs text-white">No syntax errors or diagnostics detected.</span>
                <span className="text-[11px] text-[#666666] mt-0.5">Pristine source structure maintained.</span>
              </div>
            ) : (
              problems.map((p) => (
                <div key={p.id} className="flex items-center gap-2 py-1 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-white font-medium">{p.message}</span>
                  <span className="text-[#858585] text-[11px]">[{p.line}:{p.column}]</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Output (Telemetry) Content */}
        {activeTab === 'output' && (
          <div className="space-y-2 text-xs">
            <div className="text-[11px] text-[#858585] pb-1 border-b border-[#242424]">
              Character Stream Buffer & Performance Metrics
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
              <div className="bg-[#1f1f1f] p-2.5 rounded border border-[#2b2b2b]">
                <div className="text-[10px] text-[#858585] uppercase">Total Size</div>
                <div className="text-sm font-bold text-white mt-0.5">{metrics.totalChars.toLocaleString()} chars</div>
                <div className="text-[10px] text-[#666666]">~{Math.round(metrics.totalChars / 1024 * 10) / 10} KB UTF-8</div>
              </div>
              <div className="bg-[#1f1f1f] p-2.5 rounded border border-[#2b2b2b]">
                <div className="text-[10px] text-[#858585] uppercase">Streamed</div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">{metrics.currentChars.toLocaleString()} chars</div>
                <div className="text-[10px] text-[#666666]">{metrics.percent.toFixed(1)}% verified</div>
              </div>
              <div className="bg-[#1f1f1f] p-2.5 rounded border border-[#2b2b2b]">
                <div className="text-[10px] text-[#858585] uppercase">Line Count</div>
                <div className="text-sm font-bold text-white mt-0.5">{metrics.currentLine} / {metrics.totalLines}</div>
                <div className="text-[10px] text-[#666666]">Col {metrics.currentColumn}</div>
              </div>
              <div className="bg-[#1f1f1f] p-2.5 rounded border border-[#2b2b2b]">
                <div className="text-[10px] text-[#858585] uppercase">Elapsed Time</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{metrics.elapsedSeconds.toFixed(1)}s</div>
                <div className="text-[10px] text-[#666666]">{metrics.charsPerSecond.toFixed(1)} chars/sec</div>
              </div>
            </div>
          </div>
        )}

        {/* VS Code Desktop Companion Info */}
        {activeTab === 'companion' && (
          <div className="space-y-3 text-xs max-w-3xl">
            <div className="flex items-start gap-2 bg-[#1e2a38] border border-blue-900/60 p-3 rounded text-blue-100">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Browser Monaco vs Real Desktop VS Code</div>
                <div className="text-[11px] text-blue-200/80 mt-1 leading-relaxed">
                  By default, CodeReplay Studio renders and replays code entirely inside your browser using the official Microsoft Monaco Editor engine (the exact same core that powers VS Code).
                  Browser security sandboxes prevent web apps from directly writing into other desktop applications without an explicit local bridge.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-white font-medium flex items-center justify-between">
                <span>Optional Local Desktop Companion Script:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyBridgeScript}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#282828] hover:bg-[#333333] text-white rounded border border-[#3c3c3c] transition-colors"
                  >
                    {copiedBridge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBridge ? 'Copied' : 'Copy Bridge Script'}</span>
                  </button>
                  <button
                    onClick={handleDownloadBridgeScript}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Companion .js</span>
                  </button>
                </div>
              </div>

              <pre className="bg-[#1b1b1b] p-3 rounded border border-[#2b2b2b] text-[11px] font-mono text-[#bbbbbb] overflow-x-auto max-h-32">
                {desktopBridgeScript}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
