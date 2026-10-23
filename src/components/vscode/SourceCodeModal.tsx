import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  X, 
  Upload, 
  Sparkles, 
  Trash2, 
  Check, 
  Play, 
  AlertTriangle 
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, detectLanguageFromFilename } from '../../utils/languageMap';
import { SAMPLE_SNIPPETS } from '../../utils/sampleSnippets';

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceText: string;
  onSourceTextChange: (text: string) => void;
  filename: string;
  onFilenameChange: (name: string) => void;
  languageId: string;
  onLanguageChange: (langId: string) => void;
  onLoadCode: () => void;
  onClear: () => void;
  totalCharacters: number;
}

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({
  isOpen,
  onClose,
  sourceText,
  onSourceTextChange,
  filename,
  onFilenameChange,
  languageId,
  onLanguageChange,
  onLoadCode,
  onClear,
  totalCharacters,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'templates'>('editor');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const linesCount = sourceText ? sourceText.split('\n').length : 0;
  const wordCount = sourceText ? sourceText.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleFilenameBlur = () => {
    if (filename.trim()) {
      const detected = detectLanguageFromFilename(filename.trim());
      if (detected.id !== 'plaintext') {
        onLanguageChange(detected.id);
      }
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_SNIPPETS[0]) => {
    onFilenameChange(sample.filename);
    onLanguageChange(sample.languageId);
    onSourceTextChange(sample.code);
    setActiveTab('editor');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="bg-[#252526] border border-[#454545] rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden text-[#cccccc] text-xs flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1e1e1e] border-b border-[#3c3c3c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <FileCode className="w-4 h-4 text-[#007acc]" />
            <span>Configure Source Code &mdash; DeskPilot Replay Buffer</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#858585] hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-[#333333]"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#1f1f1f] border-b border-[#333333] px-3">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? 'border-[#007acc] text-white bg-[#252526]'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            Source Code Buffer
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates'
                ? 'border-[#007acc] text-white bg-[#252526]'
                : 'border-transparent text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Templates ({SAMPLE_SNIPPETS.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        {activeTab === 'editor' ? (
          <div className="p-4 flex flex-col flex-1 overflow-hidden space-y-3">
            {/* Top inputs: Filename & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#858585] uppercase tracking-wider mb-1">
                  Filename
                </label>
                <input 
                  type="text"
                  value={filename}
                  onChange={(e) => onFilenameChange(e.target.value)}
                  onBlur={handleFilenameBlur}
                  placeholder="e.g. ecoart-works (1).html"
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007acc] px-2.5 py-1.5 rounded text-white text-xs outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#858585] uppercase tracking-wider mb-1">
                  Language Syntax
                </label>
                <select
                  value={languageId}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007acc] px-2 py-1.5 rounded text-white text-xs outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name} ({lang.extension})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 flex flex-col min-h-[260px]">
              <div className="flex items-center justify-between text-[11px] text-[#858585] mb-1">
                <span>Paste or edit your exact source code below (whitespace and indent preserved):</span>
                <span className="font-mono text-[#4ec9b0]">
                  {linesCount} lines · {totalCharacters.toLocaleString()} chars · {wordCount} words
                </span>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => onSourceTextChange(e.target.value)}
                placeholder="Paste your source code here (Python, HTML, CSS, JavaScript, TypeScript, C#, etc.)..."
                spellCheck={false}
                className="w-full h-64 bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007acc] rounded p-3 text-[#d4d4d4] font-mono text-xs leading-relaxed resize-none outline-none overflow-y-auto selection:bg-[#264f78]"
              />
            </div>

            {/* Footer Stats & Actions */}
            <div className="pt-2 border-t border-[#333333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-700/60 px-2 py-1 rounded">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-200 text-[11px]">Clear all code?</span>
                    <button
                      onClick={() => {
                        onClear();
                        setShowClearConfirm(false);
                      }}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-semibold cursor-pointer"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-0.5 bg-[#333333] hover:bg-[#444444] text-white rounded text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="px-2.5 py-1.5 rounded bg-[#2a2d2e] hover:bg-red-900/40 text-[#858585] hover:text-red-300 border border-[#3c3c3c] flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Clear Buffer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Code</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] border border-[#3c3c3c] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onLoadCode();
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Load Code &amp; Sync to Replay</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Templates Tab */
          <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
            <p className="text-xs text-[#858585]">
              Choose a preloaded template to immediately load code, filename, and syntax highlighting:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAMPLE_SNIPPETS.map((snippet, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(snippet)}
                  className="p-3 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2d2e] border border-[#333333] hover:border-[#007acc] cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white group-hover:text-blue-400 transition-colors text-xs">
                        {snippet.title}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#2d2d2d] text-[#858585]">
                        {snippet.languageId}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#858585] mb-2 leading-relaxed">
                      {snippet.description}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#666666] pt-2 border-t border-[#2d2d2d]">
                    <span className="font-mono text-[#888888]">{snippet.filename}</span>
                    <span className="text-[#007acc] group-hover:underline flex items-center gap-1 font-medium">
                      Load &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
