// src/app/api/files/[workspaceId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

const workspacesDir = path.join(process.cwd(), 'workspaces');

// (Keep the type definitions and getFileTree function from the previous step)
type FileNode = { type: 'file'; name: string };
type FolderNode = { type: 'folder'; name: string; children: TreeNode[] };
type TreeNode = FileNode | FolderNode;
async function getFileTree(dir: string): Promise<TreeNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const tree: TreeNode[] = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return {
          type: 'folder',
          name: entry.name,
          children: await getFileTree(fullPath),
        } as FolderNode;
      } else {
        return {
          type: 'file',
          name: entry.name,
        } as FileNode;
      }
    })
  );
  return tree;
}


// GET handler: Now handles both listing the tree and reading a single file
export async function GET(
  request: NextRequest, // Use NextRequest to access searchParams
  { params }: { params: { workspaceId: string } }
) {
  const { workspaceId } = params;
  const workspacePath = path.join(workspacesDir, workspaceId);
  const filePath = request.nextUrl.searchParams.get('path'); // Check for a 'path' query parameter

  try {
    await fs.ensureDir(workspacePath);

    if (filePath) {
      // If a file path is provided, read and return its content
      const fullPath = path.join(workspacePath, filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } });
    } else {
      // Otherwise, return the file tree
      const fileTree = await getFileTree(workspacePath);
      return NextResponse.json(fileTree);
    }
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}

// POST handler: Writes content to a specified file
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  const { workspaceId } = params;
  const workspacePath = path.join(workspacesDir, workspaceId);

  try {
    const { filePath, content } = await request.json();
    if (!filePath || content === undefined) {
      return NextResponse.json({ error: 'File path and content are required.' }, { status: 400 });
    }
    
    const fullPath = path.join(workspacePath, filePath);
    await fs.writeFile(fullPath, content); // Write the new content to the file
    
    return NextResponse.json({ message: 'File saved successfully.' });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
  }
}