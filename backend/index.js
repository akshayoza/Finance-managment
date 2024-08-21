import express from "express";
import mongoose from "mongoose";
import financialrecord from "./src/routes/financialrecord.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3009;
const URI = "mongodb://localhost:27017/mydatabase";

app.use(express.json());
app.use(cors());

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Use routes
app.use("/financial-records", financialrecord);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
