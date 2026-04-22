import { useTimer } from "react-timer-hook";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { ClockIcon, PlayIcon, PauseIcon, RotateCcwIcon } from "lucide-react";
import { useState, useEffect } from "react";

function InterviewTimer({ duration = 45, isActive = false, onTimeUp }) {
  const [isRunning, setIsRunning] = useState(isActive);
  const [key, setKey] = useState(0); // For restarting the timer

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning: timerRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date(Date.now() + duration * 60 * 1000),
    onExpire: () => {
      setIsRunning(false);
      onTimeUp?.();
    },
    autoStart: false,
  });

  useEffect(() => {
    if (isActive && !timerRunning) {
      start();
      setIsRunning(true);
    } else if (!isActive && timerRunning) {
      pause();
      setIsRunning(false);
    }
  }, [isActive, timerRunning, start, pause]);

  const handleStart = () => {
    start();
    setIsRunning(true);
  };

  const handlePause = () => {
    pause();
    setIsRunning(false);
  };

  const handleReset = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + duration * 60);
    restart(time, false);
    setIsRunning(false);
    setKey(prev => prev + 1);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = duration * 60;
  const remainingTime = totalDuration - totalSeconds;

  return (
    <div className="flex items-center gap-4 p-4 bg-base-100 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-primary" />
        <span className="font-semibold">Time Remaining</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Circular Timer */}
        <CountdownCircleTimer
          key={key}
          isPlaying={isRunning}
          duration={totalDuration}
          initialRemainingTime={remainingTime}
          colors={['#10B981', '#F59E0B', '#EF4444']}
          colorsTime={[totalDuration * 0.5, totalDuration * 0.2, 0]}
          size={80}
          strokeWidth={6}
          trailColor="#E5E7EB"
          onComplete={() => {
            setIsRunning(false);
            onTimeUp?.();
          }}
        >
          {({ remainingTime }) => (
            <div className="text-center">
              <div className="text-lg font-bold">
                {formatTime(remainingTime)}
              </div>
              <div className="text-xs text-base-content/60">
                {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}
        </CountdownCircleTimer>

        {/* Digital Timer */}
        <div className="text-2xl font-mono font-bold">
          {formatTime(totalSeconds)}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="btn btn-primary btn-sm gap-2"
            >
              <PlayIcon className="w-4 h-4" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="btn btn-warning btn-sm gap-2"
            >
              <PauseIcon className="w-4 h-4" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm gap-2"
          >
            <RotateCcwIcon className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Time Status */}
      <div className="ml-auto">
        {remainingTime <= totalDuration * 0.2 && remainingTime > 0 && (
          <span className="badge badge-error badge-sm animate-pulse">
            Time Running Out!
          </span>
        )}
        {remainingTime === 0 && (
          <span className="badge badge-error badge-sm">
            Time's Up!
          </span>
        )}
      </div>
    </div>
  );
}

export default InterviewTimer;