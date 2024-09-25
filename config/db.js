import mongoose from "mongoose";

export const dbConnection = async()=>{
    await mongoose.connect('mongodb+srv://miinouush:aminachamina404@cluster0.tsy9x.mongodb.net/MernProject')
    .then(()=>{
        console.log('db connected');
    });
}