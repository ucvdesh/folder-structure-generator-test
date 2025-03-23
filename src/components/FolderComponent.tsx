import { useRef, useState } from "react";

export type Files = {
  name: string;
  folder?: Files[];
};

export type ItemType = "folder" | "file" | null;

interface FolderComponentProps {
  structure: Files;
  handleSetFolderStructure: (newFolder: Files, root: string) => void;
}

export const FolderComponent: React.FC<FolderComponentProps> = ({
  structure,
  handleSetFolderStructure,
}) => {
  const [showNewElementNameInput, setShowNewElementNameInput] =
    useState<ItemType>(null);
  const [newElementName, setNewElementName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    handleSetFolderStructure(
      {
        name: newElementName,
        ...(showNewElementNameInput === "folder" && { folder: [] }),
      },
      structure.name
    );
    setShowNewElementNameInput(null);
    setNewElementName("");
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        paddingTop: "10px",
        alignItems: "start",
        marginLeft: "50px",
      }}
    >
      <div>
        {structure.folder ? "📁" : "📄"} {structure.name}
        {structure.folder && (
          <>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => setShowNewElementNameInput("folder")}
            >
              + Add Folder
            </button>
            <button
              onClick={() => setShowNewElementNameInput("file")}
              style={{ marginLeft: 10 }}
            >
              + Add File
            </button>
          </>
        )}
      </div>
      {showNewElementNameInput && (
        <input
          type="text"
          ref={inputRef}
          value={newElementName}
          onChange={(e) => setNewElementName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
            }
          }}
          onBlur={handleBlur}
          style={{ marginLeft: 50 }}
        />
      )}
      <div>
        {structure.folder?.map((folder, index) => {
          return (
            <FolderComponent
              key={index}
              structure={folder}
              handleSetFolderStructure={handleSetFolderStructure}
            />
          );
        })}
      </div>
    </div>
  );
};
