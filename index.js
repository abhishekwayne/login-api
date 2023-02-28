const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");
const app = require("./app");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DATABASE!"))
  .catch((err) => console.log(err));
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
const port = process.env.PORT;
app.listen(port, () => console.log(`Connected to Port: ${port}`));
