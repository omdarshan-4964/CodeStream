'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import CodeEditor from '@/components/Editor';
import FileTree from '@/components/FileTree';

// Define the precise structure for WebSocket messages
type WebSocketMessage =
  | { type: 'code_change'; payload: { content: string } }
  | { type: 'file_select'; payload: { fileId: string; fileName: string } };

export default function WorkspacePage() {
  const [code, setCode] = useState('// Click a file to start editing!');
  // The active file state now stores both the ID and the name
  const [activeFile, setActiveFile] = useState<{ id: string; name: string } | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // This function is now wrapped in useCallback for stability in useEffect
  const handleFileSelect = useCallback(async (fileId: string, fileName: string, notifyPeers: boolean = true) => {
    try {
      // Fetch file content using the database fileId
      const response = await fetch(`/api/files/${workspaceId}?fileId=${fileId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const content = await response.text();
      setCode(content);
      setActiveFile({ id: fileId, name: fileName });

      // Notify other users in the same room that a file was selected
      if (notifyPeers && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'file_select',
          payload: { fileId, fileName }
        }));
      }
    } catch (error) {
      console.error('Failed to load file content:', error);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;

    // Use the environment variable for the deployed URL, with a fallback for local development
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || `ws://localhost:8080`;
    const socket = new WebSocket(`${wsUrl}?workspaceId=${workspaceId}`);
    ws.current = socket;

    socket.onopen = () => console.log(`WebSocket connected to workspace ${workspaceId}`);

    socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'code_change':
          setCode(message.payload.content);
          break;
        case 'file_select':
          // When another user selects a file, we load it too
          handleFileSelect(message.payload.fileId, message.payload.fileName, false);
          break;
      }
    };

    socket.onclose = () => console.log(`WebSocket disconnected`);
    return () => socket.close();
  }, [workspaceId, handleFileSelect]); // The dependency array is now correct

  const handleCodeChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCode(newValue);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'code_change',
          payload: { content: newValue }
        }));
      }
    }
  };

  const handleSave = async () => {
    if (!activeFile) return alert('No file selected to save.');
    try {
      await fetch(`/api/files/${workspaceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the database fileId in the request body
        body: JSON.stringify({ fileId: activeFile.id, content: code }),
      });
      alert('File saved successfully!');
    } catch (error) {
      alert('Error saving file.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <aside className="w-64 bg-gray-900 p-4 flex flex-col">
        <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">Files</h2>
        <div className="mt-4 flex-1 overflow-y-auto">
          <FileTree workspaceId={workspaceId} onFileSelect={handleFileSelect} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-700 p-2 flex justify-between items-center">
          {/* Display the file name from the activeFile state object */}
          <p>{activeFile?.name || 'No file selected'}</p>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
            Save
          </button>
        </header>
        <section className="flex-1 bg-[#1e1e1e]">
          <CodeEditor value={code} onChange={handleCodeChange} />
        </section>
      </main>
    </div>
  );
}

