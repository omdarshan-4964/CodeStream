'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [workspaceId, setWorkspaceId] = useState('');
  const router = useRouter();

  const handleCreateOrJoinWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceId.trim()) {
      // Navigate to the dynamic workspace route
      router.push(`/workspace/${workspaceId.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to CodeStream
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Your real-time, collaborative code editor in the cloud. Create a workspace, share the link, and start coding together instantly.
        </p>

        <form 
          onSubmit={handleCreateOrJoinWorkspace}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="relative w-full sm:w-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              /workspace/
            </span>
            <input
              type="text"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="your-project-name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pr-4 pl-28 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            Create or Join
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          No sign-up required. Just enter a name and start collaborating.
        </p>
      </div>
    </main>
  );
}
