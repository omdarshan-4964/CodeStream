import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// **THE FIX:** This line tells Vercel to treat this as a dynamic API route.
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// **FIX:** The function signature for GET has been updated to match Vercel's expected types.
export async function GET(
    request: NextRequest,
    context: { params: { workspaceId: string } }
) {
    const { workspaceId } = context.params; // We now get params from the 'context' object
    const fileId = request.nextUrl.searchParams.get('fileId');

    try {
        const workspace = await prisma.workspace.findFirst({
            where: { name: workspaceId },
        });

        if (!workspace) {
            return NextResponse.json([], { status: 200 });
        }

        if (fileId) {
            const file = await prisma.file.findUnique({
                where: { id: fileId, workspaceId: workspace.id },
            });

            if (!file) {
                return NextResponse.json({ error: 'File not found.' }, { status: 404 });
            }
            return new NextResponse(file.content, { headers: { 'Content-Type': 'text/plain' } });

        } else {
            const files = await prisma.file.findMany({
                where: { workspaceId: workspace.id },
                select: { id: true, name: true },
            });

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

// **FIX:** The function signature for POST has also been updated.
export async function POST(
    request: NextRequest,
    context: { params: { workspaceId: string } }
) {
    const { workspaceId } = context.params; // We get params from the 'context' object here too

    try {
        const workspace = await prisma.workspace.findFirst({
            where: { name: workspaceId },
        });

        if (!workspace) {
            return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
        }

        const { fileId, content } = await request.json();
        if (!fileId || content === undefined) {
            return NextResponse.json({ error: 'File ID and content are required.' }, { status: 400 });
        }

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

