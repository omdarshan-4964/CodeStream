'use client';

import React, { useState, useEffect } from 'react';

// Define the updated types for our file/folder structure to include the database ID
type FileNode = {
  id: string; // The database ID is now the unique identifier
  type: 'file';
  name: string;
};

// FolderNode is kept for potential future implementation of folders in the DB
type FolderNode = {
  id: string;
  type: 'folder';
  name: string;
  children: TreeNode[];
};

type TreeNode = FileNode | FolderNode;

// The component now accepts workspaceId and an onFileSelect callback as props
interface FileTreeProps {
  workspaceId: string;
  // The callback now passes both the file's ID and its name
  onFileSelect: (fileId: string, fileName: string) => void;
}

// A simple recursive component to render the tree
// It's updated to pass both id and name on click
const renderTree = (nodes: TreeNode[], onFileSelect: (fileId: string, fileName: string) => void) => (
  <ul className="pl-4">
    {nodes.map((node) => (
      <li
        key={node.id} // Use the database ID as the key
        className="cursor-pointer hover:text-gray-300"
        // When a file is clicked, call onFileSelect with both the ID and the name
        onClick={() => node.type === 'file' && onFileSelect(node.id, node.name)}
      >
        <span>{node.type === 'folder' ? '📁' : '📄'} {node.name}</span>
        {/* Added optional chaining for safety, in case children is undefined */}
        {node.type === 'folder' && node.children && renderTree(node.children, onFileSelect)}
      </li>
    ))}
  </ul>
);

export default function FileTree({ workspaceId, onFileSelect }: FileTreeProps) {
  // State to store the file tree data fetched from the API
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the file tree data from our API when the component mounts or workspaceId changes
    const fetchFileTree = async () => {
      // Don't fetch if there's no workspaceId
      if (!workspaceId) return;

      setIsLoading(true);
      try {
        // Fetch from the API endpoint that lists files for a given workspace
        const response = await fetch(`/api/files/${workspaceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch file tree');
        }
        const data: TreeNode[] = await response.json();
        setNodes(data);
      } catch (error) {
        console.error(error);
        // It's good practice to clear nodes on error
        setNodes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileTree();
  }, [workspaceId]); // Re-run the effect if the workspaceId changes

  if (isLoading) {
    return <p className="text-gray-400">Loading file system...</p>;
  }
  
  if (nodes.length === 0) {
      return <p className="text-gray-500 text-sm">No files in this workspace yet.</p>
  }

  // Pass the onFileSelect function to the renderer
  return <div>{renderTree(nodes, onFileSelect)}</div>;
}
