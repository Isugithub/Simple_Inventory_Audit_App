
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT =
  process.env.PORT || 5000;

  const cors = require("cors");
app.use(cors());

// Connect MongoDB
connectDB();


// Start server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;

