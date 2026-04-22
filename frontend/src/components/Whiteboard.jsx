import { ReactSketchCanvas } from "react-sketch-canvas";
import { useRef, useState } from "react";
import {
  PenIcon,
  EraserIcon,
  UndoIcon,
  RedoIcon,
  TrashIcon,
  DownloadIcon,
  PaletteIcon,
  XIcon
} from "lucide-react";

function Whiteboard({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(8);
  const [tool, setTool] = useState("pen"); // pen, eraser

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
    "#800080", "#008000", "#808080", "#FFC0CB"
  ];

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleExport = async () => {
    const dataURL = await canvasRef.current?.exportImage("png");
    if (dataURL) {
      const link = document.createElement("a");
      link.download = "whiteboard.png";
      link.href = dataURL;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PaletteIcon className="w-6 h-6" />
            Whiteboard
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b border-base-300 bg-base-200">
          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTool("pen")}
              className={`btn btn-sm ${tool === "pen" ? "btn-primary" : "btn-ghost"}`}
            >
              <PenIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`btn btn-sm ${tool === "eraser" ? "btn-primary" : "btn-ghost"}`}
            >
              <EraserIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={tool === "pen" ? strokeWidth : eraserWidth}
              onChange={(e) => {
                if (tool === "pen") {
                  setStrokeWidth(Number(e.target.value));
                } else {
                  setEraserWidth(Number(e.target.value));
                }
              }}
              className="range range-xs range-primary"
            />
            <span className="text-sm w-8">
              {tool === "pen" ? strokeWidth : eraserWidth}
            </span>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color:</span>
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setStrokeColor(color)}
                  className={`w-6 h-6 rounded border-2 ${
                    strokeColor === color ? "border-primary" : "border-base-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleUndo} className="btn btn-ghost btn-sm">
              <UndoIcon className="w-4 h-4" />
            </button>
            <button onClick={handleRedo} className="btn btn-ghost btn-sm">
              <RedoIcon className="w-4 h-4" />
            </button>
            <button onClick={handleClear} className="btn btn-error btn-sm">
              <TrashIcon className="w-4 h-4" />
            </button>
            <button onClick={handleExport} className="btn btn-success btn-sm">
              <DownloadIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <div className="w-full h-full border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
            <ReactSketchCanvas
              ref={canvasRef}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              eraserWidth={eraserWidth}
              canvasColor="white"
              style={{ border: "none" }}
              className="w-full h-full"
              allowOnlyPointerType="all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;