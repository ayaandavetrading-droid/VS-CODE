export interface LanguageOption {
  id: string;
  name: string;
  extension: string;
  monacoLang: string;
  defaultFilename: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python', extension: '.py', monacoLang: 'python', defaultFilename: 'main.py' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoLang: 'typescript', defaultFilename: 'index.ts' },
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoLang: 'javascript', defaultFilename: 'app.js' },
  { id: 'html', name: 'HTML', extension: '.html', monacoLang: 'html', defaultFilename: 'index.html' },
  { id: 'css', name: 'CSS', extension: '.css', monacoLang: 'css', defaultFilename: 'styles.css' },
  { id: 'java', name: 'Java', extension: '.java', monacoLang: 'java', defaultFilename: 'Solution.java' },
  { id: 'csharp', name: 'C#', extension: '.cs', monacoLang: 'csharp', defaultFilename: 'Program.cs' },
  { id: 'sql', name: 'SQL', extension: '.sql', monacoLang: 'sql', defaultFilename: 'query.sql' },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoLang: 'rust', defaultFilename: 'main.rs' },
  { id: 'go', name: 'Go', extension: '.go', monacoLang: 'go', defaultFilename: 'main.go' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoLang: 'cpp', defaultFilename: 'main.cpp' },
  { id: 'json', name: 'JSON', extension: '.json', monacoLang: 'json', defaultFilename: 'config.json' },
  { id: 'markdown', name: 'Markdown', extension: '.md', monacoLang: 'markdown', defaultFilename: 'README.md' },
  { id: 'plaintext', name: 'Plain Text', extension: '.txt', monacoLang: 'plaintext', defaultFilename: 'notes.txt' },
];

export function detectLanguageFromFilename(filename: string): LanguageOption {
  const clean = filename.toLowerCase().trim();
  for (const lang of SUPPORTED_LANGUAGES) {
    if (clean.endsWith(lang.extension)) {
      return lang;
    }
  }
  return SUPPORTED_LANGUAGES.find(l => l.id === 'plaintext') || SUPPORTED_LANGUAGES[0];
}

export function getLanguageById(id: string): LanguageOption {
  return SUPPORTED_LANGUAGES.find(l => l.id === id) || SUPPORTED_LANGUAGES[0];
}
