import { useState } from "react";
import { JsonFileDropzone } from "./components/JsonFileDropzone";
import { JsonEditor } from "./components/JsonEditor/JsonEditor";
import type { JsonValue } from "./types";

export default function App() {
  const [data, setData] = useState<unknown>();

  return (
    <>
      {typeof data === "undefined" ? (
        <JsonFileDropzone
          onChange={(json) => {
            setData(JSON.parse(json));
          }}
        />
      ) : (
        <JsonEditor data={data as JsonValue} />
      )}
    </>
  );
}
