import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ReplayState, 
  ReplaySpeedPreset, 
  ReplayConfig, 
  ReplayMetrics, 
  LogEntry 
} from '../types';

interface UseReplayEngineProps {
  sourceCode: string;
  filename: string;
  onLog: (message: string, type?: LogEntry['type'], details?: string) => void;
}

export function useReplayEngine({
  sourceCode,
  filename,
  onLog,
}: UseReplayEngineProps) {
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [status, setStatus] = useState<ReplayState>('idle');
  const [config, setConfig] = useState<ReplayConfig>({
    preset: 'normal',
    customMs: 25,
    naturalCadence: true,
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Refs for tracking mutable loop state across re-renders
  const timerRef = useRef<any>(null);
  const elapsedTimerRef = useRef<any>(null);
  const currentOffsetRef = useRef<number>(0);
  const sourceCodeRef = useRef<string>(sourceCode);
  const configRef = useRef<ReplayConfig>(config);
  const statusRef = useRef<ReplayState>(status);
  const startTimeRef = useRef<number>(0);

  // Keep refs in sync
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

  // Determine delay in milliseconds for the current character
  const getDelayForChar = useCallback((char: string, nextChar?: string) => {
    const { preset, customMs, naturalCadence } = configRef.current;
    
    let baseMs = 25;
    if (preset === 'very_slow') baseMs = 120;
    else if (preset === 'slow') baseMs = 60;
    else if (preset === 'normal') baseMs = 25;
    else if (preset === 'fast') baseMs = 8;
    else if (preset === 'turbo') baseMs = 2;
    else if (preset === 'custom') baseMs = customMs;

    if (!naturalCadence) return baseMs;

    // Realistic human cadence variations
    if (char === '\n') {
      return baseMs * 3.5; // Natural pause after finishing a line
    }
    if (char === ';' || char === '{' || char === '}') {
      return baseMs * 2.0; // Punctuation pause
    }
    if (char === ' ' && nextChar === ' ') {
      return Math.max(2, baseMs * 0.4); // Faster for indentation runs
    }
    // Random human jitter (+/- 25%)
    const jitter = (Math.random() - 0.5) * 0.5;
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

    const tick = () => {
      const src = sourceCodeRef.current;
      const cur = currentOffsetRef.current;

      if (cur >= src.length) {
        setStatus('completed');
        statusRef.current = 'completed';
        stopTimer();
        onLog(`Replay completed for "${filename}". All ${src.length} characters rendered.`, 'success');
        return;
      }

      // In turbo mode, insert a chunk of characters per frame for responsiveness
      const isTurbo = configRef.current.preset === 'turbo';
      const chunkSize = isTurbo ? Math.min(6, src.length - cur) : 1;
      const nextOffset = cur + chunkSize;

      setCurrentOffset(nextOffset);
      currentOffsetRef.current = nextOffset;

      if (nextOffset >= src.length) {
        setStatus('completed');
        statusRef.current = 'completed';
        stopTimer();
        onLog(`Replay completed for "${filename}". All ${src.length} characters rendered.`, 'success');
        return;
      }

      // Schedule subsequent character
      const currentChar = src[nextOffset - 1];
      const nextChar = src[nextOffset];
      const delay = getDelayForChar(currentChar, nextChar);

      timerRef.current = setTimeout(tick, delay);
    };

    const firstDelay = getDelayForChar(sourceCodeRef.current[currentOffsetRef.current] || ' ');
    timerRef.current = setTimeout(tick, firstDelay);

    // Elapsed timer
    if (!elapsedTimerRef.current) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 0.5);
      }, 500);
    }
  }, [stopTimer, getDelayForChar, onLog, filename]);

  // Controls:
  const start = useCallback(() => {
    const src = sourceCodeRef.current;
    if (!src) {
      onLog('Cannot start replay: No source code loaded.', 'warn');
      return;
    }

    // If already complete or at end, start from 0
    if (currentOffsetRef.current >= src.length) {
      setCurrentOffset(0);
      currentOffsetRef.current = 0;
      setElapsedSeconds(0);
    }

    setStatus('playing');
    statusRef.current = 'playing';
    startTimeRef.current = Date.now();
    onLog(`Replay started for "${filename}" (${src.length} chars). Preset: ${configRef.current.preset}.`, 'info');
    scheduleNextChar();
  }, [scheduleNextChar, onLog, filename]);

  const pause = useCallback(() => {
    stopTimer();
    setStatus('paused');
    statusRef.current = 'paused';
    onLog(`Replay paused at character ${currentOffsetRef.current} of ${sourceCodeRef.current.length}.`, 'info');
  }, [stopTimer, onLog]);

  const resume = useCallback(() => {
    if (currentOffsetRef.current >= sourceCodeRef.current.length) {
      onLog('Already at end of source code. Use Restart to replay.', 'info');
      return;
    }
    setStatus('playing');
    statusRef.current = 'playing';
    onLog(`Replay resumed from character ${currentOffsetRef.current}.`, 'info');
    scheduleNextChar();
  }, [scheduleNextChar, onLog]);

  const restart = useCallback(() => {
    stopTimer();
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setElapsedSeconds(0);
    setStatus('idle');
    statusRef.current = 'idle';
    onLog(`Replay restarted from character 0 for "${filename}".`, 'info');
  }, [stopTimer, onLog, filename]);

  const reset = useCallback(() => {
    stopTimer();
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setElapsedSeconds(0);
    setStatus('idle');
    statusRef.current = 'idle';
    onLog(`Editor output reset. Source code preserved in memory.`, 'info');
  }, [stopTimer, onLog]);

  const stepLine = useCallback(() => {
    stopTimer();
    const src = sourceCodeRef.current;
    const cur = currentOffsetRef.current;

    if (cur >= src.length) {
      setStatus('completed');
      return;
    }

    // Find next newline
    const nextNewline = src.indexOf('\n', cur);
    const targetOffset = nextNewline === -1 ? src.length : nextNewline + 1;

    setCurrentOffset(targetOffset);
    currentOffsetRef.current = targetOffset;
    
    if (targetOffset >= src.length) {
      setStatus('completed');
      onLog(`Step line reached end of source. Replay complete.`, 'success');
    } else {
      setStatus('paused');
      onLog(`Step line advanced to character ${targetOffset} (next line).`, 'info');
    }
  }, [stopTimer, onLog]);

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
      onLog(`Step char reached end of source. Replay complete.`, 'success');
    } else {
      setStatus('paused');
    }
  }, [stopTimer, onLog]);

  const finish = useCallback(() => {
    stopTimer();
    const src = sourceCodeRef.current;
    setCurrentOffset(src.length);
    currentOffsetRef.current = src.length;
    setStatus('completed');
    statusRef.current = 'completed';
    onLog(`Replay fast-forwarded to finish for "${filename}". 100% matched.`, 'success');
  }, [stopTimer, onLog, filename]);

  // Adjust speed presets dynamically
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

  // Load new source code into the engine
  const loadSource = useCallback((newSource: string, newFilename?: string) => {
    stopTimer();
    sourceCodeRef.current = newSource;
    setCurrentOffset(0);
    currentOffsetRef.current = 0;
    setElapsedSeconds(0);
    setStatus('idle');
    statusRef.current = 'idle';
    const lines = newSource ? newSource.split('\n').length : 0;
    onLog(`Loaded source code for "${newFilename || filename}" (${newSource.length} chars, ${lines} lines).`, 'info');
  }, [stopTimer, onLog, filename]);

  // Clean up timers on unmount
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
