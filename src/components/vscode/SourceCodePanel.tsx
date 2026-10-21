import React, { useState } from 'react';
import { 
  FileCode, 
  EyeOff, 
  Upload, 
  Trash2, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronDown,
  Maximize2
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageById } from '../../utils/languageMap';
import { SAMPLE_SNIPPETS, SampleSnippet } from '../../utils/sampleSnippets';

interface SourceCodePanelProps {
  sourceText: string;
  onSourceTextChange: (newText: string) => void;
  selectedLanguageId: string;
  onSelectLanguage: (langId: string) => void;
  filename: string;
  onFilenameChange: (name: string) => void;
  onLoadCode: () => void;
  onHideSource: () => void;
  onConfirmClearRequest: () => void;
  isLoaded: boolean;
  totalCharacters: number;
  onEnterFocusMode: () => void;
}

export const SourceCodePanel: React.FC<SourceCodePanelProps> = ({
  sourceText,
  onSourceTextChange,
  selectedLanguageId,
  onSelectLanguage,
  filename,
  onFilenameChange,
  onLoadCode,
  onHideSource,
  onConfirmClearRequest,
  isLoaded,
  totalCharacters,
  onEnterFocusMode,
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const lineCount = sourceText ? sourceText.split('\n').length : 0;
  const charCount = sourceText.length;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langId = e.target.value;
    onSelectLanguage(langId);
    
    // Auto-update extension if filename is still generic
    const currentLang = getLanguageById(langId);
    const baseName = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;
    if (baseName) {
      onFilenameChange(`${baseName}${currentLang.extension}`);
    } else {
      onFilenameChange(currentLang.defaultFilename);
    }
  };

  const handleApplySample = (sample: SampleSnippet) => {
    onSourceTextChange(sample.code);
    onSelectLanguage(sample.languageId);
    onFilenameChange(sample.filename);
    setShowSampleDropdown(false);
  };

  const handleCopy = () => {
    if (!sourceText) return;
    navigator.clipboard.writeText(sourceText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] border-r border-[#2d2d2d] text-[#cccccc] select-none text-xs w-[400px] shrink-0 z-10 shadow-xl">
      {/* Header bar */}
      <div className="h-9 px-3 bg-[#202020] border-b border-[#2d2d2d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#007acc]" />
          <span className="font-semibold text-white tracking-wide text-[12px]">Source Code</span>
          {isLoaded && (
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded font-mono">
              Ready
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onHideSource}
            title="Hide Source Panel (keeps code in memory for replay)"
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#2b2b2b] hover:bg-[#383838] text-[#cccccc] hover:text-white transition-colors text-xs cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#9da5b4]" />
            <span>Hide Source</span>
          </button>
        </div>
      </div>

      {/* Control bar: Language, Filename, Samples */}
      <div className="p-3 bg-[#1e1e1e] border-b border-[#2d2d2d] flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* Language Selector */}
          <div>
            <label className="block text-[10px] text-[#858585] uppercase tracking-wider mb-1 font-medium">
              Language
            </label>
            <select
              value={selectedLanguageId}
              onChange={handleLanguageChange}
              className="w-full bg-[#252526] text-[#cccccc] border border-[#3c3c3c] rounded px-2 py-1.5 text-xs outline-none focus:border-[#007acc] transition-colors cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.extension})
                </option>
              ))}
            </select>
          </div>

          {/* Filename Input */}
          <div>
            <label className="block text-[10px] text-[#858585] uppercase tracking-wider mb-1 font-medium">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => onFilenameChange(e.target.value)}
              placeholder="e.g. main.py"
              className="w-full bg-[#252526] text-[#cccccc] border border-[#3c3c3c] rounded px-2 py-1.5 text-xs outline-none focus:border-[#007acc] transition-colors font-mono"
            />
          </div>
        </div>

        {/* Load Code button & Sample dropdown */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onLoadCode}
            disabled={!sourceText.trim()}
            className={`flex-1 py-1.5 px-3 rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
              sourceText.trim()
                ? 'bg-[#007acc] hover:bg-[#0062a3] text-white cursor-pointer'
                : 'bg-[#2b2b2b] text-[#666666] cursor-not-allowed'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load Code</span>
          </button>

          {/* Enter Focus Mode Button */}
          <button
            onClick={onEnterFocusMode}
            title="Switch directly to distraction-free Clean Editor Mode"
            className="py-1.5 px-2.5 bg-[#25382b] hover:bg-[#2d4735] text-[#89d185] border border-[#3b5e43] rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Focus Mode</span>
          </button>

          {/* Sample Snippet Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSampleDropdown(!showSampleDropdown)}
              className="py-1.5 px-2.5 bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] border border-[#3c3c3c] rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample</span>
              <ChevronDown className="w-3 h-3 text-[#858585]" />
            </button>

            {showSampleDropdown && (
              <div 
                className="absolute right-0 top-full mt-1 w-64 bg-[#252526] border border-[#454545] rounded-md shadow-2xl py-1 z-50"
                onMouseLeave={() => setShowSampleDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[10px] text-[#858585] uppercase font-semibold border-b border-[#333333]">
                  Load Sample Code
                </div>
                {SAMPLE_SNIPPETS.map((sample) => (
                  <button
                    key={sample.title}
                    onClick={() => handleApplySample(sample)}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex flex-col gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-xs text-[#e1e1e1]">{sample.title}</span>
                    <span className="text-[10px] text-[#858585] truncate">{sample.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear button with explicit confirmation */}
          <button
            onClick={onConfirmClearRequest}
            disabled={!sourceText}
            title="Clear Source Code (requires confirmation)"
            className={`p-1.5 rounded border border-[#3c3c3c] text-xs transition-colors ${
              sourceText 
                ? 'bg-[#2a2d2e] hover:bg-red-950 hover:text-red-300 hover:border-red-800 text-[#cccccc] cursor-pointer' 
                : 'bg-[#222222] text-[#555555] cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Code Textarea */}
      <div className="flex-1 flex flex-col p-2.5 bg-[#141414] overflow-hidden">
        <div className="flex items-center justify-between text-[11px] text-[#858585] mb-1.5 px-0.5">
          <span>Paste your source code below:</span>
          {sourceText && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[#007acc] hover:underline cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        <textarea
          value={sourceText}
          onChange={(e) => onSourceTextChange(e.target.value)}
          placeholder={`// Paste your complete code here...\n// Indentation, blank lines, comments, and symbols are 100% preserved.\n// Click "Load Code" then "Start" to replay line by line!`}
          className="flex-1 w-full bg-[#1b1b1b] text-[#d4d4d4] font-mono text-[12px] leading-relaxed p-3 rounded border border-[#2a2a2a] outline-none focus:border-[#007acc] resize-none overflow-auto shadow-inner selection:bg-[#264f78]"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      {/* Footer stats bar */}
      <div className="p-2.5 bg-[#1e1e1e] border-t border-[#2d2d2d] text-[11px] text-[#858585] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span aria-hidden="true">·</span>
          <span>{charCount.toLocaleString()} chars</span>
        </div>
        <div className="text-[10px] text-[#787878]">
          Exact character match guaranteed
        </div>
      </div>
    </div>
  );
};
