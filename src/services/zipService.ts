import JSZip from 'jszip';
import { WorkspaceProject, WorkspaceFile } from '../types';

export function downloadFile(file: WorkspaceFile): void {
  const content = file.sourceCode;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportProjectAsZip(project: WorkspaceProject): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(project.name) || zip;

  for (const file of project.files) {
    // Add file with its path or name
    folder.file(file.name, file.sourceCode);
  }

  // Also include a lightweight README inside the zip
  folder.file('README.md', `# ${project.name}\n\nExported from CodeReplay Studio on ${new Date().toISOString()}.\nTotal files: ${project.files.length}\n`);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-export.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
