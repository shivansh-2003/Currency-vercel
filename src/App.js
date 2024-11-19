import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = "https://currencydetector-production.up.railway.app"; // Your Railway API URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${apiUrl}/predict/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      setError("Error uploading file or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Fake Currency Detector
        </Typography>
        
        <Paper sx={{ p: 3, width: "100%", mb: 3, textAlign: "center" }}>
          <Typography variant="h6" mb={2}>
            Upload a Currency Image (Fake or Real)
          </Typography>
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
              component="span"
              color="primary"
              startIcon={<CloudUploadIcon />}
            >
              Choose Image
            </Button>
          </label>
        </Paper>

        {loading && <CircularProgress />}
        {error && <Typography color="error" mt={2}>{error}</Typography>}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload and Predict"}
        </Button>

        {result && !loading && (
          <Paper sx={{ p: 3, mt: 4, width: "100%" }}>
            <Typography variant="h6">Prediction Result</Typography>
            <Typography variant="body1">
              <strong>File:</strong> {result.filename}
            </Typography>
            <Typography variant="body1">
              <strong>Prediction:</strong> {result.prediction}
            </Typography>
            <Typography variant="body1">
              <strong>Confidence:</strong> {result.confidence.toFixed(2)}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;