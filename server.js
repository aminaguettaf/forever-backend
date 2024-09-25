import express from 'express';
import cors from 'cors';
import { dbConnection } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import dotenv from 'dotenv';
import cartRouter from './routes/cartRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

dbConnection();

app.get('/', (req,res)=>{
    res.send('Api working');
})

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

//servir tous les images de fichiers uploads a l'url /images
app.use('/images', express.static('uploads'));

app.listen(port, ()=>{
    console.log('Server started');
})
