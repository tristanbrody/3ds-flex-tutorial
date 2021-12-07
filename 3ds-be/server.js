require("dotenv").config();
const cors = require("cors");
const app = require("./app");

app.use(cors());
app.listen(3001, () => {
  console.log("listening on port 3001");
});
