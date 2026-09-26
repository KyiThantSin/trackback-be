import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import gateway from '@/routes/gateway'
import helmet from "helmet";
import cors from "cors";

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
app.use(gateway);

app.listen(port, () => {
  console.log(`Server is listening at ${port}`)
});