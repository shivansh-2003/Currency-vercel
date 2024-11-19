import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setUploadStatus("No file selected!");
      return;
    }

    setFile(selectedFile);
    setUploadStatus(null); // Reset status if a new file is selected
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first!");
      return;
    }

    setIsLoading(true); // Start loading spinner
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("YOUR_API_URL/predict/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(
          `File uploaded successfully! Prediction: ${data.prediction}, Confidence: ${data.confidence.toFixed(2)}`
        );
      } else {
        setUploadStatus("Error uploading file. Please check the server logs.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Server error. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <Box>
      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="upload-file"
      />
      <label htmlFor="upload-file">
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
        >
          Choose Image
        </Button>
      </label>

      {/* Image Preview */}
      {imagePreview && (
        <Box mt={2}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Box>
      )}

      {/* Upload Button */}
      <Box mt={2}>
        <Button
          variant="contained"
          color="success"
          onClick={handleFileUpload}
          disabled={isLoading || !file}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Upload File"}
        </Button>
      </Box>

      {/* Upload Status */}
      {uploadStatus && (
        <Typography
          mt={2}
          color={uploadStatus.includes("successfully") ? "green" : "red"}
        >
          {uploadStatus}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;