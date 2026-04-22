import { useState } from "react";
import { MonitorIcon, MonitorOffIcon, Loader2Icon } from "lucide-react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

function ScreenShare({ call }) {
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { useScreenShareState } = useCallStateHooks();
  const { screenShare } = useScreenShareState();

  const handleToggleScreenShare = async () => {
    if (!call) return;

    setIsLoading(true);
    try {
      if (screenShare.isSharing) {
        await call.stopScreenShare();
        setIsSharing(false);
      } else {
        await call.startScreenShare();
        setIsSharing(true);
      }
    } catch (error) {
      console.error("Screen share error:", error);
      alert("Failed to toggle screen sharing. Please check your browser permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleScreenShare}
      disabled={isLoading}
      className={`btn btn-sm gap-2 ${
        screenShare.isSharing ? "btn-error" : "btn-ghost"
      }`}
      title={screenShare.isSharing ? "Stop sharing screen" : "Share your screen"}
    >
      {isLoading ? (
        <Loader2Icon className="w-4 h-4 animate-spin" />
      ) : screenShare.isSharing ? (
        <MonitorOffIcon className="w-4 h-4" />
      ) : (
        <MonitorIcon className="w-4 h-4" />
      )}
      {screenShare.isSharing ? "Stop Share" : "Share Screen"}
    </button>
  );
}

export default ScreenShare;