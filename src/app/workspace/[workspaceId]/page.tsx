'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import CodeEditor from '@/components/Editor';
import FileTree from '@/components/FileTree';

// Define the structure for our WebSocket messages
type WebSocketMessage = {
  type: 'code_change' | 'file_select';
  payload: any; // Using 'any' for simplicity, can be more specific
};

export default function WorkspacePage() {
  const [code, setCode] = useState('// Click a file to start editing!');
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // Wrapped in useCallback to stabilize its reference for the useEffect hook
  const handleFileSelect = useCallback(async (filePath: string, notifyPeers: boolean = true) => {
    try {
      const response = await fetch(`/api/files/${workspaceId}?path=${filePath}`);
      const content = await response.text();
      setCode(content);
      setActiveFile(filePath);
      
      if (notifyPeers && ws.current?.readyState === WebSocket.OPEN) {
        // Notify other users that a file was opened
        ws.current.send(JSON.stringify({
          type: 'file_select',
          payload: { filePath }
        }));
      }
    } catch (error) {
      console.error('Failed to load file content:', error);
    }
  }, [workspaceId]); // This function depends on workspaceId

  useEffect(() => {
    if (!workspaceId) return;

    // Use the environment variable for the deployed URL, or localhost for development
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
          handleFileSelect(message.payload.filePath, false);
          break;
      }
    };

    socket.onclose = () => console.log(`WebSocket disconnected`);
    return () => socket.close();
  }, [workspaceId, handleFileSelect]); // Correctly including handleFileSelect dependency

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
        body: JSON.stringify({ filePath: activeFile, content: code }),
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
          <p>{activeFile || 'No file selected'}</p>
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
