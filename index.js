const express = require("express");
const cors = require("cors");
const app = express();
const auth = require("./routes/auth");
const api = require("./routes/api");
const connectDb = require("./utils/db_connection");
app.use(cors());
app.use(express.json());

connectDb()
  .then((connected) => {
    if (connected) {
      console.log("DB Connected");
    }
  })
  .catch((e) => {
    console.log(e);
  });
app.get("/", (_, res) => {
  res.status(200).send({ message: "Zoho API Working😇" });
});
app.use("/api/auth", auth);
app.use("/api/contact", api);
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
