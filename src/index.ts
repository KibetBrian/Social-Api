import express ,{  Application, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './Routes/user';
import postRoute from './Routes/post';
const app:Application = express();
app.use(express.json());
dotenv.config();
const routes = Router();
app.use(routes);

declare var process: {
    env: {
        NODE_ENV: string
        MONGO_URI: string
        JWT_SECRET_KEY: string
    }
}

//Connect db
try {
      mongoose.connect(process.env.MONGO_URI);
} catch (e) {
    console.log(e)
};

//Routes
routes.use("/user/", userRoute);
routes.use("/post/", postRoute);


app.get("/", (req: Request, res: Response): void => {
    res.status(200).json("Test Successful!");
});


app.listen(8080, (): void => console.log("Server Running..."));
