// src/components/Editor.tsx

'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

// Define the props for our component
interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={value} // Controlled component: value is driven by props
      onChange={onChange} // Pass the handler function
      options={{
        minimap: { enabled: false },
        fontSize: 14,
      }}
    />
  );
}