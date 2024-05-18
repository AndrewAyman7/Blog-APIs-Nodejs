const express = require("express");
const connectToDB = require("./config/connectToDB");
require("dotenv").config();

const routes = require("./routes");
connectToDB();

const app = express();

app.use(express.json());

app.use(routes);

app.use(express.static("images"));

app.listen(process.env.PORT , ()=>console.log("The Server is running"));