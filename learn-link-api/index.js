require("dotenv").config()

const { app } = require("./app");
// const port = process.env.PORT;
const port = 3000; // Temporary change for testing

app.listen(port, () => {
  console.log(`API running on port: ${port}`);
});
