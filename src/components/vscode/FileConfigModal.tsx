import React, { useState, useEffect } from 'react';
import { FileEdit, X, Check, Code } from 'lucide-react';
import { SUPPORTED_LANGUAGES, detectLanguageFromFilename } from '../../utils/languageMap';

interface FileConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilename: string;
  currentLanguageId: string;
  onSave: (filename: string, languageId: string) => void;
}

export const FileConfigModal: React.FC<FileConfigModalProps> = ({
  isOpen,
  onClose,
  currentFilename,
  currentLanguageId,
  onSave,
}) => {
  const [filename, setFilename] = useState(currentFilename);
  const [languageId, setLanguageId] = useState(currentLanguageId);

  useEffect(() => {
    setFilename(currentFilename);
    setLanguageId(currentLanguageId);
  }, [currentFilename, currentLanguageId, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'Enter' && isOpen && (e.ctrlKey || e.metaKey)) {
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filename, languageId]);

  if (!isOpen) return null;

  const handleFilenameChange = (val: string) => {
    setFilename(val);
    if (val.trim()) {
      const detected = detectLanguageFromFilename(val.trim());
      if (detected.id !== 'plaintext') {
        setLanguageId(detected.id);
      }
    }
  };

  const handleSave = () => {
    if (filename.trim()) {
      onSave(filename.trim(), languageId);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="bg-[#252526] border border-[#454545] rounded-lg shadow-2xl w-full max-w-md overflow-hidden text-[#cccccc] text-xs flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1e1e1e] border-b border-[#3c3c3c] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <FileEdit className="w-4 h-4 text-[#007acc]" />
            <span>Filename &amp; Language Mode</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#858585] hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-[#333333]"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#858585] uppercase tracking-wider mb-1">
              Document Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => handleFilenameChange(e.target.value)}
              placeholder="e.g. ecoart-works (1).html"
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007acc] px-2.5 py-1.5 rounded text-white text-xs outline-none font-mono"
              autoFocus
            />
            <p className="text-[10px] text-[#666666] mt-1">
              Extension auto-configures the Monaco Editor language syntax.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#858585] uppercase tracking-wider mb-1">
              Syntax Highlighting Mode
            </label>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007acc] px-2.5 py-1.5 rounded text-white text-xs outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.extension})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-[#333333] flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#2a2d2e] hover:bg-[#373a3c] text-[#cccccc] border border-[#3c3c3c] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-medium flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
