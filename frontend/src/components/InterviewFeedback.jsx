import { useState } from "react";
import { StarIcon, MessageSquareIcon, SendIcon } from "lucide-react";

function InterviewFeedback({ sessionId, candidateName, isHost, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }

    const feedbackData = {
      sessionId,
      candidateName,
      rating,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage for now (in a real app, this would go to a database)
    const existingFeedback = JSON.parse(localStorage.getItem('interview-feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('interview-feedback', JSON.stringify(existingFeedback));

    setSubmitted(true);
    onSubmit?.(feedbackData);
  };

  if (!isHost || submitted) {
    return null;
  }

  return (
    <div className="bg-base-100 rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Interview Feedback</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rate the candidate's performance:
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-colors"
              >
                <StarIcon
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-sm text-base-content/60 mt-1">
            {rating > 0 && (
              <>
                {rating === 1 && "Poor performance"}
                {rating === 2 && "Below average"}
                {rating === 3 && "Average performance"}
                {rating === 4 && "Good performance"}
                {rating === 5 && "Excellent performance"}
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Additional feedback:
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts on the candidate's problem-solving approach, communication skills, code quality, etc."
            className="textarea textarea-bordered w-full h-32 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="btn btn-primary w-full gap-2"
        >
          <SendIcon className="w-4 h-4" />
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

export default InterviewFeedback;