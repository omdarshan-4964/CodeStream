// app/components/Editor.tsx
"use client";

import { java } from "@codemirror/lang-java";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";

// The default Java code
const javaDefault = `// Java:Name the class to Main and remove 'public'
class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`;

export function Editor() {
  const [code, setCode] = useState(javaDefault);

  const onChange = (value: string) => {
    setCode(value);
    // In the next step, we'll emit this change via Socket.IO
  };

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      theme={githubDark} // Apply the GitHub Dark theme
      extensions={[java()]} // Enable Java language support
      style={{
        height: "100%",
        width: "100%",
        fontSize: "14px",
      }}
    />
  );
}