# CodeReplay Studio — VS Code Coding Simulator

**CodeReplay Studio** is a realistic, interactive Visual Studio Code coding simulator built with React, TypeScript, and Microsoft Monaco Editor. It empowers creators, educators, video producers, and developers to load or paste their exact source code into a private input panel, hide or show the panel at will, and replay the code progressively inside a real code editor, line-by-line and character-by-character.

---

## Key Features

### 1. Ultra-Slow Replay (Default Setting)
- **Deliberate, Clear Typing Pace**: The default playback speed is now configured to **Very Slow (150ms/char)** for realistic, high-visibility coding demos and tutorials.
- **Configurable Speed Presets**:
  - **Very Slow** (150ms/char) — *Default*
  - **Slow** (70ms/char)
  - **Normal** (30ms/char)
  - **Fast** (10ms/char)
  - **Turbo** (Instant batched rendering)
  - **Custom** (User-defined millisecond delay between characters)
- **Immediate Pause Response**: Pauses instantly at the exact character without lag or overlapping timers.
- **Pristine Exact Match**: Indentation, blank lines, comments, quotes, and Unicode characters remain 100% unaltered.

### 2. Clean Editor Mode (Focus Editor)
- **Distraction-Free Presentation Layout**: Dedicated **"Focus Editor"** button instantly hides surrounding toolbars, activity bar, sidebar, and terminal, expanding the Monaco editor to fill the workspace.
- **One-Click Restore Layout**: **"Restore Layout"** button and keyboard shortcut (`Escape` or `F11`) immediately bring back the user's previous panel arrangement.
- **Selective Panel Visibility**: Individual toggle controls for Source Code Panel, File Explorer, Activity Bar, Playback Controls, Bottom Terminal Panel, and Status Bar via the top **View** menu or Command Palette.

### 3. Multi-File Editor Tabs with Cross-File Protection
- **Realistic Tab Bar**: File names, file-type icons, active tab highlights, and typing indicators.
- **Tab Closing & Reopening**: Close tabs with `×` and reopen closed files via the `+` dropdown without losing file content or progress.
- **Cross-File Replay Safeguard**: The engine binds typing strictly to the active document; switching tabs pauses or isolates playback so typing never leaks into other files.

### 4. Dedicated Source Code Input Panel
- **Pristine Source Storage**: Text is preserved with 100% fidelity, including tabs, whitespace, and formatting.
- **Hide / Show Panel**: Hide the source panel so your audience sees only the typing canvas. The replay engine keeps the code in memory. Revealing the panel restores the source without alteration.
- **Language Selector**: Supports Python, TypeScript, JavaScript, HTML, CSS, Java, C#, SQL, Rust, Go, C++, JSON, Markdown, and Plain Text.
- **Sample Snippets**: Preloaded with production-grade samples for one-click testing.
- **Safe Clear Confirmation**: Prevents accidental data loss by prompting the user before clearing code.

### 5. Playback Controls & Telemetry
- **Start / Pause / Resume / Restart / Reset**: Comprehensive controls for any presentation pacing.
- **Step Line**: Advance typing by one full line.
- **Step Character**: Advance by a single character.
- **Finish**: Fast-forward to 100% completion.
- **Real Terminal & Telemetry**: Built-in bash-like shell logging real lifecycle events (`help`, `status`, `start`, `pause`, `speed`, `focus`, `restore`, `ls`, `cat`).

### 6. Browser Editor Notice & Optional Desktop Companion
- Accurately identifies as an in-browser Monaco simulator with an optional Node.js desktop companion bridge script (`codereplay-desktop-bridge.js`) for streaming keystrokes to a local desktop VS Code instance.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+Shift+B` / `⌘Shift+B` | **Hide / Reveal Replay Controls Bar** (Smooth, without interrupting replay) |
| `F11` | Toggle Focus Editor Mode (Clean Presentation) |
| `Escape` | Restore Layout (Exit Focus Mode) / Close Modals |
| `F5` | Start Replay / Resume Replay |
| `F6` | Pause Replay Immediately |
| `F8` | Fast-Forward to Finish |
| `Ctrl+P` / `⌘P` | Open Command Palette / Quick Open |
| `Ctrl+B` / `⌘B` | Toggle File Explorer Sidebar |
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
