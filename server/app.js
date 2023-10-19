const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { ErrorResponseObject } = require("./common/http");

const app = express();

const cors = require("cors");

app.use(cors());

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 1 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use("/api/brc-20", require("./routes/brc-20.route"));
app.use("/api/address", require("./routes/address.route"));

app.get("/hello", (req, res) => {
  res.send("people");
});

// default catch all handler
app.all("*", (req, res) =>
  res.status(404).json(new ErrorResponseObject("route not defined"))
);

module.exports = app;
