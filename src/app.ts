import 'dotenv/config';
import express, { type Express, type Request, type Response, json, urlencoded } from 'express';
import gateway from '@/routes/gateway'
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { errorHandler } from '@/middlewares/error-handlers';

const app:Express = express();
const port = Number(process.env.PORT ?? 8080);

app.get('/', (_req:Request, res:Response) => {
    res.send("Hello World");
});
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,       
  })
)
app.use(helmet());
app.use(json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())
app.use(gateway);

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is listening at ${port}`)
});