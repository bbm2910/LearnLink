const { app } = require("./app");
const port = process.env.PORT;
// const port = 3000;

app.listen(port, () => {
  console.log(`API running on port: ${port}`);
});
