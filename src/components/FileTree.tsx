// src/components/FileTree.tsx

// ... (imports remain the same)

type TreeNode = {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
};

interface FileTreeProps {
  workspaceId: string;
  onFileSelect: (path: string) => void; // Add this prop
}

const renderTree = (nodes: TreeNode[], onFileSelect: (path: string) => void) => (
  <ul className="pl-4">
    {nodes.map((node) => (
      <li
        key={node.name}
        className="cursor-pointer hover:text-gray-300"
        // Call onFileSelect when a file is clicked
        onClick={() => node.type === 'file' && onFileSelect(node.name)}
      >
        <span>{node.type === 'folder' ? '📁' : '📄'} {node.name}</span>
        {node.type === 'folder' && renderTree(node.children ?? [], onFileSelect)}
      </li>
    ))}
  </ul>
);

import React, { useState, useEffect } from 'react';

export default function FileTree({ workspaceId, onFileSelect }: FileTreeProps) {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulate fetching data
        setIsLoading(true);
        // Replace this with your actual data fetching logic
        setTimeout(() => {
            setNodes([
                { name: 'src', type: 'folder', children: [
                    { name: 'index.tsx', type: 'file' },
                    { name: 'App.tsx', type: 'file' }
                ]},
                { name: 'package.json', type: 'file' }
            ]);
            setIsLoading(false);
        }, 1000);
    }, [workspaceId]);

    if (isLoading) { return <div>Loading...</div>; }

    // Pass the onFileSelect function to the renderer
    return <div>{renderTree(nodes, onFileSelect)}</div>;
}