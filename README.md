# CodeReplay Studio — VS Code Coding Simulator

**CodeReplay Studio** is a realistic, interactive Visual Studio Code coding simulator built with React, TypeScript, and Microsoft Monaco Editor. It empowers creators, educators, video producers, and developers to load or paste their exact source code into a private input panel, hide or show the panel at will, and replay the code progressively inside a real code editor, line-by-line and character-by-character.

---

## Key Features

### 1. Visual Studio Code Aesthetic & Workflow
- **Dark VS Code Theme**: Accurate `#1e1e1e` editor canvas, `#252526` file explorer, `#2c2c2c` activity bar, and `#007acc` status bar.
- **Activity Bar**: Quick navigation for Explorer, Source Code panel toggle, Search, Git status, Replayer controls, and Desktop Companion.
- **Monaco Editor Core**: Powered by `@monaco-editor/react`, the same core technology powering Visual Studio Code desktop, featuring syntax highlighting, code folding, minimap, and bracket colorization.
- **Status Bar**: Realtime status reporting line and column positions (`Ln X, Col Y`), character counters, encoding (`UTF-8`), indentation, and active language mode.

### 2. Dedicated Source Code Input Panel
- **Pristine Source Storage**: Text is preserved with 100% fidelity, including indentation, tabs, blank lines, Unicode characters, and comments.
- **Hide / Show Panel**: Users can hide the source panel once loaded. The replay engine retains the code in memory and continues writing. Revealing the panel restores the source without alteration.
- **Language Selector**: Supports Python, TypeScript, JavaScript, HTML, CSS, Java, C#, SQL, Rust, Go, C++, JSON, Markdown, and Plain Text.
- **Sample Snippets**: Preloaded with production-grade samples for one-click testing.
- **Safe Clear Confirmation**: Prevents accidental data loss by prompting the user before clearing code.

### 3. Drift-Free Replay Engine
- **Accurate Character Tracking**: Progressively streams character slices `sourceCode.slice(0, currentOffset)` into the Monaco model.
- **Active Cursor & Auto-Scroll**: Cursor locks to the current character and automatically scrolls the view as code grows.
- **Adjustable Replay Speed**:
  - Very Slow (120ms/char)
  - Slow (60ms/char)
  - Normal (25ms/char)
  - Fast (8ms/char)
  - Turbo (Instant batched rendering)
  - Custom (User-defined millisecond delay)
- **Natural Human Cadence (Optional)**: Simulates natural typing cadence with micro-pauses at newlines, indentation bursts, and punctuation.

### 4. Comprehensive Playback Controls
- **Start**: Initiates replay from character 0.
- **Pause**: Freezes the insertion at the current character without losing progress.
- **Resume**: Continues playback from the exact paused position.
- **Restart**: Returns to the first character and prepares to replay.
- **Reset**: Clears editor output and resets position while preserving the source code in memory.
- **Step Line**: Advances typing to the next newline.
- **Step Character**: Inserts exactly one single character.
- **Finish**: Instantly inserts all remaining characters and completes playback.

### 5. Multi-File Explorer & Project Workspace
- Create and switch between multiple virtual projects.
- Add, rename, switch, and delete files.
- Each file maintains its own independent replay state and character offset.
- Download individual files directly.
- Export the entire project as a `.zip` archive via `JSZip`.

### 6. Interactive Terminal & Telemetry
- Real bash-like terminal prompt (`user@codereplay:~/workspace$`).
- Genuine replay event logging (no fabricated build outputs or mock successes).
- Built-in commands: `help`, `status`, `start`, `pause`, `resume`, `restart`, `step`, `finish`, `speed <val>`, `ls`, `cat <file>`, `export`, `clear`.
- Output tab showing character stream telemetry, byte size, and insertion rate.

### 7. Optional VS Code Desktop Companion
- Distinguishes clearly between browser Monaco and desktop VS Code.
- Provides a Node.js companion bridge script (`codereplay-desktop-bridge.js`) allowing stream integration into local VS Code windows.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `F5` | Start Replay / Resume Replay |
| `F6` | Pause Replay |
| `F8` | Fast-Forward to Finish |
| `Ctrl+P` / `⌘P` | Open Command Palette / Quick Open |
| `Ctrl+S` / `⌘S` | Show / Hide Source Code Panel |
| `Ctrl+E` / `⌘E` | Export Project as ZIP |

---

## Development & Local Setup

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript compilation and lint checks
npm run lint

# Build for production
npm run build
```
