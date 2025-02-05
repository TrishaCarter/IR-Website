const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// Example API endpoint
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from a dynamic Angular app!" });
});

// Handle all other routes dynamically
app.get("*", (req, res) => {
  res.send("This is a dynamic response for route: " + req.originalUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

