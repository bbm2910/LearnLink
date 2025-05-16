require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { logger } = require("./middleware/logger");
const { userRouter } = require("./routers/userRouter");
const { appointmentRouter } = require("./routers/appointmentRouter")
const { skillRouter } = require("./routers/skillRouter");

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter)
app.use("/skills", skillRouter);  // To-do: Change endpoint to "/api/skills/" (also change in dashboard-skills.js)

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Learn Link!");
});

module.exports = {
  app,
};
