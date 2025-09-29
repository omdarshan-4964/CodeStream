import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

const workspacesDir = path.join(process.cwd(), 'workspaces');

// Type definitions for the file tree structure
type FileNode = { type: 'file'; name: string };
type FolderNode = { type: 'folder'; name: string; children: TreeNode[] };
type TreeNode = FileNode | FolderNode;

// Recursive function to read the directory structure
async function getFileTree(dir: string): Promise<TreeNode[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map(async (dirent): Promise<TreeNode> => {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                return {
                    type: 'folder',
                    name: dirent.name,
                    children: await getFileTree(res),
                };
            } else {
                return {
                    type: 'file',
                    name: dirent.name,
                };
            }
        })
    );
    return files;
}

// GET handler for listing files or reading a single file's content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
    const { workspaceId } = context.params;
    const workspacePath = path.join(workspacesDir, workspaceId);
    const filePath = request.nextUrl.searchParams.get('path');

    try {
        await fs.ensureDir(workspacePath);

        if (filePath) {
            const fullPath = path.join(workspacePath, filePath);
            const content = await fs.readFile(fullPath, 'utf8');
            return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } });
        } else {
            const fileTree = await getFileTree(workspacePath);
            return NextResponse.json(fileTree);
        }
    } catch (error) {
        console.error('API GET Error:', error);
        return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
    }
}

// POST handler for writing content to a file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: NextRequest, context: any) {
    const { workspaceId } = context.params;
    const workspacePath = path.join(workspacesDir, workspaceId);

    try {
        const { filePath, content } = await request.json();
        if (!filePath || content === undefined) {
            return NextResponse.json({ error: 'File path and content are required.' }, { status: 400 });
        }
        
        const fullPath = path.join(workspacePath, filePath);
        await fs.writeFile(fullPath, content);
        
        return NextResponse.json({ message: 'File saved successfully.' });
    } catch (error) {
        console.error('API POST Error:', error);
        return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
    }
}
