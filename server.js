require("module-alias/register");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const DBconn = require("./config/dbConn");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/app", require("./routes/app/index"));
app.use("/api/v1/auth", require("./routes/auth/index"));
app.use("/api/v1/user", require("./routes/user/index"));

app.use("/api/v1/ZAdmin", require("./routes/admin"));

app.use(errorHandler);

const pingInterval = 840000; // 14 minutes in milliseconds

function pingSelf() {
  axios
    .get("https://verdantserver.onrender.com")
    .then((response) => {
      console.log("Service pinged successfully:", response.status);
    })
    .catch((error) => {
      console.error("Error pinging service:", error);
    });
}

// Set up the interval to ping your service every 14 minutes
setInterval(pingSelf, pingInterval);

DBconn(app, port);
