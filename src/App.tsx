import { useState } from "react";
import "./App.css";
import { FolderComponent, Files } from "./components";

const addToCorrectFolder = (
  currentFolder: Files,
  newItem: Files,
  rootFolder: string,
  folderDept = 0,
  currentDept: number = 0,
): Files => {
  if (currentFolder.name === rootFolder && currentDept === folderDept) {
    if (
      !currentFolder.folder?.find(
        (file) =>
          file.name === newItem.name &&
          typeof file.folder === typeof newItem.folder
      )
    ) {
      const orderedFolders = [newItem, ...(currentFolder.folder || [])]
        .filter((file) => file.folder)
        .sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          return -1;
        });

      const orderedFiles = [newItem, ...(currentFolder.folder || [])]
        .filter((file) => !file.folder)
        .sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          return -1;
        });

      return {
        ...currentFolder,
        folder: [...orderedFolders, ...orderedFiles],
      };
    }

    return currentFolder;
  }
  return {
    ...currentFolder,
    folder: currentFolder.folder?.map((subFolder) =>
      addToCorrectFolder(subFolder, newItem, rootFolder, folderDept, currentDept + 1)
    ),
  };
};

function App() {
  const [structure, setStructure] = useState<Files>({
    name: "root",
    folder: [],
  });

  const handleSetFolderStructure = (
    newFolder: Files,
    root: string,
    folderDept: number
  ) => {
    const newFolders = addToCorrectFolder(structure, newFolder, root, folderDept);
    setStructure(newFolders);
  };

  return (
    <FolderComponent
      structure={structure}
      handleSetFolderStructure={handleSetFolderStructure}
      dept={0}
    />
  );
}

export default App;
