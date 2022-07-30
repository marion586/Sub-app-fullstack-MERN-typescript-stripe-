import express from "express";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("connected to  mongodb");
    const app = express();
    //req.body is undefined , to git rid of this , we need declare thiscode below
    app.use(express.json());

    // to allow server to read variables inside .en file

    // app.get("/", (req, res) => res.send("hello world"));

    // we need to utilise our route  with some url base
    app.use("/auth", authRoutes);

    app.listen(8081, () => {
      console.log(`Now listening to port 8081`);
    });
  })
  .catch((error) => {
    console.log(error);
    throw new Error();
  });
// listen port
