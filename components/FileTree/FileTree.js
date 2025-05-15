"use client";

import { useState } from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";

export default function FileTree({ files, onSelect, selectedDocument }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="p-2">
        <FileTreeList
          files={files}
          onSelect={onSelect}
          selectedDocument={selectedDocument}
        />
      </div>
    </div>
  );
}

function FileTreeList({ files, onSelect, selectedDocument, level = 0 }) {
  return (
    <ul className={`space-y-1 ${level > 0 ? "pl-6 pt-1" : ""}`}>
      {files.map((file) => (
        <FileTreeNode
          key={file._id.$oid}
          file={file}
          onSelect={onSelect}
          selectedDocument={selectedDocument}
          level={level}
        />
      ))}
    </ul>
  );
}

function FileTreeNode({ file, onSelect, selectedDocument, level }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = file.children && file.children.length > 0;
  const isSelected = selectedDocument?._id === file._id;

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(Number.parseInt(dateStr));
    return date.toLocaleDateString();
  };

  return (
    <li>
      <div
        className={`group flex items-center text-left gap-2 rounded-md px-2 py-1.5 text-sm
          ${
            isSelected
              ? "bg-blue-50 text-blue-600 font-medium"
              : "hover:bg-gray-100"
          }
          transition-colors duration-100 ease-in-out
          cursor-pointer`}
        onClick={() => {
          onSelect(file);
          if (hasChildren) {
            setExpanded(!expanded);
          }
        }}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSelect(file);
            if (hasChildren) {
              setExpanded(!expanded);
            }
            e.preventDefault();
          }
        }}
      >
        {hasChildren && (
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-100
              ${expanded ? "rotate-90" : ""}`}
          />
        )}

        {hasChildren ? (
          expanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-amber-500" />
          )
        ) : (
          <File className="h-4 w-4 shrink-0 text-blue-500" />
        )}

        <span className="truncate">{file.title}</span>

        {/* Show date in a subtle way */}
        {/* <span className="ml-auto text-xs text-gray-400">
          {formatDate(file.updatedAt)}
        </span> */}
      </div>

      {hasChildren && expanded && (
        <FileTreeList
          files={file.children}
          onSelect={onSelect}
          selectedDocument={selectedDocument}
          level={level + 1}
        />
      )}
    </li>
  );
}
