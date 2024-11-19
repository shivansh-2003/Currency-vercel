import React from "react";

const Result = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-3">
      <h4>Prediction Result:</h4>
      <p>
        <strong>Filename:</strong> {result.filename}
      </p>
      <p>
        <strong>Prediction:</strong> {result.prediction}
      </p>
      <p>
        <strong>Confidence:</strong> {result.confidence.toFixed(2)}
      </p>
    </div>
  );
};

export default Result;