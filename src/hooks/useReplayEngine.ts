import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ReplayState, 
  ReplaySpeedPreset, 
  ReplayConfig, 
  ReplayMetrics, 
  LogEntry 
} from '../types';

interface UseReplayEngineProps {
  fileId: string;
  sourceCode: string;
  filename: string;
  initialOffset?: number;
  initialStatus?: ReplayState;
  onLog: (message: string, type?: LogEntry['type'], details?: string) => void;
  onOffsetChange?: (fileId: string, newOffset: number, newStatus: ReplayState) => void;
}

export function useReplayEngine({
  fileId,
  sourceCode,
  filename,
  initialOffset = 0,
  initialStatus = 'idle',
  onLog,
  onOffsetChange,
}: UseReplayEngineProps) {
  const [currentOffset, setCurrentOffset] = useState<number>(initialOffset);
  const [status, setStatus] = useState<ReplayState>(initialStatus);
  const [config, setConfig] = useState<ReplayConfig>({
    preset: 'very_slow', // Default to Ultra-Slow / Very Slow playback mode as required
    customMs: 150,
    naturalCadence: false,
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Mutable refs for tracking state across asynchronous ticks
  const timerRef = useRef<any>(null);
  const elapsedTimerRef = useRef<any>(null);
  const currentOffsetRef = useRef<number>(initialOffset);
  const sourceCodeRef = useRef<string>(sourceCode);
  const configRef = useRef<ReplayConfig>(config);
  const statusRef = useRef<ReplayState>(status);
  const fileIdRef = useRef<string>(fileId);
  const filenameRef = useRef<string>(filename);

  // Sync refs when props or states change
  useEffect(() => {
    sourceCodeRef.current = sourceCode;
  }, [sourceCode]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    currentOffsetRef.current = currentOffset;
  }, [currentOffset]);

  useEffect(() => {
    filenameRef.current = filename;
  }, [filename]);

  // Synchronize with external active file switch
  useEffect(() => {
    if (fileId !== fileIdRef.current) {
      // Switched files: stop any pending timers on previous file to avoid cross-file contamination
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      fileIdRef.current = fileId;
      currentOffsetRef.current = initialOffset;
      setCurrentOffset(initialOffset);
      statusRef.current = initialStatus;
      setStatus(initialStatus);
    }
  }, [fileId, initialOffset, initialStatus]);

  // Determine delay in milliseconds for the current character
  const getDelayForChar = useCallback((char: string, nextChar?: string) => {
    const { preset, customMs, naturalCadence } = configRef.current;
    
    let baseMs = 150;
    if (preset === 'very_slow') baseMs = 150; // Ultra-slow deliberate typing
    else if (preset === 'slow') baseMs = 70;
    else if (preset === 'normal') baseMs = 30;
    else if (preset === 'fast') baseMs = 10;
    else if (preset === 'turbo') baseMs = 2;
    else if (preset === 'custom') baseMs = customMs;

    if (!naturalCadence) return baseMs;

    // Realistic human cadence variations
    if (char === '\n') {
      return baseMs * 2.5; // Natural pause after newline
    }
    if (char === ';' || char === '{' || char === '}') {
      return baseMs * 1.8; // Punctuation pause
    }
    if (char === ' ' && nextChar === ' ') {
      return Math.max(2, baseMs * 0.5); // Faster for indentation runs
    }
    const jitter = (Math.random() - 0.5) * 0.3;
    return Math.max(1, Math.round(baseMs * (1 + jitter)));
  }, []);

  // Stop playback timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  // Main replay execution tick
  const scheduleNextChar = useCallback(() => {
    stopTimer();

    const targetFileId = fileIdRef.current;

    const tick = () => {
      // Guard: do not continue if file has changed
      if (fileIdRef.current !== targetFileId) {
        return;
      }

      const src = sourceCodeRef.current;
      const cur = currentOffsetRef.current;

      if (cur >= src.length) {
        setStatus('completed');
        statusRef.current = 'completed';
        stopTimer();
        onOffsetChange?.(targetFileId, src.length, 'completed');
        onLog(`Replay completed for "${filenameRef.current}". All ${src.length} characters accurately rendered.`, 'success');
        return;
      }

      // In turbo mode, insert a chunk of characters per frame for high throughput
      const isTurbo = configRef.current.preset === 'turbo';
      const chunkSize = isTurbo ? Math.min(6, src.length - cur) : 1;
      const nextOffset = cur + chunkSize;

      setCurrentOffset(nextOffset);
      currentOffsetRef.current = nextOffset;
      onOffsetChange?.(targetFileId, nextOffset, 'playing');

      if (nextOffset >= src.length) {
        setStatus('completed');
        statusRef.current = 'completed';
        stopTimer();
        onOffsetChange?.(targetFileId, src.length, 'completed');
        onLog(`Replay completed for "${filenameRef.current}". All ${src.length} characters accurately rendered.`, 'success');
        return;
      }

      // Schedule subsequent character
      const currentChar = src[nextOffset - 1];
      const nextChar = src[nextOffset];
      const delay = getDelayForChar(currentChar, nextChar);

      timerRef.current = setTimeout(tick, delay);
    };

    const firstChar = sourceCodeRef.current[currentOffsetRef.current] || ' ';
    const firstDelay = getDelayForChar(firstChar);
    timerRef.current = setTimeout(tick, firstDelay);

    // Elapsed timer
    if (!elapsedTimerRef.current) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 0.5);
      }, 500);
    }
  }, [stopTimer, getDelayForChar, onLog, onOffsetChange]);

  // Controls:
  const start = useCallback(() => {
    const src = sourceCodeRef.current;
    if (!src) {
      onLog('Cannot start replay: No source code loaded in this file.', 'warn');
      return;
    }

    // If already complete or at end, restart from 0
    if (currentOffsetRef.current >= src.length) {
      setCurrentOffset(0);
      currentOffsetRef.current = 0;
      setElapsedSeconds(0);
    }

    setStatus('playing');
    statusRef.current = 'playing';
    onOffsetChange?.(fileIdRef.current, currentOffsetRef.current, 'playing');
    onLog(`Replay started for "${filenameRef.current}" (${src.length} chars). Speed: ${configRef.current.preset}.`, 'info');
    scheduleNextChar();
  }, [scheduleNextChar, onLog, onOffsetChange]);

  const pause = useCallback(() => {
    stopTimer();
    setStatus('paused');
    statusRef.current = 'paused';
    onOffsetChange?.(fileIdRef.current, currentOffsetRef.current, 'paused');
    onLog(`Replay paused at character ${currentOffsetRef.current} of ${sourceCodeRef.current.length}.`, 'info');
  }, [stopTimer, onLog, onOffsetChange]);

  const resume = useCallback(() => {
    if (currentOffsetRef.current >= sourceCodeRef.current.length) {
      onLog('Already at end of source code. Use Restart to replay from beginning.', 'info');
      return;
    }
    setStatus('playing');
    statusRef.current = 'playing';
    onOffsetChange?.(fileIdRef.current, currentOffsetRef.current, 'playing');
    onLog(`Replay resumed from character ${currentOffsetRef.current}.`, 'info');
    scheduleNextChar();
  }, [scheduleNextChar, onLog, onOffsetChange]);

  const restart = useCallback(() => {
    stopTimer();
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setElapsedSeconds(0);
    setStatus('idle');
    statusRef.current = 'idle';
    onOffsetChange?.(fileIdRef.current, 0, 'idle');
    onLog(`Replay restarted from character 0 for "${filenameRef.current}".`, 'info');
  }, [stopTimer, onLog, onOffsetChange]);

  const reset = useCallback(() => {
    stopTimer();
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setElapsedSeconds(0);
    setStatus('idle');
    statusRef.current = 'idle';
    onOffsetChange?.(fileIdRef.current, 0, 'idle');
    onLog(`Editor output reset. Source code preserved in memory.`, 'info');
  }, [stopTimer, onLog, onOffsetChange]);

  const stepLine = useCallback(() => {
    stopTimer();
    const src = sourceCodeRef.current;
    const cur = currentOffsetRef.current;

    if (cur >= src.length) {
      setStatus('completed');
      return;
    }

    const nextNewline = src.indexOf('\n', cur);
    const targetOffset = nextNewline === -1 ? src.length : nextNewline + 1;

    setCurrentOffset(targetOffset);
    currentOffsetRef.current = targetOffset;
    
    if (targetOffset >= src.length) {
      setStatus('completed');
      statusRef.current = 'completed';
      onOffsetChange?.(fileIdRef.current, targetOffset, 'completed');
      onLog(`Step line reached end of source. Replay complete.`, 'success');
    } else {
      setStatus('paused');
      statusRef.current = 'paused';
      onOffsetChange?.(fileIdRef.current, targetOffset, 'paused');
      onLog(`Step line advanced to character ${targetOffset}.`, 'info');
    }
  }, [stopTimer, onLog, onOffsetChange]);

  const stepChar = useCallback(() => {
    stopTimer();
    const src = sourceCodeRef.current;
    const cur = currentOffsetRef.current;

    if (cur >= src.length) {
      setStatus('completed');
      return;
    }

    const targetOffset = cur + 1;
    setCurrentOffset(targetOffset);
    currentOffsetRef.current = targetOffset;

    if (targetOffset >= src.length) {
      setStatus('completed');
      statusRef.current = 'completed';
      onOffsetChange?.(fileIdRef.current, targetOffset, 'completed');
      onLog(`Step char reached end of source. Replay complete.`, 'success');
    } else {
      setStatus('paused');
      statusRef.current = 'paused';
      onOffsetChange?.(fileIdRef.current, targetOffset, 'paused');
    }
  }, [stopTimer, onLog, onOffsetChange]);

  const finish = useCallback(() => {
    stopTimer();
    const src = sourceCodeRef.current;
    setCurrentOffset(src.length);
    currentOffsetRef.current = src.length;
    setStatus('completed');
    statusRef.current = 'completed';
    onOffsetChange?.(fileIdRef.current, src.length, 'completed');
    onLog(`Replay fast-forwarded to finish for "${filenameRef.current}". 100% matched.`, 'success');
  }, [stopTimer, onLog, onOffsetChange]);

  const setSpeedPreset = useCallback((preset: ReplaySpeedPreset) => {
    setConfig((prev) => ({ ...prev, preset }));
    onLog(`Replay speed set to: ${preset}.`, 'system');
  }, [onLog]);

  const setCustomMs = useCallback((ms: number) => {
    setConfig((prev) => ({ ...prev, customMs: ms, preset: 'custom' }));
    onLog(`Custom speed set to: ${ms}ms/char.`, 'system');
  }, [onLog]);

  const toggleCadence = useCallback(() => {
    setConfig((prev) => {
      const nextCadence = !prev.naturalCadence;
      onLog(`Human typing cadence ${nextCadence ? 'enabled' : 'disabled'}.`, 'system');
      return { ...prev, naturalCadence: nextCadence };
    });
  }, [onLog]);

  const loadSource = useCallback((newSource: string, newFilename?: string) => {
    stopTimer();
    sourceCodeRef.current = newSource;
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setElapsedSeconds(0);
    setStatus('idle');
    statusRef.current = 'idle';
    const lines = newSource ? newSource.split('\n').length : 0;
    onLog(`Loaded source code for "${newFilename || filenameRef.current}" (${newSource.length} chars, ${lines} lines).`, 'info');
  }, [stopTimer, onLog]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Compute live metrics
  const totalChars = sourceCode.length;
  const currentChars = currentOffset;
  const percent = totalChars > 0 ? (currentChars / totalChars) * 100 : 0;
  
  const currentText = sourceCode.slice(0, currentOffset);
  const currentLines = currentText ? currentText.split('\n') : [''];
  const totalLines = sourceCode ? sourceCode.split('\n').length : 0;
  const currentLine = currentLines.length;
  const currentColumn = currentLines[currentLines.length - 1].length + 1;

  const charsPerSecond = elapsedSeconds > 0 ? currentChars / elapsedSeconds : 0;
  const remainingChars = Math.max(0, totalChars - currentChars);
  const estimatedRemainingSeconds = charsPerSecond > 0 ? remainingChars / charsPerSecond : 0;

  const metrics: ReplayMetrics = {
    totalChars,
    currentChars,
    totalLines,
    currentLine,
    currentColumn,
    percent,
    elapsedSeconds,
    estimatedRemainingSeconds,
    charsPerSecond,
  };

  return {
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
  };
}
