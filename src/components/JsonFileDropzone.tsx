import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const JsonFileDropzone = ({
  onChange,
}: {
  onChange: (json: string) => void;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          if (typeof reader.result !== "string") return;

          onChange(reader.result);
        };

        reader.readAsText(file);
      });
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};
