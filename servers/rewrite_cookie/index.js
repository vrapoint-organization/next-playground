const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 8080;

// Middleware to parse cookies
app.use(cookieParser());

// Route to set, rewrite, and log cookies
app.get("/rewrite_cookie_test", (req, res) => {
  console.log("Initial cookies:", req.cookies);

  // Send a response
  res.send("Cookie received : " + JSON.stringify(req.cookies));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
