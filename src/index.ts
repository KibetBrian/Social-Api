import express, { Application, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './Routes/user';
import postRoute from './Routes/post';
import cookieSession from 'cookie-session';
import cors from 'cors';
import passport from 'passport';
import authRoute from './Routes/auth';
import morgan from 'morgan';
const app: Application = express();
app.use(express.json());
dotenv.config();
const routes = Router();

//CORS
app.use(cors());
app.use(morgan('tiny'));


declare var process: {
    env: {
        NODE_ENV: string
        MONGO_URI: string
        JWT_SECRET_KEY: string
        COOKIE_PRIVATE_KEY: string
        GOOGLE_CLIENT_ID: string
        GOOGLE_CLIENT_SECRET: string
    }
}
//Passport module
require('./passport');

//Cookie session
app.use(cookieSession(
    {
        name: "session",
        keys: [process.env.COOKIE_PRIVATE_KEY],
        maxAge: 24 * 60 * 60 * 3
    }
));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect db
async function connect(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database Connected')
    }catch(e){
        console.log(e)
    }
}
connect();


//Routes
app.use(routes);
app.use("/user/", userRoute);
app.use("/post/", postRoute);
app.use('/auth/', authRoute)


app.get("/", (req: Request, res: Response): void => {
    res.status(200).json("Test Successful!");
});


app.listen(8080, (): void => console.log("Server Running..."));
