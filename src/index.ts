import express, { Application, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './Routes/User';
import postRoute from './Routes/Post';
import cookieSession from 'cookie-session';
import cors from 'cors';
import passport, { session } from 'passport';
import authRoute from './Routes/Auth';
import morgan from 'morgan';

declare var process: {
    env: {
        NODE_ENV: string
        PORT: string
        MONGO_URI: string
        JWT_SECRET_KEY: string
        COOKIE_PRIVATE_KEY: string
        GOOGLE_CLIENT_ID: string
        GOOGLE_CLIENT_SECRET: string
    }
}

const app: Application = express();
const port = process.env.PORT || 8081
const routes = Router();

dotenv.config();
require('./passport');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(passport.initialize());

app.use(cookieSession(
    {
        name: "session",
        keys: [process.env.COOKIE_PRIVATE_KEY],
        maxAge: 24 * 60 * 60 * 3
    }
));
app.use(passport.session());

//Connect db
const ConnectDb = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database Connected')
    } catch (e) {
        console.log(e)
    }
}
ConnectDb();

//Routes
app.use(routes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use('/api/v1/auth', authRoute);

app.listen(port, (): void => console.log("Server Running at port " + port));
