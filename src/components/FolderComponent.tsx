import { useMemo, useRef, useState } from "react";

export type Files = {
  name: string;
  folder?: Files[];
};

export type ItemType = "folder" | "file" | null;

interface FolderComponentProps {
  structure: Files;
  handleSetFolderStructure: (
    newFolder: Files,
    root: string,
    folderDept: number
  ) => void;
  dept: number;
}

export const FolderComponent: React.FC<FolderComponentProps> = ({
  structure,
  handleSetFolderStructure,
  dept,
}) => {
  const [showNewElementNameInput, setShowNewElementNameInput] =
    useState<ItemType>(null);
  const [showFolderInternals, setShowFolderInternals] = useState(true);
  const [newElementName, setNewElementName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (newElementName) {
      handleSetFolderStructure(
        {
          name: newElementName,
          ...(showNewElementNameInput === "folder" && { folder: [] }),
        },
        structure.name,
        dept
      );
    }
    setShowNewElementNameInput(null);
    setNewElementName("");
  };

  console.log(showFolderInternals);

  const isRootFolder = useMemo(
    () => structure.name === "root",
    [structure.name]
  );

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        paddingTop: "10px",
        alignItems: "start",
        marginLeft: isRootFolder ? 0 : 25,
      }}
    >
      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
        <div onClick={() => setShowFolderInternals((prevState) => !prevState)}>
          {!isRootFolder && "└─"}
          {structure.folder ? "📁" : "📄"} {structure.name}
        </div>
        <div>
          {structure.folder && (
            <>
              <button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setShowNewElementNameInput("folder");
                  setShowFolderInternals(true);
                }}
              >
                + Add Folder
              </button>
              <button
                onClick={() => {
                  setShowNewElementNameInput("file");
                  setShowFolderInternals(true);
                }}
                style={{ marginLeft: 10 }}
              >
                + Add File
              </button>
            </>
          )}
        </div>
      </div>
      {showNewElementNameInput && (
        <div style={{ marginLeft: 25 }}>
          └─
          {showNewElementNameInput === "folder" ? "📁" : "📄"}
          <input
            type="text"
            ref={inputRef}
            value={newElementName}
            autoFocus
            onChange={(e) => setNewElementName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                inputRef.current?.blur();
              } else if (e.key === "Escape") {
                setNewElementName("");
                setShowNewElementNameInput(null);
              }
            }}
            onBlur={handleBlur}
            style={{ marginLeft: 5, marginTop: 10, width: 250 }}
          />
        </div>
      )}
      <div>
        {showFolderInternals &&
          structure.folder?.map((folder, index) => {
            return (
              <FolderComponent
                key={index}
                structure={folder}
                handleSetFolderStructure={handleSetFolderStructure}
                dept={dept + 1}
              />
            );
          })}
      </div>
    </div>
  );
};
