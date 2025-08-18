const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");


app.use(bodyParser.json());
const schoolsRoutes = require("./routes/school");

// Middleware
app.use(express.json());

// Import routes

app.use("/schools",schoolsRoutes );

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
