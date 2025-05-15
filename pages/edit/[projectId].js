"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import io from "socket.io-client";
import Model from "@/components/Model/Model";
import Button from "@/components/Button/Button";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Images,
  ItalicIcon,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  MoveLeft,
  SeparatorHorizontal,
  Strikethrough,
  TextQuote,
  UnderlineIcon,
} from "lucide-react";
import FileTree from "@/components/FileTree/FileTree";

// Rich Text Editor Toolbar Component
const MenuBar = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  if (!editor) {
    return null;
  }

  const addImage = () => {
    // const url = window.prompt("Enter image URL");
    setOpen(true);
    // if (url) {
    //   editor.chain().focus().setImage({ src: url }).run();
    // }
  };

  const handleSave = (type) => {
    if (type === "URL") {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    // const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().unsetLink().run();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="p-2 flex flex-wrap gap-1 mb-2 bg-gray-100">
        {/* Text Formatting Group */}
        <div className="flex border-r pr-2 mr-2">
          <Button
            buttonText={""}
            title={"Bold"}
            icon={<BoldIcon size={20} />}
            clickHandler={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Italic"}
            icon={<ItalicIcon size={20} />}
            clickHandler={() => editor.chain().focus().toggleItalic().run()}
            className={`${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Underline"}
            icon={<UnderlineIcon size={20} />}
            clickHandler={() => editor.chain().focus().toggleUnderline().run()}
            className={`${editor.isActive("underline") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Strike"}
            icon={<Strikethrough size={20} />}
            clickHandler={() => editor.chain().focus().toggleStrike().run()}
            className={`${editor.isActive("strike") ? "bg-gray-200" : ""}`}
          />
        </div>

        {/* Heading Group */}
        <div className="flex border-r pr-2 mr-2">
          <Button
            buttonText={""}
            title={"Heading 1"}
            icon={<Heading1 size={20} />}
            clickHandler={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
            }`}
          />
          <Button
            buttonText={""}
            title={"Heading 2"}
            icon={<Heading2 size={20} />}
            clickHandler={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
          />
          <Button
            buttonText={""}
            title={"Heading 3"}
            icon={<Heading3 size={20} />}
            clickHandler={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
            }`}
          />
        </div>

        {/* List Group */}
        <div className="flex border-r pr-2 mr-2">
          <Button
            buttonText={""}
            title={"Bullet List"}
            icon={<List size={20} />}
            clickHandler={() => editor.chain().focus().toggleBulletList().run()}
            className={`${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Ordered List"}
            icon={<ListOrdered size={20} />}
            clickHandler={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            className={`${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Task List"}
            icon={<ListTodo size={20} />}
            clickHandler={() => editor.chain().focus().toggleTaskList().run()}
            className={`${editor.isActive("taskList") ? "bg-gray-200" : ""}`}
          />
        </div>

        {/* Alignment Group */}
        <div className="flex border-r pr-2 mr-2">
          <Button
            buttonText={""}
            title={"Align Left"}
            icon={<AlignLeft size={20} />}
            clickHandler={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
            className={`${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
            }`}
          />

          <Button
            buttonText={""}
            title={"Align Center"}
            icon={<AlignCenter size={20} />}
            clickHandler={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
            className={`${
              editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
            }`}
          />

          <Button
            buttonText={""}
            title={"Align Right"}
            icon={<AlignRight size={20} />}
            clickHandler={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
            className={`${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
            }`}
          />

          <Button
            buttonText={""}
            title={"Justify"}
            icon={<AlignJustify size={20} />}
            clickHandler={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
            className={`${
              editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
            }`}
          />
        </div>

        {/* Special Features Group */}
        <div className="flex">
          <Button
            buttonText={""}
            title={"Code Block"}
            icon={<Code size={20} />}
            clickHandler={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Blockquote"}
            icon={<TextQuote size={20} />}
            clickHandler={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Add Image"}
            icon={<Images size={20} />}
            clickHandler={setLink}
            className={`${editor.isActive("image") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Add Link"}
            icon={<Link2 size={20} />}
            clickHandler={setLink}
            className={`${editor.isActive("link") ? "bg-gray-200" : ""}`}
          />
          <Button
            buttonText={""}
            title={"Horizontal Rule"}
            icon={<SeparatorHorizontal size={20} />}
            clickHandler={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
            className={``}
          />
        </div>
      </div>
      <Model
        open={open}
        onOpenChange={setOpen}
        title="Paste Image URL"
        buttons={[
          {
            label: "Save",
            onClick: () => {
              handleSave("Image");
              setOpen(false);
            },
          },
          {
            label: "Cancel",
            type: "cancel",
            onClick: () => setOpen(false),
          },
        ]}
      >
        <input
          type="url"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          placeholder="Add URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Model>
      <Model
        open={open}
        onOpenChange={setOpen}
        title="Paste URL"
        buttons={[
          {
            label: "Save",
            onClick: () => {
              handleSave("URL");
              setOpen(false);
            },
          },
          {
            label: "Cancel",
            type: "cancel",
            onClick: () => setOpen(false),
          },
        ]}
      >
        <input
          type="url"
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          placeholder="Add URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Model>
    </>
  );
};

export default function Editor() {
  const router = useRouter();
  const { projectId } = router.query;
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const socketRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      Link,
      // Highlight,
      // CodeBlockLowlight.configure({
      //   lowlight,
      // }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: selectedFile?.content || "",
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set saving indicator
      setSaving(true);

      // Emit content change to socket
      if (socketRef.current) {
        socketRef.current.emit("content-change", {
          projectId,
          fileId: selectedFile._id,
          content,
        });
      }

      // Debounce saving to database
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `/api/files/${selectedFile._id}`,
            { content },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Error saving content:", err);
        } finally {
          setSaving(false);
        }
      }, 1000);
    },
  });

  useEffect(() => {
    if (!projectId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch project data
        const projectResponse = await axios.get(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(projectResponse.data);

        // Fetch files
        const filesResponse = await axios.get(
          `/api/projects/${projectId}/files`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFiles(filesResponse.data);

        // Select first file if available
        if (filesResponse.data.length > 0) {
          setSelectedFile(filesResponse.data[0]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project");
        setLoading(false);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    };

    fetchData();

    // Setup socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        query: { token, projectId },
      }
    );

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("content-updated", ({ fileId, content, userId }) => {
      if (selectedFile && selectedFile._id === fileId && editor) {
        // Only update if the change came from another user
        const token = localStorage.getItem("token");
        const currentUserId = JSON.parse(atob(token.split(".")[1])).userId;

        if (userId !== currentUserId) {
          editor.commands.setContent(content);
        }
      }
    });

    socket.on("active-users", (users) => {
      setActiveUsers(users);
    });

    socketRef.current = socket;

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      socket.disconnect();
    };
  }, [projectId, router]);

  // Update editor content when selected file changes
  useEffect(() => {
    if (editor && selectedFile) {
      editor.commands.setContent(selectedFile.content || "");
    }
  }, [selectedFile, editor]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/workspace")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col lg:py-20">
      <Head>
        <title>
          {project?.title || "Editor"} - Content Collaboration Platform
        </title>
      </Head>

      <header className="mt-5 px-4 sm:px-6 lg:px-8 ">
        <div className="px-4 py-4 sm:px-6 lg:px-0 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/workspace")}
              className="mr-4 h-9 w-9 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
            >
              <MoveLeft />
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">
              {project?.title || "Untitled Project"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {saving && (
              <span className="text-sm text-gray-500 flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            )}
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {activeUsers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white">
                  +{activeUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex mt-5 px-4 py-4 sm:px-6 lg:px-8 ">
        {/* File tree sidebar */}
        <div className="w-64 bg-white overflow-y-auto">
          {files.length === 0 ? (
            <p className="text-gray-500 text-sm">No files available</p>
          ) : (
            <FileTree
              files={files}
              onSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          )}
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-auto">
          {selectedFile ? (
            <div className="px-4">
              <div className="bg-white border rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-medium mb-4">
                  {selectedFile.title}
                </h2>
                <div className="prose max-w-none">
                  <MenuBar editor={editor} />
                  <EditorContent
                    editor={editor}
                    className="min-h-[300px] border rounded p-4"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a file to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
