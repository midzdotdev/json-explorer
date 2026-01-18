import { useState } from "react";
import { JsonFileDropzone } from "./components/JsonFileDropzone";
import { JsonEditor } from "./components/JsonEditor/JsonEditor";
import type { JsonValue } from "./types";

export default function App() {
  const [data, setData] = useState<unknown>();

  return (
    <div className="min-h-screen bg-background">
      {typeof data === "undefined" ? (
        <JsonFileDropzone
          onChange={(json) => {
            setData(JSON.parse(json));
          }}
        />
      ) : (
        <div className="container mx-auto max-w-7xl p-6">
          <JsonEditor data={data as JsonValue} />
        </div>
      )}
    </div>
  );
}
