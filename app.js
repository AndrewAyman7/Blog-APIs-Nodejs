const express = require("express");

const app = express();

require("dotenv").config();

//------------- DB Connection ----------------
const DBConnect = require("./models/configDB");
DBConnect();

const userRoute = require("./routes/userRoute");

app.use(express.json());

app.get("/", (req,res)=>{res.send("Home Page")});

app.use(userRoute);

app.listen(process.env.PORT , ()=>{ console.log("Server is running ... "); })