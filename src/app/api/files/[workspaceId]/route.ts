import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler: Reads file tree or a single file's content from the database
export async function GET(request: NextRequest, { params }: { params: { workspaceId: string } }) {
    // The 'workspaceId' from the URL is actually the workspace NAME.
    const workspaceName = params.workspaceId;
    const fileId = request.nextUrl.searchParams.get('fileId');

    try {
        // First, find the workspace by its NAME to get its actual database ID.
        const workspace = await prisma.workspace.findFirst({
            where: { name: workspaceName },
        });

        // If the workspace doesn't exist, we can't find any files.
        if (!workspace) {
            // Return an empty array if workspace is not found, so the frontend shows an empty list.
            return NextResponse.json([], { status: 200 }); 
        }

        if (fileId) {
            // If a fileId is provided, fetch that single file's content
            const file = await prisma.file.findUnique({
                where: { id: fileId, workspaceId: workspace.id }, // Use the found workspace.id
            });

            if (!file) {
                return NextResponse.json({ error: 'File not found.' }, { status: 404 });
            }
            return new NextResponse(file.content, { headers: { 'Content-Type': 'text/plain' } });

        } else {
            // Otherwise, fetch the list of files for the workspace using the found ID
            const files = await prisma.file.findMany({
                where: { workspaceId: workspace.id }, // Use the found workspace.id
                select: { id: true, name: true },
            });

            // Format the data to match what the frontend FileTree component expects
            const fileTree = files.map(file => ({
                id: file.id,
                type: 'file',
                name: file.name,
            }));

            return NextResponse.json(fileTree);
        }
    } catch (error) {
        console.error('API GET Error:', error);
        return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
    }
}

// POST handler: Saves file content to the database
export async function POST(request: NextRequest, { params }: { params: { workspaceId: string } }) {
    // The 'workspaceId' from the URL is the workspace NAME.
    const workspaceName = params.workspaceId;

    try {
        // Find the workspace by its NAME to get its ID for the database query.
        const workspace = await prisma.workspace.findFirst({
            where: { name: workspaceName },
        });

        if (!workspace) {
            return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
        }

        const { fileId, content } = await request.json();
        if (!fileId || content === undefined) {
            return NextResponse.json({ error: 'File ID and content are required.' }, { status: 400 });
        }

        // Use the found workspace.id to ensure the file belongs to the correct workspace
        await prisma.file.update({
            where: { id: fileId, workspaceId: workspace.id }, 
            data: { content: content },
        });

        return NextResponse.json({ message: 'File saved successfully.' });
    } catch (error) {
        console.error('API POST Error:', error);
        return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
    }
}

