import express, {Application, Request, Response} from 'express';
const app = express();
app.use(express.json());


app.get("/", (req: Request, res: Response):void=>{
    res.status(200).json("Test Successful!");
})

app.listen(8080, (): void=>console.log("Server Running..."));
