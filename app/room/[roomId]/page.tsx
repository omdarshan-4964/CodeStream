// app/room/[roomId]/page.tsx

import { getAuthSession } from "@/lib/auth";
import { Editor } from "@/app/components/Editor";

// This is a server component, so we can get params and session directly
interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    // You can redirect or show a "must be logged in" message
    return (
      <div className="flex items-center justify-center min-h-screen">
        Please log in to view this room.
      </div>
    );
  }

  // TODO: Fetch room data from Prisma to verify user is a participant

  return (
    <div className="flex h-screen w-full">
      {/* 1. Left Sidebar (Team Members) */}
      <aside className="w-1/5 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Team Members</h2>
        <div className="flex-grow">
          <ul>
            <li className="flex items-center space-x-2 mb-2">
              <img
                src={session.user.image ?? ""}
                alt={session.user.name ?? "User"}
                className="w-8 h-8 rounded-full"
              />
              <span>{session.user.name} (Owner)</span>
            </li>
            {/* We'll add more participants here later via WebSockets */}
          </ul>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
            Copy Room ID
          </button>
          <button className="w-full bg-red-600 hover:bg-red-700 p-2 rounded">
            Leave Room
          </button>
        </div>
      </aside>

      {/* 2. Main Area (Editor + I/O) */}
      <main className="w-4/5 flex flex-col">
        {/* Top bar for language/theme */}
        <div className="flex justify-between items-center p-2 bg-gray-800 text-white border-b border-gray-700">
          <div>
            <label htmlFor="language" className="mr-2">
              Language:
            </label>
            <select
              id="language"
              className="bg-gray-700 p-1 rounded"
              defaultValue="java"
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <button className="bg-green-600 hover:bg-green-700 p-2 rounded px-4">
            Run Code
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-grow bg-gray-800 text-white p-4">
          <div className="bg-black h-full w-full rounded p-2">
            <div className="flex-grow bg-gray-800 text-white overflow-hidden">
                <Editor roomId={params.roomId} />
            </div>
          </div>
        </div>

        {/* Bottom Panels (Input/Output) */}
        <div className="h-1/4 flex bg-gray-900 text-white">
          <div className="w-1/2 p-2 border-r border-gray-700">
            <h3 className="font-semibold mb-2">Input</h3>
            <textarea
              className="w-full h-full bg-gray-800 rounded p-2 resize-none"
              placeholder="Enter input for your program..."
            ></textarea>
          </div>
          <div className="w-1/2 p-2">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="w-full h-full bg-gray-800 rounded p-2 overflow-y-auto">
              {/* Output will appear here */}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}