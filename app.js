require("dotenv").config();
const express = require("express");
const DbConnect = require("./configs/DbConnect");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const categoryRouter = require("./routes/categoryRoutes");

DbConnect();

const app = express();
app.use(express.json());

app.use("/api/auth" , authRouter);
app.use("/api/users" , userRouter);
app.use("/api/posts" , postRouter);
app.use("/api/comments" , commentRouter);
app.use("/api/categories" , categoryRouter);

app.listen(process.env.PORT , ()=>console.log(`Server is Running on port ${process.env.PORT}`));