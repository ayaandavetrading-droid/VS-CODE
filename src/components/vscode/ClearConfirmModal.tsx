import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  charCount: number;
}

export const ClearConfirmModal: React.FC<ClearConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  charCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#252526] border border-[#454545] rounded-lg shadow-2xl max-w-md w-full overflow-hidden text-[#cccccc] text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Confirm Clear Source Code</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-[#858585] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-[#d4d4d4] leading-relaxed">
            Are you sure you want to clear the source code buffer? This will delete{' '}
            <strong className="text-white font-mono">{charCount.toLocaleString()}</strong> characters of source code and reset the replay simulator.
          </p>
          <div className="p-2.5 bg-[#1e1e1e] border border-[#333333] rounded text-[11px] text-[#888888]">
            Tip: If you only want to restart replay from the first character, use <strong className="text-[#cccccc]">Restart</strong> or <strong className="text-[#cccccc]">Reset</strong> instead of clearing your source code.
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 bg-[#202020] border-t border-[#333333] flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded bg-[#3a3d41] hover:bg-[#45494e] text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded bg-red-700 hover:bg-red-600 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Source Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
