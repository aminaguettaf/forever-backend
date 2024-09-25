import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const createToken = (id, name)=>{
    return jwt.sign({id, name}, process.env.JWT_SECRET);
}

const register = async(req, res)=>{
    const{name, email, password} = req.body;
    try {
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:'User Already exists'});
        }
        if(!validator.isEmail(email)){
            return res.json({success:false, message:'Enter a valid email'});
        }
        if(password.length<8){
            return res.json({success:false, message:'Enter a strong password'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id, user.name);
        res.json({success:true, token});
    } catch (error) {
        res.json({success:false, message:'Server error'});
    }
}

const login = async(req,res)=>{
    const{email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'User doenst exists, please sign up'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message:'Incorrect password'});
        }
        const token = createToken(user._id,user.name);
            return res.json({success:true, token});
    } catch (error) {
        return res.json({success:false, message:'Server error'});
    }

}

const adminLogin = async(req,res)=>{
    try {
        const {email, password}= req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true, token});
        }
        else{
            res.json({success:false, message:'Invalid credentials'});
        }
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export {register, login, adminLogin}