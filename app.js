const express = require("express");
const connectDB = require("./config/dbConnection");
const { errorHandler, notFoundMW } = require("./controllers/errorHandler");
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use(express.static("images")); // 3shan lma aft7 img, ya5od ellink mn elfolder da

app.use(routes);
app.use(notFoundMW);
app.use(errorHandler);
require("dotenv").config();

connectDB();


const PORT = process.env.PORT || 9000;
app.listen(PORT , ()=>{console.log("Server is Running ..")});