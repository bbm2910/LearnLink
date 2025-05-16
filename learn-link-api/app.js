require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { logger } = require("./middleware/logger");
const { userRouter } = require("./routers/userRouter");
const { appointmentRouter } = require("./routers/appointmentRouter")
const { skillsRouter } = require('./routers/skillsRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter)
app.use("/skills", skillsRouter); // Clash with "skillRouter" using /api/skills endpoint

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Learn Link!");
});

module.exports = {
  app,
};
