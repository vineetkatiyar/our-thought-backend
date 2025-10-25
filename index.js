import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import userRouter from './routes/user.routes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Blog Backend is running');
});

app.use('/api/v1/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
