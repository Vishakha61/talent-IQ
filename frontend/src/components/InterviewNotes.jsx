import { useState, useRef, useEffect } from "react";
import {
  FileTextIcon,
  SaveIcon,
  DownloadIcon,
  TrashIcon,
  EditIcon,
  XIcon
} from "lucide-react";

function InterviewNotes({ sessionId, isHost }) {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotes, setSavedNotes] = useState("");
  const textareaRef = useRef(null);

  // Load notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`interview-notes-${sessionId}`);
    if (stored) {
      setNotes(stored);
      setSavedNotes(stored);
    }
  }, [sessionId]);

  // Auto-save notes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes !== savedNotes) {
        localStorage.setItem(`interview-notes-${sessionId}`, notes);
        setSavedNotes(notes);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [notes, savedNotes, sessionId]);

  const handleSave = () => {
    localStorage.setItem(`interview-notes-${sessionId}`, notes);
    setSavedNotes(notes);
    setIsEditing(false);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all notes?")) {
      setNotes("");
      setSavedNotes("");
      localStorage.removeItem(`interview-notes-${sessionId}`);
    }
  };

  const handleExport = () => {
    const dataStr = `Interview Notes - Session ${sessionId}\n\n${notes}`;
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `interview-notes-${sessionId}.txt`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  if (!isHost) {
    return null; // Only show notes to the host (interviewer)
  }

  return (
    <div className="bg-base-100 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Interview Notes</h3>
          {notes !== savedNotes && (
            <span className="badge badge-warning badge-xs">Unsaved</span>
          )}
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn btn-ghost btn-sm gap-2"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              Save
            </button>
          )}

          <button
            onClick={handleExport}
            className="btn btn-ghost btn-sm gap-2"
            disabled={!notes.trim()}
          >
            <DownloadIcon className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleClear}
            className="btn btn-error btn-sm gap-2"
            disabled={!notes.trim()}
          >
            <TrashIcon className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="min-h-[200px]">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes during the interview... (auto-saved)"
            className="textarea textarea-bordered w-full h-48 resize-none"
          />
        ) : (
          <div
            className="min-h-[200px] p-3 bg-base-200 rounded-lg cursor-pointer"
            onClick={handleEdit}
          >
            {notes.trim() ? (
              <pre className="whitespace-pre-wrap text-sm">{notes}</pre>
            ) : (
              <div className="text-base-content/50 text-center py-8">
                Click to start taking notes...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-base-content/60 mt-2">
        Notes are automatically saved to your browser's local storage
      </div>
    </div>
  );
}

export default InterviewNotes;